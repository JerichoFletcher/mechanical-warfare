const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const bulletLib = require("mechanical-warfare/bulletlib");

const ghostGlassFrag = bulletLib.bullet(BasicBulletType, 5, 12, 1, 0.5, 9, 0, -1, 0, 2, 20, null, null, null, null, null);
ghostGlassFrag.despawnEffect = Fx.none;

const ghostGlass = bulletLib.bullet(FlakBulletType, 3, 15, 0, 0, 12, 48, 18, 0, 18, 14, null, null, null, null, null);
ghostGlass.ammoMultiplier = 2;
ghostGlass.fragBullets = 12;
ghostGlass.fragBullet = ghostGlassFrag;
ghostGlass.hitEffect = Fx.flakExplosion;
ghostGlass.despawnEffect = Fx.flakExplosion;

const ghostPyratite = bulletLib.bullet(FlakBulletType, 4, 18, 0, 0, 66, 102, 18, 0, 16, 16, null, null, null, null, null);
ghostPyratite.ammoMultiplier = 2;
ghostPyratite.hitEffect = Fx.flakExplosion;
ghostPyratite.despawnEffect = Fx.flakExplosion;

const ghostBlastCompound = bulletLib.bullet(FlakBulletType, 3, 15, 0, 0, 104, 152, 42, 0, 15, 16, null, null, null, null, null);
ghostBlastCompound.ammoMultiplier = 2;
ghostBlastCompound.reloadMultiplier = 0.6;
ghostBlastCompound.hitEffect = Fx.blastExplosion;
ghostBlastCompound.despawnEffect = Fx.blastExplosion;

const ghostPlastaniumFrag = bulletLib.bullet(BasicBulletType, 5, 12, 1, 0.5, 12, 0, -1, 0, 2, 20, null, null, null, null, null);
ghostPlastaniumFrag.despawnEffect = Fx.none;

const ghostPlastanium = bulletLib.bullet(FlakBulletType, 4, 18, 0, 0, 18, 56, 24, 0, 18, 14, null, null, null, null, null);
ghostPlastanium.ammoMultiplier = 3;
ghostPlastanium.fragBullets = 12;
ghostPlastanium.fragBullet = ghostPlastaniumFrag;
ghostPlastanium.hitEffect = Fx.plasticExplosion;
ghostPlastanium.despawnEffect = Fx.plasticExplosion;

const ghostSurge = bulletLib.bullet(FlakBulletType, 4, 18, 0, 0, 20, 48, 20, 0, 18, 14, cons(b => {
	elib.fillCircle(b.x, b.y, Pal.surge, 1, 4);
	if(!Vars.state.isPaused()){
		Effects.effect(ghostSurge.trailEffect, b.x, b.y, b.rot());
	}
}), null, cons(b => {
	if(Mathf.chance(0.3)){
		cone = 45;
		rot = b.rot() + Mathf.range(cone);
		Lightning.create(b.getTeam(), Pal.surge, 12, b.x, b.y, rot, 10);
	}
}), cons(b => {
	for(var i = 0; i < 5; i++){
		Lightning.create(b.getTeam(), Pal.surge, 12, b.x, b.y, Mathf.random(360), 15);
	}
}), null);
ghostSurge.trailEffect = newEffect(5, e => {
	elib.fillCircle(e.x, e.y, Pal.surge, 1, e.fout() * 2);
});
ghostSurge.ammoMultiplier = 3;
ghostSurge.reloadMultiplier = 1.2;
ghostSurge.status = StatusEffects.shocked;
ghostSurge.hitEffect = Fx.flakExplosion;
ghostSurge.despawnEffect = ghostSurge.hitEffect;

const ghostShell = bulletLib.bullet(FlakBulletType, 5, 21, 0, 0, 125, 174, 42, 0, 20, 13, null, null, null, null, null);
ghostShell.ammoMultiplier = 5;
ghostShell.hitEffect = Fx.blastExplosion;
ghostShell.despawnEffect = Fx.blastExplosion;

const ghost = extendContent(DoubleTurret, "ghost", {
	init(){
		ghost.ammo(
			Items.metaglass, ghostGlass, // Raw DPS: 672
			Items.pyratite, ghostPyratite, // Raw DPS: 672
			Items.blastCompound, ghostBlastCompound, // Raw DPS: 731
			Items.plastanium, ghostPlastanium, // Raw DPS: 872
			Items.surgealloy, ghostSurge, // Raw DPS: 640
			Vars.content.getByName(ContentType.item, "mechanical-warfare-he-shell"), ghostShell // Raw DPS: 1196
		);
		this.super$init();
	}
});
