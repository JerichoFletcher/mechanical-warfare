const elib = require("effectlib");
const plib = require("plib");

const seismHE = extend(BasicBulletType, {
  update(b){
    this.super$update(b);
    if(Mathf.chance(0.75)){
      Effects.effect(this.trailEffect, b.x, b.y, b.rot());
    }
  },
  /*hit(b, x, y){
    if(typeof(x) !== "undefined" && typeof(y) !== "undefined"){
      this.super$hit(b, x, y);
    }else{
      this.super$hit(b);
    }
    Effects.effect(this.hitEffect, b.x, b.y, b.rot());
  }*/
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
// Trail effect
seismHE.trailEffect = newEffect(30, e => {
  elib.fillCircle(e.x, e.y, seismHE.frontColor, 1, Mathf.lerp(2, 0.2, e.fin()));
});
// Hit effect
seismHE.hitEffect = newEffect(18, e => {
  var c1Thickness = 6 * e.fout();
  var c1Radius = Mathf.lerp(3, 60, e.fin());
  elib.outlineCircle(e.x, e.y, Pal.missileYellow, c1Thickness, c1Radius);
  
  var c2Alpha = 0.3 + e.fin() * 0.7;
  var c2Radius = Mathf.lerp(60, 0.5, e.fin());
  elib.fillCircle(e.x, e.y, Pal.missileYellowBack, c2Alpha, c2Radius);
  
  var sAlpha = 0.3 + e.fout() * 0.7;
  var sRadius = Mathf.lerp(2, 0.5, e.fin());
  Angles.randLenVectors(e.id, 10, Mathf.lerp(20, 60, e.finpow()), new Floatc2(){get: (a, b) => {
    elib.fillCircle(e.x + a, e.y + b, Color.gray, sAlpha, sRadius);
  }});
  
  var lThickness = e.fout() * 3;
  var lDistance = Mathf.lerp(20, 120, e.finpow());
  var lLength = Mathf.lerp(14, 1, e.fin());
  var lCount = 15;
  elib.splashLines(e.x, e.y, Pal.missileYellow, lThickness, lDistance, lLength, lCount, e.id);
});
seismHE.despawnEffect = seismHE.hitEffect;

const seismAP = extend(BasicBulletType, {
  update(b){
    this.super$update(b);
    if(Mathf.chance(0.75)){
      Effects.effect(this.trailEffect, b.x, b.y, b.rot());
    }
  },
});
seismAP.damage = 2550;
seismAP.splashDamage = 120;
seismAP.splashDamageRadius = 20;
seismAP.speed = 12;
seismAP.lifetime = 40;
seismAP.knockback = 8;
seismAP.bulletWidth = 20;
seismAP.bulletHeight = 26;
seismAP.frontColor = plib.frontColorAP;
seismAP.backColor = plib.backColorAP;
seismAP.ammoMultiplier = 4;
seismAP.reloadMultiplier = 1.2;
seismAP.hitSound = Sounds.boom;
// Trail effect
seismAP.trailEffect = newEffect(30, e => {
  elib.fillCircle(e.x, e.y, seismAP.frontColor, 1, Mathf.lerp(2, 0.2, e.fin()));
});
seismAP.hitEffect = Fx.blastExplosion;
seismAP.despawnEffect = seismAP.hitEffect;

const seism = extendContent(ArtilleryTurret, "seism", {
  load(){
    this.super$load();
  },
  init(){
    seism.ammo(
      Vars.content.getByName(ContentType.item, modName + "-he-shell"), seismHE,
      Vars.content.getByName(ContentType.item, modName + "-ap-shell"), seismAP
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
