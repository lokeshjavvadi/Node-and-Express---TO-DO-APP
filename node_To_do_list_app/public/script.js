const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const todoList = document.getElementById('todo-list');

// Fetch and display todos
async function loadTodos() {
  const res = await fetch('/todos');
  const todos = await res.json();

  todoList.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';
    li.innerHTML = `
      <span onclick="toggleComplete(${todo.id}, ${todo.completed})">${todo.task}</span>
      <button onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    todoList.appendChild(li);
  });
}

// Add new todo
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const task = taskInput.value;

  await fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task })
  });

  taskInput.value = '';
  loadTodos();
});

// Toggle complete
async function toggleComplete(id, completed) {
  await fetch(`/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !completed })
  });
  loadTodos();
}

// Delete
async function deleteTodo(id) {
  await fetch(`/todos/${id}`, { method: 'DELETE' });
  loadTodos();
}

// Initial load
loadTodos();
