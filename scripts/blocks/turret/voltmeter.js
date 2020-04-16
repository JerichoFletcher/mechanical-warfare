var boltrotspeed = [16, 12, 18, 15, 24, 20];
//var warmup = 0;
const voltmeter = extendContent(PowerTurret, "voltmeter", {
  update(tile){
    this.super$update(tile);
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
    var f = (1.8 + Mathf.absin(Time.time(), 1, 0.4)) * Vars.tilesize;
    Draw.rect(Core.atlas.find(this.name + "-top"), tile.drawx(), tile.drawy(), f, f);
    for (i = 1; i <= 6; i++){
      var j = i - 1;
      var s = this.name + "-bolt" + i;
      Draw.mixcol(Color.white, Mathf.absin(Time.time(), boltrotspeed[j] * 0.1, 0.5));
      Draw.alpha(0.9 + Mathf.absin(Time.time(), boltrotspeed[j] * 0.1, 0.1));
      Draw.blend(Blending.additive);
      Draw.rect(Core.atlas.find(s), tile.drawx(), tile.drawy(), Time.time() * boltrotspeed[j]);
      Draw.blend();
      Draw.reset();
    }
  },
});
