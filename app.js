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
      verdictTitle.textContent = `Jurisdiction Match: Authorized In-State Practice (${docCoords.name})`;
      verdictExpl.innerHTML = `
        Both physician and patient are physically located in <strong>${docCoords.name}</strong>. 
        Because the encounter occurs within a single jurisdiction, Dr. Sterling’s license fulfills standard medical board requirements without triggering interstate boundary complications.
      `;
      updateConvergenceGate('licensing', true, `${docCode} In-State Authorized`);
    }
    // SCENARIO B: Interstate Compact (IMLC) Pathway
    else if (imlcCompactList.includes(docCode) && imlcCompactList.includes(patCode)) {
      verdictCard.classList.add('verdict-compact-pathway');
      if (boundaryBarrier) {
        boundaryBarrier.style.display = 'block';
        const box = boundaryBarrier.querySelector('.boundary-box');
        const txt = boundaryBarrier.querySelector('.boundary-text');
        if (box) box.style.fill = 'var(--gold-amber)';
        if (txt) txt.textContent = 'IMLC COMPACT PATHWAY';
      }
      signalArc.style.stroke = 'var(--gold-amber)';

      verdictIcon.textContent = '⚡';
      verdictTitle.textContent = `Expedited Interstate Reciprocity: IMLC Member States (${docCoords.name} ↔ ${patCoords.name})`;
      verdictExpl.innerHTML = `
        Both ${docCoords.name} and ${patCoords.name} participate in the <strong>Interstate Medical Licensure Compact (IMLC)</strong>. 
        While this does not constitute a single national license, it provides an expedited administrative process for qualified physicians to obtain dual licensure across member jurisdictions.
      `;
      updateConvergenceGate('licensing', true, `IMLC (${docCode} ↔ ${patCode})`);
    }
    // SCENARIO C: Florida Telehealth Registry Model
    else if (patCode === 'FL') {
      verdictCard.classList.add('verdict-compact-pathway');
      if (boundaryBarrier) {
        boundaryBarrier.style.display = 'block';
        const txt = boundaryBarrier.querySelector('.boundary-text');
        if (txt) txt.textContent = 'FL TELEHEALTH REGISTRY';
      }
      signalArc.style.stroke = 'var(--gold-amber)';

      verdictIcon.textContent = '📋';
      verdictTitle.textContent = `Out-of-State Telehealth Registry Pathway (${docCoords.name} ➔ Florida)`;
      verdictExpl.innerHTML = `
        Under Florida Section 456.47, out-of-state healthcare practitioners can register with the Florida Department of Health to provide telemedicine to Florida residents without holding a full Florida license, provided they meet statutory criteria and do not open a physical office.
      `;
      updateConvergenceGate('licensing', true, 'FL Registry Authorized');
    }
    // SCENARIO D: Cross-Border Regulatory Barrier (e.g., NY to CA)
    else {
      verdictCard.classList.add('verdict-friction');
      if (boundaryBarrier) {
        boundaryBarrier.style.display = 'block';
        const box = boundaryBarrier.querySelector('.boundary-box');
        const txt = boundaryBarrier.querySelector('.boundary-text');
        if (box) box.style.fill = 'var(--coral-warning)';
        if (txt) txt.textContent = 'REGULATORY BOUNDARY';
      }
      signalArc.style.stroke = 'var(--coral-warning)';

      verdictIcon.textContent = '⚠️';
      verdictTitle.textContent = `Jurisdiction Boundary Friction: ${docCoords.name} to ${patCoords.name}`;
      verdictExpl.innerHTML = `
        Telemedicine can create licensing challenges because requirements differ between jurisdictions. 
        Because the patient is physically located in <strong>${patCoords.name}</strong>, local health regulations stipulate that the clinical encounter occurs within ${patCoords.name}. 
        Without active licensure from the ${patCoords.name} Medical Board, practicing across this state line is restricted under current jurisdictional frameworks.
      `;
      updateConvergenceGate('licensing', false, `Boundary (${docCode} ✕ ${patCode})`);
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
    padlockHeadline.textContent = 'STANDARD MEDICATION: AUTHORIZED';
    padlockSub.textContent = 'Non-scheduled pharmacotherapy does not trigger federal in-person examination mandates.';

    displayMedClass.textContent = 'Standard Maintenance Therapy (Lisinopril / Amoxicillin)';
    displayStatuteStatus.textContent = 'Exempt from In-Person Exam Mandate';
    displayStatuteStatus.className = 'field-val highlight-val';

    if (rxStamp) {
      rxStamp.textContent = 'PDMP VERIFIED';
      rxStamp.style.color = 'var(--green-deep)';
      rxStamp.style.borderColor = 'var(--green-sage)';
      rxStamp.style.backgroundColor = 'var(--green-tint)';
    }

    if (considerationNote) {
      considerationNote.innerHTML = `
        <strong>Regulatory Consideration:</strong> Non-controlled medications can generally be electronically prescribed via telemedicine where a valid patient-provider relationship is established in compliance with relevant state practice standards.
      `;
    }

    updateConvergenceGate('prescribing', true, 'Standard Rx Approved');
  });

  btnControlled.addEventListener('click', () => {
    btnControlled.classList.add('active');
    btnStandard.classList.remove('active');

    // Lock visual
    padlockContainer.classList.add('locked-state');
    padlockIcon.textContent = '🔒';
    padlockHeadline.textContent = 'CONTROLLED SUBSTANCE: SPECIAL STATUTORY SAFEGUARDS';
    padlockSub.textContent = 'Prescribing Schedule II–V controlled substances triggers heightened safety and in-person evaluation rules.';

    displayMedClass.textContent = 'Schedule III: Buprenorphine (Opioid Use Disorder)';
    displayStatuteStatus.textContent = 'Subject to Federal In-Person Mandates & PDMP Rules';
    displayStatuteStatus.className = 'field-val';
    displayStatuteStatus.style.color = 'var(--coral-warning)';

    if (rxStamp) {
      rxStamp.textContent = 'DEA SAFEGUARD';
      rxStamp.style.color = 'var(--coral-warning)';
      rxStamp.style.borderColor = 'var(--coral-warning)';
      rxStamp.style.backgroundColor = 'var(--coral-tint)';
    }

    if (considerationNote) {
      considerationNote.innerHTML = `
        <strong>Regulatory Consideration:</strong> Prescribing controlled substances such as buprenorphine raises critical public health considerations. While pandemic flexibilities relaxed in-person requirements to prevent overdose deaths, long-term regulatory frameworks require balancing access for rural populations against diversion and safety oversight (Salmanizadeh et al., 2022).
      `;
    }

    updateConvergenceGate('prescribing', false, 'Controlled Rx: Safeguards Active');
  });
}


