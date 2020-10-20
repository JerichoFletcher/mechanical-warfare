package mw.content;

import mindustry.content.*;
import mindustry.ctype.*;
import mindustry.entities.bullet.*;
import mindustry.gen.*;
import mw.entities.bullet.*;

public class MWBullets implements ContentList{
    public static BulletType

    //element aura bullets
    fireAuraBullet, frostAuraBullet,

    //high velocity
    hvSmall,

    //pop
    flakPopSmall;

    @Override
    public void load(){
        fireAuraBullet = new BasicBulletType(0.00001f, 1f){
            {
                instantDisappear = true;
                status = StatusEffects.melting;
                hitEffect = Fx.none;
                despawnEffect = Fx.none;
            }

            @Override
            public void draw(Bullet b){}
        };

        frostAuraBullet = new BasicBulletType(0.00001f, 1.5f){
            {
                instantDisappear = true;
                status = StatusEffects.freezing;
                hitEffect = Fx.none;
                despawnEffect = Fx.none;
            }

            @Override
            public void draw(Bullet b){}
        };

        hvSmall = new BasicBulletType(16f, 50f, "mechanical-warfare-hvbullet"){{
            lifetime = 18f;
            width = 8f;
            height = 15f;
            knockback = 2f;
        }};

        flakPopSmall = new PopBulletType(8f, 32f, "shell"){{
            lifetime = 15f;
            width = height = 12f;
            shrinkY = 0.2f;
            drag = 0.2f;
            splashDamage = 12f;
            splashDamageRadius = 32f;
            shootEffect = Fx.shootBig;
            smokeEffect = Fx.shootBigSmoke;
            hitEffect = despawnEffect = Fx.blastExplosion;
            
            popBullet = hvSmall;
        }};
    }
}
