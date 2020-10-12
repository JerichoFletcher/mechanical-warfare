package mw.world.blocks.defense;

import arc.*;
import arc.graphics.g2d.*;
import arc.math.*;
import mindustry.content.*;
import mindustry.entities.*;
import mindustry.entities.bullet.*;
import mindustry.gen.*;
import mindustry.type.*;
import mindustry.world.*;
import mindustry.world.consumers.*;
import mindustry.world.meta.*;
import mindustry.world.meta.values.*;

import static mindustry.Vars.*;

public class ElementAura extends Block{
    protected BulletType bullet;

    public Liquid liquid;
    public TextureRegion liquidRegion;

    public float warmup = 0.08f;
    public float cooldown = 0.02f;
    public float liquidUsed = 1f;
    public float reloadTime = 5f;

    public int areaEffectCount = 3;
    public Effect shootEffect = Fx.none;
    public Effect smokeEffect = Fx.none;

    public final int timerTarget = timers++;
    public float targetInterval = 5f;

    public float range = 15f * tilesize;

    public ElementAura(String name, Liquid liquid){
        super(name);
        this.liquid = liquid;
        outlineIcon = false;
    }

    public ElementAura(String name){
        this(name, Liquids.water);
    }

    @Override
    public void setStats(){
        super.setStats();

        if(consumes.has(ConsumeType.liquid)){
            consumes.remove(ConsumeType.liquid);
        }
        stats.add(BlockStat.input, new LiquidValue(liquid, 60 / reloadTime, true));
    }

    @Override
    public void load(){
        super.load();

        liquidRegion = Core.atlas.find(name + "-liquid");
    }

    public class ElementAuraBuild extends Building{
        public float heat = 0.0f;
        public float reload = reloadTime;

        public Teamc target;
        public boolean hasTarget = false;

        protected boolean hasShot = false;

        @Override
        public void updateTile(){
            if(!validateTarget()){
                target = null;
                hasTarget = false;
            }

            heat = Mathf.lerpDelta(heat, 
                shooting() ? 1 : 0,
                shooting() ? warmup : cooldown
            );

            if(hasAmmo()){
                if(timer(timerTarget, targetInterval)){
                    findTarget();
                }

                if(shooting()){
                    updateShooting();
                }
            }
        }

        public void updateShooting(){
            if(reload <= 0.0f){
                shoot();
                reload = reloadTime;
            }else{
                reload = Math.max(reload - edelta() * timeScale(), 0f);
            }
        }

        public boolean shooting(){
            return hasAmmo() && hasTarget;
        }

        public boolean validateTarget(){
            return !Units.invalidateTarget(target, team, x, y, range);
        }

        public boolean hasAmmo(){
            return liquids.get(liquid) >= liquidUsed * timeScale();
        }

        public void findTarget(){
            target = Units.closestTarget(team(), x, y, range, e -> !e.dead());
            hasTarget = target != null;
        }

        public void shoot(){
            hasShot = false;

            Units.nearbyEnemies(team(), x - range, y - range, range * 2, range * 2, unit -> {
                if(unit.within(this, range) && !unit.dead()){
                    bullet.create(this, team(), unit.x, unit.y, 0f, 0f, 0f);

                    if(!hasShot){
                        effects();
                        useAmmo();

                        hasShot = true;
                    }
                }
            });
        }

        public void effects(){
            Effect shoot = shootEffect == Fx.none ? bullet.shootEffect : shootEffect;
            Effect smoke = smokeEffect == Fx.none ? bullet.smokeEffect : smokeEffect;

            for(int i = 0; i < areaEffectCount; i++){
                float x = this.x + Angles.trnsx(Mathf.random(360f), Mathf.random(range));
                float y = this.y + Angles.trnsy(Mathf.random(360f), Mathf.random(range));

                shoot.at(x, y);
                smoke.at(x, y);
            }
        }

        public BulletType useAmmo(){
            if(cheating()) return bullet;

            liquids.remove(liquid, liquidUsed);

            return bullet;
        }

        @Override
        public boolean acceptItem(Building source, Item type){
            return false;
        }

        @Override
        public boolean acceptLiquid(Building source, Liquid type, float amount) {
            return liquid == type
                && liquids.get(liquids.current()) <= liquidUsed;
        }
    }
}
