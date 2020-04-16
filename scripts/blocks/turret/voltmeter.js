const boltrotspeed = [8, 6, 18, 15, 24, 20];
const boltCooldown = 0.05;
//var warmup = 0;
const voltmeter = extendContent(PowerTurret, "voltmeter", {
  load(){
    this.super$load();
  },
  update(tile){
    this.super$update(tile);
    var entity = tile.ent();
    if (entity.boltWarmup == null) {
      entity.boltWarmup = entity.power.status;
    }else{
      entity.boltWarmup = Mathf.lerpDelta(entity.boltWarmup, entity.power.status, boltCooldown);
    }
  },
  shoot(tile, type){
    var entity = tile.ent();
    var result = Predict.intercept(entity, entity.target, type.speed);
    if (result.isZero()){
      result.set(entity.target.getX(), entity.target.getY());
    }
    var targetRot = result.sub(tile.drawx(), tile.drawy()).angle();
    entity.heat = 1;
    Calls.createBullet(type, tile.getTeam(), tile.drawx(), tile.drawy(), targetRot, 1, 1);
    this.effects(tile);
    this.useAmmo(tile);
  },
  drawLayer(tile){
    this.super$drawLayer(tile);
    var entity = tile.ent();
    var f = (2 + Mathf.absin(Time.time(), 2, 0.5)) * Vars.tilesize;
    Draw.alpha(entity.boltWarmup);
    Draw.rect(Core.atlas.find(this.name + "-top"), tile.drawx(), tile.drawy(), f, f);
    Draw.reset();
    for (i = 1; i <= 6; i++){
      var j = i - 1;
      var s = this.name + "-bolt" + i;
      var sign =
        i > 4 ?
          (i % 2 == 0 ? 1 : -1)
        :
          (i > 2 ? -1 : 1);
      Draw.mixcol(Color.white, Mathf.absin(Time.time(), boltrotspeed[j] * 0.1, 0.5));
      Draw.alpha(entity.boltWarmup * (0.9 + Mathf.absin(Time.time(), boltrotspeed[j] * 0.1, 0.1)));
      Draw.blend(Blending.additive);
      Draw.rect(Core.atlas.find(s), tile.drawx(), tile.drawy(), Time.time() * boltrotspeed[j] * sign);
      Draw.blend();
      Draw.reset();
    }
  },
});
