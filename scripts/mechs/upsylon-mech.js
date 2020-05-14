const elib = require("effectlib");
const plib = require("plib");

const shotgunRound = extend(BasicBulletType, {});
shotgunRound.damage = 8;
shotgunRound.bulletWidth = 5;
shotgunRound.bulletHeight = 12;
shotgunRound.bulletShrink = 0.3;
shotgunRound.drag = 0.01;
shotgunRound.speed = 6;
shotgunRound.lifetime = 17;
shotgunRound.hitEffect = Fx.hitBulletSmall;
shotgunRound.shootEffect = Fx.shootBig;
shotgunRound.smokeEffect = Fx.shootBigSmoke;

const shotgun = extendContent(Weapon, "shotgun", {
  load(){
    this.region = Core.atlas.find(modName + "-shotgun-equip");
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
shotgun.velocityRnd = 0.5;
shotgun.shootSound = Sounds.shootBig;
shotgun.bullet = shotgunRound;

const upsylon = extendContent(Mech, "upsylon-mech", {
  load(){
    this.weapon.load();
    this.region = Core.atlas.find(this.name);
  },
  updateAlt(player){
    if(player.shootHeat > 0.01){
      Time.run(this.secondaryReload / 2, run(() => {
        this._shots++;
        var i = Mathf.signs[this._shots % 2];
        this.pl1.trns(player.rotation - 90, i * this.weaponOffsetX, this.weaponOffsetY);
        var dir = player.rotation + i * this.secondaryAngle;
        Calls.createBullet(BulletType, player.getTeam(),
          player.x + this.pl1.x, player.y + this.pl1.y,
          dir, 1, 1
        );
      }));
    }
  }
});
upsylon.pl1 = new Vec2();
upsylon._shots = 0;
upsylon.secondaryAngle = 45;
upsylon.secondaryReload = 60;
upsylon.speed = 0.5;
upsylon.boostSpeed = 1.2;
upsylon.drag = 0.1;
upsylon.mass = 3.5;
upsylon.drillPower = 6;
upsylon.mineSpeed = 1.2;
upsylon.itemCapacity = 70;
upsylon.shake = 2;
upsylon.engineColor = plib.frontColorCyan;
upsylon.engineOffset = 5.6;
upsylon.health = 250;
upsylon.buildPower = 1.8;
upsylon.weaponOffsetX = 2;
upsylon.weapon = shotgun;
