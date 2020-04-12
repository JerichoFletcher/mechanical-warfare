// Aegis
const aegis = extendContent(ItemTurret, "aegis", {
  load(){
    this.super$load();
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  drawLayer(tile){
    this.super$drawLayer(tile);
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
});
