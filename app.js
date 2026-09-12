/**
 * ==============================================================================
 * TELEMEDICINE: GOVERNMENT RULES AND REGULATIONS
 * University SCI1125D Academic Editorial Engine
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initGateProgressTracker();
  initLicensingSimulator();
  initPrescribingEngine();
  initQuiltAndMazeEngine();
  initConvergenceAudit();
  initInfographicLightbox();
  initSmoothNavigation();
});

/* ==============================================================================
   00. REGULATORY GATES PROGRESS TRACKER & NAV HIGHLIGHTER
   ============================================================================== */
function initGateProgressTracker() {
  const gate1 = document.getElementById('gate-indicator-1');
  const gate2 = document.getElementById('gate-indicator-2');
  const gate3 = document.getElementById('gate-indicator-3');
  const navLinks = document.querySelectorAll('.academic-nav .nav-btn');

  const sections = [
    { id: 'home', gate: 0 },
    { id: 'licensing', gate: 1 },
    { id: 'prescribing', gate: 2 },
    { id: 'reimbursement', gate: 3 },
    { id: 'convergence', gate: 3 },
    { id: 'about', gate: 3 },
    { id: 'infographic', gate: 3 },
    { id: 'references', gate: 3 }
  ];

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 220;

    let currentSection = 'home';
    sections.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el && el.offsetTop <= scrollPos) {
        currentSection = sec.id;
      }
    });

    // Update active nav button
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });

    // Update Gate Tracker
    if (gate1 && gate2 && gate3) {
      gate1.classList.remove('active');
      gate2.classList.remove('active');
      gate3.classList.remove('active');

      if (currentSection === 'licensing') {
        gate1.classList.add('active');
      } else if (currentSection === 'prescribing') {
        gate1.classList.add('active');
        gate2.classList.add('active');
      } else if (currentSection === 'reimbursement' || currentSection === 'convergence') {
        gate1.classList.add('active');
        gate2.classList.add('active');
        gate3.classList.add('active');
      }
    }
  });
}

function initSmoothNavigation() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}


/* ==============================================================================
   ASPECT 1: LICENSING SIMULATOR (US MAP & BOUNDARY PAUSE)
   ============================================================================== */
