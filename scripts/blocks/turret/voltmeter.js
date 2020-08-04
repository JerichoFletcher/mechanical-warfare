const voltmeter = extendContent(PowerTurret, "voltmeter", {
  load(){
    this.super$load();
    this.layer2 = Layer.power;
  },
  update(tile){
    var entity = tile.ent()
    if (!this.validateTarget(tile)){
      entity.target = null;
    }
	entity.heat = Mathf.lerpDelta(entity.heat, entity.cons.valid() ? this.baseHeat : 0, this.cooldown);
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
          entity.heat = Mathf.lerpDelta(entity.heat, 1, this.boltWarmup * entity.efficiency());
          this.updateShooting(tile);
        }
      }
    }
  },
  shoot(tile, type){
    var entity = tile.ent();
    var targetRot = entity.angleTo(entity.target);
    for (var i = 0; i < this.shots; i++){
      Bullet.create(type, tile.entity, tile.getTeam(), tile.drawx(), tile.drawy(), targetRot, 1, 1);
    }
    this.effects(tile);
    this.useAmmo(tile);
  },
  drawLayer(tile){
    this.super$drawLayer(tile);
  },
  drawLayer2(tile){
    var entity = tile.ent();
    var heat = entity.heat;
    
    // lamps
    if (entity.efficiency() > 0){
      Draw.mixcol(Pal.lancerLaser, 1);
      for (var i = 1; i <= 3; i++){
        var n = 4 - i;
        var period = this.lampPeriod * entity.efficiency();
        var current = Mathf.absin(Time.time() + i * period * 2 * Mathf.PI / 3, period, entity.efficiency());
        Draw.alpha(current);
        Draw.rect(Core.atlas.find(this.name + "-lamp" + n), tile.drawx(), tile.drawy());
      }
      Draw.mixcol();
      Draw.reset();
    }
    
    // top region
    if (heat >= 0.11){
      var f = ((2 + Mathf.absin(Time.time(), 2, 0.6)) * Vars.tilesize) * (heat - 0.1);
      Draw.rect(Core.atlas.find(this.name + "-top"), tile.drawx(), tile.drawy(), f, f);
      Draw.reset();
    }
    
    // bolts
    Draw.blend(Blending.additive);
    for (var i = 1; i <= 6; i++){
      if (Mathf.randomSeed(Mathf.round(Time.time() + entity.id + i)) > heat){continue;}
      var j = i - 1;
      var rawrot = Time.time() * this.boltrotspeed[j] * this.boltrotdir[j];
      var truerot =
        rawrot > 0 ?
          (rawrot % 360)
        :
          (360 + (rawrot % 360));
      Draw.mixcol(Color.white, Mathf.absin(Time.time(), this.boltrotspeed[j] * 0.1, 0.5));
      Draw.alpha(0.9 + Mathf.absin(Time.time(), this.boltrotspeed[j] * 0.1, 0.1));
      Draw.rect(Core.atlas.find(this.name + "-bolt" + i), tile.drawx(), tile.drawy(), truerot);
      Draw.mixcol();
      Draw.color();
    }
    
    Draw.blend();
    Draw.reset();
  },
  shouldIdleSound: function(tile){
    var entity = tile.ent();
    return tile != null && entity.cons.valid() && !this.shouldActiveSound(tile);
  },
  shouldActiveSound: function(tile){
    var entity = tile.ent();
    return tile != null && entity.heat > 0.5;
  },
});
voltmeter.boltrotspeed = [16, 12, 36, 30, 24, 20];
voltmeter.boltrotdir = [1, -1, -1, 1, 1, -1];
voltmeter.boltWarmup = 0.07;
voltmeter.baseHeat = 0.1;
voltmeter.lampPeriod = 4;
