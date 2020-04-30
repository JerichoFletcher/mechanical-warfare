const fireAuraRange = 15 * Vars.tilesize;

/* Fire Aura effect */
const fireAuraColor = "ffaa44";
const fireAuraEffect = newEffect(40, e => {
  Draw.color(Color.valueOf(fireAuraColor), Pal.darkFlame, e.fin());
  Angles.randLenVectors(e.id, 3, 2 + e.fin() * 9, new Floatc2(){get: (x, y) => {
    Fill.circle(e.x + x, e.y + y, 0.2 + e.fout() * 1.5);
  }});
});

/* Aura bullet */
const fireAuraBullet = extend(BasicBulletType, {});
fireAuraBullet.bulletSprite = Core.atlas.find("clear");
fireAuraBullet.speed = 0.001;
fireAuraBullet.lifetime = 1;
fireAuraBullet.damage = 1;
fireAuraBullet.status = StatusEffects.melting;
fireAuraBullet.hitEffect = Fx.none;

const fireAuraConsumer = new ConsumeLiquid(Vars.content.getByName(ContentType.liquid, modName + "-liquid-lava"), 1);
fireAuraConsumer.valid = function(entity){
  return entity != null && entity.liquids != null && entity.liquids.get(this.liquid) >= this.use(entity) && entity.target != null;
};
fireAuraConsumer.display = function(stats){};

/* Fire Aura */
const fireAura = extendContent(PowerTurret, "fire-aura", {
  load(){
    this.super$load();
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  update(tile){
    var entity = tile.ent();
    if(!this.validateTarget(tile)){
      entity.target = null;
    }
    entity.recoil = 0;
    entity.rotation = 0;
    entity.heat = Mathf.lerpDelta(entity.heat,
      this.validateTarget(tile) ? 1 : 0,
      this.validateTarget(tile) ? this.warmup : this.cooldown
    );
    if (entity.cons.valid()){
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
    Units.nearbyEnemies(tile.getTeam(), tile.drawx() - radius, tile.drawy() - radius, radius * 2, radius * 2, cons(unit => {
      if(unit.withinDst(tile.drawx(), tile.drawy(), radius)){
        if(!unit.isDead() && unit instanceof HealthTrait){
          Calls.createBullet(type, tile.getTeam(), unit.x, unit.y, 0, 1, 1);
        }
      }
    }));
    this.effects(tile);
    this.effectsArea(tile, this.areaEffectCount);
    this.useAmmo(tile);
  },
  effects(tile){
    var shootEffect = this.shootEffect == Fx.none ? (this.peekAmmo(tile)).shootEffect : this.shootEffect;
    var smokeEffect = this.smokeEffect == Fx.none ? (this.peekAmmo(tile)).smokeEffect : this.smokeEffect;
    var entity = tile.ent();
    Effects.effect(shootEffect, tile.drawx(), tile.drawy(), entity.rotation);
    Effects.effect(smokeEffect, tile.drawx(), tile.drawy(), entity.rotation);
    this.shootSound.at(tile, Mathf.random(0.9, 1.1));
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
  setStats(){
    this.super$setStats();
    this.consumes.add(fireAuraConsume);
  },
  useAmmo: function(tile){
    tile.entity.cons.trigger();
    return this.super$useAmmo(tile);
  },
  hasAmmo: function(tile){
    return tile.entity.cons.valid();
  },
  shouldTurn: function(tile){
    return false;
  },
});
fireAura.reload = 5;
fireAura.shootType = fireAuraBullet;
fireAura.range = fireAuraRange;
fireAura.areaEffectCount = 3;
fireAura.hasLiquids = true;
fireAura.liquidCapacity = 20;
fireAura.shootEffect = fireAuraEffect;
fireAura.smokeEffect = Fx.fireSmoke;
fireAura.ammoUseEffect = Fx.none;
fireAura.targetInterval = 5;
fireAura.warmup = 0.08;
