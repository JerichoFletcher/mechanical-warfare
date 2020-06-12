const plib = require("mechanical-warfare/plib");

const fireAuraRange = 15 * Vars.tilesize;

/* Fire Aura effect */
const fireAuraEffect = newEffect(40, e => {
  Draw.color(plib.fireAuraFlame, Pal.darkFlame, e.fin());
  Angles.randLenVectors(e.id, 3, 2 + e.fin() * 9, new Floatc2(){get: (x, y) => {
    Fill.circle(e.x + x, e.y + y, 0.2 + e.fout() * 1.5);
  }});
});

/* Aura bullet */
const fireAuraBullet = extend(BasicBulletType, {
  draw(b){}
});
fireAuraBullet.speed = 0.001;
fireAuraBullet.lifetime = 1;
fireAuraBullet.damage = 1;
fireAuraBullet.status = StatusEffects.melting;
fireAuraBullet.hitEffect = Fx.none;
fireAuraBullet.despawnEffect = Fx.none;

/* Fire Aura */
const fireAura = extendContent(PowerTurret, "fire-aura", {
  load(){
    this.super$load();
    this.region = Core.atlas.find(this.name + "-block");
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  update(tile){
    var entity = tile.ent();
    if(!this.validateTarget(tile)){
      entity.target = null;
    }
    entity.recoil = 0;
    entity.rotation = 90;
    var isShooting = this.hasAmmo(tile) && this.validateTarget(tile);
    entity.heat = Mathf.lerpDelta(entity.heat,
      isShooting ? 1 : 0,
      isShooting ? this.warmup : this.cooldown
    );
    if(this.hasAmmo(tile)){
      if(entity.timer.get(this.timerTarget, this.targetInterval)){
        this.findTarget(tile);
      }
      if(this.validateTarget(tile)){
        this.updateShooting(tile);
      }
    }
  },
  drawLayer(tile){
    this.super$drawLayer(tile);
    var entity = tile.ent();
    Draw.color(entity.liquids.current().color);
    Draw.alpha(entity.liquids.total() / this.liquidCapacity);
    Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
    Draw.color();
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
  updateShooting(tile){
    var entity = tile.ent();
    if(entity.reload >= this.reload){
      var type = this.peekAmmo(tile);
      this.shoot(tile, type);
      entity.reload = 0;
    }else{
      entity.reload += tile.entity.delta() * (this.peekAmmo(tile)).reloadMultiplier * this.baseReloadSpeed(tile);
    }
  },
  shoot(tile, type){
    var entity = tile.ent();
    var radius = this.range;
    var hasShot = false;
    Units.nearbyEnemies(tile.getTeam(), tile.drawx() - radius, tile.drawy() - radius, radius * 2, radius * 2, cons(unit => {
      if(unit.withinDst(tile.drawx(), tile.drawy(), radius)){
        if(!unit.isDead() && unit instanceof HealthTrait){
          Calls.createBullet(type, tile.getTeam(), unit.x, unit.y, 0, 1, 1);
          if(!hasShot){
            hasShot = true;
            this.effects(tile);
            this.effectsArea(tile, this.areaEffectCount);
            this.useAmmo(tile);
          }
        }
      }
    }));
  },
  effects(tile){
    var shootEffect = this.shootEffect == Fx.none ? (this.peekAmmo(tile)).shootEffect : this.shootEffect;
    var smokeEffect = this.smokeEffect == Fx.none ? (this.peekAmmo(tile)).smokeEffect : this.smokeEffect;
    var entity = tile.ent();
    Effects.effect(shootEffect, tile.drawx(), tile.drawy(), entity.rotation);
    Effects.effect(smokeEffect, tile.drawx(), tile.drawy(), entity.rotation);
    //this.shootSound.at(tile, Mathf.random(0.9, 1.1));
  },
  effectsArea(tile, count){
    var shootEffect = this.shootEffect == Fx.none ? (this.peekAmmo(tile)).shootEffect : this.shootEffect;
    var smokeEffect = this.smokeEffect == Fx.none ? (this.peekAmmo(tile)).smokeEffect : this.smokeEffect;
    var entity = tile.ent();
    for (var i = 0; i < count; i++){
      Effects.effect(shootEffect,
        tile.drawx() + Angles.trnsx(Mathf.random(360), Mathf.random(this.range)),
        tile.drawy() + Angles.trnsy(Mathf.random(360), Mathf.random(this.range)),
        entity.rotation
      );
      Effects.effect(smokeEffect,
        tile.drawx() + Angles.trnsx(Mathf.random(360), Mathf.random(this.range)),
        tile.drawy() + Angles.trnsy(Mathf.random(360), Mathf.random(this.range)),
        entity.rotation
      );
    }
  },
  findTarget(tile){
	var entity = tile.ent();
	entity.target = Units.closestEnemy(tile.getTeam(), tile.drawx(), tile.drawy(), this.range, boolf(e => !e.isDead()));
  },
  setStats(){
    this.super$setStats();
    this.stats.remove(BlockStat.booster);
    this.stats.add(BlockStat.input, new LiquidValue(this.liquidAsAmmo(), this.shootType.ammoMultiplier * 60 / this.reload, true));
  },
  useAmmo: function(tile){
    var entity = tile.ent();
    if(tile.isEnemyCheat()){
      return this.shootType;
    }
    var type = this.shootType;
    entity.liquids.remove(entity.liquids.current(), type.ammoMultiplier);
    return type;
  },
  acceptItem: function(item, tile, source){
    return false;
  },
  acceptLiquid: function(tile, source, liquid, amount){
    return this.liquidAsAmmo() == liquid || tile.entity.liquids.current() == liquid && tile.entity.liquids.get(tile.entity.liquids.current()) <= this.shootType.ammoMultiplier + 0.001;
  },
  hasAmmo: function(tile){
    var entity = tile.ent();
    return entity.cons.valid() && this.liquidAsAmmo() == entity.liquids.current() && entity.liquids.total() >= this.shootType.ammoMultiplier;
  },
  shouldActiveSound: function(tile){
    var entity = tile.ent();
    return tile != null && this.hasAmmo(tile) && this.validateTarget(tile);
  },
  shouldTurn: function(tile){
    return false;
  },
  liquidAsAmmo: function(){
    return Vars.content.getByName(ContentType.liquid, this.liquidAmmoName);
  },
});
fireAura.reload = 5;
fireAura.shootType = fireAuraBullet;
fireAura.range = fireAuraRange;
fireAura.areaEffectCount = 3;
fireAura.hasItems = false;
fireAura.hasLiquids = true;
fireAura.liquidAmmoName = "mechanical-warfare-liquid-lava"
fireAura.liquidCapacity = 60;
fireAura.shootEffect = fireAuraEffect;
fireAura.smokeEffect = Fx.fireSmoke;
fireAura.ammoUseEffect = Fx.none;
fireAura.targetInterval = 5;
fireAura.warmup = 0.08;
