const elib = require("effectlib");
const plib = require("plib");
const seismHE = extend(BasicBulletType, {
  update(b){
    this.super$update(b);
    if(Mathf.chance(0.75)){
      Effects.effect(this.trailEffect, b.x, b.y, b.rot());
    }
  },
  hit(b, x, y){
    if(typeof(x) !== "undefined" && typeof(y) !== "undefined"){
      this.super$hit(b, x, y);
    }
    Effects.effect(this.hitEffect, b.x, b.y, b.rot());
  }
});
seismHE.damage = 270;
seismHE.splashDamage = 560;
seismHE.splashDamageRadius = 40;
seismHE.speed = 12;
seismHE.lifetime = 40;
seismHE.knockback = 4;
seismHE.bulletWidth = 20;
seismHE.bulletHeight = 26;
seismHE.frontColor = plib.frontColorHE;
seismHE.backColor = plib.backColorHE;
seismHE.ammoMultiplier = 4;
seismHE.hitSound = Sounds.boom;
seismHE.trailEffect = newEffect(30, e => {
  elib.fillCircle(e.x, e.y, seismHE.frontColor, 1, Mathf.lerp(2, 0.5, e.fin()));
});
seismHE.hitEffect = newEffect(27, e => {
  elib.outlineCircle(e.x, e.y, Pal.missileYellow, 6 * e.fout(), Mathf.lerp(3, 60, e.fin()));
  elib.fillCircle(e.x, e.y, Pal.missileYellowBack, 0.3 + e.fin() * 0.7, Mathf.lerp(65, 0.5, e.fout()));
  elib.splashLines(e.x, e.y, Pal.missileYellow, e.fout() * 3, Mathf.lerp(20, 120, e.finpow()), Mathf.lerp(14, 1, e.fin()), 15, e.id);
});

const seism = extendContent(ArtilleryTurret, "seism", {
  load(){
    this.super$load();
  },
  init(){
    seism.ammo(
      Vars.content.getByName(ContentType.item, modName + "-he-shell"), seismHE
    );
    this.super$init();
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
