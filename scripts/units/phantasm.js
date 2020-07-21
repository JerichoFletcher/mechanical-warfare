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
