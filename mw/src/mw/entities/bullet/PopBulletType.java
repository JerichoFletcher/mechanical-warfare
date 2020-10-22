package mw.entities.bullet;

import arc.audio.*;
import arc.math.geom.*;
import arc.util.*;
import mindustry.entities.*;
import mindustry.entities.bullet.*;
import mindustry.gen.*;

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

        boolean notPlayer = true;
        if(b.owner() instanceof Unit){
            if(((Unit)b.owner()).isPlayer()){
                Unit owner = (Unit)b.owner();

                Tmp.v1.set(owner.aimX(), owner.aimY());
                float targetRot = Tmp.v1.sub(b.x, b.y).angle();

                popSound.at(b);
                popBullet.create(owner, owner.team(), b.x, b.y, targetRot);
            }else{
                notPlayer = false;
            }
        }else if(!notPlayer){
            Posc target = Units.closestTarget(b.team(), b.x, b.y, popBullet.range());

            if(target != null){
                Vec2 result = Predict.intercept(b, target, popBullet.speed);
                float targetRot = result.sub(b.x, b.y).angle();

                popSound.at(b);
                popBullet.create(b, b.team(), b.x, b.y, targetRot);
            }
        }
    }
}
