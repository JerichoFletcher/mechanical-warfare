package mw.content;

import arc.graphics.*;
import mindustry.content.*;
import mindustry.ctype.*;
import mindustry.type.*;

public class MWLiquids implements ContentList{
    public static Liquid

    lava, contaminatedWater, acid, gas;

    @Override
    public void load(){
        lava = new Liquid("lava", Color.valueOf("d95f34")){{
            temperature = 1.4f;
            viscosity = 0.9f;
            effect = StatusEffects.melting;
        }};

        contaminatedWater = new Liquid("contaminated-water", Color.valueOf("588a4c")){{
            temperature = 0.6f;
            effect = StatusEffects.wet;
        }};

        acid = new Liquid("acid", Color.valueOf("c9eb86")){{
            temperature = 0.6f;
            viscosity = 0.8f;
            effect = StatusEffects.corroded;
        }};

        gas = new Liquid("gas", Color.valueOf("b33eb3")){{
            flammability = 1.25f;
            explosiveness = 1f;
        }};
    }
}
