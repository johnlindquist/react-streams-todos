import { source, pipeProps } from "react-streams/dist"
import { tap, pluck, scan, switchMap } from "rxjs/operators"
import { concat, of, combineLatest } from "rxjs"

export default pipeProps(
  switchMap(({ todo }) => {
    const toggleEdit = source(tap(e => e.preventDefault()))
    const update = source(pluck("target", "value"))

    const todo$ = concat(of(todo), update).pipe(
      scan((todo, text) => ({ ...todo, text }))
    )

    const isEditing$ = concat(of(false), toggleEdit).pipe(scan(prev => !prev))

    return combineLatest(todo$, isEditing$, (todo, isEditing) => ({
      todo,
      isEditing,
      update,
      toggleEdit
    }))
  })
)
