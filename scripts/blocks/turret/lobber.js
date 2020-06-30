const elib = require("mechanical-warfare/effectlib")
const bulletLib = require("mechanical-warfare/bulletlib")

const trailEffect = newEffect(30, e => {
	Angles.randLenVectors(e.id, 3, e.data.dist, new Floatc2(){get: (a, b) => {
		elib.fillCircle(e.x + a, e.y + b, e.data.color, 1, e.fout() * e.data.size);
	}});
});

const scrapFrag = bulletLib.bullet(BasicBulletType, 7, 7, 1, 0.1, 12, 0, -1, 0, 4, 20, null, cons(b => {
	Effects.effect(trailEffect, b.x, b.y, b.rot(), {
		size: b.fout() * 2,
		color: scrapFrag.backColor,
		dist: Mathf.range(2.0)
	});
}), null, null);

const lobberScrap = bulletLib.bullet(ArtilleryBulletType, 12, 12, 0.3, 0, 0, 25, 16, 0, 4, 60, null, cons(b => {
	Effects.effect(trailEffect, b.x, b.y, b.rot(), {
		size: b.fslope() * 2.5,
		color: lobberScrap.backColor,
		dist: Mathf.range(2.5)
	});
}), null, null);
lobberScrap.bulletWidth = lobberScrap.bulletHeight = 12;
lobberScrap.bulletSprite = "shell";
lobberScrap.hitSound = Sounds.explosion;
lobberScrap.ammoMultiplier = 2;
lobberScrap.reloadMultiplier = 0.8;
lobberScrap.fragBullets = 3;
lobberScrap.fragBullet = scrapFrag;

const lobberCopper = bulletLib.bullet(ArtilleryBulletType, 12, 12, 0.3, 0, 0, 50, 16, 0, 3, 80, null, cons(b => {
	Effects.effect(trailEffect, b.x, b.y, b.rot(), {
		size: b.fslope() * 2.5,
		color: lobberCopper.backColor,
		dist: Mathf.range(2.5)
	});
}), null, null);
lobberCopper.bulletWidth = lobberCopper.bulletHeight = 13;
lobberCopper.bulletSprite = "shell";
lobberCopper.hitSound = Sounds.explosion;
lobberCopper.ammoMultiplier = 2;

const lobberCoal = bulletLib.bullet(ArtilleryBulletType, 12, 12, 0.3, 0, 0, 50, 16, 0, 2.6, 90, null, cons(b => {
	Effects.effect(trailEffect, b.x, b.y, b.rot(), {
		size: b.fslope() * 2.5,
		color: lobberCoal.backColor,
		dist: Mathf.range(2.5)
	});
}), null, null);
lobberCoal.frontColor = Pal.lightishOrange;
lobberCoal.backColor = Pal.lightOrange;
lobberCoal.bulletWidth = lobberCoal.bulletHeight = 13;
lobberCoal.bulletSprite = "shell";
lobberCoal.hitSound = Sounds.explosion;
lobberCoal.ammoMultiplier = 2;
lobberCoal.relaodMultiplier = 0.8;
lobberCoal.status = StatusEffects.burning;

const lobberHoming = bulletLib.bullet(ArtilleryBulletType, 12, 12, 0.3, 0, 0, 50, 16, 0, 3, 80, null, cons(b => {
	Effects.effect(trailEffect, b.x, b.y, b.rot(), {
		size: b.fslope() * 2.5,
		color: lobberHoming.backColor,
		dist: Mathf.range(2.5)
	});
}), null, null);
lobberHoming.bulletWidth = lobberHoming.bulletHeight = 14;
lobberHoming.bulletSprite = "shell";
lobberHoming.homingPower = 2;
lobberHoming.homingRange = 50;
lobberHoming.hitSound = Sounds.explosion;
lobberHoming.ammoMultiplier = 2;
lobberHoming.relaodMultiplier = 1.2;

const lobber = extendContent(ArtilleryTurret, "lobber", {
	init(){
		this.ammo(
			Items.scrap, lobberScrap, // Raw DPS: 48.8
			Items.copper, lobberCopper, // Raw DPS: 50
			Items.coal, lobberCoal, // Raw DPS: 40
			Items.silicon, lobberHoming // Raw DPS: 60
		);
		this.super$init();
	}
});