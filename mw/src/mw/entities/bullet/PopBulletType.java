package mw.entities.bullet;

import arc.audio.*;
import arc.math.geom.*;
import arc.util.*;
import mindustry.entities.*;
import mindustry.entities.bullet.*;
import mindustry.gen.*;
import mindustry.world.blocks.defense.turrets.Turret.*;

public class PopBulletType extends FlakBulletType{
    public BulletType popBullet;
    public Sound popSound = Sounds.missile;

    public PopBulletType(float speed, float damage, String bulletSprite){
        this(speed, damage);
        sprite = bulletSprite;
    }

    public PopBulletType(float speed, float damage){
        super(speed, damage);
        collides = true;
        collidesAir = true;
        collidesGround = true;
        collidesTiles = true;
    }

    @Override
    public void hit(Bullet b, float x, float y){
        super.hit(b, x, y);

        if(b.owner() instanceof Unit){
            if(((Unit)b.owner()).isPlayer()){
                Unit owner = (Unit)b.owner();

                Tmp.v1.set(owner.aimX(), owner.aimY());
                float targetRot = Tmp.v1.sub(b.x, b.y).angle();

                popSound.at(b);
                popBullet.create(owner, owner.team(), b.x, b.y, targetRot);
            }else{
                if(b.owner() instanceof TurretBuild){
                    TurretBuild build = (TurretBuild)b.owner();

                    if(build.target != null){
                        popSound.at(b);
                        popBullet.create(b, b.team(), b.x, b.y, Tmp.v1.set(build.targetPos).sub(b).angle());
                    }
                }else{
                    Posc target = Units.closestTarget(b.team(), b.x, b.y, popBullet.range(), unit -> {
                        return (popBullet.collidesGround && !unit.isFlying()) || (popBullet.collidesAir && unit.isFlying()) && !unit.dead();
                    });

                    if(target != null){
                        Vec2 result = Predict.intercept(b, target, popBullet.speed);
                        float targetRot = result.sub(b.x, b.y).angle();

                        popSound.at(b);
                        popBullet.create(b, b.team(), b.x, b.y, targetRot);
                    }
                }
            }
        }
    }

    @Override
    public float range(){
        return popBullet.range();
    }
}
