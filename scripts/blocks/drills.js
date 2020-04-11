// Chemical Drill
const chemicalDrill = extendContent(Drill, "chemical-drill", {
  generateIcons: function(){
    return [
      Core.atlas.find(this.name)
    ];
  },
  draw(tile){
    const e = tile.entity;
    Draw.rect(Core.atlas.find(this.name + "-bottom"), tile.drawx(), tile.drawy());
    Draw.color(e.liquids.current().color);
    Draw.alpha(e.liquids.total() / this.liquidCapacity);
    Draw.rect(Core.atlas.find(this.name + "-liquid"), tile.drawx(), tile.drawy());
    if(this.drawRim){
      Draw.color(this.heatColor);
      Draw.blend(Blending.additive);
      Draw.alpha(e.warmup * 0.6 * (1 - 0.3 + Mathf.absin(Time.time(), 3, 0.3)));
      Draw.rect(Core.atlas.find(this.name + "-rim"), tile.drawx(), tile.drawy());
      Draw.blend();
    }
    Draw.color();
    Draw.rect(Core.atlas.find(this.name + "-rotator-bottom"), tile.drawx(), tile.drawy(), e.drillTime * 2.5);
    Draw.rect(Core.atlas.find(this.name + "-rotator-top"), tile.drawx(), tile.drawy(), e.drillTime * 4);
    Draw.rect(Core.atlas.find(this.name + "-top"), tile.drawx(), tile.drawy());
    /*if(e.dominantItem != null && this.drawMineItem){
      Draw.color(e.dominantItem.color);
      Draw.rect("drill-top", tile.drawx(), tile.drawy(), 1);
      Draw.color();
    } */
  },
});
