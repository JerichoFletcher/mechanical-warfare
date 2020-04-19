// Chemical Station
const chemicalStation = extendContent(GenericCrafter, "chemical-station", {
  load(){
    this.region = Core.atlas.find(this.name);
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  generateIcons: function(){
    return [
      Core.atlas.find(this.name),
      Core.atlas.find(this.name + "-top")
    ];
  },
  draw(tile){
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.color(this.outputLiquid.liquid.color);
    Draw.alpha(tile.entity.liquids.get(this.outputLiquid.liquid) / this.liquidCapacity);
    Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
    Draw.color();
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
});

// Stone Centrifuge
const stoneCentrifuge = extendContent(GenericCrafter, "stone-centrifuge", {
  load(){
    this.region = Core.atlas.find(this.name)
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  generateIcons: function(){
    return [
      Core.atlas.find(this.name),
      Core.atlas.find(this.name + "-top")
    ];
  },
  draw(tile){
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.color(tile.entity.liquids.current().color);
    Draw.alpha(tile.entity.liquids.total() / this.liquidCapacity);
    Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
    Draw.color();
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
});

// Stone Grinder
const stoneGrinder = extendContent(GenericCrafter, "stone-grinder", {
  load(){
    this.bottomRegion = Core.atlas.find(this.name + "-bottom");
    this.rightRotatorRegion = Core.atlas.find(this.name + "-rotator1");
    this.leftRotatorRegion = Core.atlas.find(this.name + "-rotator2");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  generateIcons: function(){
    return [
      Core.atlas.find(this.name)
    ];
  },
  draw(tile){
    Draw.rect(this.bottomRegion, tile.drawx(), tile.drawy());
    Draw.rect(this.rightRotatorRegion, tile.drawx() + 11, tile.drawy() + 11, tile.entity.totalProgress * 2);
    Draw.rect(this.leftRotatorRegion, tile.drawx() - 10, tile.drawy() - 10, tile.entity.totalProgress * -2);
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
});
