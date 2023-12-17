const Player = require('../Player.js');
const Policy = require('./Policy.js');

class P extends Policy {    
    decide(environment, player) {

        if (!this.target || !environment.includes(this.target)) {
            this.target = environment
            .filter((e) => e instanceof Player)
            .filter((e) => e.team_id != player.team_id)
            
            this.target = this.target[Math.floor(Math.random() * this.target.length)]
        }

        if (!this.target) return;

        let angle = Math.atan2(this.target._pose.y - player._pose.y, this.target._pose.x - player._pose.x) + Math.PI / 2
        let angle_diff = angle - player._pose.angle

        if (angle_diff > Math.PI) angle_diff -= Math.PI * 2
        if (angle_diff < -Math.PI) angle_diff += Math.PI * 2

        if (angle_diff > 0.1) player.rotate(0.1)
        if (angle_diff < -0.1) player.rotate(-0.1)

        if (Math.abs(angle_diff) < 0.1) 
            player.fire()

        
        player.step_forward(10)

    }
}

module.exports = P;