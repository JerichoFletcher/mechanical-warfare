const ghostGlassFrag = extend(BasicBulletType, {});
ghostGlassFrag.damage = 9;
ghostGlassFrag.bulletWidth = 5;
ghostGlassFrag.bulletHeight = 12;
ghostGlassFrag.bulletShrink = 1;
ghostGlassFrag.lifetime = 20;
ghostGlassFrag.despawnEffect = Fx.none;

const ghostGlass = extend(FlakBulletType, {});
ghostGlass.damage = 12;
ghostGlass.splashDamage = 48;
ghostGlass.splashDamageRadius = 18;
ghostGlass.speed = 18;
ghostGlass.lifetime = 14;
ghostGlass.bulletWidth = 3;
ghostGlass.bulletHeight = 15;
ghostGlass.ammoMultiplier = 2;
ghostGlass.hitEffect = Fx.flakExplosion;
ghostGlass.fragBullets = 12;
ghostGlass.fragBullet = ghostGlassFrag;

const ghostPyratiteFrag = extend(BasicBulletType, {});
ghostPyratiteFrag.damage = 9;
ghostPyratiteFrag.bulletWidth = 5;
ghostPyratiteFrag.bulletHeight = 12;
ghostPyratiteFrag.bulletShrink = 1;
ghostPyratiteFrag.lifetime = 20;
ghostPyratiteFrag.status = StatusEffects.burning;
ghostPyratiteFrag.despawnEffect = Fx.none;

const ghostPyratite = extend(FlakBulletType, {});
ghostPyratite.damage = 12;
ghostPyratite.splashDamage = 48;
ghostPyratite.splashDamageRadius = 18;
ghostPyratite.speed = 16;
ghostPyratite.lifetime = 16;
ghostPyratite.bulletWidth = 4;
ghostPyratite.bulletHeight = 18;
ghostPyratite.ammoMultiplier = 2;
ghostPyratite.hitEffect = Fx.flakExplosion;
ghostPyratite.status = StatusEffects.burning;
ghostPyratite.fragBullets = 12;
ghostPyratite.fragBullet = ghostPyratiteFrag;

const ghostBlastCompoundFrag = extend(BasicBulletType, {});
ghostBlastCompoundFrag.damage = 14;
ghostBlastCompoundFrag.bulletWidth = 5;
ghostBlastCompoundFrag.bulletHeight = 12;
ghostBlastCompoundFrag.bulletShrink = 1;
ghostBlastCompoundFrag.lifetime = 20;
ghostBlastCompoundFrag.despawnEffect = Fx.none;

const ghostBlastCompound = extend(FlakBulletType, {});
ghostBlastCompound.damage = 20;
ghostBlastCompound.splashDamage = 68;
ghostBlastCompound.splashDamageRadius = 42;
ghostBlastCompound.speed = 15;
ghostBlastCompound.lifetime = 16;
ghostBlastCompound.bulletWidth = 3;
ghostBlastCompound.bulletHeight = 15;
ghostBlastCompound.ammoMultiplier = 2;
ghostBlastCompound.hitEffect = Fx.blastExplosion;
ghostBlastCompound.fragBullets = 12;
ghostBlastCompound.fragBullet = ghostBlastCompoundFrag;

const ghostPlastaniumFrag = extend(BasicBulletType, {});
ghostPlastaniumFrag.damage = 12;
ghostPlastaniumFrag.bulletWidth = 5;
ghostPlastaniumFrag.bulletHeight = 12;
ghostPlastaniumFrag.bulletShrink = 1;
ghostPlastaniumFrag.lifetime = 20;
ghostPlastaniumFrag.despawnEffect = Fx.none;

const ghostPlastanium = extend(FlakBulletType, {});
ghostPlastanium.damage = 18;
ghostPlastanium.splashDamage = 64;
ghostPlastanium.splashDamageRadius = 24;
ghostPlastanium.speed = 18;
ghostPlastanium.lifetime = 14;
ghostPlastanium.bulletWidth = 4;
ghostPlastanium.bulletHeight = 18;
ghostPlastanium.ammoMultiplier = 3;
ghostPlastanium.hitEffect = Fx.plasticExplosion;
ghostPlastanium.reloadMultiplier = 1.2;
ghostPlastanium.fragBullets = 12;
ghostPlastanium.fragBullet = ghostPlastaniumFrag;

const ghostSurge = extend(FlakBulletType, {
  update(b){
    if(Mathf.chance(0.33)){
      var cone = this.lightningCone;
      var rot = b.velocity().angle() + Mathf.random(-cone, cone);
      Calls.createLighting(b.id + Mathf.random(50), b.getTeam(), Pal.surge, this.lightningDamage, b.x, b.y, rot, 10);
    }
  },
  hit(b, x, y){
    if(typeof(x) !== "undefined" && typeof(y) !== "undefined"){this.super$hit(b, x, y)}
    for(var i = 0; i < this.lightningHitCount; i++){
      Calls.createLighting(b.id + Mathf.random(50), b.getTeam(), Pal.surge, this.lightningDamage, b.x, b.y, Mathf.random(360), 15);
    }
  }
});
ghostSurge.damage = 20;
ghostSurge.lightningDamage = 8;
ghostSurge.lightningHitCount = 10;
ghostSurge.splashDamage = 48;
ghostSurge.splashDamageRadius = 20;
ghostSurge.speed = 18;
ghostSurge.lifetime = 14;
ghostSurge.bulletWidth = 4;
ghostSurge.bulletHeight = 18;
ghostSurge.ammoMultiplier = 3;
ghostSurge.hitEffect = Fx.flakExplosion;
ghostSurge.reloadMultiplier = 0.8;
ghostSurge.lightningCone = 45;
ghostSurge.status = StatusEffects.shocked;

const ghostShellFrag = extend(BasicBulletType, {});
ghostPlastaniumFrag.damage = 17;
ghostPlastaniumFrag.bulletWidth = 5;
ghostPlastaniumFrag.bulletHeight = 12;
ghostPlastaniumFrag.bulletShrink = 1;
ghostPlastaniumFrag.lifetime = 20;
ghostPlastaniumFrag.despawnEffect = Fx.none;

const ghostShell = extend(FlakBulletType, {});
ghostShell.damage = 23;
ghostShell.splashDamage = 72;
ghostShell.splashDamageRadius = 42;
ghostShell.speed = 20;
ghostShell.lifetime = 13;
ghostShell.bulletWidth = 5;
ghostShell.bulletHeight = 21;
ghostShell.ammoMultiplier = 5;
ghostShell.hitEffect = Fx.blastExplosion;
ghostShell.fragBullets = 12;
ghostShell.fragBullet = ghostShellFrag;

ghost.shellAmmoName = modName + "-he-shell";
const ghost = extendContent(DoubleTurret, "ghost", {
  init(){
    this.super$init();
    this.shell = Vars.content.getByName(ContentType.item, this.shellAmmoName);
  },
});
ghost.ammo(
  Items.metaglass, ghostGlass,
  Items.pyratite, ghostPyratite,
  Items.blastCompound, ghostBlastCompound,
  Items.plastanium, ghostPlastanium,
  Items.surgealloy, ghostSurge,
  ghost.shell, ghostShell
);
