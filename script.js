const game = document.getElementById('game');
const p1 = { el: document.getElementById('p1'), x: 100, y: window.innerHeight-150 };
const p2 = { el: document.getElementById('p2'), x: 100, y: 150 };
const ghost = { el: document.getElementById('ghost'), x: 300, y: 300 };
const darkness = document.getElementById('darkness');
const jumpscare = document.getElementById('jumpscare');
let running = false;

// Life / Nyawa
let life = { p1: 3, p2: 3 };
const lifeP1El = document.getElementById('life-p1');
const lifeP2El = document.getElementById('life-p2');

function loseLife(player){
  if(player==='p1'){ life.p1--; lifeP1El.textContent='❤️'.repeat(life.p1); }
  if(player==='p2'){ life.p2--; lifeP2El.textContent='💙'.repeat(life.p2); }
  if(life.p1<=0 || life.p2<=0){
    alert('GAME OVER!');
    location.reload();
  }
}

// Maze layout (array of walls: x, y, width, height)
const maze = [
  {x:0,y:0,w:window.innerWidth,h:20},
  {x:0,y:0,w:20,h:window.innerHeight},
  {x:window.innerWidth-20,y:0,w:20,h:window.innerHeight},
  {x:0,y:window.innerHeight-20,w:window.innerWidth,h:20},
  {x:100,y:100,w:300,h:20},
  {x:200,y:200,w:20,h:200},
  {x:400,y:50,w:20,h:300}
];

function createMaze(){
  maze.forEach(w=>{
    const div=document.createElement('div');
    div.className='wall';
    div.style.left=w.x+'px';
    div.style.top=w.y+'px';
    div.style.width=w.w+'px';
    div.style.height=w.h+'px';
    document.getElementById('maze').appendChild(div);
  });
}

// Player update
function updatePlayer(p){ p.el.style.left=p.x+'px'; p.el.style.top=p.y+'px'; }

// Collision check
function collide(x,y){ return maze.some(w=>x+24>w.x && x<w.x+w.w && y+24>w.y && y<w.y+w.h); }

function startGame(){ 
  document.getElementById('story').remove(); 
  running=true; 
  createMaze(); 
  spawnGhost(); 
}

// Controls
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('touchstart',()=>{
    if(!running) return;
    const dir = btn.dataset.dir;
    const player = btn.closest('.pad').dataset.player==='1'?p1:p2;
    const speed=10;
    let nx=player.x, ny=player.y;
    if(dir==='up') ny-=speed;
    if(dir==='down') ny+=speed;
    if(dir==='left') nx-=speed;
    if(dir==='right') nx+=speed;
    if(!collide(nx,ny)){ player.x=nx; player.y=ny; updatePlayer(player); }
  });
});

// Ghost AI simple follow player
function spawnGhost(){
  setInterval(()=>{
    if(!running) return;
    const target = Math.random()<0.5?p1:p2;
    let dx = target.x - ghost.x;
    let dy = target.y - ghost.y;
    const dist = Math.hypot(dx,dy);
    dx/=dist; dy/=dist;
    let nx=ghost.x+dx*2, ny=ghost.y+dy*2;
    if(!collide(nx,ny)){ ghost.x=nx; ghost.y=ny; ghost.el.style.left=ghost.x+'px'; ghost.el.style.top=ghost.y+'px'; }
    // Jumpscare & nyawa
    if(dist<40){
      jumpscare.style.opacity=1;
      setTimeout(()=>jumpscare.style.opacity=0,200);
      if(target===p1) loseLife('p1');
      if(target===p2) loseLife('p2');
    }
  },30);
}

// Darkness & senter update
setInterval(()=>{
  const p1x=p1.x+12,p1y=p1.y+12,p2x=p2.x+12,p2y=p2.y+12;
  darkness.style.background=
    `radial-gradient(circle at ${p1x}px ${p1y}px, rgba(34,197,94,0.5) 100px, rgba(0,0,0,0.95) 200px),
     radial-gradient(circle at ${p2x}px ${p2y}px, rgba(59,130,246,0.5) 100px, rgba(0,0,0,0.95) 200px)`;
},30);

updatePlayer(p1);
updatePlayer(p2);
ghost.el.style.left=ghost.x+'px';
ghost.el.style.top=ghost.y+'px';