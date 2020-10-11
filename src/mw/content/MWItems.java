package mw.content;

import arc.graphics.*;
import mindustry.ctype.*;
import mindustry.type.*;

public class MWItems implements ContentList{
    public static Item

    gravel, iron, aluminum, uranium,
    steel, scrapPlate, insulationPlate,
    apShell, heShell,
    alienSporePod, radioactiveSporePod,
    mk2Module,
    coil, sulfur;

    @Override
    public void load(){
        gravel = new Item("gravel", Color.valueOf("6b6b77"));

        iron = new Item("iron", Color.valueOf("cce7ff")){{
            hardness = 3;
        }};

        aluminum = new Item("aluminum", Color.valueOf("ff7f8a")){{
            hardness = 4;
            cost = 1.2f;
        }};

        uranium = new Item("uranium", Color.valueOf("309926")){{
            hardness = 6;
            cost = 3.2f;
            explosiveness = 0.3f;
            radioactivity = 1.7f;
        }};

        steel = new Item("steel", Color.valueOf("aeaeae")){{
            cost = 1.5f;
        }};

        scrapPlate = new Item("scrap-plate", Color.valueOf("e0b28d"));

        insulationPlate = new Item("insulation-plate", Color.valueOf("87ceeb")){{
            cost = 4f;
        }};

        apShell = new Item("ap-shell", Color.valueOf("c9e75f")){{
            explosiveness = 0.6f;
        }};

        heShell = new Item("he-shell", Color.valueOf("f3885e")){{
            explosiveness = 1.8f;
        }};

        alienSporePod = new Item("alien-spore-pod", Color.valueOf("996f58")){{
            cost = 1.7f;
            explosiveness = 1f;
            flammability = 0.5f;
            radioactivity = 5f;
        }};

        radioactiveSporePod = new Item("radioactive-spore-pod", Color.valueOf("588a4c")){{
            cost = 1.6f;
            explosiveness = 2.5f;
            flammability = 0.15f;
            radioactivity = 1.4f;
        }};

        mk2Module = new Item("mk2-module", Color.valueOf("6cd9b5")){{
            cost = 5f;
        }};

        coil = new Item("coil", Color.valueOf("ff9c5a"));

        sulfur = new Item("sulfur", Color.valueOf("cfcc5a")){{
            explosiveness = 0.2f;
            flammability = 1.2f;
        }};
    }
}
