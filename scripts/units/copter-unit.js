const copterLib = require("units/copter-base");

// Serpent
const serpentBullet = extend(BasicBulletType, {});
serpentBullet.width = 6;
serpentBullet.height = 8;
serpentBullet.speed = 7;
serpentBullet.lifetime = 19;
serpentBullet.damage = 4;
serpentBullet.shootEffect = Fx.shootSmall;
serpentBullet.smokeEffect = Fx.shootSmallSmoke;

const serpentWeapon = extendContent(Weapon, "serpent-gun", {
  load(){
    this.region = Core.atlas.find(this.name + "-equip");
  },
});
serpentWeapon.width = 10;
serpentWeapon.length = 5;
serpentWeapon.reload = 12;
serpentWeapon.alternate = true;
serpentWeapon.recoil = 2;
serpentWeapon.shake = 0;
serpentWeapon.inaccuracy = 3;
serpentWeapon.ejectEffect = Fx.shellEjectSmall;
serpentWeapon.shootSound = Sounds.shootSnap;
serpentWeapon.bullet = serpentBullet;

const serpentUnit = extendContent(UnitType, "serpent", {
  load(){
    this.weapon.load();
    this.region = Core.atlas.find(this.name);
  },
  rotorBladeRegion: function(){
    return typeof(this.bladeRegion) !== "undefined" ? this.bladeRegion : Core.atlas.find("error");
  },
  rotorTopRegion: function(){
    return typeof(this.topRegion) !== "undefined" ? this.topRegion : Core.atlas.find("error");
  },
  rotorScale: function(){
    return 1.4;
  },
  rotorSpeed: function(){
    return 15;
  },
  rotorOffset: function(){
    return 3;
  },
  rotorWidth: function(){
    return 0;
  },
  alternateRotor: function(){
    return true;
  },
  isTwinBlade: function(){
    return false;
  },
});
serpentUnit.weapon = serpentWeapon;
serpentUnit.create(prov(() => extend(HoverUnit, {
  draw(){
    copterLib.drawBase(this);
  },
  drawWeapons(){
    copterLib.drawWeapons(this);
  },
  drawRotor(){
    copterLib.drawRotor(this);
  },
})));

const serpentFactory = extendContent(UnitFactory, "serpent-factory", {
  load(){
    this.region = Core.atlas.find(this.name);
    this.topRegion = Core.atlas.find("clear");
  },
  generateIcons: function(){
    return [this.region];
  }
});
serpentFactory.unitType = serpentUnit;
