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

        let angle = Math.atan2(this.target.pose.y - player.pose.y, this.target.pose.x - player.pose.x) + Math.PI / 2
        let angle_diff = angle - player.pose.angle

        if (angle_diff > Math.PI) angle_diff -= Math.PI * 2
        if (angle_diff < -Math.PI) angle_diff += Math.PI * 2

        if (angle_diff > 0.1) player.pose.turn(0.1)
        if (angle_diff < -0.1) player.pose.turn(-0.1)

        if (Math.abs(angle_diff) < 0.1) 
            player.fire()

        
        player.pose.step_forward(10)

    }
}

module.exports = P;