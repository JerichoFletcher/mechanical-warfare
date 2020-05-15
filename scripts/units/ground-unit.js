const elib = require("effectlib");
const plib = require("plib");
const groundUnit = prov(() => extend(GroundUnit, {}));

// Nullifier
const nullBullet = extend(BasicBulletType, {
  draw(b){
    elib.fillCircle(b.x, b.y, this.backColor, 1, this.bulletWidth);
    elib.fillCircle(b.x, b.y, this.frontColor, 1, this.bulletWidth - 1.5);
  },
  update(b){
    if(b.timer.get(0, 4)){
      Effects.effect(this.trailEffect, b.x, b.y, b.rot());
    }
  }
});
nullBullet.damage = 700;
nullBullet.speed = 4;
nullBullet.knockback = 3;
nullBullet.lifetime = 75;
nullBullet.backColor = Color.white;
nullBullet.frontColor = Color.black;
nullBullet.bulletWidth = nullBullet.bulletHeight = 10;
nullBullet.trailEffect = newEffect(30, e => {
  var thickness = e.fout() * 3;
  var radius = 0.2 + e.fout() * 6;
  elib.outlineCircle(e.x, e.y, nullBullet.backColor, thickness, radius);
});
nullBullet.hitEffect = newEffect(18, e => {
  elib.fillCircle(e.x, e.y, nullBullet.frontColor, 0.2 + e.fin() * 0.8, 0.2 + e.fout() * 19.8);
  
  var thickness = e.fout() * 4;
  var radius = e.fin() * 20;
  elib.outlineCircle(e.x, e.y, nullBullet.backColor, thickness, radius);
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
