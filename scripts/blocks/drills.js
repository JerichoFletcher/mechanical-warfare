// Chemical Drill
const chemicalDrill = extendContent(Drill, "chemical-drill", {
  generateIcons: function(){
    return [
      Core.atlas.find(this.name)
    ];
  },
  load(){
    this.baseRegion = Core.atlas.find(this.name + "-base");
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.region = Core.atlas.find(this.name + "-bottom");
    this.rimRegion = Core.atlas.find(this.name + "-rim");
    this.rotatorRegion = Core.atlas.find(this.name + "-rotator");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  draw(tile){
    Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
    Draw.color(tile.entity.liquids.current().color);
    Draw.alpha(tile.entity.liquids.total() / this.liquidCapacity);
    Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
    Draw.color();
    this.super$draw(tile);
    /* const e = tile.ent();
    Draw.rect(this.bottomRegion, tile.drawx(), tile.drawy());
    Draw.color(e.liquids.current().color);
    Draw.alpha(e.liquids.total() / this.liquidCapacity);
    Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
    if(this.drawRim){
      Draw.color(this.heatColor);
      Draw.blend(Blending.additive);
      Draw.alpha(e.warmup * 0.6 * (1 - 0.3 + Mathf.absin(Time.time(), 3, 0.3)));
      Draw.rect(this.rimRegion, tile.drawx(), tile.drawy());
      Draw.blend();
    }
    Draw.color();
    Draw.rect(this.rotatorBottomRegion, tile.drawx(), tile.drawy(), e.drillTime * 2.5 * e.warmup);
    Draw.rect(this.rotatorTopRegion, tile.drawx(), tile.drawy(), e.drillTime * -4 * e.warmup);
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
    if(e.dominantItem != null && this.drawMineItem){
      Draw.color(e.dominantItem.color);
      Draw.rect("drill-top", tile.drawx(), tile.drawy(), 1);
      Draw.color();
    } */
  },
});
