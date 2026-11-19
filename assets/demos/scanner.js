(() => {
  const dialog = document.querySelector('#scanner-demo');
  const devices = dialog.querySelector('#scanner-devices');
  const patientName = 'Meera Rao';
  const patientId = 'CN-482731';
  const sample = { patient: patientName, item: 'Sample item A', details: 'Placeholder text' };
  const profiles = [
    { label: 'Patient', name: patientName, firstName: 'Meera', age: 42 },
    { label: 'Caregiver', name: 'Asha Rao', firstName: 'Asha', age: 29 },
  ];
  const scannerIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <path d="M4 9V4h5m6 0h5v5m0 6v5h-5m-6 0H4v-5M4 12h16" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  const portrait = '<img src="assets/images/linking-demo-patient.png" alt="CareNest illustration of Meera Rao">';

  function buildDevice(profile) {
    const device = document.createElement('div');
    device.innerHTML = `<h3 class="linking-device-label">${profile.label}’s phone</h3>
      <div class="linking-phone">
        <div class="linking-app-bar"><img src="assets/images/carenest-emblem.png" alt=""><strong>CareNest</strong></div>
        <div class="linking-screen"></div>
      </div>`;
    const screen = device.querySelector('.linking-screen');
    const isPatient = profile.label === 'Patient';
    let saved;

    function showDashboard() {
      screen.classList.add('scanner-dashboard');
      const greeting = `<h4>Hello, ${profile.firstName}!</h4><strong>${profile.name}</strong>
        <p>Age: ${profile.age} · ${profile.label} account</p>`;
      const context = isPatient
        ? `<div class="linking-card">${greeting}<div class="linking-profile"><p>Patient ID: ${patientId}</p>${portrait}</div></div>`
        : `${greeting}<div class="linking-card"><h4>Patient context</h4><span class="linking-badge">Connected</span>
          <div class="linking-profile"><div><strong>${patientName}</strong><p>Age: 42 · Patient account</p>
          <p>Patient ID: ${patientId}</p></div>${portrait}</div></div>`;
      screen.innerHTML = `<h3>${profile.label} Dashboard</h3>${context}
        <button type="button" class="scanner-fab" aria-label="Open prescription scanner">${scannerIcon}</button>`;
      screen.querySelector('button').addEventListener('click', showSample);
      if (saved) {
        const badge = document.createElement('p');
        badge.setAttribute('role', 'status');
        badge.textContent = 'Updated sample prescription saved for this demo.';
        screen.append(badge);
        const view = document.createElement('button');
        view.type = 'button';
        view.className = 'linking-secondary';
        view.textContent = 'View saved prescription';
        view.addEventListener('click', showSaved);
        screen.append(view);
      }
    }

    function showSample() {
      screen.classList.remove('scanner-dashboard');
      screen.innerHTML = `<h3>Scan a prescription</h3>
        <img class="scanner-sample" src="assets/images/scanner-demo-prescription.svg" alt="Illustrated sample prescription for Meera Rao, with a fictional item and placeholder details">
        <button type="button" data-scan>Scan sample prescription</button>
        <button type="button" class="linking-secondary" data-back>Back to dashboard</button>`;
      screen.querySelector('[data-scan]').addEventListener('click', () => showDraft(sample));
      screen.querySelector('[data-back]').addEventListener('click', showDashboard);
      screen.querySelector('[data-scan]').focus();
    }

    function showDraft(draft) {
      screen.innerHTML = `<h3>Review scanned details</h3>
        <p>Correct any fields before saving the sample.</p>
        <form class="scanner-fields">
          <label>Patient name<input name="patient" maxlength="80" required></label>
          <label>Prescription item<input name="item" maxlength="80" required></label>
          <label>Notes<input name="details" maxlength="200"></label>
          <button type="submit">Save updated prescription</button>
        </form>`;
      const form = screen.querySelector('form');
      for (const [key, value] of Object.entries(draft)) form.elements.namedItem(key).value = value;
      form.addEventListener('submit', event => {
        event.preventDefault();
        saved = Object.fromEntries(new FormData(form));
        showSaved();
      });
      form.elements.namedItem('patient').focus();
    }

    function showSaved() {
      screen.innerHTML = `<h3>Prescription updated</h3>
        <dl class="linking-card"><div><dt>Patient name</dt><dd data-field="patient"></dd></div>
        <div><dt>Prescription item</dt><dd data-field="item"></dd></div>
        <div><dt>Notes</dt><dd data-field="details"></dd></div></dl>
        <button type="button" data-edit>Edit details</button>
        <button type="button" class="linking-secondary" data-back>Back to dashboard</button>`;
      for (const field of screen.querySelectorAll('[data-field]')) {
        field.textContent = saved[field.dataset.field] || '—';
      }
      screen.querySelector('[data-edit]').addEventListener('click', () => showDraft(saved));
      screen.querySelector('[data-back]').addEventListener('click', showDashboard);
      screen.querySelector('[data-edit]').focus();
    }

    showDashboard();
    return device;
  }

  document.querySelector('#open-scanner-demo').addEventListener('click', () => {
    devices.replaceChildren(...profiles.map(buildDevice));
    dialog.showModal();
  });
})();
