(() => {
  const open = document.querySelector('#open-linking-demo');
  const dialog = document.querySelector('#linking-demo');
  const devices = Object.fromEntries([...dialog.querySelectorAll('[data-device]')].map(phone => [
    phone.dataset.device,
    { phone, screen: phone.querySelector('.linking-screen'), touch: phone.querySelector('.linking-touch') },
  ]));
  const status = dialog.querySelector('.linking-status');
  const play = dialog.querySelector('[data-play]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const patient = { name: 'Sujata Sahoo', age: 62, id: 'CN-482731' };
  const caregiver = { name: 'Ananya Sahoo', age: 31 };
  const portrait = '<img src="assets/images/linking-demo-patient.png" alt="CareNest illustration of Sujata">';
  const profile = `<div class="linking-profile"><div><strong>${patient.name}</strong>
    <p>Age: ${patient.age} · Patient account</p><p>Patient ID: ${patient.id}</p></div>${portrait}</div>`;
  const action = (label, next) => `<button type="button" data-next="${next}">${label}</button>`;
  const scenes = {
    patient: {
      caption: 'The patient sees their shareable ID.',
      html: `<h3>Patient Dashboard</h3><div class="linking-card"><h4>Hello, Sujata!</h4>${profile}
        <p>Share your Patient ID with your caregiver so they can request a connection.</p></div>`,
    },
    caregiver: {
      caption: 'The caregiver opens the linking screen.',
      html: `<h3>Caregiver Dashboard</h3><p>${caregiver.name} · Age: ${caregiver.age}</p>
        <div class="linking-card"><h4>Patient context</h4><p>No patient linked yet.</p>
        ${action('Link a patient', 'entry')}</div>`,
    },
    entry: {
      caption: 'The caregiver enters the shared Patient ID.',
      html: `<h3>Connect with a patient</h3>
        <p>The patient must approve your request before you can see their profile.</p>
        <form><label for="demo-patient-id">Patient ID</label>
        <input id="demo-patient-id" type="text" autocomplete="off" placeholder="e.g. ${patient.id}" required>
        <p class="linking-error" aria-live="polite" hidden></p>
        <button type="submit">Send connection request</button></form>`,
    },
    pending: {
      caption: 'The request is pending until the patient decides.',
      html: `<h3>Connection request sent!</h3><div class="linking-card">
        <p>Waiting for the patient to approve your request.</p></div>`,
    },
    notification: {
      caption: 'The patient receives an in-app notification.',
      html: `<h3>Patient Dashboard</h3><div class="linking-card">
        <span class="linking-badge">New notification</span><h4>Caregiver link request</h4>
        <p>${caregiver.name}, age ${caregiver.age}, is asking for permission to link with you.</p>
        ${action('View request', 'approval')}</div>`,
    },
    approval: {
      caption: 'The patient reviews the request and chooses whether to allow it.',
      html: `<h3>Caregiver link request</h3><div class="linking-card">
        <p>${caregiver.name}, age ${caregiver.age}, is asking for permission to link with you.</p>
        <p>Allowing this request shares your patient profile with this caregiver.</p>
        ${action('Allow caregiver', 'approved')}
        <button type="button" class="linking-secondary" data-next="declined">Decline</button></div>`,
    },
    approved: {
      caption: 'The patient has approved the connection.',
      html: `<h3>Connection approved</h3><div class="linking-card"><p>${caregiver.name} can now view your patient profile.</p></div>`,
    },
    patientDeclined: {
      html: '<h3>Patient Dashboard</h3><div class="linking-card"><p>You declined the caregiver’s request.</p></div>',
    },
    declined: {
      caption: 'The caregiver’s request was declined.',
      html: `<h3>Caregiver Dashboard</h3><div class="linking-card"><h4>Patient context</h4>
        <p>Your connection request was declined.</p>${action('Try again', 'entry')}</div>`,
    },
    connected: {
      caption: 'The linked patient now appears on the caregiver dashboard.',
      html: `<h3>Caregiver Dashboard</h3><p>${caregiver.name} · Age: ${caregiver.age}</p>
        <div class="linking-card"><h4>Patient context</h4><span class="linking-badge">Connected</span>
        ${profile}</div>`,
    },
  };

  let activeDevice;
  let playing = false;
  let timer;
  const later = (callback, delay) => { timer = setTimeout(callback, delay); };

  function stop() {
    clearTimeout(timer);
    playing = false;
    for (const { touch } of Object.values(devices)) touch.style.opacity = '0';
    play.textContent = 'Play';
  }

  function pointAt(target, { phone, touch }) {
    target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const bounds = target.getBoundingClientRect();
    const frame = phone.getBoundingClientRect();
    touch.style.left = `${(bounds.left + bounds.width / 2 - frame.left) / frame.width * 100}%`;
    touch.style.top = `${(bounds.top + bounds.height / 2 - frame.top) / frame.height * 100}%`;
    touch.style.opacity = '1';
  }

  function cue() {
    const device = devices[activeDevice];
    const { screen } = device;
    const input = screen.querySelector('input');
    const button = screen.querySelector('button');
    if (!button) return;

    function tap() {
      pointAt(button, device);
      later(() => button.click(), 420);
    }

    if (!input) {
      later(tap, 1900);
      return;
    }

    function typeId() {
      if (input.value.length === patient.id.length) {
        later(tap, 550);
        return;
      }
      input.value += patient.id[input.value.length];
      later(typeId, 95);
    }
    later(() => {
      pointAt(input, device);
      input.value = '';
      later(typeId, 420);
    }, 1400);
  }

  function render(role, next) {
    const device = devices[role];
    device.scene = next;
    device.touch.style.opacity = '0';
    device.screen.innerHTML = scenes[next].html;
  }

  function follow(role, caption) {
    clearTimeout(timer);
    activeDevice = role;
    status.textContent = caption;
    if (playing) cue();
  }

  function replay() {
    stop();
    playing = !reducedMotion.matches;
    play.textContent = playing ? 'Pause' : 'Play';
    play.disabled = false;
    render('patient', 'patient');
    render('caregiver', 'caregiver');
    dialog.scrollTop = 0;
    follow('caregiver', scenes.patient.caption);
  }

  open.addEventListener('click', () => {
    dialog.showModal();
    replay();
  });
  dialog.addEventListener('close', stop);
  dialog.querySelector('[data-replay]').addEventListener('click', replay);
  play.addEventListener('click', () => {
    if (playing) stop();
    else {
      playing = true;
      play.textContent = 'Pause';
      cue();
    }
  });
  for (const [role, { screen }] of Object.entries(devices)) {
    screen.addEventListener('click', event => {
      const button = event.target.closest('[data-next]');
      if (!button) return;
      if (event.isTrusted) stop();
      const next = button.dataset.next;
      if (next === 'approved' || next === 'declined') {
        render('patient', next === 'approved' ? 'approved' : 'patientDeclined');
        const result = next === 'approved' ? 'connected' : 'declined';
        render('caregiver', result);
        follow('caregiver', scenes[result].caption);
        if (result === 'connected') {
          stop();
          play.disabled = true;
        }
        devices.caregiver.phone.scrollIntoView({ block: 'nearest' });
        return;
      }
      render(role, next);
      follow(role, scenes[next].caption);
      if (event.isTrusted) screen.querySelector('input, button')?.focus({ preventScroll: true });
    });
  }

  const caregiverScreen = devices.caregiver.screen;
  caregiverScreen.addEventListener('focusin', event => {
    if (event.target.matches('input')) stop();
  });
  caregiverScreen.addEventListener('submit', event => {
    event.preventDefault();
    if (devices.caregiver.scene !== 'entry') return;
    const input = caregiverScreen.querySelector('input');
    if (input.value.trim().toUpperCase() === patient.id) {
      render('caregiver', 'pending');
      render('patient', 'notification');
      follow('patient', scenes.notification.caption);
      if (!playing) devices.patient.screen.querySelector('button')?.focus();
      return;
    }
    stop();
    const error = caregiverScreen.querySelector('.linking-error');
    error.hidden = false;
    error.textContent = 'Patient ID not found. Please check the ID and try again.';
    input.focus();
  });
})();
