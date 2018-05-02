import { source, streamProps, streamActions, action } from "react-streams"
import { of } from "rxjs"
import { pluck, tap } from "rxjs/operators"

export default streamProps(({ todo }) => {
  const toggleEdit = source(tap(e => e.preventDefault()))

  const cancel = source()

  const isEditing$ = streamActions(of(false), [
    action(toggleEdit, () => bool => !bool),
    action(cancel, () => () => false)
  ])

  const update = source(pluck("target", "value"))
  const todo$ = streamActions(of(todo), [
    action(update, text => todo => ({ ...todo, text })),
    action(cancel, () => () => todo)
  ])

  return {
    todo: todo$,
    isEditing: isEditing$,
    update,
    toggleEdit,
    cancel
  }
})
