// content.js

console.log("AI Reducer content script loaded.");

const LOCK_KEY = "__aiReducerLockUntil";

// If a lockout is active, show it immediately
const lockUntil = localStorage.getItem(LOCK_KEY);
if (lockUntil && Date.now() < Number(lockUntil)) {
  showLockout(Number(lockUntil));
} else {
  localStorage.removeItem(LOCK_KEY);
  if (!window.__aiReducerInjected) {
    window.__aiReducerInjected = true;
    showFirstPopup();
  }
}

//
// FIRST POPUP
//
function showFirstPopup() {
  const overlay = createOverlay();

  const box = createBox();
  box.innerHTML = `
    <h1 style="margin:0 0 10px;font-size:22px;color:#222;">Reduce ChatGPT Usage</h1>
    <p style="margin:0 0 20px;font-size:16px;color:#555;">Do you want to continue using ChatGPT?</p>
  `;

  const btnRow = createBtnRow();

  const redirectBtn = createButton("Redirect to Google", "#4285f4");
  redirectBtn.onclick = () => window.location.href = "https://www.google.com";

  const cancelBtn = createButton("Cancel", "#e53935");
  cancelBtn.onclick = () => {
    overlay.remove();
    startLockout(10); // 10-minute lockout
  };

  btnRow.appendChild(redirectBtn);
  btnRow.appendChild(cancelBtn);
  box.appendChild(btnRow);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

//
// START LOCKOUT
//
function startLockout(minutes) {
  const unlockTime = Date.now() + minutes * 60 * 1000;
  localStorage.setItem(LOCK_KEY, unlockTime);
  showLockout(unlockTime);
}

//
// LOCKOUT SCREEN
//
function showLockout(untilTimestamp) {
  const overlay = createOverlay();
  overlay.style.backdropFilter = "blur(4px)";

  const box = createBox();
  box.innerHTML = `
    <h2 style="margin-bottom:16px;">Come back later</h2>
    <p style="margin-bottom:16px;">You can return in:</p>
  `;

  const timer = document.createElement("h1");
  timer.style.fontSize = "28px";
  timer.style.margin = "0 0 10px";
  timer.style.color = "#222";

  box.appendChild(timer);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  function updateTimer() {
    const now = Date.now();
    const diff = untilTimestamp - now;

    if (diff <= 0) {
      overlay.remove();
      localStorage.removeItem(LOCK_KEY);
      return;
    }

    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    timer.textContent = `${mins}m ${secs}s`;

    requestAnimationFrame(updateTimer);
  }

  updateTimer();
}

//
// UI HELPERS
//
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.setAttribute("ai-overlay", "1");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0, 0, 0, 0.65)";
  overlay.style.zIndex = "999999";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.userSelect = "none";
  return overlay;
}

function createBox() {
  const box = document.createElement("div");
  box.style.background = "#ffffff";
  box.style.borderRadius = "10px";
  box.style.padding = "24px 28px";
  box.style.maxWidth = "420px";
  box.style.width = "90%";
  box.style.boxShadow = "0 12px 30px rgba(0,0,0,0.25)";
  box.style.fontFamily = "Arial, sans-serif";
  box.style.textAlign = "center";
  return box;
}

function createBtnRow() {
  const row = document.createElement("div");
  row.style.display = "flex";
  row.style.justifyContent = "center";
  row.style.gap = "12px";
  return row;
}

function createButton(text, color) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.style.padding = "10px 18px";
  btn.style.border = "none";
  btn.style.borderRadius = "6px";
  btn.style.background = color;
  btn.style.color = "#fff";
  btn.style.cursor = "pointer";
  btn.style.fontSize = "14px";
  return btn;
}
