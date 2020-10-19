package mw.content;

import arc.math.*;
import arc.struct.*;
import mindustry.content.*;
import mindustry.ctype.*;
import mindustry.entities.*;
import mindustry.entities.bullet.*;
import mindustry.gen.*;
import mindustry.type.*;

public class MWUnitTypes implements ContentList{
    public static UnitType

    //ground - orange
    sabre;

    @Override
    public void load(){
        sabre = new UnitType("sabre"){{
            constructor = () -> MechUnit.create();

            health = 600f;
            speed = 0.4f;
            hitSize = 12f;
            rotateSpeed = 3f;
            mechFrontSway = 0.5f;
            armor = 9f;
            immunities = ObjectSet.with(StatusEffects.corroded);

            weapons.add(new Weapon("mechanical-warfare-sabre-launcher"){{
                top = false;
                x = 9f;
                rotate = false;
                reload = 90f;
                recoil = 3f;
                shake = 2f;
                shots = 1;
                ejectEffect = Fx.shellEjectBig;
                shootSound = Sounds.shootBig;

                bullet = new MissileBulletType(2.5f, 20f){
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
            }});
        }};
    }
}
