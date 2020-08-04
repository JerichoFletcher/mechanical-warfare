const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const groundUnit = prov(() => extend(GroundUnit, {}));
const bulletLib = require("mechanical-warfare/bulletlib");

const rapierBlade = extend(BasicBulletType, {
	init(b){
		if(typeof(b) !== "undefined"){
			this.super$init();
			b.setData({
				hits: 0,
				target: null
			});
		}
	},
	hit(b, x, y){
		this.super$hit(b, b.x, b.y);
		b.setData({
			hits: b.getData().hits + 1,
			target: null
		});
		if(b.getData().hits >= 3){
			b.remove();
			return;
		}
		x2 = Mathf.range(32);
		y2 = Mathf.range(32);
		b.set(b.x + x2, b.y + y2);
		b.time(0);
		targ = Units.closestTarget(b.getTeam(), b.x, b.y, this.range(), boolf(u => !u.isDead()), boolf(t => !t.isDead()));
		b.setData({
			hits: b.getData().hits,
			target: targ
		});
		if(b.getData().target == null){
			b.remove();
			return;
		}
		b.velocity().set(0, 0.5).setAngle(Angles.angle(b.x, b.y, b.getData().target.getX(), b.getData().target.getY()));
		Effects.effect(this.chargeEffect, b.x, b.y, b.rot());
		Time.run(10, run(() => {
			if(b == null || b.getData() == null){return;}
			if(b.getData().target == null && b != null){
				b.remove();
				return;
			}
			Effects.effect(this.launchEffect, b.x, b.y, b.rot());
			bullet = new TargetTrait(){
				isDead: () => {return b == null},
				getTeam: () => {return b.getTeam()},
				getX: () => {return b.getX()},
				getY: () => {return b.getY()},
				setX: (x) => {b.x = x},
				setY: (y) => {b.y = y},
				velocity: () => {return b.velocity()},
				getTargetVelocityX: () => {return b.velocity().x},
				getTargetVelocityY: () => {return b.velocity().y}
			}
			result = Predict.intercept(bullet, b.getData().target, this.speed);
			targetRot = result.sub(b.x, b.y).angle();
			b.velocity().set(0, this.speed).setAngle(targetRot);
		}));
	}
});
rapierBlade.bulletSprite = "mechanical-warfare-blade";
rapierBlade.bulletWidth = 10;
rapierBlade.bulletHeight = 20;
rapierBlade.damage = 17;
rapierBlade.speed = 4;
rapierBlade.lifetime = 40;
rapierBlade.pierce = true;
rapierBlade.frontColor = plib.frontColorCyan;
rapierBlade.backColor = plib.backColorCyan;
rapierBlade.shootEffect = newEffect(30, e => {
	for(var i = 0; i < 2; i++){
		sign = Mathf.signs[i];
		Angles.randLenVectors(e.id, 7, e.finpow() * 16, e.rotation + (sign * 30), 12, new Floatc2(){get: (x, y) => {
			elib.fillPolygon(e.x + x, e.y + y, plib.frontColorCyan, 1, 4, e.fout() * 2, Time.time() * 2 * sign);
		}});
	}
});
rapierBlade.smokeEffect = Fx.none;
rapierBlade.hitEffect = newEffect(48, e => {
	e.scaled(30, cons(i => {
		angle = e.rotation;
		dst = i.finpow() * 4;
		Draw.color(rapierBlade.backColor);
		Draw.alpha(i.fout());
		Draw.rect(Core.atlas.find(rapierBlade.bulletSprite + "-back"),
			e.x + Angles.trnsx(angle, dst),
			e.y + Angles.trnsy(angle, dst),
			rapierBlade.bulletWidth, rapierBlade.bulletHeight,
			e.rotation - 90
		);
		Draw.color(rapierBlade.frontColor);
		Draw.alpha(i.fout());
		Draw.rect(Core.atlas.find(rapierBlade.bulletSprite),
			e.x + Angles.trnsx(angle, dst),
			e.y + Angles.trnsy(angle, dst),
			rapierBlade.bulletWidth, rapierBlade.bulletHeight,
			e.rotation - 90
		);
	}));
	Angles.randLenVectors(e.id, 12, e.finpow() * 16, e.rotation, 45, new Floatc2(){get: (x, y) => {
		elib.fillPolygon(e.x + x, e.y + y, plib.frontColorCyan, 1, 4, e.fout() * 2, Time.time() * 2);
	}});
});
rapierBlade.launchEffect = newEffect(32, e => {
	e.scaled(16, cons(i => {
		Angles.randLenVectors(e.id, 8, i.finpow() * 24, e.rotation + 180, 50, new Floatc2(){get: (x, y) => {
			elib.fillCircle(e.x + x, e.y + y, plib.backColorCyan, 1, i.fout() * 1.4);
		}});
	}));
	Angles.randLenVectors(e.id, 10, e.finpow() * 32, e.rotation + 180, 40, new Floatc2(){get: (x, y) => {
		elib.fillPolygon(e.x + x, e.y + y, plib.frontColorCyan, 1, 4, e.fout() * 2, Time.time() * 2);
	}});
});
rapierBlade.chargeEffect = newEffect(16, e => {
	e.scaled(8, cons(i => {
		elib.outlineCircle(e.x, e.y, plib.frontColorCyan, i.fin() * 1.5, i.fout() * 15);
	}));
	elib.splashLines(e.x, e.y, plib.backColorCyan, e.fslope() * 1.8, e.fout() * 32, e.fslope() * 8, 8, e.id);
});

const rapierGun = extendContent(Weapon, "rapier-gun", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-rapier-gun-equip");
	}
});
rapierGun.width = 8;
rapierGun.length = 5;
rapierGun.reload = 120;
rapierGun.alternate = true;
rapierGun.recoil = 2;
rapierGun.shootSound = Sounds.shootBig;
rapierGun.ejectEffect = Fx.none;
rapierGun.bullet = rapierBlade;

const rapier = extendContent(UnitType, "rapier", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find(this.name + "-base");
		this.legRegion = Core.atlas.find(this.name + "-leg");
	}
});
rapier.weapon = rapierGun;
rapier.create(groundUnit);

const rapierFactory = extendContent(UnitFactory, "rapier-factory", {});
rapierFactory.unitType = rapier;
