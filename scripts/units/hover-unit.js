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

// Apollyon
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

const apollyonAtt = {
	weaponCount: 3,
	rotateWeapon: [false, true, true],
	weaponAngles: [
		[0.0, 0.0],
		[0.0, 0.0],
		[0.0, 0.0]
	],
	shootCone: [30, 20, 60],
	weaponOffsetY: [0, -5.75, 12],
	weapon: [],
}
apollyonAtt.weapon[0] = multiWeap.newWeapon("apollyon-machine-gun", 0, null, null);
apollyonAtt.weapon[0].width = 8.25;
apollyonAtt.weapon[0].length = 16.75;
apollyonAtt.weapon[0].recoil = 1.8;
apollyonAtt.weapon[0].alternate = true;
apollyonAtt.weapon[0].inaccuracy = 3;
apollyonAtt.weapon[0].reload = 6;
apollyonAtt.weapon[0].ejectEffect = Fx.shellEjectBig;
apollyonAtt.weapon[0].shootSound = Sounds.shootBig;
apollyonAtt.weapon[0].bullet = apollyonBullet;

apollyonAtt.weapon[1] = multiWeap.newWeapon("apollyon-sniper", 1, null, null);
apollyonAtt.weapon[1].width = 13;
apollyonAtt.weapon[1].length = 1;
apollyonAtt.weapon[1].recoil = 2.5;
apollyonAtt.weapon[1].alternate = true;
apollyonAtt.weapon[1].inaccuracy = 0;
apollyonAtt.weapon[1].reload = 50;
apollyonAtt.weapon[1].ejectEffect = Fx.shellEjectBig;
apollyonAtt.weapon[1].shootSound = Sounds.shootBig;
apollyonAtt.weapon[1].bullet = apollyonHVBullet;

apollyonAtt.weapon[2] = multiWeap.newWeapon("apollyon-lasergun", 2, (weap, shooter, x, y, rotation, left) => {
	weap.shootSound.at(x, y, Mathf.random(1.8, 2.0));
	Angles.shotgun(weap.shots, weap.spacing, rotation, new Floatc(){get: f => {
		weap.bulletB(shooter, x, y, f);
	}});
}, null);
apollyonAtt.weapon[2].width = 18;
apollyonAtt.weapon[2].length = 19;
apollyonAtt.weapon[2].recoil = 2.5;
apollyonAtt.weapon[2].alternate = false;
apollyonAtt.weapon[2].inaccuracy = 0;
apollyonAtt.weapon[2].reload = 60;
apollyonAtt.weapon[2].ejectEffect = Fx.none;
apollyonAtt.weapon[2].shootSound = Sounds.shotgun;
apollyonAtt.weapon[2].bullet = apollyonLaser;

const apollyon = extendContent(UnitType, "apollyon", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
	},
	getAttributes(){
		return apollyonAtt;
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
			if(this.target !== null){
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

// Phantasm
const phantasmalFlak = extend(FlakBulletType, {});
phantasmalFlak.bulletSprite = "shell";
phantasmalFlak.bulletWidth = 6;
phantasmalFlak.bulletHeight = 10;
phantasmalFlak.bulletShrink = 0.3;
phantasmalFlak.speed = 12;
phantasmalFlak.lifetime = 15;
phantasmalFlak.damage = 5;
phantasmalFlak.explodeRange = 12;
phantasmalFlak.shootEffect = Fx.shootSmall;
phantasmalFlak.smokeEffect = Fx.shootSmallSmoke;
phantasmalFlak.hitEffect = Fx.flakExplosion;

const phantasmalGun = extendContent(Weapon, "phantasmal-gun", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-phantasmal-gun-equip");
	}
});
phantasmalGun.width = 4.5;
phantasmalGun.reload = 20;
phantasmalGun.alternate = true;
phantasmalGun.inaccuracy = 2;
phantasmalGun.ejectEffect = Fx.shellEjectSmall;
phantasmalGun.shootSound = Sounds.shootBig;
phantasmalGun.bullet = phantasmalFlak;

const phantasm = extendContent(UnitType, "phantasm", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
	}
});
phantasm.weapon = phantasmalGun;
phantasm.create(prov(() => {
	const unit = extend(HoverUnit, {
		draw(){
			Draw.mixcol(Color.white, this.hitTime / this.hitDuration);
			this.drawWeapons();
			Draw.rect(this.type.region, this.x, this.y, this.rotation - 90);
			Draw.mixcol();
		},
		drawWeapons(){
			for(var j = 0; j < 2; j++){
				i = Mathf.signs[j];
				angle = this.rotation - 90;
				trY = this.type.weaponOffsetY - this.type.weapon.getRecoil(this, (i > 0));
				w = -i * this.type.weapon.region.getWidth() * Draw.scl;
				h = this.type.weapon.region.getHeight() * Draw.scl;
				Draw.rect(this.type.weapon.region,
					this.x + Angles.trnsx(angle, this.getWeapon().width * i, trY),
					this.y + Angles.trnsy(angle, this.getWeapon().width * i, trY),
					w, h, angle
				);
			}
		}
	});
	return unit;
}));

const phantasmFactory = extendContent(UnitFactory, "phantasm-factory", {});
phantasmFactory.unitType = phantasm;

// Shadow
const shadowSalvo = extend(BasicBulletType, {});
shadowSalvo.inaccuracy = 0.5;
shadowSalvo.bulletWidth = 8;
shadowSalvo.bulletHeight = 10;
shadowSalvo.speed = 7;
shadowSalvo.lifetime = 30;
shadowSalvo.damage = 18;
shadowSalvo.shootEffect = Fx.shootBig;
shadowSalvo.smokeEffect = Fx.shootBigSmoke;

