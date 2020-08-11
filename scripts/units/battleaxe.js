const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const multiWeap = require("mechanical-warfare/units/multi-weapon-base");

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
