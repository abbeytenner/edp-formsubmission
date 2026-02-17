const state = {
  studentType:   '',
  religion:      '',
  civilStatus:   '',
  firstName:     '',
  middleName:    '',
  lastName:      '',
  suffix:        '',
  contactNumber: '',
  birthdate:     '',
  sex:           '',
  email:         '',
  nationality:   '',
  country:       '',
  address:       '',
  bloodType:     ''
};

const REQUIRED = [
  'studentType', 'religion', 'civilStatus',
  'firstName', 'lastName',
  'contactNumber', 'birthdate',
  'sex', 'email', 'nationality',
  'country', 'address', 'bloodType'
];

const TOTAL_REQUIRED = REQUIRED.length;

function updateState(key, value) {
  state[key] = value.trim();
  updateStatusBar();
}

function updateStatusBar() {
  const filled = REQUIRED.filter(k => state[k] !== '').length;
  document.getElementById('fieldCount').textContent = `${filled} / ${TOTAL_REQUIRED}`;
  const statusEl = document.getElementById('statusText');
  if (filled === TOTAL_REQUIRED) {
    statusEl.textContent = '✔ All required fields complete — ready to submit!';
  } else {
    statusEl.textContent = `${TOTAL_REQUIRED - filled} required field(s) remaining...`;
  }
}

function attachListeners() {
  const textInputIds = [
    'firstName', 'middleName', 'lastName', 'suffix',
    'contactNumber', 'birthdate', 'email', 'nationality',
    'country', 'address'
  ];

  textInputIds.forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      updateState(id, el.value);
      if (REQUIRED.includes(id)) clearError(id);
    });
  });

  const selectIds = ['studentType', 'religion', 'civilStatus', 'sex', 'bloodType'];
  selectIds.forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('change', () => {
      updateState(id, el.value);
      clearError(id);
    });
  });
}

function validateAll() {
  let valid = true;
  REQUIRED.forEach(key => {
    if (state[key] === '') {
      showError(key);
      valid = false;
    } else {
      clearError(key);
    }
  });
  return valid;
}

function showError(id) {
  const el    = document.getElementById(id);
  const errEl = document.getElementById('err-' + id);
  if (el)    el.classList.add('error');
  if (errEl) errEl.classList.add('visible');
}

function clearError(id) {
  const el    = document.getElementById(id);
  const errEl = document.getElementById('err-' + id);
  if (el)    el.classList.remove('error');
  if (errEl) errEl.classList.remove('visible');
}

document.getElementById('submitBtn').addEventListener('click', () => {
  if (!validateAll()) {
    document.getElementById('statusText').textContent = '⚠ Please fill in all required fields!';
    return;
  }
  // Save snapshot to localStorage
  const submission = { ...state, submittedAt: new Date().toISOString() };
  localStorage.setItem('studentFormData', JSON.stringify(submission));
  // Show success dialog
  const fullName = [state.firstName, state.middleName, state.lastName, state.suffix]
    .filter(Boolean).join(' ');
  document.getElementById('dialogName').textContent = fullName;
  document.getElementById('successDialog').classList.add('visible');
});

document.getElementById('resetBtn').addEventListener('click', () => {
  Object.keys(state).forEach(k => state[k] = '');
  document.querySelectorAll('.form-input').forEach(el => el.value = '');
  document.querySelectorAll('.form-select').forEach(el => el.selectedIndex = 0);
  REQUIRED.forEach(k => clearError(k));
  updateStatusBar();
  document.getElementById('statusText').textContent = 'Form cleared.';
});

function closeDialog() {
  document.getElementById('successDialog').classList.remove('visible');
}

attachListeners();
updateStatusBar();


const saved = localStorage.getItem('studentFormData');
if (saved) {
  try {
    const data = JSON.parse(saved);
    Object.keys(state).forEach(k => {
      if (data[k] !== undefined) {
        state[k] = data[k];
        const el = document.getElementById(k);
        if (el) el.value = data[k];
      }
    });
    updateStatusBar();
    document.getElementById('statusText').textContent = 'Previous data loaded from localStorage.';
  } catch (e) { /* ignore malformed data */ }
}