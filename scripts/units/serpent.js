const copterLib = require("mechanical-warfare/units/copter-base");
const multiWeap = require("mechanical-warfare/units/multi-weapon-base");
const plib = require("mechanical-warfare/plib");
const elib = require("mechanical-warfare/effectlib");

const serpentBullet = extend(BasicBulletType, {});
serpentBullet.bulletWidth = 6;
serpentBullet.bulletHeight = 9;
serpentBullet.speed = 9;
serpentBullet.lifetime = 14;
serpentBullet.damage = 8;
serpentBullet.shootEffect = Fx.shootSmall;
serpentBullet.smokeEffect = Fx.shootSmallSmoke;
serpentBullet.hitEffect = Fx.hitBulletSmall;

const serpentMissile = extend(MissileBulletType, {});
serpentMissile.bulletWidth = 9;
serpentMissile.bulletHeight = 12;
serpentMissile.speed = 2.8;
serpentMissile.lifetime = 50;
serpentMissile.damage = 24;
serpentMissile.drag = -0.01;
serpentMissile.homingPower = 2;
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

const att = {
	weaponCount: 1,
	rotateWeapon: [],
	weaponAngles: [],
	shootCone: [],
	weaponOffsetY: [],
	weapon: [],
	rotorCount: 1,
	rotor: [],
}
att.rotor[0] = {
	offset: 5,
	width: 0,
	speed: 39.11,
	scale: 1.4,
	bladeCount: 4,
	bladeRegion: Core.atlas.find("mechanical-warfare-rotor-blade"),
	topRegion: Core.atlas.find("mechanical-warfare-rotor-top")
}
att.weaponAngles[0] = [0.0, 0.0];
att.shootCone[0] = 30;
att.weaponOffsetY[0] = 0.0;
att.rotateWeapon[0] = false;
att.weapon[0] = multiWeap.newWeapon("serpent-launcher", 0, null, null);
att.weapon[0].width = 4.25;
att.weapon[0].length = 1;
att.weapon[0].recoil = 1.5;
att.weapon[0].alternate = true;
att.weapon[0].inaccuracy = 3;
att.weapon[0].reload = 80;
att.weapon[0].shootCone = 45;
att.weapon[0].ejectEffect = Fx.shellEjectBig;
att.weapon[0].shootSound = Sounds.missile;
att.weapon[0].bullet = serpentMissile;

const serpentUnit = extendContent(UnitType, "serpent", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
	},
	getAttributes(){
		return att;
	}
});
serpentUnit.weapon = serpentWeapon;
serpentUnit.create(prov(() => {
	const base = extend(HoverUnit, {
		update(){
			this.super$update();
			if(this.target !== null){
				if(this.target.getTeam().isEnemy(this.getTeam())){
					multiWeap.updateWeapons(this);
				}
			}
		},
		draw(){
			multiWeap.drawMainWeapons(this);
			multiWeap.drawSecWeapons(this, 0);
			copterLib.drawBase(this);
		},
		drawStats(){
			this.super$drawStats();
			copterLib.drawRotor(this);
		},
		drawEngine(){},
		getTimer2(){
			return this._timer;
		},
		setTimer2(val){
			this._timer = val;
		},
		getShootTimer2(index, left){
			return left ? this.getShootTimers2()[index].timerShootLeft : this.getShootTimers2()[index].timerShootRight;
		},
		getShootTimers2(){
			return this._timerShoot;
		},
		setShootTimers2(arr){
			this._timerShoot = arr;
		}
	});
	base.setTimer2(new Interval(2));
	base.setShootTimers2([{
		timerShootLeft: 0,
		timerShootRight: 1
	}]);
	return base;
}));

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