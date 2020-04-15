health = 1280;
const mendPower = health / 15;
const mendTimer = 90
const reinforcedWall = extendContent(SurgeWall, "reinforced-wall", {
  update(tile) {
    if (tile.entity.health() < tile.entity.maxHealth() & tile.entity.timer.get(0, mendTimer)) {
      tile.entity.healBy(mendPower);
      Effects.effect(Fx.healBlockFull, Tmp.c1.set(Color.valueOf("efefff")), tile.drawx(), tile.drawy(), tile.block().size);
    }
  }
});
