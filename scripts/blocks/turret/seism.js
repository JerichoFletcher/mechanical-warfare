const elib = require("effectlib");
const seismHE = extend(BasicBulletType, {
  update(b){
    this.super$update(b);
    if(Mathf.chance(0.75)){
      Effects.effect(elib.bulletTrail(30, 2, 0.5, this.frontColor), b.x, b.y, b.rot());
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
seismHE.splashDamageRadius = 80;
seismHE.speed = 12;
seismHE.lifetime = 40;
seismHE.knockback = 4;
seismHE.bulletWidth = 20;
seismHE.bulletHeight = 26;
seismHE.frontColor = Color.valueOf("ffd385");
seismHE.backColor = Color.valueOf("b6573a");
seismHE.ammoMultiplier = 4;
seismHE.hitSound = Sounds.boom;
seismHE.hitEffect = elib.quakeHit(30, Pal.missileYellow, 6, 40, 3, Pal.missileYellowBack, 45, 0.5, Pal.missileYellow, 3, 15, 20, 120, 14, 1);

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
