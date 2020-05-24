const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");

const quakeHE = extend(BasicBulletType, {
  draw(b){
    this.super$draw(b);
    if(Time.delta() > 0 && Mathf.chance(0.75)){
      Effects.effect(this.trailEffect, b.x, b.y, b.rot());
    }
  },
});
quakeHE.damage = 240;
quakeHE.splashDamage = 500;
quakeHE.splashDamageRadius = 40;
quakeHE.speed = 10;
quakeHE.lifetime = 40;
quakeHE.knockback = 3;
quakeHE.bulletWidth = 17;
quakeHE.bulletHeight = 22;
quakeHE.frontColor = plib.frontColorHE;
quakeHE.backColor = plib.backColorHE;
quakeHE.ammoMultiplier = 2;
quakeHE.hitSound = Sounds.boom;
// Trail effect
quakeHE.trailEffect = newEffect(27, e => {
  elib.fillCircle(e.x, e.y, quakeHE.frontColor, 1, Mathf.lerp(1.8, 0.2, e.fin()));
});
// Hit effect
quakeHE.hitEffect = newEffect(27, e => {
  e.scaled(6, cons(i => {
    var c1Thickness = 4 * i.fout();
	var c1Radius = Mathf.lerp(3, 40, i.fin());
	elib.outlineCircle(e.x, e.y, Pal.missileYellow, c1Thickness, c1Radius);
  }));
  
  var c2Alpha = 0.3 + e.fin() * 0.7;
  var c2Radius = Mathf.lerp(40, 0.5, e.fin());
  elib.fillCircle(e.x, e.y, Pal.missileYellowBack, c2Alpha, c2Radius);
  
  var sAlpha = 0.3 + e.fout() * 0.7;
  var sRadius = Mathf.lerp(4, 1, e.fin());
  Angles.randLenVectors(e.id, 8, Mathf.lerp(5, 27, e.finpow()), new Floatc2(){get: (a, b) => {
    elib.fillCircle(e.x + a, e.y + b, Color.gray, sAlpha, sRadius);
  }});
  
  var lThickness = e.fout() * 2.7;
  var lDistance = Mathf.lerp(13, 80, e.finpow());
  var lLength = Mathf.lerp(10, 1, e.fin());
  elib.splashLines(e.x, e.y, Pal.missileYellow, lThickness, lDistance, lLength, 12, e.id);
});
quakeHE.despawnEffect = quakeHE.hitEffect;

const quakeAP = extend(BasicBulletType, {
  draw(b){
    this.super$draw(b);
    if(Time.delta() > 0 && Mathf.chance(0.75)){
      Effects.effect(this.trailEffect, b.x, b.y, b.rot());
    }
  },
});
quakeAP.damage = 2210;
quakeAP.splashDamage = 120;
quakeAP.splashDamageRadius = 10;
quakeAP.speed = 10;
quakeAP.lifetime = 40;
quakeAP.knockback = 6;
quakeAP.bulletWidth = 17;
quakeAP.bulletHeight = 22;
quakeAP.frontColor = plib.frontColorAP;
quakeAP.backColor = plib.backColorAP;
quakeAP.ammoMultiplier = 2;
quakeAP.reloadMultiplier = 1.2;
quakeAP.hitSound = Sounds.boom;
// Trail effect
quakeAP.trailEffect = newEffect(27, e => {
  elib.fillCircle(e.x, e.y, quakeAP.frontColor, 1, Mathf.lerp(1.8, 0.2, e.fin()));
});
// Hit effect
quakeAP.hitEffect = newEffect(13, e => {
  e.scaled(6, cons(i => {
    var cThickness = 4 * i.fout();
    var cRadius = Mathf.lerp(1.5, 20, i.fin());
    elib.outlineCircle(e.x, e.y, quakeAP.frontColor, cThickness, cRadius);
  }));
  
  var lThickness = e.fout() * 2.5;
  var lDistance = Mathf.lerp(1, 25, e.finpow());
  var lLength = Mathf.lerp(4, 1, e.fin());
  elib.splashLines(e.x, e.y, quakeAP.backColor, lThickness, lDistance, lLength, 10, e.id);
});
quakeAP.despawnEffect = quakeAP.hitEffect;

const quake = extendContent(ArtilleryTurret, "quake", {
  load(){
    this.super$load();
  },
  init(){
    this.ammo(
      Vars.content.getByName(ContentType.item, "mechanical-warfare-he-shell"), quakeHE,
      Vars.content.getByName(ContentType.item, "mechanical-warfare-ap-shell"), quakeAP
    );
    this.super$init();
  }
});
