package mw.content;

import mindustry.content.*;
import mindustry.ctype.*;
import mindustry.graphics.*;
import mindustry.world.*;
import mindustry.world.blocks.environment.*;

public class MWBlocks implements ContentList{
    public static Block

    //environment
    lava, contaminatedWater, deepContaminatedWater, darksandContaminatedWater, sandContaminatedWater,

    //ores
    oreIron, oreAluminum, oreUranium;

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

            set(contaminatedWater, Blocks.darksand);
        }};

        sandContaminatedWater = new ShallowLiquid("sand-contaminated-water"){{
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

            set(contaminatedWater, Blocks.sand);
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
    }
}
