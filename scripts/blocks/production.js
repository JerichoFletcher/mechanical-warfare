// Chemical Station
const chemicalStation = extendContent(GenericCrafter, "chemical-station", {
  generateIcons: function(){
    return [
      Core.atlas.find(this.name)
    ];
  },
  draw(tile){
    Draw.rect(Core.atlas.find(this.name + "-bottom"), tile.drawx(), tile.drawy());
    // Draw.color(tile.entity.liquids.current().color);
    // Draw.alpha(tile.entity.liquids.total() / this.liquidCapacity);
    Draw.color(this.outputLiquid.liquid.color);
    Draw.alpha(this.outputLiquid.amount / this.liquidCapacity);
    Draw.rect(Core.atlas.find(this.name + "-liquid"), tile.drawx(), tile.drawy());
    Draw.color();
    Draw.rect(Core.atlas.find(this.name + "-top"), tile.drawx(), tile.drawy());
  },
});
