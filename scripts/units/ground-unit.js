const elib = require("effectlib");
const plib = require("plib");
const groundUnit = prov(() => extend(GroundUnit, {}));

// Nullifier
const nullBullet = extend(BasicBulletType, {
  draw(b){
    elib.fillCircle(b.x, b.y, this.backColor, 1, this.bulletWidth);
    elib.fillCircle(b.x, b.y, this.frontColor, 1, this.bulletWidth - 3);
  }
});
nullBullet.damage = 700;
nullBullet.speed = 4;
nullBullet.knockback = 3;
nullBullet.lifetime = 75;
nullBullet.backColor = Color.white;
nullBullet.frontColor = Color.black;
nullBullet.bulletWidth = nullBullet.bulletHeight = 16;
nullBullet.trailEffect = newEffect(30, e => {
  var thickness = e.fout() * 4;
  var radius = 0.2 + e.fout() * 12;
  elib.outlineCircle(e.x, e.y, nullBullet.backColor, thickness, radius);
});

const nullPointer = extendContent(Weapon, "null-pointer", {});
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

const nullifier = extendContent(UnitType, "nullifier", {});
nullifier.weapon = nullPointer;
nullifier.create(groundUnit);
