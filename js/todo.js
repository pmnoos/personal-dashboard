// ===== TODO LIST =====

document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const todoAddBtn = document.getElementById("todo-add-btn");
  const todoList = document.getElementById("todo-list");

  let todos = JSON.parse(localStorage.getItem("dashboard-todos")) || [];

  function saveTodos() {
    localStorage.setItem("dashboard-todos", JSON.stringify(todos));
  }

  function renderTodos() {
    todoList.innerHTML = "";
    todos.forEach((todo, index) => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.completed ? "completed" : ""}`;
      li.innerHTML = `
                <input type="checkbox" ${todo.completed ? "checked" : ""}
                    onchange="toggleTodo(${index})">
                <span>${todo.text}</span>
                <button class="todo-delete" onclick="deleteTodo(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
      todoList.appendChild(li);
    });
  }

  function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;
    todos.push({ text, completed: false });
    saveTodos();
    renderTodos();
    todoInput.value = "";
  }

  window.toggleTodo = function (index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
  };

  window.deleteTodo = function (index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  };

  todoAddBtn.addEventListener("click", addTodo);

  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
  });

  renderTodos();
});