/* ==============================================================================
   ASPECT 3: PATCHWORK QUILT & REIMBURSEMENT MAZE JOURNEY
   ============================================================================== */
const quiltAcademicData = {
  medicare: {
    icon: '🏛️',
    title: 'Medicare (Title XVIII) Telehealth Reimbursement',
    sub: 'Federal Public Health Financing Framework',
    text: `Historically, Section 1861(m) of the Social Security Act only reimbursed telemedicine if the patient traveled to an authorized rural clinical "originating site." While temporary emergency waivers permitted direct-to-home visits during COVID-19, long-term congressional statutory action is required to establish permanent payment parity and rural waiver extensions.`
  },
  medicaid: {
    icon: '🏥',
    title: 'Medicaid: 50 Fragmented State Programs',
    sub: 'State-Federal Healthcare Financing',
    text: `Medicaid is administered on a state-by-state basis. While nearly all state Medicaid programs cover some form of live video consultation, reimbursement rates vary widely from full parity with in-person evaluations down to reduced percentages, creating inconsistent access for low-income beneficiaries across borders.`
  },
  private: {
    icon: '🏢',
    title: 'Private Insurers & Parity Legislation',
    sub: 'Commercial Employer & Marketplace Plans',
    text: `Commercial health insurance is governed by state-level parity legislation. Approximately 43 states have enacted "coverage parity" (requiring plans to cover virtual care if in-person care is covered), yet fewer than half enforce "payment parity" (mandating identical dollar-for-dollar compensation for clinicians).`
  },
  patient: {
    icon: '👤',
    title: 'Patient Beneficiary Experience & Financial Burden',
    sub: 'Out-of-Pocket Cost Sharing & Deductibles',
    text: `When payer policies are fragmented, patients often face unexpected coverage denials, ambiguous copayments, or balance billing if a remote provider is categorized as an out-of-network telehealth vendor rather than a covered primary care practitioner.`
  },
  provider: {
    icon: '🩺',
    title: 'Healthcare Provider & Institutional Sustainability',
    sub: 'Clinical Workflow, Billing Codes & Parity',
    text: `For hospitals and independent practices, sustaining telemedicine requires equitable reimbursement. Studies demonstrate that where reimbursement parity is protected, healthcare systems achieve stable virtual care integration without inflating overall utilization costs.`
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
      outcomeStamp.textContent = 'STATUS: CLAIM APPROVED (PARITY)';
      outcomeHeadline.textContent = 'Reimbursement Approved Under State Telehealth Parity';
      outcomeDesc.textContent = 'Under applicable state telehealth parity laws, synchronous two-way video consultations are reimbursed at 100% equivalent of an in-person physician fee schedule.';
      updateConvergenceGate('reimbursement', true, 'Approved (Parity)');
    }
    // SCENARIO 2: Private Payer without Parity + Audio Only
    else if (payer === 'private_nonparity' && modality === 'audio_only') {
      outcomeBox.classList.add('outcome-denied');
      outcomeStamp.textContent = 'STATUS: CLAIM DENIED';
      outcomeHeadline.textContent = 'Coverage Denied: Audio-Only Modal Non-Covered';
      outcomeDesc.textContent = 'Without statutory coverage parity mandates, commercial contracts frequently exclude telephone audio-only consultations from covered distant-site telehealth benefits.';
      updateConvergenceGate('reimbursement', false, 'Denied (No Parity)');
    }
    // SCENARIO 3: Medicare + Audio Only
    else if (payer === 'medicare' && modality === 'audio_only') {
      outcomeBox.classList.add('outcome-review');
      outcomeStamp.textContent = 'STATUS: CONDITIONAL / REVIEW';
      outcomeHeadline.textContent = 'Medicare Section 1861(m) Exception Audit';
      outcomeDesc.textContent = 'Medicare permits telephone audio-only reimbursement for selected mental and behavioral healthcare, but physical somatic encounters from home require live video interaction under standard guidelines.';
      updateConvergenceGate('reimbursement', false, 'Conditional Medicare Review');
    }
    // SCENARIO 4: General Approved Synchronous Consultation
    else {
      outcomeBox.classList.add('outcome-approved');
      outcomeStamp.textContent = 'STATUS: CLAIM APPROVED';
      outcomeHeadline.textContent = 'Distant Site Telemedicine Encounter Approved';
      outcomeDesc.textContent = 'The digital healthcare claim satisfies standard originating site requirements, electronic documentation standards, and valid billing modifier codes.';
      updateConvergenceGate('reimbursement', true, 'Claim Approved');
    }
  });
}


