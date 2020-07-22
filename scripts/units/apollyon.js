const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const multiWeap = require("mechanical-warfare/units/multi-weapon-base");
const bulletLib = require("mechanical-warfare/bulletlib");

const hoverUnit = prov(() => extend(HoverUnit, {
	drawEngine(){
		Draw.color(this.type.getEngineColor());
		var ox = Angles.trnsx(this.rotation + 180, this.type.engineOffset);
		var oy = Angles.trnsy(this.rotation + 180, this.type.engineOffset);
		var oSize = Mathf.absin(Time.time(), 2, this.type.engineSize / 4);
		Fill.circle(this.x + ox, this.y + oy, this.type.engineSize + oSize);
		
		Draw.color(Color.white);
		var ix = Angles.trnsx(this.rotation + 180, this.type.engineOffset - 1);
		var iy = Angles.trnsy(this.rotation + 180, this.type.engineOffset - 1);
		var iSize = Mathf.absin(Time.time(), 2, this.type.engineSize / 4);
		Fill.circle(this.x + ix, this.y + iy, (this.type.engineSize + oSize) / 2);
		Draw.color();
	}
}));

const apollyonBullet = bulletLib.bullet(BasicBulletType, 10, 14, 0, 0, 10, 0, 0, 0, 6, 32, null, null, null, null);
apollyonBullet.frontColor = plib.frontColorPurple;
apollyonBullet.backColor = plib.backColorPurple;
apollyonBullet.shootEffect = Fx.shootBig;
apollyonBullet.smokeEffect = Fx.shootBigSmoke;
apollyonBullet.hitEffect = Fx.hitBulletBig;

const apollyonHVBullet = bulletLib.bullet(BasicBulletType, 8, 15, 0, 0, 80, 0, 0, 2, 20, 20, null, null, null, null);
apollyonHVBullet.bulletSprite = "mechanical-warfare-hvbullet";
apollyonHVBullet.frontColor = plib.frontColorPurple;
apollyonHVBullet.backColor = plib.backColorPurple;
apollyonHVBullet.shootEffect = Fx.shootBig;
apollyonHVBullet.smokeEffect = Fx.shootBigSmoke;
apollyonHVBullet.hitEffect = Fx.hitBulletBig;

const apollyonMissile = bulletLib.bullet(MissileBulletType, 8, 13, 0, -0.02, 18, 12, 16, 2, 6, 30, null, null, null, null);
apollyonMissile.frontColor = plib.frontColorPurple;
apollyonMissile.backColor = plib.backColorPurple;
apollyonMissile.trailColor = plib.backColorPurple;
apollyonMissile.shootEffect = Fx.shootBig;
apollyonMissile.smokeEffect = Fx.shootBigSmoke;
apollyonMissile.hitEffect = Fx.blastExplosion;
apollyonMissile.homingRange = 60;
apollyonMissile.homingPower = 2;

const apollyonLaser = extend(BasicBulletType, {
	draw(b){
		col = plib.frontColorPurple;
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
			b.setData({target: b.getOwner().target});
			x = b.getData().target.x;
			y = b.getData().target.y;
			angle = Angles.angle(b.x, b.y, x, y);
			dst = Mathf.dst(b.x, b.y, x, y);
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, angle, dst);
		}
	},
	range(){
		return 125;
	}
});
apollyonLaser.pierce = true;
apollyonLaser.damage = 50;
apollyonLaser.despawnEffect = Fx.none;
apollyonLaser.hitEffect = Fx.hitBulletSmall;
apollyonLaser.lifetime = 25;
apollyonLaser.speed = 0.001;
apollyonLaser.collides = false;
apollyonLaser.hitTiles = false;
apollyonLaser.collidesTiles = false;
apollyonLaser.collidesAir = false;
apollyonLaser.collidesTeam = false;

const apollyonLauncher = extendContent(Weapon, "apollyon-launcher", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-apollyon-launcher-equip");
	}
});
apollyonLauncher.width = 20;
apollyonLauncher.length = 1;
apollyonLauncher.recoil = 2.5;
apollyonLauncher.alternate = true;
apollyonLauncher.inaccuracy = 5;
apollyonLauncher.reload = 75;
apollyonLauncher.shots = 15;
apollyonLauncher.shotDelay = 1;
apollyonLauncher.spacing = 0.5;
apollyonLauncher.ejectEffect = Fx.shellEjectBig;
apollyonLauncher.shootSound = Sounds.artillery;
apollyonLauncher.bullet = apollyonMissile;
apollyonLauncher.velocityRnd = 0.2;