function initLicensingSimulator() {
  const docSelect = document.getElementById('doctor-loc-select');
  const patSelect = document.getElementById('patient-loc-select');
  const sendBtn = document.getElementById('send-consultation-btn');

  const docMarker = document.getElementById('map-doc-marker');
  const patMarker = document.getElementById('map-pat-marker');
  const signalArc = document.getElementById('signal-flight-arc');
  const boundaryBarrier = document.getElementById('regulatory-boundary-barrier');

  const verdictCard = document.getElementById('licensing-verdict-display');
  const verdictIcon = document.getElementById('verdict-icon');
  const verdictTitle = document.getElementById('verdict-title');
  const verdictExpl = document.getElementById('verdict-explanation');

  if (!docSelect || !patSelect || !signalArc) return;

  // Geographic SVG pin coordinates for key US jurisdictions
  const stateData = {
    NY: { x: 765, y: 135, name: 'New York', compact: false },
    CA: { x: 135, y: 250, name: 'California', compact: false },
    WA: { x: 155, y: 95,  name: 'Washington', compact: true },
    AZ: { x: 215, y: 320, name: 'Arizona', compact: true },
    IL: { x: 535, y: 215, name: 'Illinois', compact: true },
    OH: { x: 620, y: 205, name: 'Ohio', compact: true },
    TX: { x: 415, y: 390, name: 'Texas', compact: false },
    FL: { x: 735, y: 440, name: 'Florida', compact: false, registry: true }
  };

  const imlcCompactList = ['WA', 'AZ', 'IL', 'OH'];

  function evaluateLicensingSimulation(isTriggeredByButton = false) {
    const docCode = docSelect.value;
    const patCode = patSelect.value;

    const docCoords = stateData[docCode] || stateData.NY;
    const patCoords = stateData[patCode] || stateData.CA;

    // 1. Move SVG Doctor & Patient Pins
    if (docMarker) {
      docMarker.setAttribute('transform', `translate(${docCoords.x}, ${docCoords.y})`);
      const docTag = docMarker.querySelector('.marker-tag');
      if (docTag) docTag.textContent = `DOCTOR: ${docCoords.name.toUpperCase()}`;
    }
    if (patMarker) {
      patMarker.setAttribute('transform', `translate(${patCoords.x}, ${patCoords.y})`);
      const patTag = patMarker.querySelector('.marker-tag');
      if (patTag) patTag.textContent = `PATIENT: ${patCoords.name.toUpperCase()}`;
    }

    // 2. Highlight SVG State Polygons
    document.querySelectorAll('.map-poly').forEach(poly => {
      poly.classList.remove('active-doctor-state', 'active-patient-state');
    });
    const docPoly = document.getElementById(`poly-${docCode}`);
    const patPoly = document.getElementById(`poly-${patCode}`);
    if (docPoly) docPoly.classList.add('active-doctor-state');
    if (patPoly) patPoly.classList.add('active-patient-state');

    // 3. Compute Curved Flight Signal
    const midX = (docCoords.x + patCoords.x) / 2;
    const midY = (docCoords.y + patCoords.y) / 2 - 45;
    const pathString = `M${docCoords.x},${docCoords.y} Q${midX},${midY} ${patCoords.x},${patCoords.y}`;
    signalArc.setAttribute('d', pathString);

    // Position Regulatory Barrier along midpoint
    if (boundaryBarrier) {
      boundaryBarrier.setAttribute('transform', `translate(${midX}, ${midY + 15})`);
    }

    // Reset verdict styling
    verdictCard.className = 'verdict-banner-academic';

    // SCENARIO A: Same Jurisdiction (In-State Practice)
    if (docCode === patCode) {
      verdictCard.classList.add('verdict-authorized');
      if (boundaryBarrier) boundaryBarrier.style.display = 'none';
      signalArc.style.stroke = 'var(--green-deep)';

      verdictIcon.textContent = '✅';
      verdictTitle.textContent = `Same State: Care Approved (${docCoords.name})`;
      verdictExpl.innerHTML = `
        Both the doctor and the patient are located in <strong>${docCoords.name}</strong>. 
        Because this visit takes place within a single state, Dr. Sterling’s license is valid and no out-of-state rules apply.
      `;
      updateConvergenceGate('licensing', true, `${docCode} In-State Approved`);
    }
    // SCENARIO B: Interstate Compact (IMLC) Pathway
    else if (imlcCompactList.includes(docCode) && imlcCompactList.includes(patCode)) {
      verdictCard.classList.add('verdict-compact-pathway');
      if (boundaryBarrier) {
        boundaryBarrier.style.display = 'block';
        const box = boundaryBarrier.querySelector('.boundary-box');
        const txt = boundaryBarrier.querySelector('.boundary-text');
        if (box) box.style.fill = 'var(--gold-amber)';
        if (txt) txt.textContent = 'IMLC COMPACT';
      }
      signalArc.style.stroke = 'var(--gold-amber)';

      verdictIcon.textContent = '⚡';
      verdictTitle.textContent = `Compact States: Expedited Licensing (${docCoords.name} ↔ ${patCoords.name})`;
      verdictExpl.innerHTML = `
        Both ${docCoords.name} and ${patCoords.name} belong to the <strong>Interstate Medical Licensure Compact (IMLC)</strong>. 
        This is not one national license, but it allows doctors in member states to get certified to practice in both states much faster.
      `;
      updateConvergenceGate('licensing', true, `IMLC (${docCode} ↔ ${patCode})`);
    }
    // SCENARIO C: Florida Telehealth Registry Model
    else if (patCode === 'FL') {
      verdictCard.classList.add('verdict-compact-pathway');
      if (boundaryBarrier) {
        boundaryBarrier.style.display = 'block';
        const txt = boundaryBarrier.querySelector('.boundary-text');
        if (txt) txt.textContent = 'FL REGISTRY';
      }
      signalArc.style.stroke = 'var(--gold-amber)';

      verdictIcon.textContent = '📋';
      verdictTitle.textContent = `Florida Out-of-State Registry (${docCoords.name} ➔ Florida)`;
      verdictExpl.innerHTML = `
        Florida allows out-of-state doctors to register with the state health department to provide telemedicine visits to Florida residents without needing a full local medical license.
      `;
      updateConvergenceGate('licensing', true, 'FL Registry Approved');
    }
    // SCENARIO D: Cross-Border Regulatory Barrier (e.g., NY to CA)
    else {
      verdictCard.classList.add('verdict-friction');
      if (boundaryBarrier) {
        boundaryBarrier.style.display = 'block';
        const box = boundaryBarrier.querySelector('.boundary-box');
        const txt = boundaryBarrier.querySelector('.boundary-text');
        if (box) box.style.fill = 'var(--coral-warning)';
        if (txt) txt.textContent = 'STATE LINE BARRIER';
      }
      signalArc.style.stroke = 'var(--coral-warning)';

      verdictIcon.textContent = '⚠️';
      verdictTitle.textContent = `State Line Barrier: ${docCoords.name} to ${patCoords.name}`;
      verdictExpl.innerHTML = `
        The patient is in <strong>${patCoords.name}</strong>, so the appointment legally takes place under ${patCoords.name} law. 
        Because Dr. Sterling only holds a license in ${docCoords.name}, they cannot treat this patient without obtaining a license from the ${patCoords.name} Medical Board.
      `;
      updateConvergenceGate('licensing', false, `State Barrier (${docCode} ✕ ${patCode})`);
    }
  }

  // Interactive Click on Map State Polygons
  document.querySelectorAll('.map-poly').forEach(poly => {
    poly.addEventListener('click', () => {
      const code = poly.getAttribute('data-code');
      patSelect.value = code;
      evaluateLicensingSimulation();
    });
  });

  // Dropdown Listeners
  docSelect.addEventListener('change', () => evaluateLicensingSimulation());
  patSelect.addEventListener('change', () => evaluateLicensingSimulation());

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      evaluateLicensingSimulation(true);
      sendBtn.textContent = '✓ Signal Evaluated';
      setTimeout(() => { sendBtn.textContent = '📡 Send Consultation Signal'; }, 1200);
    });
  }

  // Initial Run
  evaluateLicensingSimulation();
}


