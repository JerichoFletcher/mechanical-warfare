const seism = extendContent(ArtilleryTurret, "seism", {
  load(){
    this.super$load();
    this.layer2 = Layer.power;
  }
});
