// Aegis
const aegis = extendContent(ItemTurret, "aegis", {
  generateIcons: function(){
    return [
      Core.atlas.find(this.name + "-icon")
    ];
  },
  load(){
    this.super$load();
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  drawLayer(tile){
    this.super$drawLayer(tile);
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
});

// Blow
const blow = extendContent(DoubleTurret, "blow", {
  generateIcons: function(){
    return [
      Core.atlas.find(this.name + "-icon")
    ];
  },
});

// Nighthawk
const nighthawk = extendContent(ItemTurret, "nighthawk", {
  generateIcons: function(){
    return [
      Core.atlas.find(this.name + "-icon")
    ];
  },
});

// Quake
const quake = extendContent(ArtilleryTurret, "quake", {
  generateIcons: function(){
    return [
      Core.atlas.find(this.name + "-icon")
    ];
  },
});
