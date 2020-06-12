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

const ghostPyratite = extend(FlakBulletType, {});
ghostPyratite.damage = 66;
ghostPyratite.splashDamage = 102;
ghostPyratite.splashDamageRadius = 18;
ghostPyratite.speed = 16;
ghostPyratite.lifetime = 16;
ghostPyratite.bulletWidth = 4;
ghostPyratite.bulletHeight = 18;
ghostPyratite.ammoMultiplier = 2;
ghostPyratite.hitEffect = Fx.flakExplosion;
ghostPyratite.status = StatusEffects.burning;

const ghostBlastCompound = extend(FlakBulletType, {});
ghostBlastCompound.damage = 104;
ghostBlastCompound.splashDamage = 152;
ghostBlastCompound.splashDamageRadius = 42;
ghostBlastCompound.speed = 15;
ghostBlastCompound.lifetime = 16;
ghostBlastCompound.bulletWidth = 3;
ghostBlastCompound.bulletHeight = 15;
ghostBlastCompound.ammoMultiplier = 2;
ghostBlastCompound.hitEffect = Fx.blastExplosion;
ghostBlastCompound.reloadMultiplier = 0.6;

const ghostPlastaniumFrag = extend(BasicBulletType, {});
ghostPlastaniumFrag.damage = 12;
ghostPlastaniumFrag.bulletWidth = 5;
ghostPlastaniumFrag.bulletHeight = 12;
ghostPlastaniumFrag.bulletShrink = 1;
ghostPlastaniumFrag.lifetime = 20;
ghostPlastaniumFrag.despawnEffect = Fx.none;

const ghostPlastanium = extend(FlakBulletType, {});
ghostPlastanium.damage = 18;
ghostPlastanium.splashDamage = 56;
ghostPlastanium.splashDamageRadius = 24;
ghostPlastanium.speed = 18;
ghostPlastanium.lifetime = 14;
ghostPlastanium.bulletWidth = 4;
ghostPlastanium.bulletHeight = 18;
ghostPlastanium.ammoMultiplier = 3;
ghostPlastanium.hitEffect = Fx.plasticExplosion;
ghostPlastanium.fragBullets = 12;
ghostPlastanium.fragBullet = ghostPlastaniumFrag;

const ghostSurge = extend(FlakBulletType, {
  update(b){
    if(Mathf.chance(0.5)){
      var cone = this.lightningCone;
      var rot = b.velocity().angle() + Mathf.random(-cone, cone);
      Lightning.create(b.getTeam(), Pal.surge, this.lightningDamage, b.x, b.y, rot, 10);
    }
  },
  hit(b, x, y){
    this.super$hit(b, b.x, b.y);
    for(var i = 0; i < this.lightningHitCount; i++){
      Lightning.create(b.getTeam(), Pal.surge, this.lightningDamage, b.x, b.y, Mathf.random(360), 15);
    }
  }
});
ghostSurge.damage = 20;
ghostSurge.lightningDamage = 12;
ghostSurge.lightningHitCount = 5;
ghostSurge.splashDamage = 48;
ghostSurge.splashDamageRadius = 20;
ghostSurge.speed = 18;
ghostSurge.lifetime = 14;
ghostSurge.bulletWidth = 4;
ghostSurge.bulletHeight = 18;
ghostSurge.ammoMultiplier = 3;
ghostSurge.hitEffect = Fx.flakExplosion;
ghostSurge.reloadMultiplier = 1.2;
ghostSurge.lightningCone = 45;
ghostSurge.status = StatusEffects.shocked;

const ghostShell = extend(FlakBulletType, {});
ghostShell.damage = 125;
ghostShell.splashDamage = 174;
ghostShell.splashDamageRadius = 42;
ghostShell.speed = 20;
ghostShell.lifetime = 13;
ghostShell.bulletWidth = 5;
ghostShell.bulletHeight = 21;
ghostShell.ammoMultiplier = 5;
ghostShell.hitEffect = Fx.blastExplosion;

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
  },
});
