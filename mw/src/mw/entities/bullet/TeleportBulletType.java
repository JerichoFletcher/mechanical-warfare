package mw.entities.bullet;

import arc.math.*;
import arc.math.geom.*;
import arc.util.*;
import arc.util.pooling.*;
import mindustry.content.*;
import mindustry.entities.*;
import mindustry.entities.bullet.*;
import mindustry.gen.*;

public class TeleportBulletType extends BasicBulletType{
    public int maxHits = 3;
    public float teleportRange = 64f;
    public float teleportDelay = 10f;

    public Effect chargeEffect = Fx.none;
    public Effect launchEffect = Fx.none;

    public TeleportBulletType(float speed, float damage, String bulletSprite){
        this(speed, damage);
        sprite = bulletSprite;
    }

    public TeleportBulletType(float speed, float damage){
        super(speed, damage);
    }

    public TeleportBulletType(){
        this(1f, 1f);
    }

    @Override
    public void init(Bullet b){
        super.init(b);

        if(b.data == null){
            b.data(Pools.obtain(TeleportBulletData.class, () -> new TeleportBulletData(0)));
        }
    }

    @Override
    public void hit(Bullet b, float x, float y){
        super.hit(b, b.x, b.y);

        if(((TeleportBulletData)b.data()).hits < maxHits){
            Tmp.v1.trns(Mathf.randomSeed(b.id) + Time.time(), teleportRange);
            Bullet b2 = create(b, b.team(), b.x + Tmp.v1.x, b.y + Tmp.v1.y, 0f, damage, 1f, 1f, Pools.obtain(TeleportBulletData.class, () -> {
                return new TeleportBulletData(((TeleportBulletData)b.data()).hits + 1);
            }));

            Posc target = Units.closestTarget(b2.team(), b2.x, b2.y, range(), unit -> !unit.dead(), build -> !build.dead());
            if(target == null) return;

            b2.vel().set(0f, 0.5f).setAngle(Angles.angle(b2.x, b2.y, target.getX(), target.getY()));
            chargeEffect.at(b2, b2.rotation());

            Time.run(teleportDelay, () -> {
                if(b2 != null && !Units.invalidateTarget(target, b2.team(), b2.x, b2.y, range())){
                    launchEffect.at(b2, b2.rotation());

                    Vec2 result = Predict.intercept(b2, target, speed);
                    float targetRot = result.sub(b2.x, b2.y).angle();
                    b2.vel().set(0f, speed).setAngle(targetRot);
                }else{
                    Pools.free(b.data());
                }
            });
        }else{
            Pools.free(b.data());
        }
    }

    class TeleportBulletData implements Pool.Poolable{
        public int hits;

        public TeleportBulletData(int hits){
            this.hits = hits;
        }

        @Override
        public void reset(){
            hits = 0;
        }
    }
}
