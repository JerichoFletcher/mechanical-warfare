// Fire Aura effect
const fireAuraColor = "ffaa44";
const fireAuraEffect = newEffect(40, e => {
  Draw.color(Color.valueOf(fireAuraColor));
  Lines.stroke(e.fout() * 3);
  Lines.circle(e.x, e.y, e.fin() * 50);
});

// Fire Aura
const fireAura = extendContent(LiquidTurret, "fire-aura", {
  load(tile){
    this.region = Core.atlas.find(this.name);
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  drawLayer(tile){
    this.super$drawLayer(tile);
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
});
