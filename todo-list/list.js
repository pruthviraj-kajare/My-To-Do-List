/**
 * My To-Do List — list.js
 * Features: Add | Edit | Delete | Mark Complete | Filter | Clear All
 */

(function () {
  "use strict";

  // State
  let tasks = [];
  let currentFilter = "all";
  let editingId = null;

  // DOM References
  const taskInput     = document.getElementById("taskInput");
  const addTaskBtn    = document.getElementById("addTaskBtn");
  const taskList      = document.getElementById("taskList");
  const deleteAllBtn  = document.getElementById("deleteAllBtn");
  const filterBtns    = document.querySelectorAll(".filter-btn");

  const modalOverlay  = document.getElementById("modalOverlay");
  const editInput     = document.getElementById("editInput");
  const saveEditBtn   = document.getElementById("saveEditBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  const totalCount    = document.getElementById("totalCount");
  const pendingCount  = document.getElementById("pendingCount");
  const doneCount     = document.getElementById("doneCount");

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // Render
  function render() {
    const filtered = tasks.filter(function (t) {
      if (currentFilter === "pending")   return !t.completed;
      if (currentFilter === "completed") return  t.completed;
      return true;
    });

    taskList.innerHTML = "";

    const total   = tasks.length;
    const done    = tasks.filter(function (t) { return t.completed; }).length;
    const pending = total - done;
    totalCount.textContent   = total;
    pendingCount.textContent = pending;
    doneCount.textContent    = done;

    filtered.forEach(function (task) {
      var li = document.createElement("li");
      li.className = "task-item" + (task.completed ? " completed" : "");
      li.dataset.id = task.id;

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", function () {
        toggleComplete(task.id);
      });

      var span = document.createElement("span");
      span.className = "task-text";
      span.textContent = task.text;

      var actions = document.createElement("div");
      actions.className = "task-actions";

      var editBtn = document.createElement("button");
      editBtn.className = "action-btn edit-btn";
      editBtn.innerHTML = "✏️";
      editBtn.addEventListener("click", function () {
        openEditModal(task.id);
      });

      var deleteBtn = document.createElement("button");
      deleteBtn.className = "action-btn delete-btn";
      deleteBtn.innerHTML = "🗑";
      deleteBtn.addEventListener("click", function () {
        deleteTask(task.id);
      });

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(actions);
      taskList.appendChild(li);
    });
  }

  // Task Operations
  function addTask() {
    var text = taskInput.value.trim();
    if (!text) {
      taskInput.focus();
      return;
    }
    tasks.push({ id: generateId(), text: text, completed: false });
    taskInput.value = "";
    taskInput.focus();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    render();
  }

  function toggleComplete(id) {
    tasks = tasks.map(function (t) {
      if (t.id === id) return { id: t.id, text: t.text, completed: !t.completed };
      return t;
    });
    render();
  }

  function deleteAll() {
    if (tasks.length === 0) return;
    if (!confirm("Are you sure you want to delete all tasks?")) return;
    tasks = [];
    render();
  }

  // Edit Modal
  function openEditModal(id) {
    var task = tasks.find(function (t) { return t.id === id; });
    if (!task) return;
    editingId = id;
    editInput.value = task.text;
    modalOverlay.classList.add("open");
    editInput.focus();
    editInput.select();
  }

  function closeEditModal() {
    editingId = null;
    modalOverlay.classList.remove("open");
  }

  function saveEdit() {
    var newText = editInput.value.trim();
    if (!newText) return;
    tasks = tasks.map(function (t) {
      if (t.id === editingId) return { id: t.id, text: newText, completed: t.completed };
      return t;
    });
    closeEditModal();
    render();
  }

  // Filtering
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  // Event Listeners
  addTaskBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") addTask();
  });

  deleteAllBtn.addEventListener("click", deleteAll);
  saveEditBtn.addEventListener("click", saveEdit);

  editInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter")  saveEdit();
    if (e.key === "Escape") closeEditModal();
  });

  cancelEditBtn.addEventListener("click", closeEditModal);

  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) closeEditModal();
  });

  // Init
  render();

})();
