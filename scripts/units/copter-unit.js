const copterLib = require("units/copter-base");

// Serpent
const serpentMissileReload = 40;
const serpentBullet = extend(BasicBulletType, {});
serpentBullet.width = 6;
serpentBullet.height = 8;
serpentBullet.speed = 7;
serpentBullet.lifetime = 19;
serpentBullet.damage = 4;
serpentBullet.shootEffect = Fx.shootSmall;
serpentBullet.smokeEffect = Fx.shootSmallSmoke;

const serpentMissile = extend(MissileBulletType, {});
serpentMissile.speed = 4;
serpentMissile.lifetime = 35;
serpentMissile.damage = 15;
serpentMissile.drag = -0.005;
serpentMissile.homingPower = 0.01;
serpentMissile.homingRange = 40;
serpentMissile.shootEffect = Fx.shootBig;
serpentMissile.smokeEffect = Fx.shootBigSmoke;

const serpentWeapon = extendContent(Weapon, "serpent-gun", {
  load(){
    this.region = Core.atlas.find(this.name + "-equip", Core.atlas.find(this.name));
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
  weaponRegion: function(){
    return Core.atlas.find("serpent-gun-equip");
  },
});
serpentUnit.weapon = serpentWeapon;
serpentUnit.create(prov(() => extend(HoverUnit, {
  behavior(){
    this.super$behavior();
    if(typeof(this.missileTimer) === "undefined"){
      this.missileTimer = 0;
    }
    if(typeof(this.currentLauncher) === "undefined"){
      this.currentLauncher = -1;
    }
    if(this.target != null){
      if(this.missileTimer++ >= serpentMissileReload){
        var offx = Angles.trnsx(this.rotation - 90, this.getWeapon().width * this.currentLauncher / 2, 1);
        var offy = Angles.trnsy(this.rotation - 90, this.getWeapon().width * this.currentLauncher / 2, 1);
        Calls.createBullet(serpentMissile, this.getTeam(), this.x + offx, this.y + offy, this.rotation, 1 - Mathf.random(0.1), 1);
        Sounds.missile.at(this.x, this.y, Mathf.random(0.9, 1.1));
        this.missileTimer = 0;
        if(this.currentLauncher < 0){
          this.currentLauncher = 1;
        }else{
          this.currentLauncher = -1;
        }
      }
    }
  },
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
