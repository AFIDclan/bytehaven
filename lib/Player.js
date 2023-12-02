
const { Entity, Pose, Vec2, PhysicsEntity } = require('../engine');
const Rect = require('../engine/utils/Rect.js');
const Bullet = require('./Bullet.js');
const fs = require('fs');



class Player extends PhysicsEntity
{
    constructor(engine, team_id, color)
    {
        super(`player_${color}.png`, Rect.from_coordinates(0, 0, 50, 50), team_id +"-Player1");

        this.team_id = team_id;
        this.color = color;
        
        this.engine = engine;

        this.fire_rate = 1000;
        this.last_fired = Date.now()-Math.random()*this.fire_rate;
        this.health = 100;
        this.max_health = 100;

        this.max_velocity = 8;
        this.max_rotation_velocity = 0.1;

        this.gun_pose = new Pose(0, -20, 0);

        this.kills = 0;

        this.original_image = this.image_path;
        this.shield_up = false;
        this.shield_duration_remaining = 2000;

        this.policy = null;

    }

    attach_policy(policy)
    {
        this.policy = policy;
    }

    activate_shield()
    {
        if (this.shield_up) return;
        if (this.shield_duration_remaining <= 0) return;

        this.image_path = "player_shield.png";
        this.shield_up = true;
    }

    decativate_shield()
    {
        if (!this.shield_up) return;

        this.image_path = this.original_image;
        this.shield_up = false;
    }

    fire()
    {
        if (Date.now() - this.last_fired > this.fire_rate)
        {
            this.last_fired = Date.now();

            let bullet = new Bullet(this.gun_pose.after(this.pose), this, "Bullet");

            this.engine.add_entity(bullet);
        }
    }

    enemy_killed(enemy)
    {
        this.kills++;
        this.emit("kill", enemy);
    }

    die(source)
    {
        this.engine.remove_entity(this);
        this.emit("death");
        this.active = false;

        if (source instanceof Player)
            source.enemy_killed(this);

    }

    take_damage(damage, source)
    {
        if (!this.active) return;

        // This should check the direction of impact
        if (this.shield_up) return;
           
        

        this.health -= damage;

        if (this.health <= 0)
            this.die(source);
        
    }

    execute_command(command)
    {
        switch (command.type)
        {
            case "fire":
                this.fire();
                break;
            case "move":
                // Clamp movement delta to a reasonable value
                let x = Math.max(-this.max_velocity, Math.min(this.max_velocity, command.data.x));
                let y = Math.max(-this.max_velocity, Math.min(this.max_velocity, command.data.y));

                let added_velocity = this.pose.rotate_vec(new Vec2(x, y))

                if (!isNaN(added_velocity.x))
                    this.velocity.x = added_velocity.x;
                if (!isNaN(added_velocity.y))
                    this.velocity.y = added_velocity.y;
                break;
            case "turn":
                let angle_vel = Math.max(-this.max_rotation_velocity, Math.min(this.max_rotation_velocity, command.data.angle));

                if (isNaN(angle_vel)) break;

                this.velocity.angle = angle_vel;
                break;

            case "activate_shield":
                this.activate_shield();
                break;

            case "deactivate_shield":
                this.decativate_shield();
                break;

            default:
                break;

        }
    }
    
    update()
    {
        super.update();

        if (this.policy)
        {
            this.policy.decide(this.get_environment(), this);
        }

        if (this.shield_up)
        {
            this.shield_duration_remaining -= this.engine.delta_time;

            if (this.shield_duration_remaining <= 0)
                this.decativate_shield()
            
        }
    }

    serialize()
    {
        return {
            ...super.serialize(),
            team_id: this.team_id,
            color: this.color,
            health: this.health,
            max_health: this.max_health,
            shield_up: this.shield_up
        }
    }

    get_environment()
    {
        return this.engine.entities.filter((e) => e != this)
    }

}

module.exports = Player;