const frame = document.querySelector(".app-frame");
const orbit = document.querySelector(".orbit-wrap");
const nodes = [...document.querySelectorAll(".orbit-node")];
const toggles = [...document.querySelectorAll(".menu-toggle")];
const visibleAnchorAngle = 72;
let currentRotation = 0;

function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

function setActiveState(menu) {
  const activeNode = nodes.find((node) => node.dataset.menu === menu);
  const nodeAngle = activeNode ? Number(activeNode.dataset.angle || 0) : 0;
  const targetRotation = normalizeAngle(visibleAnchorAngle - nodeAngle);
  const clockwiseStep = normalizeAngle(targetRotation - normalizeAngle(currentRotation));
  const slotCount = clockwiseStep / 72;

  currentRotation += clockwiseStep;

  frame.dataset.active = menu;
  orbit.classList.remove("is-expanded");
  orbit.style.setProperty("--rotation-duration", `${slotCount * 220}ms`);
  orbit.style.setProperty("--orbit-rotation", `${currentRotation}deg`);

  nodes.forEach((node) => {
    const isActive = node.dataset.menu === menu;
    node.classList.toggle("is-active", isActive);
    node.setAttribute("aria-pressed", String(isActive));
  });
}

orbit.addEventListener("pointerleave", () => {
  orbit.classList.remove("is-expanded");
});

orbit.addEventListener("focusin", () => {
  if (frame.dataset.active) orbit.classList.add("is-expanded");
});

orbit.addEventListener("focusout", (event) => {
  if (!orbit.contains(event.relatedTarget)) orbit.classList.remove("is-expanded");
});

function activeMenuFromInputs() {
  const checked = toggles.find((toggle) => toggle.checked);
  return checked ? checked.id.replace("menu-", "") : null;
}

nodes.forEach((node) => {
  node.addEventListener("pointerenter", () => {
    if (node.classList.contains("is-active")) orbit.classList.add("is-expanded");
  });

  node.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    document.querySelector(`#menu-${node.dataset.menu}`).checked = true;
    setActiveState(node.dataset.menu);
  });

  node.tabIndex = 0;
  node.setAttribute("role", "button");
});

orbit.addEventListener("transitionend", (event) => {
  if (event.target !== orbit || event.propertyName !== "transform") return;

  const normalizedRotation = normalizeAngle(currentRotation);
  if (normalizedRotation === currentRotation) return;

  orbit.classList.add("no-transition");
  currentRotation = normalizedRotation;
  orbit.style.setProperty("--orbit-rotation", `${currentRotation}deg`);
  requestAnimationFrame(() => requestAnimationFrame(() => orbit.classList.remove("no-transition")));
});

toggles.forEach((toggle) => {
  toggle.addEventListener("change", () => {
    setActiveState(activeMenuFromInputs());
  });
});

nodes.forEach((node) => node.setAttribute("aria-pressed", "false"));