/* ==============================================================================
   04. CONVERGENCE CONSOLE ENGINE
   ============================================================================== */
const convergenceState = {
  licensing: false,
  licensingText: 'Boundary (NY ✕ CA)',
  prescribing: true,
  prescribingText: 'Standard Rx Approved',
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
    licEl.className = `gate-status-pill ${convergenceState.licensing ? 'status-pass' : 'status-conditional'}`;
    licEl.innerHTML = `<span class="status-icon">${convergenceState.licensing ? '✓' : '⚠️'}</span> ${convergenceState.licensingText}`;
  }

  if (rxEl) {
    rxEl.className = `gate-status-pill ${convergenceState.prescribing ? 'status-pass' : 'status-conditional'}`;
    rxEl.innerHTML = `<span class="status-icon">${convergenceState.prescribing ? '✓' : '🔒'}</span> ${convergenceState.prescribingText}`;
  }

  if (reimbEl) {
    reimbEl.className = `gate-status-pill ${convergenceState.reimbursement ? 'status-pass' : 'status-conditional'}`;
    reimbEl.innerHTML = `<span class="status-icon">${convergenceState.reimbursement ? '✓' : '✕'}</span> ${convergenceState.reimbursementText}`;
  }

  if (overallBadge) {
    const allPassed = convergenceState.licensing && convergenceState.prescribing && convergenceState.reimbursement;
    if (allPassed) {
      overallBadge.textContent = 'FULL REGULATORY COMPLIANCE';
      overallBadge.style.backgroundColor = 'var(--green-deep)';
    } else {
      overallBadge.textContent = 'CONDITIONAL COMPLIANCE';
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
  }

  function hideModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
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
