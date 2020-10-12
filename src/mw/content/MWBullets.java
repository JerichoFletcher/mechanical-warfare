package mw.content;

import mindustry.content.*;
import mindustry.ctype.*;
import mindustry.entities.bullet.*;
import mindustry.gen.*;

public class MWBullets implements ContentList{
    public static BulletType

    //element aura bullets
    fireAuraBullet, frostAuraBullet;

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
    }
}
