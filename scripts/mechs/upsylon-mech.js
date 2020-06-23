const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const bulletLib = require("mechanical-warfare/bulletlib");

const shotgunRound = bulletLib.bullet(BasicBulletType, 6, 9, 0.3, 0, 9, 0, -1, 0, 6, 17, null, null, null, null);
shotgunRound.frontColor = plib.frontColorCyan;
shotgunRound.backColor = plib.backColorCyan;
shotgunRound.hitEffect = Fx.hitBulletSmall;
shotgunRound.shootEffect = Fx.shootBig;
shotgunRound.smokeEffect = Fx.shootBigSmoke;

const shotgun = extendContent(Weapon, "shotgun", {
  load(){
    this.region = Core.atlas.find("mechanical-warfare-shotgun-equip");
  }
});
shotgun.width = 5;
shotgun.length = 5.5;
shotgun.recoil = 3;
shotgun.reload = 30;
shotgun.shots = 20;
shotgun.spacing = 0;
shotgun.inaccuracy = 12;
shotgun.alternate = true;
shotgun.ejectEffect = Fx.shellEjectBig;
shotgun.shake = 2;
shotgun.velocityRnd = 0.3;
shotgun.shootSound = Sounds.shootBig;
shotgun.bullet = shotgunRound;

const upsylonPlasma = bulletLib.bullet(BasicBulletType, 1, 1, 0, 0.08, Vars.state.rules.playerDamageMultiplier * 15, Vars.state.rules.playerDamageMultiplier * 30, 20, 0, 12, 48, cons(b => {
	elib.fillCircle(b.x, b.y, Pal.lancerLaser, 1, 6);
}), cons(b => {
	Effects.effect(upsylonPlasma.trailEffect, b.x, b.y, b.rot());
}), null, null);
upsylonPlasma.homingRange = upsylonPlasma.range();
upsylonPlasma.homingPower = 0.001;
upsylonPlasma.shootEffect = Fx.shootBig;
upsylonPlasma.smokeEffect = Fx.shootBigSmoke;
upsylonPlasma.trailEffect = newEffect(30, e => {
  elib.fillCircle(e.x, e.y, Pal.lancerLaser, 1, Mathf.lerp(6, 0.2, e.fin()));
});
upsylonPlasma.hitEffect = newEffect(16, e => {
  e.scaled(1.2, cons(i => {
	elib.outlineCircle(e.x, e.y, Pal.lancerLaser, i.fout() * 6, 1 + i.fin() * (upsylonPlasma.splashDamageRadius + 6));
  }));
  elib.fillCircle(e.x, e.y, Pal.lancerLaser, 0.2 + e.fout() * 0.8, Mathf.lerp(upsylonPlasma.splashDamageRadius, 0.2, e.fin()));
});
upsylonPlasma.despawnEffect = upsylonPlasma.hitEffect;
upsylonPlasma.hitSound = Sounds.explosion;

const upsylon = extendContent(Mech, "upsylon-mech", {
  load(){
    this.weapon.load();
    this.region = Core.atlas.find(this.name);
    this.baseRegion = Core.atlas.find(this.name + "-base");
    this.legRegion = Core.atlas.find(this.name + "-leg");
  },
  updateAlt(player){
    if(player.isShooting()){
      if(player.timer.get(player.timerAbility, this.secondaryReload)){
        Bullet.create(upsylonPlasma, player, player.getTeam(), player.x, player.y, player.rotation + Mathf.range(this.secondaryAngle / 2), 1, 1);
        this.secondaryShootSound.at(player.x, player.y, Mathf.random(0.9, 1.1));
      }
    }
  }
});
upsylon.pl1 = new Vec2();
upsylon._shots = 0;
upsylon.secondaryShootSound = Sounds.artillery;
upsylon.secondaryAngle = 45;
upsylon.secondaryReload = 30;
upsylon.speed = 0.5;
upsylon.maxSpeed = 2;
upsylon.boostSpeed = 1;
upsylon.mass = 3.5;
upsylon.drillPower = 6;
upsylon.mineSpeed = 1.2;
upsylon.itemCapacity = 70;
upsylon.shake = 2;
upsylon.engineColor = plib.engineColorCyan;
upsylon.engineOffset = 5.6;
upsylon.health = 250;
upsylon.buildPower = 1.8;
upsylon.weaponOffsetX = 2;
upsylon.weapon = shotgun;

const upsylonPad = extendContent(MechPad, "upsylon-mech-pad", {});
upsylonPad.mech = upsylon;
