const copterLib = require("mechanical-warfare/units/copter-base");
const multiWeap = require("mechanical-warfare/units/multi-weapon-base");
const plib = require("mechanical-warfare/plib");
const elib = require("mechanical-warfare/effectlib");

const viperBullet = extend(BasicBulletType, {});
viperBullet.bulletWidth = 9;
viperBullet.bulletHeight = 14;
viperBullet.frontColor = plib.frontColorCyan;
viperBullet.backColor = plib.backColorCyan;
viperBullet.speed = 6;
viperBullet.lifetime = 21;
viperBullet.damage = 12;
viperBullet.shootEffect = Fx.shootBig;
viperBullet.smokeEffect = Fx.shootBigSmoke;
viperBullet.hitEffect = Fx.hitBulletBig;

const viperGun = extendContent(Weapon, "viper-machine-gun", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-viper-machine-gun-equip");
	}
});
viperGun.width = 4;
viperGun.length = 19.25;
viperGun.reload = 16;
viperGun.alternate = true;
viperGun.recoil = 1.5;
viperGun.shake = 0;
viperGun.inaccuracy = 3;
viperGun.ejectEffect = Fx.shellEjectSmall;
viperGun.shootSound = Sounds.shootBig;
viperGun.bullet = viperBullet;

const viperLaser = extend(BasicBulletType, {
	draw(b){
		col = plib.frontColorCyan;
		x = b.getData().target.x;
		y = b.getData().target.y;
		angle = Angles.angle(b.x, b.y, x, y);
		dst = Mathf.dst(b.x, b.y, x, y);
		Lines.precise(true);
		Lines.stroke(b.fout() * 2.8);
		Draw.color(col, 0.3 + b.fout() * 0.7);
		Lines.lineAngle(b.x, b.y, angle, dst);
		Lines.stroke(1);
		Lines.precise(false);
		Drawf.tri(x, y, b.fout() * 2.8, 10, angle);
		Draw.color();
	},
	init(b){
		if(typeof(b) !== "undefined"){
			this.super$init(b);
			unit = b.getOwner();
			b.setData({target: unit.target});
			x = b.getData().target.x;
			y = b.getData().target.y;
			angle = Angles.angle(b.x, b.y, x, y);
			dst = Mathf.dst(b.x, b.y, x, y);
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, angle, dst);
		}
	},
	range(){
		return 100;
	}
});
viperLaser.pierce = true;
viperLaser.damage = 30;
viperLaser.despawnEffect = Fx.none;
viperLaser.hitEffect = Fx.hitBulletSmall;
viperLaser.lifetime = 25;
viperLaser.speed = 0.001;
viperLaser.collides = false;
viperLaser.hitTiles = false;
viperLaser.collidesTiles = false;
viperLaser.collidesAir = false;
viperLaser.collidesTeam = false;

const viperMissile = extend(MissileBulletType, {});
viperMissile.frontColor = plib.frontColorCyan;
viperMissile.backColor = plib.backColorCyan;
viperMissile.bulletWidth = 9;
viperMissile.bulletHeight = 12;
viperMissile.speed = 3.2;
viperMissile.lifetime = 55;
viperMissile.damage = 16;
viperMissile.drag = -0.01;
viperMissile.homingPower = 2;
viperMissile.homingRange = 120;
viperMissile.shootEffect = Fx.shootBig;
viperMissile.smokeEffect = Fx.shootBigSmoke;
viperMissile.hitEffect = Fx.blastExplosion;
viperMissile.trailColor = viperMissile.backColor;

const att = {
	load(){
		this.weaponCount = 2;
		this.rotateWeapon = [];
		this.weaponAngles = [];
		this.shootCone = [];
		this.weaponOffsetY = [];
		this.targetAir = [];
		this.targetGround = [];
		this.weapon = [];
		this.rotorCount = 2;
		this.rotor = [];
		
		for(var i = 0; i < this.rotorCount; i++){
			sign = Mathf.signs[i];
			this.rotor[i] = {
				offset: 4 + sign * 10.5,
				width: 0,
				speed: 39.11,
				scale: 1.2,
				bladeCount: 3,
				bladeRegion: Core.atlas.find("mechanical-warfare-rotor-blade2"),
				topRegion: Core.atlas.find("mechanical-warfare-rotor-top")
			}
		}
		
		for(var i = 0; i < this.weaponCount; i++){
			this.weaponAngles[i] = [0.0, 0.0];
			this.shootCone[i] = 30;
			this.weaponOffsetY[i] = 0.0;
			this.rotateWeapon[i] = false;
			this.targetAir[i] = true;
			this.targetGround[i] = true;
		}
		
		this.weapon[0] = multiWeap.newWeapon("viper-lasergun", 0, (weap, shooter, x, y, rotation, left) => {
			weap.shootSound.at(x, y, Mathf.random(1.8, 2.0));
			Angles.shotgun(weap.shots, weap.spacing, rotation, new Floatc(){get: f => {
				weap.bulletB(shooter, x, y, f);
			}});
		}, null);
		
		this.weapon[0].width = 7;
		this.weapon[0].length = 8;
		this.weapon[0].recoil = 2;
		this.weapon[0].alternate = false;
		this.weapon[0].inaccuracy = 0;
		this.weapon[0].reload = 80;
		this.weapon[0].ejectEffect = Fx.none;
		this.weapon[0].shootSound = Sounds.shotgun;
		this.weapon[0].bullet = viperLaser;

		this.weapon[1] = multiWeap.newWeapon("viper-launcher", 1, null, null);
		this.weapon[1].width = 7;
		this.weapon[1].length = 3.5;
		this.weapon[1].recoil = 2.3;
		this.weapon[1].shots = 3;
		this.weapon[1].alternate = true;
		this.weapon[1].inaccuracy = 3;
		this.weapon[1].reload = 60;
		this.weapon[1].ejectEffect = Fx.shellEjectBig;
		this.weapon[1].shootSound = Sounds.missile;
		this.weapon[1].bullet = viperMissile;
	}
}

const viperUnit = extendContent(UnitType, "viper", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
		att.load();
	},
	getAttributes(){
		return att;
	}
});
viperUnit.weapon = viperGun;
viperUnit.create(prov(() => {
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
			att = this.type.getAttributes();
			multiWeap.drawMainWeapons(this);
			for(var i = 0; i < att.weaponCount; i++){
				multiWeap.drawSecWeapons(this, i);
			}
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
	base.setTimer2(new Interval(4));
	base.setShootTimers2([{
		timerShootLeft: 0,
		timerShootRight: 1
	}, {
		timerShootLeft: 2,
		timerShootRight: 3
	}]);
	return base;
}));

const viperFactory = extendContent(UnitFactory, "viper-factory", {
	load(){
		this.region = Core.atlas.find(this.name);
		this.topRegion = Core.atlas.find("clear");
	},
	generateIcons: function(){
		return [Core.atlas.find(this.name)];
	}
});
viperFactory.unitType = viperUnit;