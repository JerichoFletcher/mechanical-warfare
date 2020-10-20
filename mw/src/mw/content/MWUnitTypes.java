package mw.content;

import arc.struct.*;
import mindustry.content.*;
import mindustry.ctype.*;
import mindustry.gen.*;
import mindustry.type.*;

public class MWUnitTypes implements ContentList{
    public static UnitType

    //ground - orange
    rapier, sabre, dominator, nullifier;

    @Override
    public void load(){
        rapier = new UnitType("rapier"){{
            constructor = () -> MechUnit.create();

            health = 360f;
            speed = 0.6f;
            hitSize = 12f;

            weapons.add(new Weapon("mechanical-warfare-rapier-gun"){{
                top = false;
                x = 8f;
                rotate = false;
                reload = 60f;
                alternate = true;
                recoil = 2f;
                ejectEffect = Fx.none;
                shootSound = Sounds.shootBig;
                bullet = MWBullets.bladeSmall;
            }});
        }};

        sabre = new UnitType("sabre"){{
            constructor = () -> MechUnit.create();

            health = 800f;
            speed = 0.4f;
            hitSize = 16f;
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
                ejectEffect = Fx.shellEjectBig;
                shootSound = Sounds.shootBig;
                bullet = MWBullets.fragBig;
            }});
        }};

        dominator = new UnitType("dominator"){{
            constructor = () -> MechUnit.create();

            health = 10000f;
            speed = 0.3f;
            hitSize = 22f;
            rotateSpeed = 2f;
            mechFrontSway = 0.55f;

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
                ejectEffect = Fx.shellEjectBig;
                bullet = MWBullets.flakPopSmall;
            }});
        }};

        nullifier = new UnitType("nullifier"){{
            constructor = () -> MechUnit.create();

            health = 18000f;
            speed = 0.2f;
            hitSize = 27f;
            rotateSpeed = 2f;
            mechFrontSway = 0.6f;

            weapons.add(new Weapon("mechanical-warfare-null-pointer"){{
                top = false;
                x = 30.25f;
                shootY = 21.5f;
                reload = 30f;
                recoil = 5f;
                shake = 2.2f;
                inaccuracy = 2f;
                shootSound = MWSounds.quakeshot;
                ejectEffect = Fx.shellEjectBig;
                bullet = MWBullets.nullBullet;
            }});
        }};
    }
}
