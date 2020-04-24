// Fire Aura effect
const fireAuraColor = "ffaa44";
const fireAuraEffect = newEffect(40, e => {
  Draw.color(Color.valueOf(fireAuraColor));
  Lines.stroke(e.fout() * 3);
  Lines.circle(e.x, e.y, e.fin() * 50);
});

// Fire Aura bullet
const fireAuraBullet = extend(BulletType, {});
fireAuraBullet.bulletSprite = Core.atlas.find("clear");
fireAuraBullet.speed = 0.001;
fireAuraBullet.lifetime = 1;
fireAuraBullet.instantDisappear = true;

// Fire Aura
const fireAura = extendContent(LiquidTurret, "fire-aura", {
  load(tile){
    this.region = Core.atlas.find(this.name);
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  drawLayer(tile){
    this.super$drawLayer(tile);
    Draw.color(tile.entity.liquids.current().color);
    Draw.alpha(tile.entity.liquids.total() / this.liquidCapacity);
    Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
    Draw.color();
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
});
