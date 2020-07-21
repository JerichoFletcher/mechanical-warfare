const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const groundUnit = prov(() => extend(GroundUnit, {}));
const bulletLib = require("mechanical-warfare/bulletlib");

const hvBullet = bulletLib.bullet(BasicBulletType, 8, 15, 0, 0, 50, 0, 0, 2, 16, 18, null, null, null, null);
hvBullet.bulletSprite = "mechanical-warfare-hvbullet";

const flakPopper = extend(FlakBulletType, {
	init(b){
		if(typeof(b) !== "undefined"){
			b.setData({
				target: null
			});
		}
	},
	hit(b, x, y){
		this.super$hit(b, b.x, b.y);
		targ = Units.closestTarget(b.getTeam(), b.x, b.y, this.range(), boolf(u => !u.isDead()), boolf(t => !t.isDead()));
		b.setData({
			target: targ
		});
		if(
			b.getData().target == null ||
			b == null
		){return;}
		bullet = new TargetTrait(){
			isDead: () => {return b == null},
			getTeam: () => {return b.getTeam()},
			getX: () => {return b.x},
			getY: () => {return b.y},
			setX: (x) => {b.x = x},
			setY: (y) => {b.y = y},
			velocity: () => {return b.velocity()}
		}
		result = Predict.intercept(bullet, b.getData().target, this.getBullet().speed);
		targetRot = result.sub(b.x, b.y).angle();
		Bullet.create(this.getBullet(), b, b.getTeam(), b.x, b.y, targetRot, 1, 1);
		Sounds.missile.at(b.x, b.y, Mathf.random(0.8, 1.2));
	},
	range(){
		return this.getBullet().range();
	},
	getBullet(){
		return hvBullet;
	}
});
flakPopper.bulletWidth = flakPopper.bulletHeight = 12;
flakPopper.bulletShrink = 0.2;
flakPopper.drag = 0.2;
flakPopper.damage = 32;
flakPopper.splashDamage = 12;
flakPopper.splashDamageRadius = 32;
flakPopper.speed = 8;
flakPopper.lifetime = 15;
flakPopper.shootEffect = Fx.shootBig;
flakPopper.smokeEffect = Fx.shootBigSmoke;
flakPopper.hitEffect = Fx.blastExplosion;
flakPopper.despawnEffect = Fx.blastExplosion;

const domination = extendContent(Weapon, "domination", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-domination-equip");
	}
});
domination.width = 20.5;
domination.length = 13.25;
domination.reload = 60;
domination.recoil = 2.4;
domination.alternate = true;
domination.shots = 6;
domination.inaccuracy = 50;
domination.shootSound = Sounds.shootBig;
domination.ejectEffect = Fx.shellEjectBig;
domination.bullet = flakPopper;

const dominator = extendContent(UnitType, "dominator", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find(this.name + "-base");
		this.legRegion = Core.atlas.find(this.name + "-leg");
	}
});
dominator.weapon = domination;
dominator.create(groundUnit);
