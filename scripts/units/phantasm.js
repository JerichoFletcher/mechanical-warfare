const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const multiWeap = require("mechanical-warfare/units/multi-weapon-base");

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

const teleportEffect1 = newEffect(48, e => {
	x = Angles.trnsx(e.rotation, 0, e.finpow() * 8);
	y = Angles.trnsy(e.rotation, 0, e.finpow() * 8);
	Draw.blend(Blending.additive);
	Draw.alpha(e.fout());
	Draw.rect(phantasm.region, e.x + x, e.y + y, e.rotation - 90);
	Draw.color();
	Draw.blend();
});

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
		},
		damage(amount){
			this.super$damage(amount);
			if(this.timer.get(this.timerTeleport, 60) && !this.isDead()){
				this.teleport();
			}
		},
		teleport(){
			x = Angles.trnsx(this.rotation - 90, Mathf.randomSeed(this.id + Time.time(), 64) - 32, -Mathf.randomSeed(this.id + Time.time() + 1, 80));
			y = Angles.trnsy(this.rotation - 90, Mathf.randomSeed(this.id + Time.time(), 64) - 32, -Mathf.randomSeed(this.id + Time.time() + 1, 80));
			Effects.effect(teleportEffect1, this.x, this.y, this.rotation);
			this.set(this.x + x, this.y + y);
			Core.app.post(run(() => {
				Effects.effect(teleportEffect1, this.x, this.y, this.rotation);
			}));
		}
	});
	unit.timerTeleport = unit.timerIndex++;
	return unit;
}));

const phantasmFactory = extendContent(UnitFactory, "phantasm-factory", {});
phantasmFactory.unitType = phantasm;
