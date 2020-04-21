const warmup = 0.06;
const rayScale = 0.9;
const heatRay = extendContent(PowerTurret, "heat-ray", {
  load(){
    this.super$load();
    this.beamRegion = Core.atlas.find(this.name + "-beam");
    this.beamEndRegion = Core.atlas.find(this.name + "-beam-end");
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
    this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2, Mathf.range(this.xRand));
    this.bullet(tile, type, entity.rotation);
    this.effects(tile);
    this.useAmmo(tile);
  },
  bullet(tile, type, angle){
    var entity = tile.ent();
    var tx = tile.drawx();
    var ty = tile.drawy();
    var ex = entity.target.getX();
    var ey = entity.target.getY();
    var rot = Mathf.angle(ex - tx, ey - ty);
    Calls.createBullet(type, tile.getTeam(), entity.target.getX(), entity.target.getY(), 0, 1, 1);
    Draw.color(Color.lightGray, Color.white, 1 - Mathf.absin(Time.time(), 0.5, 0.3));
    var vec = new Vec2();
    vec.trns(rot, 8 * rayScale * Draw.scl);
    Draw.rect(this.beamEndRegion, tx, ty, this.beamEndRegion.getWidth() * rayScale * Draw.scl, this.beamEndRegion.getHeight() * rayScale * Draw.scl, rot + 180);
    Draw.rect(this.beamEndRegion, ex, ey, this.beamEndRegion.getWidth() * rayScale * Draw.scl, this.beamEndRegion.getHeight() * rayScale * Draw.scl, rot);
    Lines.stroke(12 * rayScale);
    Lines.precise(true);
    Lines.line(this.beamRegion, tx + vec.x, ty + vec.y, ex - vec.x, ey - vec.y, CapStyle.none, 0);
    Lines.precise(false);
    Lines.stroke(1);
    Vars.renderer.lights.line(tx, ty, ex, ey);
    Draw.color();
  },
});
