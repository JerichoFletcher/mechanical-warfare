// Reinforced Wall
const reinforced-wall = extendContent(Wall, "reinforced-wall",{
  health = 1280
  const mendPower = health / 15
  const mendTimer = 30
  update(tile){
    if(tile.entity.health() < tile.entity.maxHealth() & tile.entity.timer.get(0, mendTimer)){
      tile.entity.healBy(mendPower);
    }
  }
});
