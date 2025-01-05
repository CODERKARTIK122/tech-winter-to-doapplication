// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Render tasks
function renderTasks() {
  todoList.innerHTML = '';
  let filteredTasks = tasks;

  if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.classList.toggle('completed', task.completed);

    const span = document.createElement('span');
    span.classList.add('task-text');
    span.textContent = task.text;
    li.appendChild(span);

    // Mark task as complete/incomplete
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = task.completed ? 'Mark Incomplete' : 'Mark Complete';
    toggleBtn.onclick = () => toggleTaskCompletion(task.id);
    li.appendChild(toggleBtn);

    // Edit task
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editTask(task.id);
    li.appendChild(editBtn);

    // Delete task
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTask(task.id);
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
  });
}

// Add task
addTaskBtn.onclick = () => {
  const text = taskInput.value.trim();
  if (text) {
    const newTask = { id: Date.now(), text, completed: false };
    tasks.push(newTask);
    taskInput.value = '';
    saveTasks();
    renderTasks();
  }
};

// Toggle task completion
function toggleTaskCompletion(id) {
  const task = tasks.find(task => task.id === id);
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

// Edit task
function editTask(id) {
  const task = tasks.find(task => task.id === id);
  taskInput.value = task.text;
  addTaskBtn.onclick = () => {
    const updatedText = taskInput.value.trim();
    if (updatedText) {
      task.text = updatedText;
      saveTasks();
      renderTasks();
      taskInput.value = '';
    }
  };
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Save tasks to local storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Filter tasks
filterBtns.forEach(button => {
  button.onclick = () => {
    currentFilter = button.dataset.filter;
    renderTasks();
  };
});

// Initial render
renderTasks();
