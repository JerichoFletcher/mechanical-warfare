const warmup = 0.06;
const rayScale = 0.8;
const turretLength = 6;
const heatRay = extendContent(PowerTurret, "heat-ray", {
  load(){
    this.super$load();
    this.beamRegion = Core.atlas.find(this.name + "-beam");
    this.beamEndRegion = Core.atlas.find(this.name + "-beam-end");
    this.layer2 = Layer.power;
  },
  shoot(tile, type){
    var entity = tile.ent();
    entity.heat = Mathf.lerpDelta(entity.heat, 1, warmup);
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
  },
  // draw heat laser
  drawLayer2(tile){
    var entity = tile.ent();
    if (entity.cons.valid() && entity.target != null){
      var targetPos = new Vec2(entity.target.getX(), entity.target.getY());
      var angle = targetPos.sub(tile.drawx(), tile.drawy()).angle();
      if (Angles.angleDist(entity.rotation, angle) < this.shootCone){
        Draw.color(Color.lightGray, Color.white, 1 - Mathf.absin(Time.time(), 0.6, 0.3));
        Drawf.laser(this.beamRegion, this.beamEndRegion, 
          tile.drawx() + Angles.trnsx(angle, turretLength),
          tile.drawy() + Angles.trnsy(angle, turretLength),
          entity.target.getX(), entity.target.getY(), entity.heat * rayScale * entity.power.status);
        Draw.color();
      }
    }
  },
  // only play sound when shooting
  shouldActiveSound: function(tile){
    var entity = tile.ent();
    if (tile != null && entity.target != null && entity.cons.valid()){
      var targetPos = new Vec2(entity.target.getX(), entity.target.getY());
      var angle = targetPos.sub(tile.drawx(), tile.drawy()).angle()
      return Angles.angleDist(entity.rotation, angle) < this.shootCone;
    }else{
      return false;
    }
  },
});
