const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, './public')));


const filePath = path.join(__dirname, './todos.json');

// Utility: Read todos from file
function readTodos() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Utility: Write todos to file
function writeTodos(todos) {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
}

// GET all todos
app.get('/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// GET one todo by ID
app.get('/todos/:id', (req, res) => {
  const todos = readTodos();
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.json(todo);
});

// POST new todo
app.post('/todos', (req, res) => {
  const todos = readTodos();
  const { task } = req.body;
  if (!task) return res.status(400).json({ message: 'Task is required' });

  const newTodo = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    task,
    completed: false
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// PUT update todo
app.put('/todos/:id', (req, res) => {
  const todos = readTodos();
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  const { task, completed } = req.body;
  if (task !== undefined) todo.task = task;
  if (completed !== undefined) todo.completed = completed;

  writeTodos(todos);
  res.json(todo);
});

// DELETE a todo
app.delete('/todos/:id', (req, res) => {
  let todos = readTodos();
  todos = todos.filter(t => t.id !== parseInt(req.params.id));
  writeTodos(todos);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`📁 TODO API with JSON running at http://localhost:${PORT}`);
});
