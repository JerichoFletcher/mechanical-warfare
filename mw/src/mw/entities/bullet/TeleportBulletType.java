package mw.entities.bullet;

import arc.math.*;
import arc.math.geom.*;
import arc.util.*;
import arc.util.pooling.*;
import mindustry.content.*;
import mindustry.entities.*;
import mindustry.entities.bullet.*;
import mindustry.gen.*;

public class TeleportBulletType extends BasicBulletType {
    public float teleportRange = 32f;
    public float teleportDelay = 10f;

    public Effect chargeEffect = Fx.none;
    public Effect launchEffect = Fx.none;

    public TeleportBulletType(float speed, float damage, String bulletSprite){
        this(speed, damage);
        sprite = bulletSprite;
    }

    public TeleportBulletType(float speed, float damage){
        super(speed, damage);
        pierceCap = 3;
    }

    public TeleportBulletType(){
        this(1f, 1f);
    }

    @Override
    public void init(Bullet b){
        super.init(b);

        b.data(Pools.obtain(TeleportBulletData.class, () -> new TeleportBulletData()));
    }

    @Override
    public void hit(Bullet b, float x, float y){
        super.hit(b, x, y);

        float x2 = Mathf.randomSeedRange((long)(b.id + Time.time()), teleportRange);
        float y2 = Mathf.randomSeedRange((long)(b.id + Time.time() + 1), teleportRange);
        b.set(x + x2, y + y2);
        b.time(0f);

        ((TeleportBulletData)b.data()).target = Units.closestTarget(b.team(), b.x, b.y, range(), unit -> !unit.dead(), tile -> !tile.dead());

        if(((TeleportBulletData)b.data()).target == null){
            Pools.free(b.data());
            b.remove();

            return;
        }

        b.vel().set(0f, 0.5f).setAngle(Angles.angle(b.x, b.y, ((TeleportBulletData)b.data()).target.x(), ((TeleportBulletData)b.data()).target.y()));
        chargeEffect.at(b, b.rotation());

        Time.run(teleportDelay, () -> {
            if(b != null){
                if(((TeleportBulletData)b.data()).target == null){
                    Pools.free(b.data());
                    b.remove();

                    return;
                }else{
                    launchEffect.at(b, b.rotation());

                    Vec2 result = Predict.intercept(b, ((TeleportBulletData)b.data()).target, speed);
                    float targetRot = result.sub(b.x, b.y).angle();
                    b.vel().set(0f, speed).setAngle(targetRot);
                }
            }
        });
    }

    class TeleportBulletData implements Pool.Poolable{
        private Teamc target;

        @Override
        public void reset(){
            target = null;
        }
    }
}
