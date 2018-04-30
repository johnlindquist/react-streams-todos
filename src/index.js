import "./index.css"
import React, { Component } from "react"
import { render } from "react-dom"
import TodosStream from "./TodosStream"
import TodoStream from "./TodoStream"

// Get your own, free todos API 🙌 https://glitch.com/edit/#!/import/github/johnlindquist/todos-api
const endpoint = "https://silly-boar.glitch.me/todos"

class App extends Component {
  render() {
    return (
      <TodosStream endpoint={endpoint}>
        {({ todos, setTodo, addTodo, toggleDone, deleteTodo, patchTodo }) => (
          <div style={{ padding: "2rem" }}>
            <form onSubmit={addTodo}>
              <input type="text" onBlur={setTodo} />
              <input type="submit" value="Add Todo" />
            </form>
            <h3>Click a Todo to Edit</h3>
            <ul>
              {todos.map(todo => (
                <TodoStream key={todo.id} todo={todo}>
                  {({ todo, update, isEditing, toggleEdit }) => {
                    return (
                      <li>
                        {isEditing ? (
                          <form
                            style={{
                              display: "flex",
                              width: "50%",
                              justifyContent: "space-between"
                            }}
                            onSubmit={e => {
                              toggleEdit(e)
                              patchTodo(todo)
                            }}
                          >
                            <input
                              type="text"
                              value={todo.text}
                              onChange={update}
                              onBlur={toggleEdit}
                              autoFocus
                            />
                            <input type="submit" />
                          </form>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              width: "50%",
                              justifyContent: "space-between"
                            }}
                          >
                            <span onClick={toggleEdit}>{todo.text}</span>
                            <button onClick={e => toggleDone(todo)}>
                              Done
                            </button>
                          </div>
                        )}
                      </li>
                    )
                  }}
                </TodoStream>
              ))}
            </ul>
          </div>
        )}
      </TodosStream>
    )
  }
}

render(<App />, document.getElementById("root"))
