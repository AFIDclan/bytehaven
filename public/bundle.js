(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Pose = require('./Pose.js');

class Entity
{
    constructor()
    {
        this.pose = new Pose(0, 0, 0);
    }
}

module.exports = Entity;
},{"./Pose.js":3}],2:[function(require,module,exports){
const Entity = require('./Entity.js');

class Player extends Entity
{
    constructor(image_path)
    {
        super();
        this.name = 'Player';
        this.image = new Image();
        this.image.src = image_path;
    }

    draw(ctx)
    {
        ctx.save(); // Save the current canvas state
        ctx.translate(this.pose.x, this.pose.y); // Move the origin to the player's position
        ctx.rotate(this.pose.angle); // Rotate the canvas by the player's angle
        ctx.drawImage(this.image, -this.image.width/2, -this.image.height/2); // Draw the image centered on the origin
        ctx.restore(); // Restore the saved canvas state
    }
}

module.exports = Player;
},{"./Entity.js":1}],3:[function(require,module,exports){

class Pose {

    constructor(x, y, angle)
    {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }

    step_forward(distance)
    {
        this.x += distance * Math.sin(this.angle);
        this.y += distance * -Math.cos(this.angle);
    }

    turn(angle)
    {
        this.angle += angle;
    }
}

module.exports = Pose;
},{}],4:[function(require,module,exports){
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
},{"./Player":2}]},{},[4]);
