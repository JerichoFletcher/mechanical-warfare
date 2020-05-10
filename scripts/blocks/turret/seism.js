const seism = extendContent(ArtilleryTurret, "seism", {
  load(){
    this.super$load();
  },
  drawLayer(tile){
    this.super$drawLayer(tile);
    var entity = tile.ent();
    var val = entity.totalAmmo / this.maxAmmo;
    for(var i = 0; i <= 2; i++){
      var j = i + 1;
      var lo = i / 3;
      var hi = j / 3;
      Draw.color(Pal.lancerLaser);
      Draw.alpha((Mathf.clamp(val, lo, hi) - lo) * 3);
      Draw.rect(Core.atlas.find(this.name + "-phase" + i), tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
      Draw.color();
    }
  }
});
