const Policy = require('./Policy.js');

class P extends Policy {    
    decide(environment, player) {

        player.pose.turn(0.01)
        player.pose.step_forward(5)
    }
}

module.exports = P;