package mw.entities.bullet;

import arc.graphics.g2d.*;
import arc.math.*;
import mindustry.content.Fx;
import mindustry.entities.*;
import mindustry.entities.bullet.*;
import mindustry.gen.*;

public class MeleeBulletType extends BasicBulletType{
    public float length = 40f;

    public MeleeBulletType(float damage, String bulletSprite){
        super(0.01f, damage);

        keepVelocity = false;
        hitEffect = Fx.hitLancer;
        despawnEffect = Fx.none;
        shootEffect = Fx.none;
        smokeEffect = Fx.none;
        sprite = bulletSprite;
        lifetime = 16f;
        pierce = true;
        pierceBuilding = true;
        hittable = false;
        collides = false;
    }

    public MeleeBulletType(float damage){
        this(damage, "mechanical-warfare-blade");
    }

    public MeleeBulletType(){
        this(1f);
    }

    @Override
    public void init(Bullet b){
        super.init(b);
        Damage.collideLine(b, b.team(), hitEffect, b.x, b.y, b.rotation(), length);
    }

    @Override
    public void draw(Bullet b){
        float len = Mathf.curve(b.fin(), 0f, 0.2f);
        float w, h;

        Draw.color(backColor);
        w = backRegion.width * Draw.scl;
        h = backRegion.height * Draw.scl * len;
        Draw.rect(backRegion, b.x, b.y, w, h, b.rotation());

        Draw.color(frontColor);
        w = frontRegion.width * Draw.scl;
        h = frontRegion.height * Draw.scl * len;
        Draw.rect(frontRegion, b.x, b.y, w, h, b.rotation());

        Draw.reset();
    }
}
