const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

const STORAGE_KEY = 'tasks_v1';

//Read tasks from storage
function readTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

//Write tasks to storage
function writeTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

//Create a unique id
function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}

//Add task handler
function addTask() {
  const text = taskInput.value.trim();
  const priority = priorityInput.value || 'Low';

  if (!text) {
    alert('Task cannot be empty!');
    return;
  }

  const tasks = readTasks();
  tasks.push({ id: makeId(), text, priority, completed: false });
  writeTasks(tasks);
  renderTasks();

  taskInput.value = '';
  priorityInput.value = 'Low';
  taskInput.focus();
}

//Sort by priority (High -> Medium -> Low)
function sortTasks(tasks) {
  const order = { High: 1, Medium: 2, Low: 3 };
  return tasks.slice().sort((a,b) => {
    if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
    return 0;
  });
}

//Render all tasks to UI
function renderTasks() {
  const tasks = sortTasks(readTasks());
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.classList.add(task.priority.toLowerCase());
    if (task.completed) li.classList.add('completed');

    // left part: checkbox + text
    const left = document.createElement('div');
    left.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'task-checkbox';
    checkbox.addEventListener('change', () => toggleComplete(task.id));

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const tag = document.createElement('span');
    tag.className = `priority-tag ${task.priority.toLowerCase()}`;
    tag.textContent = task.priority;

    left.appendChild(checkbox);
    left.appendChild(span);
    left.appendChild(tag);

    // right part: actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTask(task.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(left);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

//Toggle completed state by id
function toggleComplete(id) {
  const tasks = readTasks().map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  writeTasks(tasks);
  renderTasks();
}

//Edit a task
function editTask(id) {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newText = prompt('Edit task text:', task.text);
  if (newText === null) return; // Cancel
  const trimmed = newText.trim();
  if (trimmed === '') { alert('Task text cannot be empty'); return; }

  //Ask for priority
  let newPriority = prompt('Set priority (High / Medium / Low):', task.priority);
  if (newPriority === null) return;

  newPriority = newPriority.trim();
  const allowed = ['High','Medium','Low'];
  if (!allowed.includes(capitalise(newPriority))) {
    //Try capitalising first letter
    const cc = capitalise(newPriority);
    if (!allowed.includes(cc)) {
      alert('Invalid priority. Keeping previous priority.');
      newPriority = task.priority;
    } else newPriority = cc;
  } else {
    newPriority = capitalise(newPriority);
  }

  //Apply changes
  const updated = tasks.map(t => t.id === id ? { ...t, text: trimmed, priority: newPriority } : t);
  writeTasks(updated);
  renderTasks();
}

function capitalise(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

//Delete a task by id
function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  const tasks = readTasks().filter(t => t.id !== id);
  writeTasks(tasks);
  renderTasks();
}

//Setup events
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();

  //Add button
  addBtn.addEventListener('click', addTask);

  //Enter key support
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
  });
});
//EOF