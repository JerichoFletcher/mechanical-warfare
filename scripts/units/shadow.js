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
