const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const groundUnit = prov(() => extend(GroundUnit, {}));

const sabreAcid = extend(LiquidBulletType, {
	init(){
		this.liquid = Vars.content.getByName(ContentType.liquid, "mechanical-warfare-liquid-acid");
		this.super$init();
	}
});
sabreAcid.lifetime = 2;
sabreAcid.speed = 1;
sabreAcid.damage = 2;

const sabreFrag = extend(MissileBulletType, {});
sabreFrag.damage = 4;
sabreFrag.lifetime = 24;
sabreFrag.speed = 2.5;
sabreFrag.splashDamageRadius = 20;
sabreFrag.splashDamage = 5;
sabreFrag.frontColor = plib.frontColorAcid;
sabreFrag.backColor = plib.backColorAcid;
sabreFrag.homingPower = 0.5;
sabreFrag.homingRange = 75;
sabreFrag.fragBullets = 3;
sabreFrag.fragBullet = sabreAcid;
sabreFrag.status = StatusEffects.corroded;

const sabreMissile = extend(MissileBulletType, {
	hit(b, x, y){
		Effects.effect(this.hitEffect, b.x, b.y, b.rot());
		this.hitSound.at(b.x, b.y, 1);
		Effects.shake(this.hitShake, this.hitShake, b);
		for(var i = 0; i < this.fragBullets; i++){
			var len = Mathf.random(1, 7);
			var a = Mathf.random(360);
			Bullet.create(
				this.fragBullet, b, b.getTeam(), 
				b.x + Angles.trnsx(a, len), 
				b.y + Angles.trnsy(a, len), 
				a, Mathf.random(this.fragVelocityMin, this.fragVelocityMax), Mathf.random(0.8, 2.2)
			);
		}
		Damage.damage(
			b.getTeam(), b.x, b.y, 
			this.splashDamageRadius, this.splashDamage * b.damageMultiplier(),
			false
		);
	}
});
sabreMissile.bulletWidth = 9;
sabreMissile.bulletHeight = 13;
sabreMissile.lifetime = 64;
sabreMissile.speed = 2.5;
sabreMissile.damage = 20;
sabreMissile.frontColor = plib.frontColorAcid;
sabreMissile.backColor = plib.backColorAcid;
sabreMissile.homingPower = 0.5;
sabreMissile.homingRange = 50;
sabreMissile.shootEffect = Fx.shootBig;
sabreMissile.smokeEffect = Fx.shootBigSmoke;
sabreMissile.fragBullets = 10;
sabreMissile.fragBullet = sabreFrag;
sabreMissile.status = StatusEffects.corroded;

const sabreLauncher = extendContent(Weapon, "sabre-launcher", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-sabre-launcher-equip");
	}
});
sabreLauncher.width = 9;
sabreLauncher.length = 1;
sabreLauncher.reload = 90;
sabreLauncher.alternate = true;
sabreLauncher.recoil = 3;
sabreLauncher.shake = 2;
sabreLauncher.shots = 1;
sabreLauncher.ejectEffect = Fx.shellEjectBig;
sabreLauncher.shootSound = Sounds.shootBig;
sabreLauncher.bullet = sabreMissile;

const sabre = extendContent(UnitType, "sabre", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find(this.name + "-base");
		this.legRegion = Core.atlas.find(this.name + "-leg");
	}
});
sabre.weapon = sabreLauncher;
sabre.create(groundUnit);

const sabreFactory = extendContent(UnitFactory, "sabre-factory", {});
sabreFactory.unitType = sabre;
