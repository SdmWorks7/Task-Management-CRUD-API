const API = '/tasks';
  let tasks = [];
  let currentFilter = 'all';
  let editingId = null;
  let deleteConfirming = false;

  const listEl = document.getElementById('list');
  const panel = document.getElementById('panel');
  const overlay = document.getElementById('overlay');
  const toast = document.getElementById('toast');

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function formatDate(d) {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function statusColor(status) {
    if (status === 'completed') return 'var(--status-done)';
    if (status === 'in-progress') return 'var(--status-progress)';
    return 'var(--status-pending)';
  }

  async function fetchTasks() {
    try {
      const res = await fetch(API);
      const data = await res.json();
      tasks = data.data || [];
      renderCounts();
      renderList();
    } catch (err) {
      listEl.innerHTML = '<div class="empty">Could not reach the API. Make sure the server is running.</div>';
    }
  }

  function renderCounts() {
    document.getElementById('count-all').textContent = tasks.length;
    document.getElementById('count-pending').textContent = tasks.filter(t => t.status === 'pending').length;
    document.getElementById('count-progress').textContent = tasks.filter(t => t.status === 'in-progress').length;
    document.getElementById('count-completed').textContent = tasks.filter(t => t.status === 'completed').length;
  }

  function renderList() {
    const filtered = currentFilter === 'all' ? tasks : tasks.filter(t => t.status === currentFilter);

    if (filtered.length === 0) {
      listEl.innerHTML = '<div class="empty">No tasks here yet.</div>';
      return;
    }

    listEl.innerHTML = filtered.map(t => `
      <div class="task" data-id="${t._id}">
        <div class="status-dot" style="background:${statusColor(t.status)}"></div>
        <div class="task-body">
          <div class="task-title ${t.status === 'completed' ? 'done' : ''}">${escapeHtml(t.title)}</div>
          ${t.description ? `<div class="task-desc">${escapeHtml(t.description)}</div>` : ''}
          <div class="task-meta">Due ${formatDate(t.dueDate)}</div>
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('.task').forEach(el => {
      el.addEventListener('click', () => openEdit(el.dataset.id));
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function openPanel() {
    panel.classList.add('open');
    overlay.classList.add('open');
  }

  function closePanel() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    editingId = null;
    deleteConfirming = false;
    resetDeleteBtn();
  }

  function resetDeleteBtn() {
    const btn = document.getElementById('delete-btn');
    btn.textContent = 'Delete';
    btn.classList.remove('confirm');
  }

  function openNew() {
    editingId = null;
    document.getElementById('panel-title').textContent = 'New Task';
    document.getElementById('f-title').value = '';
    document.getElementById('f-desc').value = '';
    document.getElementById('f-status').value = 'pending';
    document.getElementById('f-due').value = '';
    document.getElementById('delete-btn').style.display = 'none';
    openPanel();
  }

  function openEdit(id) {
    const task = tasks.find(t => t._id === id);
    if (!task) return;
    editingId = id;
    document.getElementById('panel-title').textContent = 'Edit Task';
    document.getElementById('f-title').value = task.title;
    document.getElementById('f-desc').value = task.description || '';
    document.getElementById('f-status').value = task.status;
    document.getElementById('f-due').value = task.dueDate ? task.dueDate.slice(0, 10) : '';
    document.getElementById('delete-btn').style.display = 'block';
    resetDeleteBtn();
    openPanel();
  }

  async function saveTask() {
    const title = document.getElementById('f-title').value.trim();
    if (!title) {
      showToast('Title is required');
      return;
    }

    const body = {
      title,
      description: document.getElementById('f-desc').value.trim(),
      status: document.getElementById('f-status').value,
      dueDate: document.getElementById('f-due').value || undefined,
    };

    try {
      const url = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || 'Something went wrong');
        return;
      }
      showToast(editingId ? 'Task updated' : 'Task created');
      closePanel();
      fetchTasks();
    } catch (err) {
      showToast('Could not reach the API');
    }
  }

  async function deleteTask() {
    if (!deleteConfirming) {
      deleteConfirming = true;
      const btn = document.getElementById('delete-btn');
      btn.textContent = 'Confirm delete';
      btn.classList.add('confirm');
      return;
    }

    try {
      const res = await fetch(`${API}/${editingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || 'Could not delete');
        return;
      }
      showToast('Task deleted');
      closePanel();
      fetchTasks();
    } catch (err) {
      showToast('Could not reach the API');
    }
  }

  document.getElementById('new-task-btn').addEventListener('click', openNew);
  document.getElementById('close-btn').addEventListener('click', closePanel);
  document.getElementById('overlay').addEventListener('click', closePanel);
  document.getElementById('save-btn').addEventListener('click', saveTask);
  document.getElementById('delete-btn').addEventListener('click', deleteTask);

  document.querySelectorAll('.filter').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
      el.classList.add('active');
      currentFilter = el.dataset.filter;
      const titles = { all: 'All Tasks', pending: 'Pending', 'in-progress': 'In Progress', completed: 'Completed' };
      document.getElementById('view-title').textContent = titles[currentFilter];
      renderList();
    });
  });

  fetchTasks();
