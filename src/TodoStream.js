import { source, streamProps, streamActions, action } from "react-streams"
import { of } from "rxjs"
import { pluck, tap } from "rxjs/operators"

export default streamProps(({ todo }) => {
  const update = source(pluck("target", "value"))
  const todo$ = streamActions(of(todo), [
    action(update, text => todo => ({ ...todo, text }))
  ])

  const toggleEdit = source(tap(e => e.preventDefault()))
  const isEditing$ = streamActions(of(false), [
    action(toggleEdit, () => bool => !bool)
  ])

  return {
    todo: todo$,
    isEditing: isEditing$,
    update,
    toggleEdit
  }
})
