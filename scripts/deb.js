const debugBlock = extendContent(Drill, "debug", {
  init(){
    Vars.content.blocks().each(boolf(b => b.entityType instanceof Drill.DrillEntity), cons(b => {
      print(b.name + " override start");
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
        if(stone === undefined){
          print("stone is undefined");
        }
        b.itemArray.sort((item1, item2) => {
          var type = Boolean.compare(item1 != Items.sand || item1 != stone, item2 != Items.sand || item2 != stone);
          if(type != 0){return type;}
          var amounts = Integer.compare(b.oreCount.get(item1, 0), b.oreCount.get(item2, 0));
          if(amounts != 0){return amounts;}
          return Integer.compare(item1.id, item2.id);
        });
        if(b.itemArray.size == 0){return;}
        b.returnItem = b.itemArray.peek();
        b.returnCount = b.oreCount.get(b.itemArray.peek(), 0);
      }
      print(b.name + " override end");
    }));
  }
});
//debugBlock.buildVisibility = BuildVisibility.hidden;
debugBlock.alwaysUnlocked = false;
debugBlock.category = Category.production;
