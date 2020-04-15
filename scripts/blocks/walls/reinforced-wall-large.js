health = 5120;
const mendPower = health / 15;
const mendTimer = 90;
const reinforcedWallLarge = extendContent(SurgeWall, "reinforced-wall-large", {
  update(tile){
    if (tile.entity.health() < tile.entity.maxHealth() & tile.entity.timer.get(0, mendTimer)) {
      tile.entity.healBy(mendPower);
      Effects.effect(Fx.healBlockFull, Tmp.c1.set(Color.valueOf("efefff")), tile.drawx(), tile.drawy(), tile.block().size);
    }
  }
});
