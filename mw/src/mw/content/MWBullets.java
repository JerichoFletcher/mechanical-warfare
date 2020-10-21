package mw.content;

import arc.graphics.*;
import arc.math.*;
import mindustry.content.*;
import mindustry.ctype.*;
import mindustry.entities.*;
import mindustry.entities.bullet.*;
import mindustry.gen.*;
import mw.entities.bullet.*;

public class MWBullets implements ContentList{
    public static BulletType

    //element aura bullets
    fireAuraBullet, frostAuraBullet,

    //basic
    nullBullet,

    //missile
    fragBig,

    //teleport
    bladeSmall,

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

        nullBullet = new BasicBulletType(6f, 700f, "shell"){{
            lifetime = 75f;
            width = height = 14f;
            hitSize = 14f;
            knockback = 3f;
            backColor = Color.white;
            frontColor = Color.black;
            shootEffect = Fx.shootBig;
            smokeEffect = Fx.shootBigSmoke;
        }};

        fragBig = new MissileBulletType(2.5f, 20f){
            {
                width = 9f;
                height = 13f;
                lifetime = 64f;
                homingPower = 0.5f;
                homingRange = 50f;
                shootEffect = Fx.shootBig;
                smokeEffect = Fx.shootBigSmoke;
                status = StatusEffects.corroded;
                fragBullets = 10;

                fragBullet = new MissileBulletType(2.5f, 4f){{
                    lifetime = 24f;
                    splashDamage = 5f;
                    splashDamageRadius = 20f;
                    homingPower = 0.75f;
                    homingRange = 75f;
                    status = StatusEffects.corroded;
                    fragBullets = 3;

                    fragBullet = new LiquidBulletType(MWLiquids.acid){{
                        lifetime = 2f;
                        speed = 1f;
                        damage = 2f;
                    }};
                }};
            }

            @Override
            public void hit(Bullet b, float x, float y){
                hitEffect.at(b, b.rotation());
                hitSound.at(b);
                Effect.shake(hitShake, 6f, b);

                for(int i = 0; i < fragBullets; i++){
                    float len = Mathf.random(1f, 7f);
                    float a = Mathf.random(360f);

                    fragBullet.create(b, b.team(),
                        b.x + Angles.trnsx(a, len),
                        b.y + Angles.trnsy(a, len),
                        a, Mathf.random(fragVelocityMin, fragVelocityMax), len
                    );
                }

                Damage.damage(b.team, x, y, splashDamageRadius, splashDamage * b.damageMultiplier(), collidesAir, collidesGround);
                Damage.status(b.team, x, y, splashDamageRadius, status, statusDuration, collidesAir, collidesGround);
            }
        };

        bladeSmall = new TeleportBulletType(4f, 17f, "mechanical-warfare-blade"){{
            width = 10f;
            height = 20f;
            damage = 17f;
            lifetime = 40f;
        }};

        hvSmall = new BasicBulletType(16f, 50f, "mechanical-warfare-hvbullet"){{
            lifetime = 26f;
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
