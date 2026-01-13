const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let t = 0;

// ---------------- FLOWER ----------------
function drawFlower(x, y, scale = 1, color = null, sway = 0) {
  ctx.save();
  ctx.translate(x + sway, y);
  ctx.scale(scale, scale);

  const colors = color || ["#ff4f7c", "#ff80ab", "#f54291", "#ffc0cb"];

  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(
      Math.cos(angle) * 10, Math.sin(angle) * 40,
      Math.cos(angle) * 30, Math.sin(angle) * 30
    );
    ctx.closePath();
    const grad = ctx.createRadialGradient(
      Math.cos(angle) * 15, Math.sin(angle) * 15, 2,
      0, 0, 30
    );
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.5, colors[1]);
    grad.addColorStop(0.8, colors[2]);
    grad.addColorStop(1, colors[3]);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // small yellow center
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#ffec00";
  ctx.fill();

  ctx.restore();
}

// ---------------- LEAF ----------------
function drawLeaf(x, y, scale = 1, rotation = 0, sway = 0) {
  ctx.save();
  ctx.translate(x + sway, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-10, -40, 20, -60, 0, -80);
  ctx.bezierCurveTo(-20, -60, 10, -40, 0, 0);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, -80, 0, 0);
  grad.addColorStop(0, "#1b5e20");
  grad.addColorStop(1, "#4caf50");

  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

// ---------------- CREATE GARDEN ----------------
const flowers = [];
const leaves = [];

// 100 big flowers
for (let i = 0; i < 100; i++) {
  const depth = Math.random() * 0.7 + 0.3;
  flowers.push({
    x: Math.random() * canvas.width,
    y: canvas.height * (0.4 + 0.6 * depth),
    scale: 1 + Math.random() * 1,
    color: [
      `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`,
      `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`,
      `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`,
      `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`
    ],
    swayPhase: Math.random() * Math.PI * 2, // unique phase
    swayAmp: 5 + Math.random() * 5, // gentle sway
    swaySpeed: 0.5 + Math.random() * 0.5 // different speeds
  });
}

// 300 leaves
for (let i = 0; i < 300; i++) {
  const depth = Math.random() * 0.7 + 0.3;
  leaves.push({
    x: Math.random() * canvas.width,
    y: canvas.height * (0.4 + 0.6 * depth),
    scale: 0.6 + Math.random() * 0.5,
    rotation: Math.random() * Math.PI * 2,
    swayPhase: Math.random() * Math.PI * 2,
    swayAmp: 5 + Math.random() * 5,
    swaySpeed: 0.3 + Math.random() * 0.5
  });
}

// ---------------- ANIMATE ----------------
function animate() {
  t += 0.02;

  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.5);
  sky.addColorStop(0, "#87CEEB");
  sky.addColorStop(1, "#ffffff");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5);

  // Ground
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(0, canvas.height * 0.5, canvas.width, canvas.height * 0.5);

  // Leaves sway
  leaves.forEach(l => {
    const sway = Math.sin(t * l.swaySpeed + l.swayPhase) * l.swayAmp;
    drawLeaf(l.x, l.y, l.scale, l.rotation, sway);
  });

  // Flowers sway
  flowers.sort((a, b) => a.y - b.y);
  flowers.forEach(f => {
    const sway = Math.sin(t * f.swaySpeed + f.swayPhase) * f.swayAmp;
    drawFlower(f.x, f.y, f.scale, f.color, sway);
  });

  requestAnimationFrame(animate);
}

animate();
