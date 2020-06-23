const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const bulletLib = require("mechanical-warfare/bulletlib");

const seismHE = bulletLib.bullet(BasicBulletType, 20, 26, 0, 0, 350, 720, 60, 4, 12, 40, null, cons(b => {
	if(Mathf.chance(0.75)){
		Effects.effect(seismHE.trailEffect, b.x, b.y, b.rot());
	}
}), null, null);
seismHE.frontColor = plib.frontColorHE;
seismHE.backColor = plib.backColorHE;
seismHE.ammoMultiplier = 2;
seismHE.hitSound = Sounds.boom;
seismHE.trailEffect = newEffect(30, e => {
  elib.fillCircle(e.x, e.y, seismHE.frontColor, 1, Mathf.lerp(2, 0.2, e.fin()));
});
seismHE.hitEffect = newEffect(42, e => {
  e.scaled(4, cons(i => {
	c1Thickness = 6 * i.fout();
	c1Radius = Mathf.lerp(3, 60, i.fin());
	elib.outlineCircle(e.x, e.y, Pal.missileYellow, c1Thickness, c1Radius);
  }));
  
  sAlpha = 0.3 + e.fout() * 0.7;
  sRadius = Mathf.lerp(10, 1, e.fin());
  Angles.randLenVectors(e.id, 15, Mathf.lerp(5, 84, e.finpow()), new Floatc2(){get: (a, b) => {
    elib.fillCircle(e.x + a, e.y + b, Color.gray, sAlpha, sRadius);
  }});
  
  lThickness = e.fout() * 3;
  lDistance = Mathf.lerp(20, 120, e.finpow());
  lLength = Mathf.lerp(14, 1, e.fin());
  elib.splashLines(e.x, e.y, Pal.missileYellow, lThickness, lDistance, lLength, 15, e.id);
});
seismHE.despawnEffect = seismHE.hitEffect;

const seismAP = bulletLib.bullet(BasicBulletType, 20, 26, 0, 0, 3300, 160, 15, 8, 20, 26, null, cons(b => {
	if(Mathf.chance(0.75)){
		Effects.effect(seismHE.trailEffect, b.x, b.y, b.rot());
	}
}), null, null);
seismAP.frontColor = plib.frontColorAP;
seismAP.backColor = plib.backColorAP;
seismAP.ammoMultiplier = 2;
seismAP.reloadMultiplier = 1.2;
seismAP.hitSound = Sounds.boom;
seismAP.trailEffect = newEffect(30, e => {
  elib.fillCircle(e.x, e.y, seismAP.frontColor, 1, Mathf.lerp(2, 0.2, e.fin()));
});
seismAP.hitEffect = newEffect(13, e => {
  e.scaled(4, cons(i => {
    cThickness = 4 * i.fout();
    cRadius = Mathf.lerp(2, 30, i.fin());
    elib.outlineCircle(e.x, e.y, seismAP.frontColor, cThickness, cRadius);
  }));
  
  lThickness = e.fout() * 3;
  lDistance = Mathf.lerp(3, 45, e.finpow());
  lLength = Mathf.lerp(5, 1, e.fin());
  elib.splashLines(e.x, e.y, seismAP.backColor, lThickness, lDistance, lLength, 12, e.id);
});
seismAP.despawnEffect = seismAP.hitEffect;

const seism = extendContent(ArtilleryTurret, "seism", {
  load(){
    this.region = Core.atlas.find(this.name);
	this.baseRegion = Core.atlas.find("mechanical-warfare-block-5");
	this.heatRegion = Core.atlas.find(this.name + "-heat");
  },
  draw(tile){
	Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
	Draw.color();
  },
  generateIcons: function(){
	return [
	  Core.atlas.find("mechanical-warfare-block-5"),
	  Core.atlas.find(this.name)
	];
  },
  init(){
    this.ammo(
      Vars.content.getByName(ContentType.item, "mechanical-warfare-he-shell"), seismHE,
      Vars.content.getByName(ContentType.item, "mechanical-warfare-ap-shell"), seismAP
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
