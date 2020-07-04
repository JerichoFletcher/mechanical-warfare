const copterLib = require("units/copter-base");

// Serpent
// Raw DPS: 80
const serpentBullet = extend(BasicBulletType, {});
serpentBullet.bulletWidth = 6;
serpentBullet.bulletHeight = 9;
serpentBullet.speed = 9;
serpentBullet.lifetime = 21;
serpentBullet.damage = 5;
serpentBullet.shootEffect = Fx.shootSmall;
serpentBullet.smokeEffect = Fx.shootSmallSmoke;

const serpentMissile = extend(MissileBulletType, {});
serpentMissile.bulletWidth = 9;
serpentMissile.bulletHeight = 12;
serpentMissile.speed = 2.8;
serpentMissile.lifetime = 50;
serpentMissile.damage = 20;
serpentMissile.drag = -0.01;
serpentMissile.homingPower = 0.075;
serpentMissile.homingRange = 120;
serpentMissile.shootEffect = Fx.shootBig;
serpentMissile.smokeEffect = Fx.shootBigSmoke;
serpentMissile.hitEffect = Fx.blastExplosion;

const serpentWeapon = extendContent(Weapon, "serpent-gun", {
  load(){
    this.region = Core.atlas.find("mechanical-warfare-serpent-gun-equip");
  }
});
serpentWeapon.width = 6.5;
serpentWeapon.length = 5;
serpentWeapon.reload = 12;
serpentWeapon.alternate = true;
serpentWeapon.recoil = 1.5;
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
  secondaryReload: function(){
    return 40;
  },
  secondaryShootCone: function(){
    return 45;
  },
  secondaryShootSound: function(){
    return Sounds.missile;
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
    return 8;
  },
  rotorOffset: function(){
    return 5;
  },
  rotorWidth: function(){
    return 0;
  },
  alternateRotor: function(){
    return false;
  },
  isTwinBlade: function(){
    return false;
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
    if(this.target != null && this.target.getTeam().isEnemy(this.getTeam()) && Angles.near(this.angleTo(this.target), this.rotation, this.type.secondaryShootCone()) && this.dst(this.target) < serpentMissile.range()){
      if(this.missileTimer++ >= this.type.secondaryReload()){
        this.secondaryShoot(serpentMissile);
		this.missileTimer = 0;
        if(this.currentLauncher < 0){
          this.currentLauncher = 1;
        }else{
          this.currentLauncher = -1;
        }
      }
    }
  },
  secondaryShoot(bullet){
    this.offx = this.x + Angles.trnsx(this.rotation - 90, this.getWeapon().width * this.currentLauncher / 2, 1);
    this.offy = this.y + Angles.trnsy(this.rotation - 90, this.getWeapon().width * this.currentLauncher / 2, 1);
    Bullet.create(bullet, this, this.getTeam(), this.offx, this.offy, this.rotation, 1 - Mathf.random(0.1), 1);
	this.type.secondaryShootSound().at(this.x, this.y, Mathf.random(0.9, 1.1));
	Effects.effect(bullet.shootEffect, this.offx, this.offy, this.rotation);
	Effects.effect(bullet.smokeEffect, this.offx, this.offy, this.rotation);
  },
  draw(){
	this.drawWeapons();
    copterLib.drawBase(this);
  },
  drawWeapons(){
    copterLib.drawWeapons(this);
  },
  drawStats(){
	this.super$drawStats();
	copterLib.drawRotor(this);
  },
  drawEngine(){}
})));

const serpentFactory = extendContent(UnitFactory, "serpent-factory", {
  load(){
    this.region = Core.atlas.find(this.name);
    this.topRegion = Core.atlas.find("clear");
  },
  generateIcons: function(){
    return [Core.atlas.find(this.name)];
  }
});
serpentFactory.unitType = serpentUnit;
