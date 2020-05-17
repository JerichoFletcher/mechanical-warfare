const elib = require("effectlib");
const plib = require("plib");
const groundUnit = prov(() => extend(GroundUnit, {}));

// Nullifier
const nullBullet = extend(BasicBulletType, {
  draw(b){
	elib.fillCircle(b.x, b.y, this.frontColor, 1, this.bulletWidth);
	elib.outlineCircle(b.x, b.y, this.backColor, 0.5, this.bulletWidth);
	if(Mathf.chance(0.67)){
	  Effects.effect(this.trailEffectB, b.x, b.y, b.rot());
	}
    if(b.timer.get(0, 4)){
      Effects.effect(this.trailEffectA, b.x, b.y, b.rot());
    }
	Effects.effect(this.trailEffectC, b.x, b.y, b.rot());
  }
});
nullBullet.hitSize = 8;
nullBullet.damage = 700;
nullBullet.speed = 4;
nullBullet.knockback = 3;
nullBullet.lifetime = 75;
nullBullet.backColor = Color.white;
nullBullet.frontColor = Color.black;
nullBullet.bulletWidth = nullBullet.bulletHeight = 7;
nullBullet.trailEffectA = newEffect(30, e => {
  var thickness = e.fout() * 3;
  var radius = 0.2 + e.fout() * 6;
  elib.outlineCircle(e.x, e.y, nullBullet.backColor, thickness, radius);
});
nullBullet.trailEffectB = newEffect(42, e => {
  Angles.randLenVectors(e.id + 2, 1, nullBullet.bulletWidth - 1, new Floatc2(){get: (a, b) => {
	elib.fillCircle(e.x + a, e.y + b, nullBullet.frontColor, 1, e.fout() * 3);
  }});
});
nullBullet.trailEffectC = newEffect(36, e => {
  var angle = (Time.time() + Mathf.randomSeed(e.id, 360)) % 360;
  var dist = nullBullet.bulletWidth + 1 - e.fout() * 1.5;
  elib.fillCircle(e.x + Angles.trnsx(angle, dist), e.y + Angles.trnsy(angle, dist), nullBullet.backColor, 1, e.fout() * 1.1);
});
nullBullet.hitEffect = newEffect(18, e => {
  elib.fillCircle(e.x, e.y, nullBullet.frontColor, 0.2 + e.fin() * 0.8, 0.2 + e.fout() * 19.8);
  
  var thickness = e.fin() * 4;
  var radius = e.fout() * 20;
  elib.outlineCircle(e.x, e.y, nullBullet.backColor, thickness, radius);
  
  var lnThickness = e.fin() * 2;
  var lnDistance = e.fout() * 12;
  var lnLength = e.fin() * 4;
  elib.splashLines(e.x, e.y, nullBullet.backColor, lnThickness, lnDistance, lnLength, 12, e.id);
  
  var crRadius = e.fout() * 3;
  var crDistance = e.fin() * 6;
  elib.splashCircles(e.x, e.y, Color.gray, 1, crRadius, crDistance, 4, e.id + 1);
});
nullBullet.despawnEffect = nullBullet.hitEffect;

const nullPointer = extendContent(Weapon, "null-pointer", {
  load(){
    this.region = Core.atlas.find(modName + "-null-pointer-equip");
  }
});
nullPointer.length = 18;
nullPointer.width = 30;
nullPointer.reload = 60;
nullPointer.alternate = true;
nullPointer.recoil = 6;
nullPointer.shake = 2.2;
nullPointer.inaccuracy = 2;
nullPointer.ejectEffect = Fx.shellEjectBig;
nullPointer.shootSound = Sounds.artillery;
nullPointer.bullet = nullBullet;

const nullifier = extendContent(UnitType, "nullifier", {
  load(){
    this.weapon.load();
    this.region = Core.atlas.find(this.name);
    this.baseRegion = Core.atlas.find(this.name + "-base");
    this.legRegion = Core.atlas.find(this.name + "-leg");
  }
});
nullifier.weapon = nullPointer;
nullifier.create(groundUnit);
