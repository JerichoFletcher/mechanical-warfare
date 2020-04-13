// Chemical Station
const chemicalStation = extendContent(GenericCrafter, "chemical-station", {
  load(){
    this.bottomRegion = Core.atlas.find(this.name + "-bottom");
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  generateIcons: function(){
    return [
      Draw.rect(this.bottomRegion),
      Draw.rect(this.topRegion)
    ];
  },
  draw(tile){
    Draw.rect(this.bottomRegion, tile.drawx(), tile.drawy());
    Draw.color(this.outputLiquid.liquid.color);
    Draw.alpha(tile.entity.liquids.get(this.outputLiquid.liquid) / this.liquidCapacity);
    Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
    Draw.color();
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
});
