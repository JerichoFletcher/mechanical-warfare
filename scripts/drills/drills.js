// Chemical Drill
const chemicalDrill = extendContent(Drill, "chemical-drill", {
  generateIcons: function(){
    return [
      Core.atlas.find(this.name)
    ];
  },
  draw(tile){
    Draw.rect(Core.atlas.find(this.name + "-bottom"), tile.drawx(), tile.drawy());
    Draw.color(tile.entity.liquids.current().color);
    Draw.alpha(tile.entity.liquids.total() / this.liquidCapacity);
    Draw.rect(Core.atlas.find(this.name + "-liquid"), tile.drawx(), tile.drawy());
    Draw.color();
    Draw.rect(Core.atlas.find(this.name + "-rotator-bottom"), tile.drawx(), tile.drawy(), tile.entity.totalProgress * 2.5);
    Draw.rect(Core.atlas.find(this.name + "-rotator-top"), tile.drawx(), tile.drawy(), tile.entity.totalProgress * -4);
    Draw.rect(Core.atlas.find(this.name + "-top"), tile.drawx(), tile.drawy());
  },
});
