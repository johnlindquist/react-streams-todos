import React from "react"
import { render } from "react-dom"
import TodoStream from "./TodoStream"
import TodosStream from "./TodosStream"
import "./index.css"

// Get your own, free todos API 🙌 https://glitch.com/edit/#!/import/github/johnlindquist/todos-api
const endpoint = "https://silly-boar.glitch.me/todos"

const AddTodoForm = ({ addTodo, setTodo, current }) => (
  <form onSubmit={addTodo}>
    <input type="text" onChange={setTodo} value={current} />
    <input type="submit" value="Add Todo" />
  </form>
)

const EditTodo = ({ todo, update, toggleEdit, patchTodo, cancel }) => (
  <form
    style={{
      display: "flex"
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
      onKeyDown={e => (e.key === "Escape" ? cancel(e) : null)}
      autoFocus
      style={{ flex: 1 }}
    />
    <input type="submit" />
  </form>
)

const DisplayTodo = ({ todo, toggleDone, toggleEdit, deleteTodo }) => (
  <div
    style={{
      display: "flex"
    }}
  >
    <span
      style={{
        flex: 1,
        textDecoration: todo.done ? "line-through" : null
      }}
      onClick={toggleEdit}
    >
      {todo.text}
    </span>
    <button onClick={e => toggleDone(todo)}>Done</button>
    <button onClick={e => deleteTodo(todo)}>X</button>
  </div>
)

const Todo = ({
  todo,
  update,
  isEditing,
  toggleEdit,
  patchTodo,
  toggleDone,
  deleteTodo,
  cancel
}) => {
  const editTodoProps = { todo, update, toggleEdit, patchTodo, cancel }
  const displayTodoProps = { todo, toggleDone, toggleEdit, deleteTodo }
  return (
    <li style={{ width: "200px" }}>
      {isEditing ? (
        <EditTodo {...editTodoProps} />
      ) : (
        <DisplayTodo {...displayTodoProps} />
      )}
    </li>
  )
}

const App = () => (
  <TodosStream endpoint={endpoint}>
    {({
      todos,
      current,
      setTodo,
      addTodo,
      toggleDone,
      deleteTodo,
      patchTodo
    }) => (
      <div style={{ padding: "2rem" }}>
        <AddTodoForm addTodo={addTodo} setTodo={setTodo} current={current} />
        <h3>Click a Todo to Edit</h3>
        <ul>
          {todos.map(todo => (
            <TodoStream key={todo.id} todo={todo}>
              {props => {
                const todoProps = {
                  ...props,
                  toggleDone,
                  deleteTodo,
                  patchTodo
                }
                return <Todo {...todoProps} />
              }}
            </TodoStream>
          ))}
        </ul>
      </div>
    )}
  </TodosStream>
)

render(<App />, document.getElementById("root"))
