// Chemical Drill
const chemicalDrill = extendContent(Drill, "chemical-drill", {
  load(){
    this.baseRegion = Core.atlas.find(this.name + "-base");
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.region = Core.atlas.find(this.name + "-bottom");
    this.rimRegion = Core.atlas.find(this.name + "-rim");
    this.rotatorRegion = Core.atlas.find(this.name + "-rotator");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  generateIcons: function(){
    return [
      Core.atlas.find(this.name + "-base"),
      Core.atlas.find(this.name + "-bottom"),
      Core.atlas.find(this.name + "-rotator"),
      Core.atlas.find(this.name + "-top")
    ];
  },
  draw(tile){
    Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
    Draw.color(tile.entity.liquids.current().color);
    Draw.alpha(tile.entity.liquids.total() / this.liquidCapacity);
    Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
    Draw.color();
    this.super$draw(tile);
  },
});

Vars.content.blocks().each(boolf(b => b instanceof Drill), cons(b => {
  b.countOre = function(tile){
    b.returnItem = null;
    b.returnCount = 0;
    b.oreCount.clear();
    b.itemArray.clear();
    tile.getLinkedTilesAs(b, b.tempTiles).each(cons(other => {
      if(b.isValid(other)){
        b.oreCount.getAndIncrement(b.getDrop(other), 0, 1);
      }
    }));
    b.oreCount.keys().toArray().each(cons(item => {
      b.itemArray.add(item);
    }));
    const stone = Vars.content.getByName(ContentType.item, modName + "-cobblestone");
    b.itemArray.sort((item1, item2) => {
      var type = Boolean.compare(item1 != Items.sand || item1 != stone, item2 != Items.sand || item2 != stone);
      if(type != 0){return type;}
      var amounts = Integer.compare(b.oreCount.get(item1, 0), b.oreCount.get(item2, 0));
      if(amounts != 0){return amounts;}
      return Integer.compare(item1.id, item2.id);
    });
    if(b.itemArray.size == 0){
      return;
    }
    b.returnItem = b.itemArray.peek();
    b.returnCount = b.oreCount.get(b.itemArray.peek(), 0);
  }
});
