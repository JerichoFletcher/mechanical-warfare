const fireAuraRange = 15 * Vars.tilesize;
const fireAuraWarmup = 0.08;

/* Fire Aura effect */
const fireAuraColor = "ffaa44";
const fireAuraEffect = newEffect(40, e => {
  Draw.color(Color.valueOf(fireAuraColor), Pal.darkFlame, e.fin());
  Angles.randLenVectors(e.id, 3, 2 + e.fin() * 9, cons((x, y) => {
    Fill.circle(e.x + x, e.y + y, 0.2 + e.fslope() * 1.5);
  }));
});

/* Aura bullet */
/*const fireAuraBullet = extend(BulletType, {});
fireAuraBullet.bulletSprite = Core.atlas.find("clear");
fireAuraBullet.speed = 0.001;
fireAuraBullet.damage = 0;
fireAuraBullet.splashDamage = 20;
fireAuraBullet.splashDamageRadius = fireAuraRange;
fireAuraBullet.status = StatusEffects.melting;
fireAuraBullet.instantDisappear = true;*/

/* Fire Aura */
const fireAura = extendContent(LiquidTurret, "fire-aura", {
  load(){
    this.region = Core.atlas.find(this.name);
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
      this.validateTarget(tile) ? fireAuraWarmup : this.cooldown
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
    var entity = tile.ent();
    Draw.color(entity.liquids.current().color);
    Draw.alpha(entity.liquids.total() / this.liquidCapacity);
    Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
    Draw.color();
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
  shoot(tile, type){
    Calls.createBullet(type, tile.getTeam(), tile.drawx(), tile.drawy(), Mathf.random(360), 1, 1);
    this.effects(tile);
    this.effectsArea(tile, 10);
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
  shouldTurn: function(tile){
    return false;
  },
  shouldActiveSound: function(tile){
    //return this.hasAmmo(tile) && this.validateTarget(tile);
    return false;
  },
});
fireAura.reload = 5;
fireAura.range = fireAuraRange;
fireAura.shootEffect = fireAuraEffect;
fireAura.smokeEffect = Fx.fireSmoke;
