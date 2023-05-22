
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

            default:
                break;

        }
    }
    
    update()
    {
        super.update();
        if (this.moved_last_frame)
        {
            let close = this.engine.get_adjacent_entities(this, 9)
            close = close.filter((e) => (e instanceof Player || e instanceof Bullet) && e.team_id != this.team_id);
            close = close.filter((e)=>{
                let dist = this.pose.subtract(e.pose).magnitude();
                return dist < 800;
            })

            this.detected_enemies = close.filter((e)=>e instanceof Player);
            this.detected_bullets = close.filter((e)=>e instanceof Bullet);
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
            detected_enemies: this.detected_enemies.map((e)=>({team_id: e.team_id, pose: e.pose, health: e.health, velocity: e.velocity})),
            detected_bullets: this.detected_bullets.map((e)=>({team_id: e.team_id, pose: e.pose, velocity: e.velocity}))
        }
    }

}

module.exports = Player;