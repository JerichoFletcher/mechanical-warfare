// Aegis
const aegis = extendContent(ItemTurret, "aegis", {
  /* generateIcons: function(){
    return [
      Core.atlas.find(this.name + "-icon")
    ];
  },
  load(){
    this.super$load();
    this.region = Core.atlas.find(this.name);
    this.heatRegion = Core.atlas.find(this.name + "-heat");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  drawLayer(tile){
    this.super$drawLayer(tile);
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  }, */
});

// Blow
const blow = extendContent(DoubleTurret, "blow", {
  
});

// Nighthawk
const nighthawk = extendContent(ItemTurret, "nighthawk", {
  
});

//Voltmeter
const voltmeter = extendContent(PowerTurret, "voltmeter", {
  shoot(tile, type){
    var entity = tile.ent();
    entity.heat = 1;
    Calls.createBullet(type, tile.getTeam(), tile.drawx(), tile.drawy(), this.targetRot);
    this.effects(tile);
    this.useAmmo(tile);
  },
});

// Quake
const quake = extendContent(ArtilleryTurret, "quake", {
  
});
