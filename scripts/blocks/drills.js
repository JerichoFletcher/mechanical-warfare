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
    if(this.drawRim){
      Draw.color(this.heatColor);
      Draw.blend(Blending.additive);
      Draw.alpha(tile.entity.warmup * 0.6 * (1 - 0.3 + Mathf.absin(Time.time(), 3, 0.3)));
      Draw.rect(Core.atlas.find(this.name + "-rim"), tile.drawx(), tile.drawy());
      Draw.blend();
    }
    Draw.color();
    Draw.rect(Core.atlas.find(this.name + "-rotator-bottom"), tile.drawx(), tile.drawy(), tile.entity.drillTime * 2.5);
    Draw.rect(Core.atlas.find(this.name + "-rotator-top"), tile.drawx(), tile.drawy(), tile.entity.drillTime * -4);
    Draw.rect(Core.atlas.find(this.name + "-top"), tile.drawx(), tile.drawy());
    if(tile.entity.dominantItem != null && this.drawMineItem){
      Draw.color(tile.entity.dominantItem.color);
      Draw.rect("drill-top", tile.drawx(), tile.drawy(), 1);
      Draw.color();
    }
  },
});
