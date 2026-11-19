(() => {
  const dialog = document.querySelector('#multilogin-demo');
  const screen = dialog.querySelector('.linking-screen');
  const status = dialog.querySelector('.linking-status');
  const accounts = {
    caregiver: { firstName: 'Ananya', name: 'Ananya Sahoo', age: 31, role: 'Caregiver' },
    patient: { firstName: 'Sujata', name: 'Sujata Sahoo', age: 62, role: 'Patient' },
  };
  const portrait = '<img src="assets/images/linking-demo-patient.png" alt="CareNest illustration of Sujata Sahoo">';
  const switchButton = '<button type="button" data-view="switch">Switch account</button>';
  let active = 'caregiver';

  function render(view) {
    const account = accounts[active];
    const isPatient = active === 'patient';
    dialog.querySelector('[data-active-role]').textContent = account.role;
    const tabs = dialog.querySelectorAll('.multilogin-tabs button');
    tabs[1].textContent = isPatient ? 'Account' : 'More';
    for (const tab of tabs) {
      if (tab.dataset.view === view) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    }

    const patientProfile = `<div class="linking-profile"><div><strong>Sujata Sahoo</strong>
      <p>Age: 62 · Patient account</p><p>Patient ID: CN-482731</p></div>${portrait}</div>`;
    const greeting = `<h4>Hello, ${account.firstName}!</h4>`;
    const details = `<strong>${account.name}</strong><p>Age: ${account.age} · ${account.role} account</p>`;
    const homeContent = isPatient
      ? `<div class="linking-card">${greeting}${patientProfile}</div>`
      : `${greeting}${details}<div class="linking-card"><h4>Patient context</h4>
        <span class="linking-badge">Connected</span>${patientProfile}</div>`;
    const accountContent = isPatient
      ? '<h3>Account</h3><div class="linking-card"><h4>Caregiver requests</h4><p>No pending demo requests.</p></div>'
      : `<h3>More</h3><p>Patient context: Sujata Sahoo</p><ul class="multilogin-list">
        <li>Patient history</li><li>Doctor instructions</li><li>Documents</li><li>Allergies</li><li>Emergency contacts</li></ul>`;
    const alternate = Object.entries(accounts).find(([key]) => key !== active);
    const [alternateKey, alternateAccount] = alternate;
    const views = {
      home: `<h3>${account.role} Dashboard</h3>${homeContent}`,
      account: `${accountContent}<button type="button" class="linking-secondary" data-view="profile">${isPatient ? 'Personal details' : 'Profile'}</button>${switchButton}`,
      profile: `<div class="linking-card multilogin-profile">
        <h3>${isPatient ? 'Tell us about yourself' : 'Caregiver profile'}</h3>
        <p>Full name: ${account.name}</p><p>Age: ${account.age}</p><p>Role: ${account.role}</p>
        ${isPatient ? '<p>Gender: Woman</p>' : ''}</div>${switchButton}
        <button type="button" class="linking-secondary" data-view="account">Back to ${isPatient ? 'Account' : 'More'}</button>`,
      switch: `<h3>Switch account</h3><p>Choose a saved demo account.</p>
        <div class="linking-card"><strong>${account.name}</strong><p>${account.role} · Current account</p></div>
        <button type="button" data-account="${alternateKey}">Continue as ${alternateAccount.name} · ${alternateAccount.role}</button>
        <button type="button" class="linking-secondary" data-view="account">Cancel</button>`,
    };
    screen.innerHTML = views[view];
  }

  document.querySelector('#open-multilogin-demo').addEventListener('click', () => {
    active = 'caregiver';
    status.textContent = 'Open More to try switching accounts.';
    render('home');
    dialog.showModal();
  });
  dialog.addEventListener('click', event => {
    const button = event.target.closest('button[data-view], button[data-account]');
    if (!button) return;
    if (button.dataset.account) {
      active = button.dataset.account;
      render('home');
      status.textContent = `Now viewing ${accounts[active].name}’s ${accounts[active].role.toLowerCase()} account.`;
    } else {
      render(button.dataset.view);
    }
    const heading = screen.querySelector('h3');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus();
    }
  });
})();
