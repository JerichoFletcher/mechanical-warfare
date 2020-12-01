const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const groundUnit = prov(() => extend(GroundUnit, {}));

const blade = extend(BasicBulletType, {
	draw(b){
		if(b.getData().target == null) return;

		x = b.getData().target.getX();
		y = b.getData().target.getY();
		angle = Angles.angle(b.x, b.y, x, y);
		dst = Mathf.dst(b.x, b.y, x, y) * b.fslope();
		Drawf.tri(b.x, b.y, b.fout() * 3.4, dst, angle);
	},
	init(b){
		if(typeof(b) !== "undefined"){
			b.setData({target: b.getOwner().target});
			if(b.getData().target == null) return;

			x = b.getData().target.getX();
			y = b.getData().target.getY();
			angle = Angles.angle(b.x, b.y, x, y);
			dst = Mathf.dst(b.x, b.y, x, y);
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, angle, dst);
		}
	},
	range(){
		return 40;
	}
});
blade.damage = 30;
blade.shootEffect = Fx.none;
blade.smokeEffect = Fx.none;
blade.hitEffect = Fx.none;
blade.despawnEffect = Fx.none;
blade.pierce = true;
blade.lifetime = 8;
blade.speed = 0.01;
blade.keepVelocity = false;

const scrapperBlade = extendContent(Weapon, "scrapper-blade", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-scrapper-blade-equip");
	}
});
scrapperBlade.width = 5.2;
scrapperBlade.length = 4;
scrapperBlade.reload = 50;
scrapperBlade.alternate = true;
scrapperBlade.shootSound = Sounds.splash;
scrapperBlade.recoil = -4.5;
scrapperBlade.ejectEffect = Fx.none;
scrapperBlade.bullet = blade;

const scrapper = extendContent(UnitType, "scrapper", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find(this.name + "-base");
		this.legRegion = Core.atlas.find(this.name + "-leg");
	}
});
scrapper.weapon = scrapperBlade;
scrapper.create(groundUnit);

const scrapperFactory = extendContent(UnitFactory, "scrapper-factory", {});
scrapperFactory.unitType = scrapper;
