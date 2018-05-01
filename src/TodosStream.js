import { action, source, streamActions, streamProps } from "react-streams"
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

const HEADERS = { "Content-Type": "application/json" }

export default streamProps(({ endpoint }) => {
  const setTodo = source(pluck("target", "value"))

  const addTodo = source(
    tap(e => e.preventDefault()),
    withLatestFrom(setTodo, (e, text) => text),
    concatMap(text => ajax.post(`${endpoint}`, { text, done: false }, HEADERS)),
    pluck("response")
  )

  const current$ = concat(of(""), merge(setTodo, from(addTodo).pipe(mapTo(""))))

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

  const deleteTodo = source(
    concatMap(todo => ajax.delete(`${endpoint}/${todo.id}`).pipe(mapTo(todo)))
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

  // Can this be expressed better?
  const todosAndActions$ = streamActions(todos$, [
    action(toggleDone, todo => todos =>
      todos.map(t => (t.id === todo.id ? todo : t))
    ),
    action(addTodo, todo => todos => [...todos, todo]),
    action(patchTodo, todo => todos =>
      todos.map(t => (t.id === todo.id ? todo : t))
    ),
    action(deleteTodo, todo => todos => todos.filter(t => t.id !== todo.id))
  ])

  return {
    todos: todosAndActions$,
    current: current$,
    toggleDone,
    setTodo,
    addTodo,
    deleteTodo,
    patchTodo
  }
})