/* ==============================================================================
   ASPECT 2: PRESCRIBING ENGINE (STANDARD VS CONTROLLED SUBSTANCES)
   ============================================================================== */
function initPrescribingEngine() {
  const btnStandard = document.getElementById('btn-path-standard');
  const btnControlled = document.getElementById('btn-path-controlled');

  const padlockContainer = document.getElementById('rx-padlock-container');
  const padlockIcon = document.getElementById('rx-padlock-icon');
  const padlockHeadline = document.getElementById('padlock-headline');
  const padlockSub = document.getElementById('padlock-sub');

  const displayMedClass = document.getElementById('display-med-class');
  const displayStatuteStatus = document.getElementById('display-statute-status');
  const considerationNote = document.getElementById('rx-regulatory-consideration');
  const rxStamp = document.getElementById('rx-stamp');

  if (!btnStandard || !btnControlled || !padlockContainer) return;

  btnStandard.addEventListener('click', () => {
    btnStandard.classList.add('active');
    btnControlled.classList.remove('active');

    // Unlock visual
    padlockContainer.classList.remove('locked-state');
    padlockIcon.textContent = '🔓';
    padlockHeadline.textContent = 'STANDARD MEDICINE: ALLOWED ONLINE';
    padlockSub.textContent = 'Everyday medicines usually do not require an in-person physical exam.';

    displayMedClass.textContent = 'Standard Daily Medicine (Lisinopril / Amoxicillin)';
    displayStatuteStatus.textContent = 'No In-Person Exam Needed';
    displayStatuteStatus.className = 'field-val highlight-val';

    if (rxStamp) {
      rxStamp.textContent = 'PDMP CHECKED';
      rxStamp.style.color = 'var(--green-deep)';
      rxStamp.style.borderColor = 'var(--green-sage)';
      rxStamp.style.backgroundColor = 'var(--green-tint)';
    }

    if (considerationNote) {
      considerationNote.innerHTML = `
        <strong>Prescribing Rule:</strong> Everyday medications can generally be prescribed over a video call if the doctor has verified the patient's identity and medical history according to state rules.
      `;
    }

    updateConvergenceGate('prescribing', true, 'Standard Rx Allowed');
  });

  btnControlled.addEventListener('click', () => {
    btnControlled.classList.add('active');
    btnStandard.classList.remove('active');

    // Lock visual
    padlockContainer.classList.add('locked-state');
    padlockIcon.textContent = '🔒';
    padlockHeadline.textContent = 'CONTROLLED DRUGS: STRICT SAFETY RULES';
    padlockSub.textContent = 'Prescribing Schedule II–V controlled medicines involves federal checks and in-person safety rules.';

    displayMedClass.textContent = 'Controlled Medicine: Buprenorphine (Addiction Treatment)';
    displayStatuteStatus.textContent = 'Subject to Federal & State Safety Rules';
    displayStatuteStatus.className = 'field-val';
    displayStatuteStatus.style.color = 'var(--coral-warning)';

    if (rxStamp) {
      rxStamp.textContent = 'EXTRA SAFETY CHECK';
      rxStamp.style.color = 'var(--coral-warning)';
      rxStamp.style.borderColor = 'var(--coral-warning)';
      rxStamp.style.backgroundColor = 'var(--coral-tint)';
    }

    if (considerationNote) {
      considerationNote.innerHTML = `
        <strong>Prescribing Rule:</strong> Prescribing controlled substances like buprenorphine is an important public health issue. While temporary rules during COVID-19 allowed people to start treatment without an in-person exam, long-term rules must balance giving patients access with stopping prescription drug abuse (Salmanizadeh et al., 2022).
      `;
    }

    updateConvergenceGate('prescribing', false, 'Controlled Rx: Extra Checks');
  });
}