const att = {
	load(){
		this.weaponCount = 3;
		this.rotateWeapon = [false, true, true];
		this.weaponAngles = [
			[0.0, 0.0],
			[0.0, 0.0],
			[0.0, 0.0]
		];
		this.shootCone = [30, 20, 60];
		this.weaponOffsetY = [0, -5.75, 12];
		this.weapon = [];
		this.weapon[0] = multiWeap.newWeapon("apollyon-machine-gun", 0, null, null);
		this.weapon[0].width = 8.25;
		this.weapon[0].length = 16.75;
		this.weapon[0].recoil = 1.8;
		this.weapon[0].alternate = true;
		this.weapon[0].inaccuracy = 3;
		this.weapon[0].reload = 6;
		this.weapon[0].ejectEffect = Fx.shellEjectBig;
		this.weapon[0].shootSound = Sounds.shootBig;
		this.weapon[0].bullet = apollyonBullet;
		
		this.weapon[1] = multiWeap.newWeapon("apollyon-sniper", 1, null, null);
		this.weapon[1].width = 13;
		this.weapon[1].length = 1;
		this.weapon[1].recoil = 2.5;
		this.weapon[1].alternate = true;
		this.weapon[1].inaccuracy = 0;
		this.weapon[1].reload = 50;
		this.weapon[1].ejectEffect = Fx.shellEjectBig;
		this.weapon[1].shootSound = Sounds.shootBig;
		this.weapon[1].bullet = apollyonHVBullet;
		
		this.weapon[2] = multiWeap.newWeapon("apollyon-lasergun", 2, (weap, shooter, x, y, rotation, left) => {
			weap.shootSound.at(x, y, Mathf.random(1.8, 2.0));
				Angles.shotgun(weap.shots, weap.spacing, rotation, new Floatc(){get: f => {
					weap.bulletB(shooter, x, y, f);
				}});
			}, null);
		this.weapon[2].width = 18;
		this.weapon[2].length = 19;
		this.weapon[2].recoil = 2.5;
		this.weapon[2].alternate = false;
		this.weapon[2].inaccuracy = 0;
		this.weapon[2].reload = 60;
		this.weapon[2].ejectEffect = Fx.none;
		this.weapon[2].shootSound = Sounds.shotgun;
		this.weapon[2].bullet = apollyonLaser;
	}
}

const apollyon = extendContent(UnitType, "apollyon", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
		att.load();
	},
	getAttributes(){
		return att;
	},
	getEngineColor(){
		return plib.engineColorPurple;
	}
});
apollyon.weapon = apollyonLauncher;
apollyon.create(prov(() => {
	base = extend(HoverUnit, {
		update(){
			this.super$update();
			if(this.target != null){
				multiWeap.updateWeapons(this);
			}
		},
		draw(){
			att = this.type.getAttributes();
			multiWeap.drawSecWeapons(this, 0);
			Draw.mixcol(Color.white, this.hitTime / this.hitDuration);
			Draw.rect(this.type.region, this.x, this.y, this.rotation - 90);
			Draw.mixcol();
			multiWeap.drawMainWeapons(this);
			multiWeap.drawSecWeapons(this, 1);
			multiWeap.drawSecWeapons(this, 2);
		},
		drawEngine(){
			Draw.color(this.type.getEngineColor());
			ox = Angles.trnsx(this.rotation + 180, this.type.engineOffset);
			oy = Angles.trnsy(this.rotation + 180, this.type.engineOffset);
			oSize = Mathf.absin(Time.time(), 2, this.type.engineSize / 4);
			Fill.circle(this.x + ox, this.y + oy, this.type.engineSize + oSize);
			
			Draw.color(Color.white);
			ix = Angles.trnsx(this.rotation + 180, this.type.engineOffset - 1);
			iy = Angles.trnsy(this.rotation + 180, this.type.engineOffset - 1);
			iSize = Mathf.absin(Time.time(), 2, this.type.engineSize / 4);
			Fill.circle(this.x + ix, this.y + iy, (this.type.engineSize + oSize) / 2);
			Draw.color();
		},
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
	base.setTimer2(new Interval(6));
	base.setShootTimers2([{
		timerShootLeft: 0,
		timerShootRight: 1
	}, {
		timerShootLeft: 2,
		timerShootRight: 3
	}, {
		timerShootLeft: 4,
		timerShootRight: 5
	}]);
	return base;
}));
