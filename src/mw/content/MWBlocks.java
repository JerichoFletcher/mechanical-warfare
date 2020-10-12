package mw.content;

import mindustry.content.*;
import mindustry.ctype.*;
import mindustry.graphics.*;
import mindustry.type.*;
import mindustry.world.*;
import mindustry.world.blocks.defense.*;
import mindustry.world.blocks.distribution.*;
import mindustry.world.blocks.environment.*;
import mw.world.blocks.defense.*;

import static mindustry.type.ItemStack.*;

public class MWBlocks implements ContentList{
    public static Block

        //environment
        lava, contaminatedWater, deepContaminatedWater, darksandContaminatedWater, sandContaminatedWater,

        //ores
        oreIron, oreAluminum, oreUranium,

        //defense
        insulatorWall, insulatorWallLarge, reinforcedWall, reinforcedWallLarge, steelWall, steelWallLarge,

        //transport
        aluminumConveyor, ironConveyor;

    @Override
    public void load(){
        //region environment

        lava = new Floor("lava"){{
            liquidDrop = MWLiquids.lava;
            speedMultiplier = 0.15f;
            variants = 0;
            isLiquid = true;
            status = StatusEffects.melting;
            statusDuration = 180f;
            drownUpdateEffect = Fx.burning;
            walkEffect = Fx.melting;
            blendGroup = Blocks.water;
            drownTime = 40f;
            cacheLayer = CacheLayer.slag;
            albedo = 0.5f;
        }};

        contaminatedWater = new Floor("contaminated-water"){{
            liquidDrop = MWLiquids.contaminatedWater;
            speedMultiplier = 0.5f;
            variants = 0;
            isLiquid = true;
            status = StatusEffects.wet;
            statusDuration = 90f;
            drownUpdateEffect = Fx.burning;
            walkEffect = Fx.wet;
            cacheLayer = CacheLayer.water;
            albedo = 0.5f;
        }};

        deepContaminatedWater = new Floor("deep-contaminated-water"){{
            liquidDrop = MWLiquids.contaminatedWater;
            speedMultiplier = 0.2f;
            variants = 0;
            isLiquid = true;
            status = StatusEffects.wet;
            statusDuration = 120f;
            drownUpdateEffect = Fx.burning;
            walkEffect = Fx.wet;
            blendGroup = contaminatedWater;
            cacheLayer = CacheLayer.water;
            drownTime = 140f;
            albedo = 0.5f;
        }};

        darksandContaminatedWater = new ShallowLiquid("darksand-contaminated-water"){{
            set(contaminatedWater, Blocks.darksand);

            liquidDrop = MWLiquids.contaminatedWater;
            speedMultiplier = 0.5f;
            variants = 0;
            isLiquid = true;
            status = StatusEffects.wet;
            statusDuration = 90f;
            drownUpdateEffect = Fx.burning;
            walkEffect = Fx.wet;
            blendGroup = contaminatedWater;
            cacheLayer = CacheLayer.water;
            albedo = 0.5f;
        }};

        sandContaminatedWater = new ShallowLiquid("sand-contaminated-water"){{
            set(contaminatedWater, Blocks.sand);

            liquidDrop = MWLiquids.contaminatedWater;
            speedMultiplier = 0.5f;
            variants = 0;
            isLiquid = true;
            status = StatusEffects.wet;
            statusDuration = 90f;
            drownUpdateEffect = Fx.burning;
            walkEffect = Fx.wet;
            blendGroup = contaminatedWater;
            cacheLayer = CacheLayer.water;
            albedo = 0.5f;
        }};

        //end region
        //region ores

        oreIron = new OreBlock(MWItems.iron){{
            oreDefault = true;
            oreThreshold = 0.864f;
            oreScale = 24.904762f;
        }};

        oreAluminum = new OreBlock(MWItems.aluminum){{
            oreDefault = true;
            oreThreshold = 0.89f;
            oreScale = 25.828543f;
        }};

        oreUranium = new OreBlock(MWItems.uranium){{
            oreDefault = true;
            oreThreshold = 0.89f;
            oreScale = 25.828543f;
        }};

        //end region
        //region defense

        insulatorWall = new InsulatorWall("insulator-wall"){{
            requirements(Category.defense, with(MWItems.insulationPlate, 6));

            health = 900;
            powerProduction = 2f;
        }};

        insulatorWallLarge = new InsulatorWall("insulator-wall-large"){{
            requirements(Category.defense, with(MWItems.insulationPlate, 24));

            size = 2;
            health = 3600;
            powerProduction = 4f;
            energyMultiplier = 30f;
        }};

        reinforcedWall = new ReinforcedWall("reinforced-wall"){{
            requirements(Category.defense, with(MWItems.iron, 6, Items.surgealloy, 4, MWItems.uranium, 3, Items.phasefabric, 1));

            health = 1280;
        }};

        reinforcedWallLarge = new ReinforcedWall("reinforced-wall-large"){{
            requirements(Category.defense, with(MWItems.iron, 24, Items.surgealloy, 16, MWItems.uranium, 12, Items.phasefabric, 4));

            size = 2;
            health = 5120;
        }};

        steelWall = new Wall("steel-wall"){{
            requirements(Category.defense, with(MWItems.steel, 6));

            health = 560;
        }};

        steelWallLarge = new Wall("steel-wall-large"){{
            requirements(Category.defense, with(MWItems.steel, 24));

            size = 2;
            health = 2240;
        }};

        //end region
        //region transport

        aluminumConveyor = new Conveyor("aluminum-conveyor"){{
            requirements(Category.distribution, with(Items.copper, 1, Items.lead, 1, MWItems.aluminum, 1));

            health = 15;
            speed = 0.123f;
            displayedSpeed = 16f;
        }};

        ironConveyor = new Conveyor("iron-conveyor"){{
            requirements(Category.distribution, with(Items.copper, 1, Items.lead, 1, MWItems.aluminum, 1));

            health = 55;
            speed = 0.0538f;
            displayedSpeed = 7f;
        }};

        //end region
    }
}
