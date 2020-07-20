const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const groundUnit = prov(() => extend(GroundUnit, {}));
const bulletLib = require("mechanical-warfare/bulletlib");

// Scrapper
const blade = extend(BasicBulletType, {
	draw(b){
		x = b.getData().target.getX();
		y = b.getData().target.getY();
		angle = Angles.angle(b.x, b.y, x, y);
		dst = Mathf.dst(b.x, b.y, x, y) * b.fslope();
		Drawf.tri(b.x, b.y, b.fout() * 3.4, dst, angle);
	},
	init(b){
		if(typeof(b) !== "undefined"){
			b.setData({target: b.getOwner().target});
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

// Rapier
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
				velocity: () => {return b.velocity()}
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
rapierBlade.damage = 14;
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

// Sabre
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

// Nullifier
const nullBullet = extend(BasicBulletType, {
  draw(b){
	elib.fillCircle(b.x, b.y, this.frontColor, 1, this.bulletWidth);
	elib.outlineCircle(b.x, b.y, this.backColor, 0.5, this.bulletWidth);
	if(b.timer.get(0, 4)){
      Effects.effect(this.trailEffectA, b.x, b.y, b.rot());
	}
	if(!Vars.state.isPaused()){
	  if(Mathf.chance(0.67)){
		Effects.effect(this.trailEffectB, b.x, b.y, b.rot());
	  }
	  Effects.effect(this.trailEffectC, b.x, b.y, b.rot());
	}
  }
});
nullBullet.hitSize = 8;
nullBullet.damage = 700;
nullBullet.speed = 4;
nullBullet.knockback = 3;
nullBullet.lifetime = 75;
nullBullet.backColor = Color.white;
nullBullet.frontColor = Color.black;
nullBullet.bulletWidth = nullBullet.bulletHeight = 7;
nullBullet.trailEffectA = newEffect(30, e => {
  var thickness = e.fout() * 3;
  var radius = 0.2 + e.fout() * 6;
  elib.outlineCircle(e.x, e.y, nullBullet.backColor, thickness, radius);
});
nullBullet.trailEffectB = newEffect(42, e => {
  Angles.randLenVectors(e.id + 2, 1, nullBullet.bulletWidth - 1, new Floatc2(){get: (a, b) => {
	elib.fillCircle(e.x + a, e.y + b, nullBullet.frontColor, 1, e.fout() * 3);
  }});
});
nullBullet.trailEffectC = newEffect(36, e => {
  var angle = (Time.time() + Mathf.randomSeed(e.id, 360)) % 360;
  var dist = nullBullet.bulletWidth + 1 - e.fout() * 1.5;
  elib.fillCircle(e.x + Angles.trnsx(angle, dist), e.y + Angles.trnsy(angle, dist), nullBullet.backColor, 1, e.fout() * 1.1);
});
nullBullet.hitEffect = newEffect(18, e => {
  elib.fillCircle(e.x, e.y, nullBullet.frontColor, 0.2 + e.fin() * 0.8, 0.2 + e.fout() * 19.8);
  
  var thickness = e.fin() * 4;
  var radius = e.fout() * 20;
  elib.outlineCircle(e.x, e.y, nullBullet.backColor, thickness, radius);
  
  var lnThickness = e.fin() * 2;
  var lnDistance = e.fout() * 12;
  var lnLength = e.fin() * 4;
  elib.splashLines(e.x, e.y, nullBullet.backColor, lnThickness, lnDistance, lnLength, 12, e.id);
  
  var crRadius = e.fout() * 3;
  var crDistance = e.fin() * 6;
  elib.splashCircles(e.x, e.y, Color.gray, 1, crRadius, crDistance, 4, e.id + 1);
});
nullBullet.despawnEffect = nullBullet.hitEffect;

const nullPointer = extendContent(Weapon, "null-pointer", {
  load(){
    this.region = Core.atlas.find("mechanical-warfare-null-pointer-equip");
  }
});
nullPointer.length = 21.5;
nullPointer.width = 30.25;
nullPointer.reload = 60;
nullPointer.alternate = true;
nullPointer.recoil = 6;
nullPointer.shake = 2.2;
nullPointer.inaccuracy = 2;
nullPointer.ejectEffect = Fx.shellEjectBig;
nullPointer.shootSound = Sounds.artillery;
nullPointer.bullet = nullBullet;

const nullifier = extendContent(UnitType, "nullifier", {
  load(){
    this.weapon.load();
    this.region = Core.atlas.find(this.name);
    this.baseRegion = Core.atlas.find(this.name + "-base");
    this.legRegion = Core.atlas.find(this.name + "-leg");
  }
});
nullifier.weapon = nullPointer;
nullifier.create(groundUnit);

// Anarchy
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
