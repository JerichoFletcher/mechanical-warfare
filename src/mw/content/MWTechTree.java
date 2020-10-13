package mw.content;

import mindustry.content.*;

import static mindustry.content.Blocks.*;
import static mw.content.MWBlocks.*;

public class MWTechTree extends TechTree{
    public static TechNode mwRoot;

    @Override
    public void load(){
        mwRoot = node(router, () -> {
            node(ironConveyor, () -> {
                node(aluminumConveyor);
            });

            node(forceProjector, () -> {
                node(fireAura, () -> {
                    node(frostAura);
                });
            });

            node(shockMine, () -> {
                node(slagBomb);
            });

            node(titaniumWall, () -> {
                node(steelWall, () -> {
                    node(steelWallLarge);
                });
            });

            node(plastaniumWall, () -> {
                node(insulatorWall, () -> {
                    node(insulatorWallLarge);
                });
            });

            node(surgeWall, () -> {
                node(reinforcedWall, () -> {
                    node(reinforcedWallLarge);
                });
            });
        });
    }
}
