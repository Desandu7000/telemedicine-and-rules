/**
 * ==============================================================================
 * TELEMEDICINE: THE RULES BEHIND THE SCREEN
 * Living Medical Editorial Infographic & Storybook Engine
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initRoomZoom();
  initLicensingMapSimulator();
  initPrescribingEngine();
  initPatchworkQuiltEngine();
  initMazeCalculatorEngine();
  initConvergenceEngine();
  initModalLightbox();
  initSmoothNav();
});

/* ==============================================================================
   00. ROOM LIVE CLOCK & SMOOTH CAMERA ZOOM
   ============================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('screen-live-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    clockEl.textContent = `${timeStr} EST`;
  }
  updateClock();
  setInterval(updateClock, 1000);
}

function initRoomZoom() {
  const zoomBtn = document.getElementById('zoom-into-screen-btn');
  const laptopStage = document.getElementById('laptop-stage');
  const licensingChapter = document.getElementById('licensing');

  if (!zoomBtn || !laptopStage || !licensingChapter) return;

  zoomBtn.addEventListener('click', () => {
    // Apply camera zoom transform to laptop
    laptopStage.classList.add('zoomed-in');
    
    // Smoothly glide into Chapter 01
    setTimeout(() => {
      licensingChapter.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        laptopStage.classList.remove('zoomed-in');
      }, 1000);
    }, 450);
  });
}

function initSmoothNav() {
  const navLinks = document.querySelectorAll('.editorial-nav .nav-item');
  const topBtn = document.getElementById('footer-top-btn');

  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Highlight active nav item on scroll
  window.addEventListener('scroll', () => {
    const chapters = document.querySelectorAll('.story-chapter');
    let currentId = '';
    
    chapters.forEach(chapter => {
      const rect = chapter.getBoundingClientRect();
      if (rect.top <= 200 && rect.bottom >= 200) {
        currentId = chapter.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}


/* ==============================================================================
   01. CHAPTER 01: US MAP & CROSS-BORDER REGULATORY ROADBLOCK
   ============================================================================== */
