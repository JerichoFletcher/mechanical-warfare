const fireAuraRange = 15 * Vars.tilesize;

/* Fire Aura effect */
const fireAuraColor = "ffaa44";
const fireAuraEffect = newEffect(40, e => {
  Draw.color(Color.valueOf(fireAuraColor), Pal.darkFlame, e.fin());
  Angles.randLenVectors(e.id, 3, 2 + e.fin() * 9, cons((x, y) => {
    Fill.circle(e.x + x, e.y + y, 0.2 + e.fslope() * 1.5);
  }));
});

/* Aura bullet */
const fireAuraBullet = extend(BulletType, {});
fireAuraBullet.bulletSprite = Core.atlas.find("clear");
fireAuraBullet.speed = 0.001;
fireAuraBullet.damage = 0;
fireAuraBullet.splashDamage = 20;
fireAuraBullet.splashDamageRadius = fireAuraRange;
fireAuraBullet.status = StatusEffects.melting;
fireAuraBullet.instantDisappear = true;

/* Fire Aura */
const fireAura = extendContent(Turret, "fire-aura", {
  load(){
    this.super$load();
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  update(tile){
    var entity = tile.ent();
    if (!this.validateTarget(tile)){
      entity.target = null;
    }
    entity.recoil = 0;
    entity.heat = Mathf.lerpDelta(entity.heat,
      this.validateTarget(tile) ? 1 : 0,
      this.validateTarget(tile) ? this.warmup : this.cooldown
    );
    if (this.hasAmmo(tile)){
      if (entity.timer.get(this.timerTarget, this.targetInterval)){
        this.findTarget(tile);
      }
      if (this.validateTarget(tile)){
        if (entity.rotation == null){
          entity.rotation = 0;
        }
        this.updateShooting(tile);
      }
    }
  },
  drawLayer(tile){
    this.super$drawLayer(tile);
    Draw.color(entity.liquids.current().color);
    Draw.alpha(entity.liquids.total() / this.liquidCapacity);
    Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
    Draw.color();
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
  shoot(tile, type){
    Calls.createBullet(type, tile.getTeam(), tile.drawx(), tile.drawy(), Mathf.random(360), 1, 1);
    this.effects(tile);
    this.effectsArea(tile, this.effectAreaCount);
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
  effectsArea(tile, i){
    var shootEffect = this.shootEffect == Fx.none ? (this.peekAmmo(tile)).shootEffect : this.shootEffect;
    var entity = tile.ent();
    for (var j = 0; j < i; j++){
      Effects.effect(shootEffect,
        tile.drawx() + Angles.trnsx(Mathf.random(360), Mathf.random(this.range)),
        tile.drawy() + Angles.trnsy(Mathf.random(360), Mathf.random(this.range)),
        entity.rotation
      );
    }
  },
  useAmmo: function(tile){
    var entity = tile.ent();
    if (tile.isEnemyCheat()){
      return this.shootType;
    }
    var type = this.shootType;
    entity.cons.trigger();
    return type;
  },
  peekAmmo: function(tile){
    return this.shootType;
  },
  hasAmmo: function(tile){
    var entity = tile.ent();
    return entity.cons.valid();
  },
  setStats(){
    this.super$setStats();
    this.stats.add(BlockStat.damage, this.shootType.damage, StatUnit.none);
  },
  shouldTurn: function(tile){
    return false;
  },
  baseReloadSpeed(tile){
    return tile.isEnemyCheat() ? 1 : tile.entity.power.status;
  },
});
fireAura.reload = 5;
fireAura.shootType = fireAuraBullet;
fireAura.range = fireAuraRange;
fireAura.effectAreaCount = 10;
fireAura.hasPower = true;
fireAura.hasLiquids = true;
fireAura.liquidCapacity = 20;
fireAura.shootEffect = fireAuraEffect;
fireAura.smokeEffect = Fx.fireSmoke;
fireAura.ammoUseEffect = Fx.none;
fireAura.targetInterval = 5;
fireAura.warmup = 0.08;
