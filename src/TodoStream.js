import { pipeProps, source } from "react-streams/dist"
import { concat, of } from "rxjs"
import { pluck, scan, tap } from "rxjs/operators"
import { mapProps } from "./helpers"

export default pipeProps(
  mapProps(({ todo }) => {
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
)
