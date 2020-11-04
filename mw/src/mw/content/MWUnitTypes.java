package mw.content;

import arc.struct.*;
import mindustry.content.*;
import mindustry.ctype.*;
import mindustry.gen.*;
import mindustry.type.*;
import mw.annotations.Annotations.*;
import mw.type.*;

public class MWUnitTypes implements ContentList{
    public static @EntityPointer(MechUnit.class) UnitType scrapper, rapier, sabre, dominator, nullifier;

    @Override
    public void load(){
        scrapper = new MWUnitType("scrapper"){{
            health = 180f;
            speed = 0.7f;
            hitSize = 8f;

            weapons.add(new Weapon("mechanical-warfare-scrapper-blade"){{
                top = false;
                x = 5.25f;
                shootY = 4f;
                reload = 20f;
                recoil = -4.5f;
                ejectEffect = Fx.none;
                shootSound = Sounds.splash;
                bullet = MWBullets.meleeTiny;
            }});
        }};

        rapier = new MWUnitType("rapier"){{
            health = 360f;
            speed = 0.6f;
            hitSize = 11f;

            weapons.add(new Weapon("mechanical-warfare-rapier-gun"){{
                top = false;
                x = 8f;
                rotate = false;
                reload = 48f;
                alternate = true;
                recoil = 2f;
                ejectEffect = Fx.none;
                shootSound = Sounds.shootBig;
                bullet = MWBullets.bladeSmall;
            }});
        }};

        sabre = new MWUnitType("sabre"){{
            health = 800f;
            speed = 0.4f;
            hitSize = 13f;
            rotateSpeed = 3f;
            mechFrontSway = 0.5f;
            armor = 9f;
            immunities = ObjectSet.with(StatusEffects.corroded);

            weapons.add(new Weapon("mechanical-warfare-sabre-launcher"){{
                top = false;
                x = 9f;
                rotate = false;
                reload = 60f;
                recoil = 3f;
                shake = 2f;
                shots = 1;
                shootSound = Sounds.shootBig;
                bullet = MWBullets.missileFragBig;
            }});
        }};

        dominator = new MWUnitType("dominator"){{
            health = 10000f;
            speed = 0.3f;
            hitSize = 22f;
            rotateSpeed = 2f;
            canDrown = false;
            mechFrontSway = 0.6f;
            mechStepParticles = true;
            mechStepShake = 0.15f;

            weapons.add(new Weapon("mechanical-warfare-domination"){{
                top = false;
                x = 20.5f;
                shootY = 13.25f;
                rotate = false;
                reload = 30f;
                recoil = 3f;
                shots = 6;
                inaccuracy = 50f;
                shootSound = Sounds.shootBig;
                bullet = MWBullets.flakPopSmall;
            }});
        }};

        nullifier = new MWUnitType("nullifier"){{
            health = 18000f;
            speed = 0.2f;
            hitSize = 27f;
            rotateSpeed = 2f;
            canDrown = false;
            mechFrontSway = 1.9f;
            mechStepParticles = true;
            mechStepShake = 0.25f;
            mechSideSway = 0.6f;

            weapons.add(new Weapon("mechanical-warfare-null-pointer"){{
                top = false;
                x = 30.25f;
                shootY = 21.5f;
                rotate = false;
                reload = 30f;
                recoil = 5f;
                shake = 2.2f;
                inaccuracy = 2f;
                shootSound = MWSounds.quakeshot;
                bullet = MWBullets.nullBullet;
            }});
        }};
    }
}
