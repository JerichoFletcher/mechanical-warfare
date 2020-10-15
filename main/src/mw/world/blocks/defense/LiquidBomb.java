package mw.world.blocks.defense;

import arc.*;
import arc.graphics.g2d.*;
import arc.math.*;
import arc.util.*;
import mindustry.content.*;
import mindustry.entities.Puddles;
import mindustry.entities.bullet.*;
import mindustry.gen.*;
import mindustry.type.*;
import mindustry.world.*;

import static mindustry.Vars.*;

public class LiquidBomb extends Block{
    public Liquid liquid;
    public float liquidAmount = 150f;

    public BulletType fragBullet = Bullets.flakGlassFrag;
    public int fragBullets = 8;

    public TextureRegion topRegion;

    public LiquidBomb(String name, Liquid liquid){
        super(name);
        this.liquid = liquid;
        update = false;
        destructible = true;
        solid = false;
        targetable = false;
        rebuildable = false;
        hasShadow = false;
    }

    public LiquidBomb(String name){
        this(name, Liquids.slag);
    }

    @Override
    public void load(){
        super.load();

        topRegion = Core.atlas.find(name + "-top");
    }

    public class LiquidBombBuild extends Building{
        @Override
        public void draw() {
            super.draw();

            Draw.color(team().color,
                Mathf.absin(Time.time() + 360f * Mathf.randomSeed(id()), 1.5f, 1f)
            );
            Draw.rect(topRegion, x, y);

            Draw.reset();
        }

        @Override
        public void drawLight() {
            renderer.lights.add(x, y, 20f, liquid.lightColor, 0.2f);
        }

        @Override
        public void unitOn(Unit unit){
            if(unit.team().isEnemy(team())){
                Time.run(Mathf.randomSeed(id(), 5f, 10f), () -> {
                    Tile other = world.tile((int)x, (int)y);

                    if(other != null){
                        Puddles.deposit(other, liquid, liquidAmount + Mathf.randomSeedRange(id(), 30f));
                    }
                });

                for(int i = 0; i < fragBullets; i++){
                    fragBullet.create(this, team(), x, y,
                        Mathf.randomSeed(id() + (long)i, 360f),
                        Mathf.randomSeed(id() + (long)(i + 1), 0.8f, 1.2f),
                        Mathf.randomSeed(id() + (long)(i + 2), 0.9f, 1.1f)
                    );
                }

                kill();
            }
        }
    }
}
