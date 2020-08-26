const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const groundUnit = prov(() => extend(GroundUnit, {}));

const anarchyShell = extend(BasicBulletType, {
	draw(b){
		this.super$draw(b);
		if(b.timer.get(0, 3)){
			Effects.effect(this.trailEffect, b.x, b.y, b.rot());
		}
	}
});
anarchyShell.bulletWidth = 17;
anarchyShell.bulletHeight = 22;
anarchyShell.bulletShrink = 0.3;
anarchyShell.speed = 8;
anarchyShell.lifetime = 50;
anarchyShell.damage = 150;
anarchyShell.splashDamage = 100;
anarchyShell.splashDamageRadius = 16;
anarchyShell.inaccuracy = 2;
anarchyShell.hitShake = 3;
anarchyShell.frontColor = plib.frontColorCyan;
anarchyShell.backColor = plib.backColorCyan;
anarchyShell.hitSound = Sounds.explosion;
anarchyShell.shootEffect = Fx.shootBig;
anarchyShell.smokeEffect = Fx.shootBigSmoke;
anarchyShell.trailEffect = newEffect(30, e => {
	elib.fillCircle(e.x, e.y, anarchyShell.frontColor, 1, 0.2 + e.fout() * 4.8);
});
anarchyShell.hitEffect = newEffect(27, e => {
	elib.fillCircle(e.x, e.y, anarchyShell.backColor, 0.2 + e.fin() * 0.8, e.fout() * 16);
	
	e.scaled(4, cons(i => {
		var cThickness = i.fout() * 4;
		var cRadius = i.fin() * 20;
		elib.outlineCircle(e.x, e.y, anarchyShell.frontColor, cThickness, cRadius);
	}));
	
	var lnThickness = e.fout() * 2;
	var lnDistance = 4 + e.fin() * 24;
	var lnLength = e.fout() * 5;
	elib.splashLines(e.x, e.y, anarchyShell.frontColor, lnThickness, lnDistance, lnLength, 10, e.id);
	
	var crRadius = e.fout() * 4;
	var crDistance = e.fin() * 6;
	elib.splashCircles(e.x, e.y, Color.gray, 1, crRadius, crDistance, 4, e.id + 1);
});
anarchyShell.despawnEffect = anarchyShell.hitEffect;

const anarchyBlaster = extendContent(Weapon, "anarchy-blaster", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-anarchy-blaster-equip");
	}
});
anarchyBlaster.length = 15;
anarchyBlaster.width = 20;
anarchyBlaster.reload = 80;
anarchyBlaster.alternate = true;
anarchyBlaster.recoil = 6;
anarchyBlaster.shake = 3;
anarchyBlaster.inaccuracy = 3;
anarchyBlaster.shots = 2;
anarchyBlaster.shotDelay = 0;
anarchyBlaster.spacing = 0;
anarchyBlaster.ejectEffect = Fx.shellEjectBig;
anarchyBlaster.shootSound = Sounds.artillery;
anarchyBlaster.bullet = anarchyShell;

const anarchy = extendContent(UnitType, "anarchy", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find(this.name + "-base");
		this.legRegion = Core.atlas.find(this.name + "-leg");
	}
});
anarchy.weapon = anarchyBlaster;
anarchy.create(groundUnit);
