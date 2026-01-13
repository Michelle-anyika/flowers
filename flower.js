const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const cx = canvas.width / 2;
const cy = canvas.height / 2 + 100;

let t = 0;

// ---------------- PETAL ----------------
function drawPetal(rotation, breath) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation + breath * 0.02);

  ctx.beginPath();
  ctx.moveTo(0, 0);

  ctx.bezierCurveTo(
    -60 - breath * 6, -40,
    -120 - breath * 8, -200,
    -70, -380
  );

  ctx.bezierCurveTo(
    -20, -450,
     20, -450,
     70, -380
  );

  ctx.bezierCurveTo(
    120 + breath * 8, -200,
     60 + breath * 6, -40,
     0, 0
  );

  ctx.closePath();

  const grad = ctx.createLinearGradient(0, 0, 0, -420);
  grad.addColorStop(0, "#5a002b");
  grad.addColorStop(0.25, "#a00050");
  grad.addColorStop(0.6, "#ff4fa3");
  grad.addColorStop(1, "#ffd1ea");

  ctx.fillStyle = grad;
  ctx.fill();

  // ribs (slightly animated)
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = "#ffffff";
  for (let i = -40; i <= 40; i += 10) {
    ctx.beginPath();
    ctx.moveTo(i, -10);
    ctx.bezierCurveTo(
      i * 1.4, -150,
      i * 0.8, -270,
      i * 0.4 + breath * 2, -380
    );
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "#3a001c";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

// ---------------- WATER DROPLET ----------------
class Droplet {
  constructor(x, y, r) {
    this.baseX = x;
    this.baseY = y;
    this.r = r;
    this.phase = Math.random() * Math.PI * 2;
  }

  update() {
    // microscopic vibration (surface tension)
    this.x = this.baseX + Math.sin(t * 2 + this.phase) * 0.6;
    this.y = this.baseY + Math.cos(t * 1.6 + this.phase) * 0.4;
  }

  draw() {
    ctx.save();

    // highlight shimmer
    const highlightShift = Math.sin(t * 3 + this.phase) * this.r * 0.2;

    const g = ctx.createRadialGradient(
      this.x - this.r * 0.3 + highlightShift,
      this.y - this.r * 0.3,
      this.r * 0.2,
      this.x,
      this.y,
      this.r
    );

    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.4, "rgba(255,255,255,0.45)");
    g.addColorStop(1, "rgba(255,255,255,0.05)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();

    // contact shadow
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(
      this.x,
      this.y + this.r * 0.6,
      this.r * 0.9,
      this.r * 0.4,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }
}

// ---------------- DROPLETS SET ----------------
const droplets = [
  new Droplet(cx - 40, cy - 210, 6),
  new Droplet(cx + 20, cy - 250, 4),
  new Droplet(cx + 45, cy - 190, 5),
  new Droplet(cx - 10, cy - 300, 3),
  new Droplet(cx + 70, cy - 310, 4),
  new Droplet(cx - 65, cy - 260, 5)
];

// ---------------- FLOWER ----------------
function drawFlower() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const breath = Math.sin(t) * 1.5;
  const swayX = Math.sin(t * 0.4) * 3;
  const swayY = Math.cos(t * 0.3) * 2;

  ctx.save();
  ctx.translate(swayX, swayY);

  // petals (depth illusion)
  for (let i = 0; i < 7; i++) {
    drawPetal((i / 7) * Math.PI * 2 + 0.15, breath);
  }

  // center cavity
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.arc(0, -40, 55 + breath * 0.4, 0, Math.PI * 2);

  const cg = ctx.createRadialGradient(0, -40, 10, 0, -40, 60);
  cg.addColorStop(0, "#1a000c");
  cg.addColorStop(1, "#4a0025");

  ctx.fillStyle = cg;
  ctx.fill();
  ctx.restore();

  // droplets
  droplets.forEach(d => {
    d.update();
    d.draw();
  });

  ctx.restore();
}

// ---------------- LOOP ----------------
function animate() {
  drawFlower();
  t += 0.01;
  requestAnimationFrame(animate);
}

animate();
