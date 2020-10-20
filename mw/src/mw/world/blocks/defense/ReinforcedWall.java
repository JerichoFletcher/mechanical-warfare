package mw.world.blocks.defense;

import arc.graphics.*;
import mindustry.content.*;
import mindustry.entities.*;
import mindustry.world.blocks.defense.*;

public class ReinforcedWall extends Wall{
    /** Delay at which the block heals itself */
    public float healTime = 90f;
    /** Fraction of heal power, 1.0 is equivalent 100% */
    public float healPower = 1f / 15f;

    public Effect healEffect = Fx.healBlockFull;
    public Color healColor = Color.valueOf("efefff");
    public final int healTimer = timers++;

    public ReinforcedWall(String name){
        super(name);
        update = true;
        sync = true;
    }

    public class ReinforcedWallBuild extends WallBuild{
        @Override
        public void updateTile(){
            super.updateTile();

            if(timer(healTimer, healTime) && health() < maxHealth()){
                heal(maxHealth() * healPower);
                healEffect.at(x, y, size, healColor);
            }
        }
    }
}
