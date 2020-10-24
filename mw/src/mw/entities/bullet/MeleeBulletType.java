package mw.entities.bullet;

import arc.graphics.g2d.*;
import arc.math.*;
import arc.util.*;
import mindustry.content.Fx;
import mindustry.entities.*;
import mindustry.entities.bullet.*;
import mindustry.gen.*;

public class MeleeBulletType extends BasicBulletType{
    public float length = 24f;
    public float lineAngle = 30f;
    public float lineLength = 8f;

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
        float len = Mathf.curve(b.fin(), 0f, 0.2f) * b.fout() * length * 1.2f;

        Tmp.v1.trns(b.rotation(), Draw.scl * len / 2f);
        Tmp.v2.trns(b.rotation(), b.finpow() * length / 2f);

        Draw.color(backColor);
        Draw.rect(backRegion, b.x + Tmp.v1.x + Tmp.v2.x, b.y + Tmp.v1.y + Tmp.v2.y, backRegion.width * Draw.scl, len, b.rotation() - 90f);

        Draw.color(frontColor);
        Draw.rect(frontRegion, b.x + Tmp.v1.x + Tmp.v2.x, b.y + Tmp.v1.y + Tmp.v2.y, frontRegion.width * Draw.scl, len, b.rotation() - 90f);

        float alpha = 0.5f + Mathf.curve(b.fin(), 0f, 0.2f) * b.fout() * 0.5f;
        Tmp.v1.trns(b.rotation(), length);

        Draw.color(frontColor, alpha);
        Lines.stroke(b.fout() * 2f);
        for(int i : Mathf.signs){
            Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rotation() - 180f + i * lineAngle, lineLength);

            Tmp.v2.set(Tmp.v1).scl(b.fin());
            Lines.lineAngle(b.x + Tmp.v2.x, b.y + Tmp.v2.y, b.rotation() - 180f + i * lineAngle, lineLength / 2f);
        }

        Draw.reset();
    }
}