const shadowCaster = extendContent(Weapon, "shadow-caster", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-shadow-caster-equip");
	}
});
shadowCaster.width = 8;
shadowCaster.length = 2;
shadowCaster.recoil = 2;
shadowCaster.reload = 30;
shadowCaster.alternate = true;
shadowCaster.inaccuracy = 2;
shadowCaster.shots = 3;
shadowCaster.spacing = 0;
shadowCaster.shotDelay = 2;
shadowCaster.shootSound = Sounds.shootBig;
shadowCaster.bullet = shadowSalvo;

const shadow = extendContent(UnitType, "shadow", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
	},
	getEngineColor: function(){
		return Pal.engine;
	}
});
shadow.weapon = shadowCaster;
shadow.create(hoverUnit);

const shadowFactory = extendContent(UnitFactory, "shadow-factory", {});
shadowFactory.unitType = shadow;

// Battleaxe
const axeLava = extend(LiquidBulletType, {
	init(){
		this.liquid = Vars.content.getByName(ContentType.liquid, "mechanical-warfare-liquid-lava");
		this.super$init();
	}
});
axeLava.speed = 1;
axeLava.lifetime = 2;
axeLava.damage = 2;

const axe = extend(MissileBulletType, {
	draw(b){
		this.super$draw(b);
	}
});
axe.bulletWidth = 5;
axe.bulletHeight = 12;
axe.bulletShrink = 0.4;
axe.inaccuracy = 2;
axe.speed = 4;
axe.lifetime = 50;
axe.splashDamage = 24;
axe.splashDamageRadius = 16;
axe.frontColor = plib.frontColorLava;
axe.backColor = plib.backColorLava;
axe.shootEffect = Fx.shootBig;
axe.smokeEffect = Fx.shootBigSmoke;
axe.fragBullets = 3;
axe.fragBullet = axeLava;

const axeLauncher = extendContent(Weapon, "axe-launcher", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-axe-launcher-equip");
	}
});
axeLauncher.width = 7;
axeLauncher.recoil = 3;
axeLauncher.reload = 30;
axeLauncher.alternate = false;
axeLauncher.inaccuracy = 5;
axeLauncher.shots = 2;
axeLauncher.spacing = 0;
axeLauncher.shotDelay = 1;
axeLauncher.shootSound = Sounds.missile;
axeLauncher.bullet = axe;

const battleaxe = extendContent(UnitType, "battleaxe", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
	},
	getEngineColor: function(){
		return plib.engineColorCyan;
	}
});
battleaxe.weapon = axeLauncher;
battleaxe.create(hoverUnit);

const battleaxeFactory = extendContent(UnitFactory, "battleaxe-factory", {});
battleaxeFactory.unitType = battleaxe;

// Scythe
const scytheShell = extend(BasicBulletType, {
	draw(b){
		this.super$draw(b);
		if(b.timer.get(0, 3)){
			Effects.effect(this.trailEffect, b.x, b.y, b.rot());
		}
	}
});
scytheShell.collides = true;
scytheShell.collidesTiles = true;
scytheShell.collidesAir = true;
scytheShell.inaccuracy = 3;
scytheShell.bulletWidth = 10;
scytheShell.bulletHeight = 16;
scytheShell.frontColor = plib.frontColorCyan;
scytheShell.backColor = plib.backColorCyan;
scytheShell.speed = 7;
scytheShell.lifetime = 25;
scytheShell.damage = 15;
scytheShell.splashDamage = 15;
scytheShell.splashDamageRadius = 6;
scytheShell.shootEffect = Fx.shootBig;
scytheShell.smokeEffect = Fx.shootBigSmoke;
scytheShell.hitSound = Sounds.explosion;
scytheShell.trailEffect = newEffect(30, e => {
	elib.fillCircle(e.x, e.y, scytheShell.frontColor, 1, 0.2 + e.fout() * 2.5);
});
scytheShell.hitEffect = newEffect(27, e => {
	e.scaled(6, cons(i => {
		var thickness = i.fout() * 2;
		var radius = i.fout() * 8;
		elib.outlineCircle(e.x, e.y, scytheShell.frontColor, thickness, radius);
	}));
	
	var lnThickness = e.fout() * 2;
	var lnDistance = 4 + e.fin() * 16;
	var lnLength = e.fout() * 3;
	elib.splashLines(e.x, e.y, scytheShell.frontColor, lnThickness, lnDistance, lnLength, 3, e.id);
	
	var crRadius = e.fout() * 4;
	var crDistance = e.fin() * 6;
	elib.splashCircles(e.x, e.y, Color.gray, 1, crRadius, crDistance, 4, e.id + 1);
});
scytheShell.despawnEffect = scytheShell.hitEffect;

const scytheLauncher = extendContent(Weapon, "scythe-launcher", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-scythe-launcher-equip");
	}
});
scytheLauncher.width = 9;
scytheLauncher.recoil = 3;
scytheLauncher.reload = 50;
scytheLauncher.alternate = true;
scytheLauncher.inaccuracy = 2;
scytheLauncher.shots = 8;
scytheLauncher.spacing = 0.5;
scytheLauncher.shotDelay = 1;
scytheLauncher.velocityRnd = 0.3;
scytheLauncher.shootSound = Sounds.artillery;
scytheLauncher.ejectEffect = Fx.shellEjectBig;
scytheLauncher.bullet = scytheShell;

const scythe = extendContent(UnitType, "scythe", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
	},
	getEngineColor: function(){
		return plib.engineColorCyan;
	}
});
scythe.weapon = scytheLauncher;
scythe.create(hoverUnit);

const scytheFactory = extendContent(UnitFactory, "scythe-factory", {});
scytheFactory.unitType = scythe;
