const Player = require('./Player');

let player = new Player("player.png");
player.pose.angle = 2

var canvas = document.getElementById("game-viewport");
var ctx = canvas.getContext("2d");

//Center the viewport on 0 0
ctx.translate(canvas.width / 2, canvas.height / 2);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    player.pose.turn(0.01);
    player.pose.step_forward(1);
}
  
setInterval(gameLoop, 10);