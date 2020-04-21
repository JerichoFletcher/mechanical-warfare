const warmup = 0.06;
const heatLaser = extend(BulletType, {
  speed: 0.001,
  damage: 5,
  hitEffect: Fx.hitMeltdown,
  despawnEffect: Fx.none,
  shootEffect: Fx.none,
  smokeEffect: Fx.none,
  lifetime: 1,
  init(b){
    Damage.damage(b.getTeam(), b.x, b.y, 1, this.damage);
  },
  draw(b){
  },
});
const heatRay = extendContent(PowerTurret, "heat-ray", {
  load(){
    this.super$load();
    this.heatLaserRegion = Core.atlas.find("mechanical-warfare-heatlaser");
    this.heatLaserEndRegion = Core.atlas.find("mechanical-warfare-heatlaser-end");
  },
  update(tile){
    var entity = tile.ent();
    if (!this.validateTarget(tile)){
      entity.target = null;
      entity.heat = Mathf.lerpDelta(entity.heat, 0, this.cooldown);
    }
    entity.recoil = 0;
    if (this.hasAmmo(tile)){
      if(entity.timer.get(this.timerTarget, this.targetInterval)){
        this.findTarget(tile);
      }
      if (this.validateTarget(tile)){
        var result = new Vec2(entity.target.getX(), entity.target.getY());
        var targetRot = result.sub(tile.drawx(), tile.drawy()).angle();
        if (entity.rotation == null){
          entity.rotation = 0;
        }
        if (this.shouldTurn(tile)){
          this.turnToTarget(tile, targetRot);
        }
        if (entity.cons.valid()){
          entity.heat = Mathf.lerpDelta(entity.heat, 1, warmup);
        }
        if (Angles.angleDist(entity.rotation, targetRot) < this.shootCone){
          this.updateShooting(tile);
        }
      }
    }
  },
  shoot(tile, type){
    var entity = tile.ent();
    var laserType = heatLaser;
    this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2, Mathf.range(this.xRand));
    this.bullet(tile, laserType, entity.rotation);
    this.effects(tile);
    this.useAmmo(tile);
  },
  bullet(tile, type, angle){
    var entity = tile.ent();
    Drawf.laser(
      this.heatLaserRegion,
      this.heatLaserEndRegion,
      tile.drawx() + this.tr.x,
      tile.drawy() + this.tr.y,
      entity.target.getX(),
      entity.target.getY()
    );
    Calls.createBullet(type, tile.getTeam(), entity.target.getX(), entity.target.getY(), 0, 1, 1);
  },
});
