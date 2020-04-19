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
    const entity = tile.ent();
    const f = Vars.tilesize;
    Draw.rect(this.bottomRegion, tile.drawx(), tile.drawy());
    Draw.rect(this.rightRotatorRegion, tile.drawx() + 22 / f, tile.drawy() - 22 / f, entity.totalProgress * 2 * entity.warmup);
    Draw.rect(this.leftRotatorRegion, tile.drawx() - 20 / f, tile.drawy() + 20 / f, entity.totalProgress * -2 * entity.warmup);
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
});
