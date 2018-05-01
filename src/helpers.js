import { Observable, combineLatest, concat, from, merge } from "rxjs"
import { map, scan, switchMap } from "rxjs/operators"

const streamActions = (stream, actions) =>
  concat(stream, merge(...actions)).pipe(scan((value, fn) => fn(value)))

const action = (src, reducer) => from(src).pipe(map(reducer))

//props -> Object with keys/values of ref/stream
/*
  for example:
    return {
      todos: todosAndActions$,
      current: current$,
      ...handlers
    }
*/

//TODO: optimize :)
const mapProps = fn =>
  //maybe we need a "switchProps", "mergeProps", "concatProps", etc...
  //but I can't think of many scenarios where props update and you wouldn't want to "switch"
  switchMap(inProps => {
    const props = fn(inProps)
    const entries = Object.entries(props)

    //handlers are functions, so only `
    const streamEntries = entries.filter(([_, v]) => v instanceof Observable)
    const handlerEntries = entries.filter(
      ([_, v]) => !(v instanceof Observable)
    )

    const streams = streamEntries.map(([_, v]) => v)
    const streamKeys = streamEntries.map(([v]) => v)

    //this is super hard to read, so much spreading... :/
    return combineLatest(...streams, (...args) => ({
      ...args.reduce((props, arg, i) => {
        return {
          ...props,
          [streamKeys[i]]: arg
        }
      }, {}),
      ...handlerEntries.reduce(
        (acc, curr) => ({
          ...acc,
          [curr[0]]: curr[1]
        }),
        {}
      )
    }))
  })
export { streamActions, action, mapProps }
