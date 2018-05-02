import React from "react"
import { render } from "react-dom"
import TodosStream from "./TodosStream"
import "./index.css"

// Get your own, free todos API 🙌 https://glitch.com/edit/#!/import/github/johnlindquist/todos-api
const endpoint = "https://silly-boar.glitch.me/todos"

const AddTodoForm = ({ onAddTodo, onSetTodo, current }) => (
  <form
    style={{ width: "100%", height: "2rem", display: "flex" }}
    onSubmit={onAddTodo}
  >
    <input
      style={{ flex: "1" }}
      type="text"
      onChange={onSetTodo}
      value={current}
      autoFocus
      placeholder="What needs to be done?"
    />
    <input type="submit" value="Add Todo" />
  </form>
)

const Todo = ({ todo, onToggleDone, onDeleteTodo }) => (
  <li
    style={{
      display: "flex"
    }}
  >
    <span
      style={{
        flex: 1,
        textDecoration: todo.done ? "line-through" : null
      }}
    >
      {todo.text}
    </span>
    <button
      aria-label={`Toggle ${todo.text}`}
      onClick={e => onToggleDone(todo)}
    >
      ✓
    </button>
    <button
      aria-label={`Delete ${todo.text}`}
      onClick={e => onDeleteTodo(todo)}
    >
      X
    </button>
  </li>
)

const App = () => (
  <TodosStream endpoint={endpoint}>
    {({ todos, current, onSetTodo, onAddTodo, onToggleDone, onDeleteTodo }) => (
      <div style={{ padding: "2rem", width: "300px" }}>
        <AddTodoForm
          onAddTodo={onAddTodo}
          onSetTodo={onSetTodo}
          current={current}
        />
        <ul style={{ padding: "0", listStyleType: "none" }}>
          {todos.map(todo => (
            <Todo
              key={todo.id}
              todo={todo}
              onToggleDone={onToggleDone}
              onDeleteTodo={onDeleteTodo}
            />
          ))}
        </ul>
      </div>
    )}
  </TodosStream>
)

render(<App />, document.getElementById("root"))