/* ==============================================================================
   ASPECT 3: PATCHWORK QUILT & REIMBURSEMENT MAZE JOURNEY
   ============================================================================== */
const quiltAcademicData = {
  medicare: {
    icon: '🏛️',
    title: 'Medicare Telehealth Payment',
    sub: 'Federal Senior Health Program',
    text: `Before COVID-19, Medicare only covered telehealth if the patient lived in a designated rural area and traveled to a medical facility for the call. Temporary rules allowed visits directly from home, and lawmakers are working to decide which rules become permanent.`
  },
  medicaid: {
    icon: '🏥',
    title: 'Medicaid: 50 State Programs',
    sub: 'State-Run Healthcare Assistance',
    text: `Because Medicaid is run separately by each state, payment rates vary widely. While almost all states cover live video doctor visits, some pay doctors the same as in-person visits while others pay lower rates.`
  },
  private: {
    icon: '🏢',
    title: 'Private Insurance & Parity Laws',
    sub: 'Commercial Health Insurance Plans',
    text: `Private insurance is regulated at the state level. Most states require insurers to cover virtual visits if they cover clinic visits ('coverage parity'), but fewer states force insurers to pay doctors the exact same rate ('payment parity').`
  },
  patient: {
    icon: '👤',
    title: 'The Patient’s Experience',
    sub: 'Copays and Medical Bills',
    text: `When insurance rules are confusing, patients are sometimes surprised by unexpected bills or out-of-network fees if their virtual doctor isn't fully covered by their plan.`
  },
  provider: {
    icon: '🩺',
    title: 'Doctors & Clinics',
    sub: 'Keeping Telehealth Programs Running',
    text: `Clinics need reliable reimbursement so they can afford secure video platforms, computers, and medical staff to run telehealth services.`
  }
};

function initQuiltAndMazeEngine() {
  // 1. Quilt Tile Interaction
  const tiles = document.querySelectorAll('.quilt-tile');
  const trayIcon = document.getElementById('tray-icon');
  const trayTitle = document.getElementById('tray-title');
  const traySub = document.getElementById('tray-sub');
  const trayText = document.getElementById('tray-text');

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      tiles.forEach(t => t.classList.remove('active-tile'));
      tile.classList.add('active-tile');

      const key = tile.getAttribute('data-tile');
      const data = quiltAcademicData[key] || quiltAcademicData.medicare;

      if (trayIcon) trayIcon.textContent = data.icon;
      if (trayTitle) trayTitle.textContent = data.title;
      if (traySub) traySub.textContent = data.sub;
      if (trayText) trayText.textContent = data.text;
    });
  });

  // 2. Reimbursement Journey Simulation
  const simulateBtn = document.getElementById('simulate-claim-btn');
  const payerSelect = document.getElementById('claim-payer-select');
  const modalitySelect = document.getElementById('claim-modality-select');

  const outcomeBox = document.getElementById('claim-outcome-box');
  const outcomeStamp = document.getElementById('outcome-stamp');
  const outcomeHeadline = document.getElementById('outcome-headline');
  const outcomeDesc = document.getElementById('outcome-desc');

  const flowSteps = [
    document.getElementById('step-visit'),
    document.getElementById('step-elig'),
    document.getElementById('step-policy'),
    document.getElementById('step-claim'),
    document.getElementById('step-outcome')
  ];

  if (!simulateBtn || !payerSelect) return;

  simulateBtn.addEventListener('click', () => {
    const payer = payerSelect.value;
    const modality = modalitySelect.value;

    // Animate flow steps
    flowSteps.forEach((s, idx) => {
      if (s) {
        setTimeout(() => {
          s.classList.add('completed');
        }, idx * 150);
      }
    });

    outcomeBox.className = 'claim-outcome-display';

    // SCENARIO 1: Private Payer with Parity + Video
    if (payer === 'private_parity' && modality === 'video') {
      outcomeBox.classList.add('outcome-approved');
      outcomeStamp.textContent = 'STATUS: FULL PAYMENT APPROVED';
      outcomeHeadline.textContent = 'Claim Paid at 100% (State Parity Law)';
      outcomeDesc.textContent = 'Under this state’s parity law, live video doctor appointments are reimbursed at the exact same rate as an in-person clinic visit.';
      updateConvergenceGate('reimbursement', true, 'Full Payment Approved');
    }
    // SCENARIO 2: Private Payer without Parity + Audio Only
    else if (payer === 'private_nonparity' && modality === 'audio_only') {
      outcomeBox.classList.add('outcome-denied');
      outcomeStamp.textContent = 'STATUS: CLAIM DENIED';
      outcomeHeadline.textContent = 'Claim Denied: Phone Calls Not Covered';
      outcomeDesc.textContent = 'Without a state parity law, this insurance plan only covers live video visits and does not pay for audio-only phone calls.';
      updateConvergenceGate('reimbursement', false, 'Denied (Phone Not Covered)');
    }
    // SCENARIO 3: Medicare + Audio Only
    else if (payer === 'medicare' && modality === 'audio_only') {
      outcomeBox.classList.add('outcome-review');
      outcomeStamp.textContent = 'STATUS: UNDER REVIEW';
      outcomeHeadline.textContent = 'Medicare Review: Special Case';
      outcomeDesc.textContent = 'Medicare allows phone visits for certain mental health consultations, but regular medical checkups usually require video.';
      updateConvergenceGate('reimbursement', false, 'Medicare Review');
    }
    // SCENARIO 4: General Approved Synchronous Consultation
    else {
      outcomeBox.classList.add('outcome-approved');
      outcomeStamp.textContent = 'STATUS: CLAIM APPROVED';
      outcomeHeadline.textContent = 'Standard Video Visit Covered';
      outcomeDesc.textContent = 'The video consultation meets coverage criteria and the claim is paid by insurance.';
      updateConvergenceGate('reimbursement', true, 'Claim Approved');
    }
  });
}


