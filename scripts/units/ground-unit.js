const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const groundUnit = prov(() => extend(GroundUnit, {}));

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
nullPointer.length = 18;
nullPointer.width = 30;
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
