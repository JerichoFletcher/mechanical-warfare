package mw.world.blocks.defense;

import arc.*;
import arc.math.*;
import arc.struct.*;
import arc.util.*;
import arc.util.io.*;
import mindustry.entities.bullet.*;
import mindustry.gen.*;
import mindustry.graphics.*;
import mindustry.ui.*;
import mindustry.world.blocks.defense.*;

public class InsulatorWall extends Wall{
    /** The amount of power produced per tick in case of an efficiency of 1.0, which represents 100%. */
    public float powerProduction = 2f;
    /** The amount of production efficiency multiplier depends on the bullet type */
    public float energyMultiplier = 15f;
    /** The bullet types which will multiply production efficiency */
    public Seq<Class<?>> multipliedTypes = Seq.with(
        LightningBulletType.class,
        LaserBulletType.class,
        ContinuousLaserBulletType.class
    );

    public InsulatorWall(String name){
        super(name);
        update = true;
        sync = true;
        insulated = true;
        flashHit = true;
        consumesPower = false;
        outputsPower = true;
        hasPower = true;
    }

    @Override
    public void setBars(){
        super.setBars();

        if(hasPower && outputsPower && !consumes.hasPower()){
            bars.add("power", (InsulatorWallBuild entity) -> new Bar(() ->
            Core.bundle.format("bar.poweroutput",
            Strings.fixed(entity.getPowerProduction() * 60 * entity.timeScale(), 1)),
            () -> Pal.powerBar,
            () -> entity.productionEfficiency));
        }
    }

    public class InsulatorWallBuild extends WallBuild{
        public float productionEfficiency = 0.0f;

        @Override
        public void updateTile(){
            super.updateTile();

            productionEfficiency = Mathf.lerpDelta(productionEfficiency, 0f, 0.05f);
        }

        @Override
        public boolean collision(Bullet bullet){
            if(multipliedTypes.contains(bullet.type.getClass())){
                productionEfficiency += bullet.damage() / 150f * energyMultiplier;
            }else{
                productionEfficiency += bullet.damage() / 150f;
            }

            return super.collision(bullet);
        }

        @Override
        public float getPowerProduction(){
            return powerProduction * productionEfficiency;
        }

        @Override
        public void write(Writes write){
            super.write(write);
            write.f(productionEfficiency);
        }

        @Override
        public void read(Reads read){
            super.read(read);
            productionEfficiency = read.f();
        }
    }
}
