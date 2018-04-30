import React from "react"
import L from "partial.lenses"
import { pipeProps, source } from "react-streams"
import {
  combineLatest,
  switchMap,
  mergeMap,
  mergeScan,
  startWith,
  pluck,
  map,
  mapTo,
  scan,
  tap,
  concatMap,
  share,
  withLatestFrom
} from "rxjs/operators"
import { ajax } from "rxjs/ajax"
import { from, merge, concat, of } from "rxjs"

const HEADERS = { "Content-Type": "application/json" }

export default pipeProps(
  switchMap(({ endpoint }) => {
    const setTodo = source(pluck("target", "value"))

    const addTodo = source(
      withLatestFrom(setTodo, (e, text) => text),
      concatMap(text =>
        ajax.post(`${endpoint}`, { text, done: false }, HEADERS)
      ),
      pluck("response"),
      map(todo => todos => [...todos, todo])
    )

    const toggleDone = source(
      concatMap(todo =>
        ajax.patch(
          `${endpoint}/${todo.id}`,
          {
            ...todo,
            done: todo.done ? false : true
          },
          HEADERS
        )
      ),
      pluck("response"),
      map(todo => todos => todos.map(t => (t.id === todo.id ? todo : t)))
    )

    const filterById = id => xs => xs.filter(x => x.id !== id)

    const deleteTodo = source(
      concatMap(todo => {
        const filterTodos = filterById(todo.id)
        return ajax.delete(`${endpoint}/${todo.id}`).pipe(mapTo(filterTodos))
      })
    )

    const patchTodo = source(
      concatMap(todo =>
        ajax.patch(`${endpoint}/${todo.id}`, todo, {
          "Content-Type": "application/json"
        })
      ),
      pluck("response"),
      map(todo => todos => todos.map(t => (t.id === todo.id ? todo : t)))
    )

    const todos$ = of(`${endpoint}`).pipe(
      switchMap(ajax),
      pluck("response"),
      map(todos => () => todos)
    )

    const handlers = { toggleDone, setTodo, addTodo, deleteTodo, patchTodo }

    return concat(
      todos$,
      merge(toggleDone, addTodo, deleteTodo, patchTodo)
    ).pipe(scan((state, fn) => ({ ...handlers, todos: fn(state.todos) }), {}))
  })
)