function initLicensingMapSimulator() {
  // Selectors & UI Elements
  const docSelect = document.getElementById('doctor-state-select');
  const patSelect = document.getElementById('patient-state-select');
  const testBtn = document.getElementById('test-route-btn');
  const statusPill = document.getElementById('map-status-pill');
  
  const docPin = document.getElementById('doctor-pin-group');
  const patPin = document.getElementById('patient-pin-group');
  const routePath = document.getElementById('interstate-route-path');
  const travellingPulse = document.getElementById('route-travelling-pulse');
  const wallGroup = document.getElementById('regulatory-wall-group');

  const verdictCard = document.getElementById('licensing-verdict-card');
  const verdictIcon = document.getElementById('verdict-icon');
  const verdictHeadline = document.getElementById('verdict-headline');
  const verdictNarrative = document.getElementById('verdict-narrative');

  if (!docSelect || !patSelect || !routePath) return;

  // Geographic SVG Coordinates for Key States
  const stateCoordinates = {
    NY: { x: 765, y: 135, name: 'New York', compact: false },
    CA: { x: 135, y: 250, name: 'California', compact: false },
    WA: { x: 155, y: 95,  name: 'Washington', compact: true },
    AZ: { x: 215, y: 320, name: 'Arizona', compact: true },
    TX: { x: 415, y: 390, name: 'Texas', compact: false, independent: true },
    IL: { x: 535, y: 215, name: 'Illinois', compact: true },
    OH: { x: 620, y: 205, name: 'Ohio', compact: true },
    FL: { x: 735, y: 440, name: 'Florida', compact: false, registry: true }
  };

  // IMLC Compact State List
  const imlcCompactStates = ['WA', 'AZ', 'IL', 'OH'];

  function updateMapAndEvaluate() {
    const docCode = docSelect.value;
    const patCode = patSelect.value;

    const docCoords = stateCoordinates[docCode] || stateCoordinates.NY;
    const patCoords = stateCoordinates[patCode] || stateCoordinates.CA;

    statusPill.textContent = `ROUTE: ${docCode} ➔ ${patCode}`;

    // 1. Move the Doctor and Patient SVG Pins
    if (docPin) {
      docPin.setAttribute('transform', `translate(${docCoords.x}, ${docCoords.y})`);
      const docTitle = docPin.querySelector('.pin-title');
      if (docTitle) docTitle.textContent = `DR. ALEX (${docCode})`;
    }
    if (patPin) {
      patPin.setAttribute('transform', `translate(${patCoords.x}, ${patCoords.y})`);
      const patTitle = patPin.querySelector('.pin-title');
      if (patTitle) patTitle.textContent = `PATIENT (${patCode})`;
    }

    // 2. Highlight Map States
    document.querySelectorAll('.map-state').forEach(el => {
      el.classList.remove('active-origin', 'active-target');
    });
    const docStatePath = document.getElementById(`state-path-${docCode}`);
    const patStatePath = document.getElementById(`state-path-${patCode}`);
    if (docStatePath) docStatePath.classList.add('active-origin');
    if (patStatePath) patStatePath.classList.add('active-target');

    // 3. Compute the Curved Route Flight Path
    const midX = (docCoords.x + patCoords.x) / 2;
    const midY = (docCoords.y + patCoords.y) / 2 - 50; // Arch upward
    const pathD = `M${docCoords.x},${docCoords.y} Q${midX},${midY} ${patCoords.x},${patCoords.y}`;
    routePath.setAttribute('d', pathD);

    // Position the Wall at the apex
    if (wallGroup) {
      wallGroup.setAttribute('transform', `translate(${midX}, ${midY + 15})`);
    }

    // Animate travelling pulse
    if (travellingPulse) {
      travellingPulse.setAttribute('cx', docCoords.x);
      travellingPulse.setAttribute('cy', docCoords.y);
      setTimeout(() => {
        travellingPulse.setAttribute('cx', midX);
        travellingPulse.setAttribute('cy', midY);
      }, 250);
    }

    // 4. Evaluate Regulatory Status
    verdictCard.className = 'verdict-banner';
    routePath.className.baseVal = 'route-flight-path';

    // CASE A: Same State Practice
    if (docCode === patCode) {
      verdictCard.classList.add('verdict-allowed');
      routePath.classList.add('route-allowed');
      if (wallGroup) wallGroup.style.display = 'none';

      verdictIcon.textContent = '✅';
      verdictHeadline.textContent = `AUTHORIZED: Direct In-State Telehealth (${docCode})`;
      verdictNarrative.innerHTML = `
        Both physician and patient are physically situated within <strong>${docCoords.name}</strong>. 
        Because medical licensure jurisdiction is fully concurrent, Dr. Alex Sterling holds complete authority to examine and diagnose the patient without triggering cross-border regulatory barriers.
      `;
      updateFinaleLicensing(true, `${docCode} In-State Authorized`);
    }
    // CASE B: Interstate Medical Licensure Compact (IMLC)
    else if (imlcCompactStates.includes(docCode) && imlcCompactStates.includes(patCode)) {
      verdictCard.classList.add('verdict-compact');
      routePath.classList.add('route-compact');
      if (wallGroup) {
        wallGroup.style.display = 'block';
        const wallText = wallGroup.querySelector('.wall-alert-text');
        const wallBox = wallGroup.querySelector('.wall-box');
        if (wallText) wallText.textContent = 'IMLC GATE';
        if (wallBox) wallBox.style.fill = '#D4A359';
      }

      verdictIcon.textContent = '⚡';
      verdictHeadline.textContent = `IMLC EXPEDITED RECIPROCITY (${docCode} ↔ ${patCode})`;
      verdictNarrative.innerHTML = `
        Both ${docCoords.name} and ${patCoords.name} are active members of the <strong>Interstate Medical Licensure Compact (IMLC)</strong>. 
        While Dr. Alex cannot practice automatically without paperwork, he can obtain an expedited multi-state license through his State of Principal License (SPL). Full compliance requires paying separate annual renewal fees to both boards.
      `;
      updateFinaleLicensing(true, `IMLC Expedited (${docCode} ↔ ${patCode})`);
    }
    // CASE C: Florida Out-of-State Telehealth Registry
    else if (patCode === 'FL') {
      verdictCard.classList.add('verdict-compact');
      routePath.classList.add('route-compact');
      if (wallGroup) {
        wallGroup.style.display = 'block';
        const wallText = wallGroup.querySelector('.wall-alert-text');
        if (wallText) wallText.textContent = 'FL REGISTRY';
      }

      verdictIcon.textContent = '📋';
      verdictHeadline.textContent = `FLORIDA TELEHEALTH REGISTRY PATHWAY (${docCode} ➔ FL)`;
      verdictNarrative.innerHTML = `
        Florida law allows out-of-state healthcare providers to treat Florida residents without a full Florida medical license, <em>provided</em> the physician registers under Florida Section 456.47 and does not open a physical clinic in the state.
      `;
      updateFinaleLicensing(true, 'FL Registry Authorized');
    }
    // CASE D: Cross-Border Blockade (e.g., NY to CA)
    else {
      verdictCard.classList.add('verdict-blocked');
      routePath.classList.add('route-blocked');
      if (wallGroup) {
        wallGroup.style.display = 'block';
        const wallText = wallGroup.querySelector('.wall-alert-text');
        const wallBox = wallGroup.querySelector('.wall-box');
        if (wallText) wallText.textContent = 'BLOCKED';
        if (wallBox) wallBox.style.fill = '#C96B68';
      }

      verdictIcon.textContent = '🚫';
      verdictHeadline.textContent = `CRITICAL ROADBLOCK: Unlicensed Cross-Border Practice (${docCode} ➔ ${patCode})`;
      verdictNarrative.innerHTML = `
        Dr. Alex holds an active license in <strong>${docCoords.name}</strong>. However, because the patient is physically situated in <strong>${patCoords.name}</strong>, state police power dictates that the clinical encounter legally takes place in ${patCoords.name}. 
        Without an independent ${patCoords.name} Medical Board license, treating this patient is classified as unauthorized practice of medicine.
      `;
      updateFinaleLicensing(false, `Blocked (${docCode} ✕ ${patCode})`);
    }
  }

  // Interactive Click directly on SVG Map States
  document.querySelectorAll('.map-state').forEach(stateEl => {
    stateEl.addEventListener('click', () => {
      const clickedState = stateEl.getAttribute('data-state');
      // Alternate setting patient state
      patSelect.value = clickedState;
      updateMapAndEvaluate();
    });
  });

  // Event Listeners for Dropdowns & Button
  docSelect.addEventListener('change', updateMapAndEvaluate);
  patSelect.addEventListener('change', updateMapAndEvaluate);
  testBtn.addEventListener('click', () => {
    updateMapAndEvaluate();
    testBtn.textContent = '⚡ Transmitted!';
    setTimeout(() => { testBtn.textContent = '⚡ Transmit Consultation Signal'; }, 1200);
  });

  // Initial Evaluation
  updateMapAndEvaluate();
}


