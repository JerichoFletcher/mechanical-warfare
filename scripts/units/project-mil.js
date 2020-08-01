const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const wormlib = require("mechanical-warfare/units/worm-base");

const projMil = extendContent(UnitType, "project-mil", {
	load(){
		this.super$load();
		this.region = Core.atlas.find(this.name + "-head");
		this.bodyRegion = Core.atlas.find(this.name + "-body");
		this.tailRegion = Core.atlas.find(this.name + "-body");
	},
	getReg(){
		return {
			head: this.region,
			body: this.bodyRegion,
			tail: this.tailRegion
		}
	},
});

const milBullet = extend(BasicBulletType, {});
milBullet.keepVelocity = false;
milBullet.damage = 6;
milBullet.speed = 5;
milBullet.lifetime = 24;

const milBlaster = extendContent(Weapon, "mil-blaster", {
	load(){
		this.region = Core.atlas.find("clear");
	}
});
milBlaster.alternate = true;
milBlaster.reload = 135;
milBlaster.bullet = milBullet;
milBlaster.shootSound = Sounds.shootSnap;

projMil.weapon = milBlaster;
projMil.shootCone = 90;
projMil.create(prov(() => {
	unit = wormlib.newBase(7, 7, 0.12, 27, false, null, null, null, null, null, []);
	return unit;
}));
