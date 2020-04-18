// Upsylon
const upsylon = new Mech("upsylon-mech", false){
  updateAlt(Player player){
    player.healBy(Time.delta() * 0.1)
  }
};
