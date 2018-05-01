import { source, streamProps } from "react-streams"
import { concat, of } from "rxjs"
import { pluck, scan, tap } from "rxjs/operators"

export default streamProps(({ todo }) => {
  const toggleEdit = source(tap(e => e.preventDefault()))
  const update = source(pluck("target", "value"))

  const todo$ = concat(of(todo), update).pipe(
    scan((todo, text) => ({ ...todo, text }))
  )

  const isEditing$ = concat(of(false), toggleEdit).pipe(scan(prev => !prev))

  return {
    todo: todo$,
    isEditing: isEditing$,
    update,
    toggleEdit
  }
})
