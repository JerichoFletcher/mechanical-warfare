package mw.content;

import arc.graphics.Color;
import arc.graphics.g2d.*;
import arc.math.*;
import mindustry.entities.*;
import mindustry.graphics.*;
import mw.graphics.*;

public class MWFx{
    public static final Effect
    
    fireAuraEffect = new Effect(40f, e -> {
        Draw.color(MWPal.fireAuraFlame, Pal.darkFlame, e.fin());

        Angles.randLenVectors(e.id, 3, 2f + e.fin() * 9f, (x, y) -> {
            Fill.circle(e.x + x, e.y + y, 0.2f + e.fout() * 1.5f);
        });
    }),

    frostAuraEffect = new Effect(32f, e -> {
        e.scaled(17f, i -> {
            Draw.color(Pal.lancerLaser);

            Angles.randLenVectors(e.id, 3, i.fin() * 7f, (x, y) -> {
                Fill.circle(e.x + x, e.y + y, i.fout() * 3.2f);
            });
        });

        Draw.color(MWPal.frostAuraIce);

        Angles.randLenVectors(e.id, 4, 1f + e.fin() * 14f, (x, y) -> {
            Fill.circle(e.x + x, e.y + y, e.fout() * 0.8f);
        });
    }),

    frostAuraSmoke = new Effect(35f, e -> {
        Draw.color(Color.lightGray);

        Angles.randLenVectors(e.id, 2, 2f + e.fin() * 7f, (x, y) -> {
            Fill.circle(e.x + x, e.y + y, 0.2f + e.fslope() * 0.8f);
        });
    });
}
