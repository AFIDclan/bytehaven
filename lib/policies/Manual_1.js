const Policy = require('./Policy.js');

class P extends Policy {    
    decide(environment, player) {

        player.rotate(0.01)
        player.step_forward(5)
    }
}

module.exports = P;