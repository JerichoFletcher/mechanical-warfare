const boltrotspeed = [8, 6, 18, 15, 24, 20];
const boltrotdir = [1, -1, -1, 1, 1, -1];
const boltCooldown = 0.05;
//var warmup = 0;
const voltmeter = extendContent(PowerTurret, "voltmeter", {
  shoot(tile, type){
    const entity = tile.ent();
    var result = Predict.intercept(entity, entity.target, type.speed);
    if (result.isZero()){
      result.set(entity.target.getX(), entity.target.getY());
    }
    const targetRot = result.sub(tile.drawx(), tile.drawy()).angle();
    entity.heat = 1;
    Calls.createBullet(type, tile.getTeam(), tile.drawx(), tile.drawy(), targetRot, 1, 1);
    this.effects(tile);
    this.useAmmo(tile);
  },
  drawLayer(tile){
    this.super$drawLayer(tile);
    const entity = tile.ent();
    const f = (2 + Mathf.absin(Time.time(), 2, 0.5)) * Vars.tilesize;
    Draw.alpha(entity.power.status);
    Draw.rect(Core.atlas.find(this.name + "-top"), tile.drawx(), tile.drawy(), f, f);
    Draw.reset();
    for (i = 1; i <= 6; i++){
      const j = i - 1;
      const s = this.name + "-bolt" + i;
      Draw.mixcol(Color.white, Mathf.absin(Time.time(), boltrotspeed[j] * 0.1, 0.5));
      Draw.alpha(entity.power.status * (0.9 + Mathf.absin(Time.time(), boltrotspeed[j] * 0.1, 0.1)));
      Draw.blend(Blending.additive);
      Draw.rect(Core.atlas.find(s), tile.drawx(), tile.drawy(), Time.time() * boltrotspeed[j] * boltrotdir[j]);
      Draw.blend();
      Draw.reset();
    }
  },
});
