const boltrotspeed = [8, 6, 18, 15, 12, 10];
const boltrotdir = [1, -1, -1, 1, 1, -1];
const boltWarmup = 0.05;
const lampPeriod = 2;
//var warmup = 0;
const voltmeter = extendContent(PowerTurret, "voltmeter", {
  load(){
    this.super$load();
  },
  update(tile){
    this.super$update(tile);
    var entity = tile.ent()
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
        if (entity.rotation == null){
          entity.rotation = 0;
        }
        if (entity.cons.valid()){
          entity.heat = Mathf.lerpDelta(entity.heat, 1, boltWarmup);
        }
      }
    }
  },
  shoot(tile, type){
    var entity = tile.ent();
    var result = Predict.intercept(entity, entity.target, type.speed);
    if (result.isZero()){
      result.set(entity.target.getX(), entity.target.getY());
    }
    const targetRot = result.sub(tile.drawx(), tile.drawy()).angle();
    Calls.createBullet(type, tile.getTeam(), tile.drawx(), tile.drawy(), targetRot, 1, 1);
    this.effects(tile);
    this.useAmmo(tile);
  },
  drawLayer(tile){
    this.super$drawLayer(tile);
    var entity = tile.ent();
    var heat = entity.heat;
    // lamps
    if (entity.cons.valid()){
      for (var i = 1; i <= 3; i++){
        var current = Mathf.absin(Time.time() + i * 2 * Mathf.PI / 3, 1.5, 1);
        Draw.alpha(current);
        Draw.rect(Core.atlas.find(this.name + "-lamp" + i), tile.drawx(), tile.drawy());
        Draw.reset();
      }
    }
    
    // top region
    var f = ((2 + Mathf.absin(Time.time(), 2, 0.5)) * Vars.tilesize) * heat;
    Draw.rect(Core.atlas.find(this.name + "-top"), tile.drawx(), tile.drawy(), f, f);
    Draw.reset();
    
    // bolts
    Draw.blend(Blending.additive);
    for (var i = 1; i <= 6; i++){
      if (!Mathf.randomBoolean(Mathf.pow(heat, 2))){continue;}
      var j = i - 1;
      var rawrot = Time.time() * boltrotspeed[j] * boltrotdir[j];
      var truerot =
        rawrot > 0 ?
          (rawrot % 360)
        :
          (360 + (rawrot % 360));
      Draw.mixcol(Color.white, Mathf.absin(Time.time(), boltrotspeed[j] * 0.1, 0.5));
      Draw.alpha(0.9 + Mathf.absin(Time.time(), boltrotspeed[j] * 0.1, 0.1));
      Draw.rect(Core.atlas.find(this.name + "-bolt" + i), tile.drawx(), tile.drawy(), truerot);
      Draw.mixcol();
      Draw.color();
    }
    Draw.blend();
    Draw.reset();
  },
});
