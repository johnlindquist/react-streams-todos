import { pipeProps, source } from "react-streams"
import { concat, from, merge, of } from "rxjs"
import { ajax } from "rxjs/ajax"
import {
  concatMap,
  mapTo,
  pluck,
  switchMap,
  tap,
  withLatestFrom
} from "rxjs/operators"
import { action, mapProps, streamActions } from "./helpers"

const HEADERS = { "Content-Type": "application/json" }

export default pipeProps(
  mapProps(({ endpoint }) => {
    const setTodo = source(pluck("target", "value"))

    const addTodo = source(
      tap(e => e.preventDefault()),
      withLatestFrom(setTodo, (e, text) => text),
      concatMap(text =>
        ajax.post(`${endpoint}`, { text, done: false }, HEADERS)
      ),
      pluck("response")
    )

    const current$ = concat(
      of(""),
      merge(setTodo, from(addTodo).pipe(mapTo("")))
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
      pluck("response")
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
      pluck("response")
    )

    const todos$ = of(`${endpoint}`).pipe(switchMap(ajax), pluck("response"))

    //pair "handlers" to functions
    const toggleDoneAction = action(toggleDone, todo => todos =>
      todos.map(t => (t.id === todo.id ? todo : t))
    )

    const addTodoAction = action(addTodo, todo => todos => [...todos, todo])

    const patchTodoAction = action(patchTodo, todo => todos =>
      todos.map(t => (t.id === todo.id ? todo : t))
    )

    // Can this be expressed better?
    const todosAndActions$ = streamActions(todos$, [
      toggleDoneAction,
      addTodoAction,
      deleteTodo,
      patchTodoAction
    ])

    const handlers = { toggleDone, setTodo, addTodo, deleteTodo, patchTodo }

    return {
      todos: todosAndActions$,
      current: current$,
      ...handlers
    }
  })
)
