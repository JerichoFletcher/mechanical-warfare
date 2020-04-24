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

// Omni Drill
const omniDrill = extendContent(Drill, "omni-drill", {
  load(){
    this.region = Core.atlas.find(this.name + "-bottom");
    this.rotatorLeftRegion = Core.atlas.find(this.name + "-rotator");
    this.rotatorRightRegion = Core.atlas.find(this.name + "-rotator");
    this.topRegion = Core.atlas.find(this.name + "-top");
    this.rimRegion = Core.atlas.find(this.name + "-rim")
  },
  generateIcons: function(){
    return [
      Core.atlas.find(this.name)
    ];
  },
  draw(tile){
    var entity = tile.ent();
    const s = 0.3;
    const ts = 0.6;
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.rect(this.rotatorLeftRegion, tile.drawx() - 52 / 8, tile.drawy() + Mathf.sin(entity.drillTime, 20) * entity.efficiency(), entity.timeDrilled * this.rotateSpeed);
    Draw.rect(this.rotatorRightRegion, tile.drawx() + 52 / 8, tile.drawy() + Mathf.sin(entity.drillTime, 20) * entity.efficiency(), entity.timeDrilled * this.rotateSpeed * -1);
    Draw.rect(this.topRegion);
    if(drawRim){
      Draw.color(this.heatColor);
      Draw.alpha(entity.warmup * ts * (1 - s + Mathf.absin(Time.time(), 3, s)));
      Draw.blend(Blending.additive);
      Draw.rect(this.rimRegion, tile.drawx(), tile.drawy());
      Draw.blend();
      Draw.color();
    }
    if(this.dominantItem != null && drawMineItem){
      Draw.color(this.dominantItem.color);
      Draw.rect("drill-top", tile.drawx(), tile.drawy(), 1);
      Draw.color();
    }
  }
});
