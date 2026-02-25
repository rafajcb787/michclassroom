const workList = document.getElementById('work-list');
const eventList = document.getElementById('event-list');

function appendListItem(list, text) {
  const item = document.createElement('li');
  item.textContent = text;
  list.prepend(item);
}

document.getElementById('upload-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('work-title').value.trim();
  const notes = document.getElementById('work-notes').value.trim();

  if (!title) return;

  const line = notes ? `${title} — ${notes}` : title;
  appendListItem(workList, line);
  event.target.reset();
});

document.getElementById('calendar-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('event-title').value.trim();
  const date = document.getElementById('event-date').value;

  if (!title || !date) return;

  appendListItem(eventList, `${date}: ${title}`);
  event.target.reset();
});

document.getElementById('message-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const to = document.getElementById('message-to').value.trim();
  const body = document.getElementById('message-body').value.trim();
  const status = document.getElementById('message-status');

  status.textContent = to && body ? `Message sent to ${to}.` : 'Please fill all fields.';
  if (to && body) event.target.reset();
});

document.getElementById('register-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const role = document.getElementById('role').value;
  const status = document.getElementById('register-status');

  if (!name || !email || !role) {
    status.textContent = 'Please complete all registration fields.';
    return;
  }

  const key = 'micheline-classroom-users';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push({ name, email, role, createdAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(existing));

  status.textContent = `Welcome ${name}! Your ${role.toLowerCase()} account was created.`;
  event.target.reset();
});

appendListItem(workList, 'Welcome Pack — Read this before Monday');
appendListItem(eventList, '2026-09-01: First day of class');