/* ==============================================================================
   04. CONVERGENCE CONSOLE ENGINE
   ============================================================================== */
const convergenceState = {
  licensing: false,
  licensingText: 'State Barrier (NY ✕ CA)',
  prescribing: true,
  prescribingText: 'Standard Rx Allowed',
  reimbursement: true,
  reimbursementText: 'Claim Approved'
};

function updateConvergenceGate(gateName, isPass, labelText) {
  if (convergenceState[gateName] !== undefined) {
    convergenceState[gateName] = isPass;
    convergenceState[`${gateName}Text`] = labelText;
  }
  renderConvergenceUI();
}

function renderConvergenceUI() {
  const licEl = document.getElementById('conv-status-lic');
  const rxEl = document.getElementById('conv-status-rx');
  const reimbEl = document.getElementById('conv-status-reimb');
  const overallBadge = document.getElementById('overall-compliance-badge');

  if (licEl) {
    licEl.className = `gate-status-pill ${convergenceState.licensing ? 'status-pass' : 'status-denied'}`;
    licEl.innerHTML = `<span class="status-icon">${convergenceState.licensing ? '✓' : '⚠️'}</span> ${convergenceState.licensingText}`;
  }

  if (rxEl) {
    licEl && (rxEl.className = `gate-status-pill ${convergenceState.prescribing ? 'status-pass' : 'status-conditional'}`);
    rxEl.innerHTML = `<span class="status-icon">${convergenceState.prescribing ? '✓' : '🔒'}</span> ${convergenceState.prescribingText}`;
  }

  if (reimbEl) {
    reimbEl.className = `gate-status-pill ${convergenceState.reimbursement ? 'status-pass' : 'status-denied'}`;
    reimbEl.innerHTML = `<span class="status-icon">${convergenceState.reimbursement ? '✓' : '✕'}</span> ${convergenceState.reimbursementText}`;
  }

  if (overallBadge) {
    const allPassed = convergenceState.licensing && convergenceState.prescribing && convergenceState.reimbursement;
    if (allPassed) {
      overallBadge.textContent = 'ALL 3 RULES MET';
      overallBadge.style.backgroundColor = 'var(--green-deep)';
    } else {
      overallBadge.textContent = 'CONDITIONAL APPROVAL';
      overallBadge.style.backgroundColor = 'var(--teal-primary)';
    }
  }
}

function initConvergenceAudit() {
  renderConvergenceUI();
}


/* ==============================================================================
   05. HIGH RESOLUTION INFOGRAPHIC LIGHTBOX MODAL
   ============================================================================== */
function initInfographicLightbox() {
  const openBtn = document.getElementById('open-lightbox-btn');
  const modal = document.getElementById('infographic-lightbox');
  const closeBtn = document.getElementById('close-lightbox-btn');

  if (!openBtn || !modal) return;

  function showModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', showModal);
  if (closeBtn) closeBtn.addEventListener('click', hideModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      hideModal();
    }
  });
}
