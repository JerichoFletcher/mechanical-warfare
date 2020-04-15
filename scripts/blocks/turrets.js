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
  shouldTurn: function(tile){
    return false;
  },
});

// Quake
const quake = extendContent(ArtilleryTurret, "quake", {
  
});