/* ==============================================================================
   02. CHAPTER 02: THE SCREEN ISN'T THE EXAM & PADLOCK ENGINE
   ============================================================================== */
function initPrescribingEngine() {
  const btnControlled = document.getElementById('btn-choice-controlled');
  const btnStandard = document.getElementById('btn-choice-standard');
  const padlockAssembly = document.getElementById('padlock-assembly');
  const padlockText = document.getElementById('padlock-text');
  const padlockSeal = document.getElementById('padlock-seal');
  const medDisplayIcon = document.getElementById('med-display-icon');
  const medNameDisplay = document.getElementById('med-name-display');
  const medClassDisplay = document.getElementById('med-class-display');
  const haightWarningBlock = document.getElementById('haight-warning-block');
  const dateStamp = document.getElementById('rx-date-stamp');
  const glassPane = document.getElementById('frosted-glass-pane');
  const handElement = document.getElementById('doctor-reaching-hand');

  if (dateStamp) {
    dateStamp.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (!btnControlled || !btnStandard || !padlockAssembly) return;

  // Tactile Glass Hover & Cursor Parallax
  if (glassPane && handElement) {
    glassPane.addEventListener('mousemove', (e) => {
      const rect = glassPane.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      handElement.style.transform = `translate(${x * 16}px, ${y * 12}px)`;
    });

    glassPane.addEventListener('mouseleave', () => {
      handElement.style.transform = `translate(0px, 0px)`;
    });
  }

  function setPrescribeMode(mode) {
    if (mode === 'controlled') {
      btnControlled.classList.add('active');
      btnStandard.classList.remove('active');

      // Snap Padlock Shut
      padlockAssembly.classList.remove('unlocked');
      padlockAssembly.classList.add('locked');
      padlockText.textContent = 'LOCKED BY STATUTE';
      padlockSeal.textContent = 'RESTRICTED: IN-PERSON EXAM MANDATE';
      padlockSeal.style.backgroundColor = 'var(--warning-soft)';
      padlockSeal.style.color = 'var(--warning-coral)';
      padlockSeal.style.borderColor = 'var(--warning-coral)';

      // Medication Content
      medDisplayIcon.textContent = '💊';
      medNameDisplay.textContent = 'Schedule II: Methylphenidate / Adderall';
      medClassDisplay.textContent = 'DEA Controlled Substance • High abuse & physical dependence potential';

      haightWarningBlock.style.display = 'flex';
      haightWarningBlock.innerHTML = `
        <span class="warning-triangle">⚠️</span>
        <p>
          <strong>Federal Mandate (21 U.S.C. § 829):</strong> Under the <em>Ryan Haight Online Pharmacy Consumer Protection Act</em>, no controlled substance may be dispensed via telemedicine without at least one in-person physical examination. A webcam alone is legally insufficient.
        </p>
      `;

      updateFinalePrescribing(false, 'Controlled: In-Person Exam Required');
    } else {
      btnStandard.classList.add('active');
      btnControlled.classList.remove('active');

      // Unlock Padlock
      padlockAssembly.classList.remove('locked');
      padlockAssembly.classList.add('unlocked');
      padlockText.textContent = 'AUTHORIZED FOR RX';
      padlockSeal.textContent = 'APPROVED: STANDARD MEDICINE EXEMPTION';
      padlockSeal.style.backgroundColor = 'var(--green-tint)';
      padlockSeal.style.color = 'var(--green-deep)';
      padlockSeal.style.borderColor = 'var(--green-soft)';

      // Medication Content
      medDisplayIcon.textContent = '🩹';
      medNameDisplay.textContent = 'Standard Medication: Amoxicillin / Lisinopril';
      medClassDisplay.textContent = 'Non-Scheduled Prescription • Zero federal controlled substance restrictions';

      haightWarningBlock.style.display = 'flex';
      haightWarningBlock.innerHTML = `
        <span class="warning-triangle" style="color:var(--green-deep);">✓</span>
        <p style="color:var(--green-deep);">
          <strong>Statutory Exemption:</strong> Non-controlled substances do not trigger the Ryan Haight in-person physical examination rule. Dr. Alex is legally permitted to electronically transmit this prescription directly to the patient’s local pharmacy.
        </p>
      `;

      updateFinalePrescribing(true, 'Standard Rx Permitted');
    }
  }

  btnControlled.addEventListener('click', () => setPrescribeMode('controlled'));
  btnStandard.addEventListener('click', () => setPrescribeMode('standard'));
}


/* ==============================================================================
   03. CHAPTER 03: PATCHWORK QUILT & REIMBURSEMENT MAZE
   ============================================================================== */
const quiltData = {
  medicare: {
    icon: '🏛️',
    title: 'Medicare (Title XVIII) Restrictions & Section 1861(m)',
    category: 'Federal Statutory Payer',
    badge: 'CONGRESSIONAL CLIFF',
    text: `Prior to 2020, Section 1861(m) of the Social Security Act strictly barred Medicare reimbursement for telehealth unless two conditions were satisfied: 
           (1) The patient was located in a strictly designated rural Health Professional Shortage Area (HPSA), and 
           (2) The patient traveled to an approved physical medical clinic ("originating site"). 
           Pandemic waivers temporarily allowed care at home, but permanent coverage requires continuous congressional statutory reauthorization.`
  },
  medicaid: {
    icon: '🏥',
    title: 'Medicaid: 50 Independent State Payer Programs',
    category: 'State & Federal Partnership',
    badge: 'STATE-BY-STATE DISPARITY',
    text: `Medicaid is administered independently by each state under federal guidelines. While nearly every state Medicaid program reimburses some forms of telemedicine, reimbursement rates fluctuate from 100% parity down to less than 50% of an in-person visit. 
           Additionally, mandatory consent forms, transmission fees, and distant site clinician enrollment vary radically across borders.`
  },
  commercial: {
    icon: '🏢',
    title: 'Commercial Insurers & Telehealth Parity Battles',
    category: 'Private Employer & Marketplace Plans',
    badge: 'PARITY STATUTES',
    text: `Commercial insurers are governed by state-level "telehealth coverage parity" and "payment parity" laws. 
           While roughly 43 states mandate coverage parity (meaning an insurer must cover a virtual visit if they cover the in-person version), fewer than half mandate payment parity (requiring equal financial reimbursement rates for virtual versus in-person exams).`
  },
  cash: {
    icon: '💳',
    title: 'Direct-to-Consumer (Cash Pay) Health Platforms',
    category: 'Out-of-Pocket Bypass',
    badge: 'BORDERS CIRCUMVENTED',
    text: `Frustrated by the billing labyrinth, digital health companies (such as Hims, Ro, and Thirty Madison) frequently abandon the insurance reimbursement maze entirely. 
           Patients pay a transparent monthly out-of-pocket subscription fee, eliminating Medicare pre-authorizations and coding audits at the expense of patient financial out-of-pocket burden.`
  },
  maze: {
    icon: '🧭',
    title: 'The Patient’s Reimbursement Maze',
    category: 'Interactive Healthcare Labyrinth',
    badge: 'THE FINANCIAL LABYRINTH',
    text: `Telehealth coverage is not a single gateway — it is a sequence of conditional payer rules. 
           To secure payment, the patient, provider, originating site location, and technical modality must simultaneously align with current statutory provisions.`
  }
};

function initPatchworkQuiltEngine() {
  const patches = document.querySelectorAll('.quilt-patch');
  const trayIcon = document.getElementById('tray-icon');
  const trayTitle = document.getElementById('tray-title');
  const trayCategory = document.getElementById('tray-category');
  const trayBadge = document.getElementById('tray-status-badge');
  const trayNarrative = document.getElementById('tray-narrative');

  if (!trayTitle || !trayNarrative) return;

  patches.forEach(patch => {
    patch.addEventListener('click', () => {
      patches.forEach(p => p.classList.remove('active'));
      patch.classList.add('active');

      const patchKey = patch.getAttribute('data-patch');
      const data = quiltData[patchKey] || quiltData.medicare;

      trayIcon.textContent = data.icon;
      trayTitle.textContent = data.title;
      trayCategory.textContent = data.category;
      trayBadge.textContent = data.badge;
      trayNarrative.innerHTML = `<p>${data.text}</p>`;

      // If clicked maze centerpiece, scroll to maze controls smoothly
      if (patchKey === 'maze') {
        const simBox = document.getElementById('maze-simulator-box');
        if (simBox) simBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
}

function initMazeCalculatorEngine() {
  const solveBtn = document.getElementById('solve-maze-btn');
  const payerSelect = document.getElementById('maze-input-payer');
  const locSelect = document.getElementById('maze-input-location');
  const modSelect = document.getElementById('maze-input-modality');

  const solutionPath = document.getElementById('maze-solution-path');
  const patientToken = document.getElementById('maze-patient-token');
  const resultPanel = document.getElementById('maze-simulation-result');
  const resIcon = document.getElementById('maze-res-icon');
  const resHeadline = document.getElementById('maze-res-headline');
  const resNarrative = document.getElementById('maze-res-narrative');
  const resAudit = document.getElementById('maze-res-audit');

  if (!solveBtn || !payerSelect || !solutionPath) return;

  function runMazeSimulation() {
    const payer = payerSelect.value;
    const location = locSelect.value;
    const modality = modSelect.value;

    // Trigger visual maze navigation
    solutionPath.classList.remove('trail-hidden');

    // Reset result classes
    resultPanel.className = 'maze-result-panel';

    // SCENARIO 1: Cash Pay
    if (payer === 'self_pay') {
      patientToken.setAttribute('transform', 'translate(330, 180)');
      resultPanel.classList.add('result-success');
      resIcon.textContent = '✓';
      resHeadline.textContent = 'MAZE BYPASSED: Direct Out-of-Pocket Payment';
      resNarrative.textContent = 'Because the patient pays direct-to-consumer cash, the billing maze is bypassed entirely. No insurance claim denial can occur.';
      resAudit.innerHTML = '<strong>Payout Status:</strong> 100% Upfront Patient Out-of-Pocket Self-Pay';
      updateFinaleReimbursement(true, 'Self-Pay: Instant Approval');
      return;
    }

    // SCENARIO 2: Medicare Baseline Failure (Home without waiver extension)
    if (payer === 'medicare' && location === 'home' && modality === 'audio_only') {
      patientToken.setAttribute('transform', 'translate(130, 180)');
      resultPanel.classList.add('result-denied');
      resIcon.textContent = '✕';
      resHeadline.textContent = 'CLAIM DENIED: Medicare Audio-Only Home Ineligible';
      resNarrative.textContent = 'Medicare Title XVIII strictly prohibits telephone audio-only visits from a home setting for non-mental health somatic conditions. The claim is rejected.';
      resAudit.innerHTML = '<strong>Audit Finding:</strong> Statutory Violation of Social Security Act § 1861(m)';
      updateFinaleReimbursement(false, 'Medicare: Claim Denied');
      return;
    }

    // SCENARIO 3: Audio-only Commercial without Parity
    if (payer === 'commercial' && modality === 'audio_only') {
      patientToken.setAttribute('transform', 'translate(240, 120)');
      resultPanel.classList.add('result-denied');
      resIcon.textContent = '✕';
      resHeadline.textContent = 'CLAIM DENIED: Audio-Only Parity Clause Missing';
      resNarrative.textContent = 'Most commercial contracts mandate two-way video streaming. Audio-only phone consults are deemed non-covered exploratory calls.';
      resAudit.innerHTML = '<strong>Audit Finding:</strong> Non-Covered Service Code Modification';
      updateFinaleReimbursement(false, 'Commercial: Video Required');
      return;
    }

    // SCENARIO 4: Approved Synchronous Video Telehealth
    patientToken.setAttribute('transform', 'translate(330, 180)');
    resultPanel.classList.add('result-success');
    resIcon.textContent = '✓';
    resHeadline.textContent = 'REIMBURSEMENT PATH FOUND: Covered Under Telehealth Parity';
    resNarrative.textContent = 'Synchronous 2-way audio/video encounter conforms to active statutory parity policies. Claim is approved for distant-site fee schedule reimbursement.';
    resAudit.innerHTML = '<strong>Payout Status:</strong> 85%–100% In-Person Physician Fee Schedule Equivalent';
    updateFinaleReimbursement(true, 'Reimbursable Parity Approved');
  }

  solveBtn.addEventListener('click', runMazeSimulation);
}


/* ==============================================================================
   04. THE CONVERGENCE ENGINE (THE THREE WORLDS CONNECT)
   ============================================================================== */
let finaleState = {
  licensing: false,
  licensingText: 'NY ➔ CA (Blocked)',
  prescribing: false,
  prescribingText: 'Controlled: In-Person Exam Required',
  reimbursement: true,
  reimbursementText: 'Reimbursable Parity Approved'
};

function updateFinaleLicensing(ok, text) {
  finaleState.licensing = ok;
  finaleState.licensingText = text;
  renderFinaleNodes();
}

function updateFinalePrescribing(ok, text) {
  finaleState.prescribing = ok;
  finaleState.prescribingText = text;
  renderFinaleNodes();
}

function updateFinaleReimbursement(ok, text) {
  finaleState.reimbursement = ok;
  finaleState.reimbursementText = text;
  renderFinaleNodes();
}

function renderFinaleNodes() {
  const licEl = document.getElementById('final-licensing-status');
  const rxEl = document.getElementById('final-prescribing-status');
  const payEl = document.getElementById('final-reimbursement-status');

  if (licEl) {
    licEl.className = `node-live-status ${finaleState.licensing ? 'status-check' : 'status-pending'}`;
    licEl.innerHTML = `<span class="icon">${finaleState.licensing ? '✓' : '✕'}</span> ${finaleState.licensingText}`;
  }

  if (rxEl) {
    rxEl.className = `node-live-status ${finaleState.prescribing ? 'status-check' : 'status-pending'}`;
    rxEl.innerHTML = `<span class="icon">${finaleState.prescribing ? '✓' : '🔒'}</span> ${finaleState.prescribingText}`;
  }

  if (payEl) {
    payEl.className = `node-live-status ${finaleState.reimbursement ? 'status-check' : 'status-pending'}`;
    payEl.innerHTML = `<span class="icon">${finaleState.reimbursement ? '✓' : '✕'}</span> ${finaleState.reimbursementText}`;
  }
}

function initConvergenceEngine() {
  const toggleDemoBtn = document.getElementById('toggle-compliant-demo-btn');
  if (!toggleDemoBtn) return;

  let isAllCompliant = false;

  toggleDemoBtn.addEventListener('click', () => {
    isAllCompliant = !isAllCompliant;

    if (isAllCompliant) {
      updateFinaleLicensing(true, 'WA ↔ AZ (IMLC Compact Approved)');
      updateFinalePrescribing(true, 'Standard Rx Permitted (No Haight Lock)');
      updateFinaleReimbursement(true, 'Commercial Parity Approved');
      toggleDemoBtn.textContent = '🔄 Switch Scenario: Trigger Real-World Regulatory Friction';
    } else {
      updateFinaleLicensing(false, 'NY ➔ CA (Cross-Border Roadblock)');
      updateFinalePrescribing(false, 'Controlled (Ryan Haight Lock Clamped)');
      updateFinaleReimbursement(false, 'Medicare Audio-Only Home Rejected');
      toggleDemoBtn.textContent = '🔄 Switch Scenario: Ideal Fully Compliant Visit';
    }
  });

  renderFinaleNodes();
}


/* ==============================================================================
   LIGHTBOX MODAL FOR ORIGINAL INFOGRAPHIC
   ============================================================================== */
function initModalLightbox() {
  const modalBtn = document.getElementById('view-infographic-btn');
  const modal = document.getElementById('infographic-modal');
  const closeBtn = document.getElementById('close-modal-btn');

  if (!modalBtn || !modal) return;

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  modalBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}
