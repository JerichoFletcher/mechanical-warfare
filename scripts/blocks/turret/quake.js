const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const bulletLib = require("mechanical-warfare/bulletlib");

const quakeHE = bulletLib.bullet(BasicBulletType, 17, 22, 0, 0, 240, 500, 40, 3, 10, 40, null, cons(b => {
	if(Mathf.chance(0.75)){
		Effects.effect(quakeHE.trailEffect, b.x, b.y, b.rot());
	}
}), null, null);
quakeHE.frontColor = plib.frontColorHE;
quakeHE.backColor = plib.backColorHE;
quakeHE.ammoMultiplier = 2;
quakeHE.hitSound = Sounds.boom;
quakeHE.trailEffect = newEffect(27, e => {
  elib.fillCircle(e.x, e.y, quakeHE.frontColor, 1, Mathf.lerp(1.8, 0.2, e.fin()));
});
quakeHE.hitEffect = newEffect(36, e => {
  e.scaled(4, cons(i => {
    c1Thickness = 4 * i.fout();
	c1Radius = Mathf.lerp(3, 40, i.fin());
	elib.outlineCircle(e.x, e.y, Pal.missileYellow, c1Thickness, c1Radius);
  }));
  
  sAlpha = 0.3 + e.fout() * 0.2
  sRadius = Mathf.lerp(8, 1, e.fin());
  Angles.randLenVectors(e.id, 12, Mathf.lerp(5, 56, e.finpow()), new Floatc2(){get: (a, b) => {
    elib.fillCircle(e.x + a, e.y + b, Color.gray, sAlpha, sRadius);
  }});
  
  lThickness = e.fout() * 2.7;
  lDistance = Mathf.lerp(13, 80, e.finpow());
  lLength = Mathf.lerp(10, 1, e.fin());
  elib.splashLines(e.x, e.y, Pal.missileYellow, lThickness, lDistance, lLength, 12, e.id);
});
quakeHE.despawnEffect = quakeHE.hitEffect;

const quakeAP = bulletLib.bullet(BasicBulletType, 17, 22, 0, 0, 2210, 120, 10, 6, 10, 40, null, cons(b => {
	if(Mathf.chance(0.75)){
		Effects.effect(quakeAP.trailEffect, b.x, b.y, b.rot());
	}
}), null, null);
quakeAP.frontColor = plib.frontColorAP;
quakeAP.backColor = plib.backColorAP;
quakeAP.ammoMultiplier = 2;
quakeAP.reloadMultiplier = 1.2;
quakeAP.hitSound = Sounds.boom;
quakeAP.trailEffect = newEffect(27, e => {
  elib.fillCircle(e.x, e.y, quakeAP.frontColor, 1, Mathf.lerp(1.8, 0.2, e.fin()));
});
quakeAP.hitEffect = newEffect(13, e => {
  e.scaled(4, cons(i => {
    cThickness = 4 * i.fout();
    cRadius = Mathf.lerp(1.5, 20, i.fin());
    elib.outlineCircle(e.x, e.y, quakeAP.frontColor, cThickness, cRadius);
  }));
  
  lThickness = e.fout() * 2.5;
  lDistance = Mathf.lerp(1, 25, e.finpow());
  lLength = Mathf.lerp(4, 1, e.fin());
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
