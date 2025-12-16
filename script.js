const p1 = { el: document.getElementById('p1'), x: 120, y: innerHeight - 150 };
const p2 = { el: document.getElementById('p2'), x: 120, y: 150 };
const darkness = document.getElementById('darkness');
const game = document.getElementById('game');
let running = false;

function updatePlayer(p) {
  p.el.style.left = p.x + 'px';
  p.el.style.top = p.y + 'px';
}

function startGame() {
  document.getElementById('story').remove();
  running = true;
  spawnEnemy();
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('touchstart', () => {
    if (!running) return;
    const dir = btn.dataset.dir;
    const player = btn.closest('.pad').dataset.player === '1' ? p1 : p2;
    const speed = 10;
    if (dir === 'up') player.y -= speed;
    if (dir === 'down') player.y += speed;
    if (dir === 'left') player.x -= speed;
    if (dir === 'right') player.x += speed;
    updatePlayer(player);
  });
});

function spawnEnemy() {
  const e = document.createElement('div');
  e.className = 'enemy';
  let ex = Math.random() * innerWidth;
  let ey = Math.random() * innerHeight;
  game.appendChild(e);

  setInterval(() => {
    if (!running) return;
    ex += ((p1.x + p2.x) / 2 - ex) * 0.01;
    ey += ((p1.y + p2.y) / 2 - ey) * 0.01;
    e.style.left = ex + 'px';
    e.style.top = ey + 'px';

    [p1, p2].forEach(p => {
      const dx = p.x - ex;
      const dy = p.y - ey;
      if (Math.hypot(dx, dy) < 20) {
        alert('KAMU DITANGKAP!');
        location.reload();
      }
    });
  }, 30);
}

setInterval(() => {
  const cx = (p1.x + p2.x) / 2;
  const cy = (p1.y + p2.y) / 2;
  darkness.style.background = `radial-gradient(circle at ${cx}px ${cy}px, transparent 90px, rgba(0,0,0,0.95) 180px)`;
}, 30);

updatePlayer(p1);
updatePlayer(p2);