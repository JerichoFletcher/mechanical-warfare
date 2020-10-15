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
        gravel = new Item("item-gravel", Color.valueOf("6b6b77"));

        iron = new Item("item-iron", Color.valueOf("cce7ff")){{
            hardness = 3;
        }};

        aluminum = new Item("item-aluminum", Color.valueOf("ff7f8a")){{
            hardness = 4;
            cost = 1.2f;
        }};

        uranium = new Item("item-uranium", Color.valueOf("309926")){{
            hardness = 6;
            cost = 3.2f;
            explosiveness = 0.3f;
            radioactivity = 1.7f;
        }};

        steel = new Item("item-steel", Color.valueOf("aeaeae")){{
            cost = 1.5f;
        }};

        scrapPlate = new Item("item-scrap-plate", Color.valueOf("e0b28d"));

        insulationPlate = new Item("item-insulation-plate", Color.valueOf("87ceeb")){{
            cost = 4f;
        }};

        apShell = new Item("item-ap-shell", Color.valueOf("c9e75f")){{
            explosiveness = 0.6f;
        }};

        heShell = new Item("item-he-shell", Color.valueOf("f3885e")){{
            explosiveness = 1.8f;
        }};

        alienSporePod = new Item("item-alien-spore-pod", Color.valueOf("996f58")){{
            cost = 1.7f;
            explosiveness = 1f;
            flammability = 0.5f;
            radioactivity = 5f;
        }};

        radioactiveSporePod = new Item("item-radioactive-spore-pod", Color.valueOf("588a4c")){{
            cost = 1.6f;
            explosiveness = 2.5f;
            flammability = 0.15f;
            radioactivity = 1.4f;
        }};

        mk2Module = new Item("item-mk2-module", Color.valueOf("6cd9b5")){{
            cost = 5f;
        }};

        coil = new Item("item-coil", Color.valueOf("ff9c5a"));

        sulfur = new Item("item-sulfur", Color.valueOf("cfcc5a")){{
            explosiveness = 0.2f;
            flammability = 1.2f;
        }};
    }
}
