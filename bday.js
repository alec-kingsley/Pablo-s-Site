const canvas = document.querySelector('#canvas');

const w = canvas.width = window.innerWidth;
const h = canvas.height = window.innerHeight * 2;

function loop() {
  requestAnimationFrame(loop);
  ctx.clearRect(0,0,w,h);
  
  confs.forEach((conf) => {
    conf.update();
    conf.draw();
  })
}

function Confetti () {
  //construct confetti

  this.x = Math.round(Math.random() * w);
  this.y = Math.round(Math.random() * h)-(h/2);
  this.rotation = Math.random()*360;

  const size = Math.random()*(w/60);
  if (size < 15) this.size = 15;

  const colors = ['#2a438c', '#d92332', '#f2f2f2'];
  this.color = colors[Math.floor(colors.length * Math.random())];

  this.speed = this.size/7;
  
  this.opacity = Math.random()/2+0.4;

  this.shiftDirection = Math.random() > 0.5 ? 1 : -1;
}

Confetti.prototype.update = function() {
  this.y += this.speed;
  
  if (this.y <= h) {
    this.x += this.shiftDirection/3;
    this.rotation += this.shiftDirection*this.speed/100;
  } else this.y = h;
};

Confetti.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, this.rotation, this.rotation+(Math.PI/2));
  ctx.lineTo(this.x, this.y);
  ctx.closePath();
  ctx.globalAlpha = this.opacity;
  ctx.fillStyle = this.color;
  ctx.fill();
};

const ctx = canvas.getContext('2d');
const confNum = Math.floor(w / 4);
const confs = new Array(confNum).fill().map(_ => new Confetti());

loop();

function fadeOut() {

  let vis = false;
  confs.forEach((conf) => {
    vis = false;
    if (conf.opacity > 0.03) vis = true;
    conf.opacity *= 0.995;
  })
  if (vis) requestAnimationFrame(fadeOut);
  else canvas.remove();
}
setTimeout(() => {fadeOut();}, 12*h);
