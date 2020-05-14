const elib = require("effectlib");
const plib = require("plib");

const halberdBullet = extend(BasicBulletType, {});
halberdBullet.damage = 12;
halberdBullet.bulletWidth = 6;
halberdBullet.bulletHeight = 12;
halberdBullet.speed = 9;
halberdBullet.lifetime = 18;
halberdBullet.frontColor = plib.frontColorCyan;
halberdBullet.backColor = plib.backColorCyan;
halberdBullet.hitEffect = Fx.hitBulletSmall;
halberdBullet.shootEffect = Fx.shootBig;
halberdBullet.smokeEffect = Fx.shootBigSmoke;

const halberdBullet2 = extend(BasicBulletType, {
  update(b){
    Effects.effect(this.trailEffect, b.x, b.y, b.rot());
    if(Mathf.chance(0.1)){
      var cone = this.lightningCone;
      var rot = b.rot() + Mathf.random(-cone, cone);
      Calls.createLighting(b.id + Mathf.random(50), b.getTeam(), Pal.lancerLaser, this.lightningDamage, b.x, b.y, rot, 10);
    }
  },
  hit(b, x, y){
    this.super$hit(b, b.x, b.y);
    for(var i = 0; i < 3; i++){
      Calls.createLighting(b.id + Mathf.random(50), b.getTeam(), Pal.lancerLaser, this.lightningDamage, b.x, b.y, Mathf.random(360), 15);
    }
  }
});
halberdBullet2.collides = false;
halberdBullet2.collidesTile = false;
halberdBullet2.collidesAir = false;
halberdBullet2.collidesTeam = false;
halberdBullet2.lightningDamage = 12
halberdBullet2.lightningCone = 45;
halberdBullet2.damage = 0;
halberdBullet2.pierce = true;
halberdBullet2.speed = 12;
halberdBullet2.drag = 0.05;
halberdBullet2.lifetime = 60;
halberdBullet2.hitEffect = Fx.none;
halberdBullet2.shootEffect = Fx.shootBig;
halberdBullet2.smokeEffect = Fx.shootBigSmoke;
halberdBullet2.trailEffect = newEffect(30, e => {
  elib.fillCircle(e.x, e.y, Pal.lancerLaser, 1, Mathf.lerp(6, 0.2, e.fin()));
});
halberdBullet2.hitEffect = Fx.none;
halberdBullet2.despawnEffect = newEffect(20, e => {
  elib.outlineCircle(e.x, e.y, Pal.lancerLaser, e.fout() * 6, 1 + e.fin() * 14);
  elib.fillCircle(e.x, e.y, Pal.lancerLaser, 0.2 + e.fout() * 0.8, Mathf.lerp(12, 0.2, e.fin()));
});

const halberdGun = extendContent(Weapon, "gatling", {
  load(){
    this.region = Core.atlas.find(modName + "-gatling-equip");
  }
});
halberdGun.length = 1.2;
halberdGun.reload = 6;
halberdGun.alternate = true;
halberdGun.inaccuracy = 1;
halberdGun.ejectEffect = Fx.shellEjectSmall;
halberdGun.shootSound = Sounds.shootBig;
halberdGun.bullet = halberdBullet;

const halberd = extendContent(Mech, "halberd-ship", {
  load(){
    this.weapon.load();
    this.region = Core.atlas.find(this.name);
    this.heatRegion = Core.atlas.find(this.name + "-heat");
  },
  draw(player){
    this.super$draw(player);
    Draw.color(plib.frontColorCyan, plib.backColorCyan, Mathf.absin(4, 1));
    Draw.alpha(player.velocity().len() / this.maxSpeed);
    Draw.rect(this.heatRegion, player.x, player.y, player.rotation - 90);
    Draw.color();
  },
  updateAlt(player){
    for(var i = 0; i < 2; i++){
      this.pl1.trns(player.rotation - 90, Mathf.signs[i] * -22 / 4, -21 / 4);
      var scl = player.velocity().len() / this.maxSpeed;
      if(scl <= 0.33){
        Effects.effect(this.trailEffectA,
          player.x + this.pl1.x + player.velocity().x * 5 / 6,
          player.y + this.pl1.y + player.velocity().y * 5 / 6,
          player.velocity().angle());
      }else if(scl <= 0.67){
        Effects.effect(this.trailEffectB,
          player.x + this.pl1.x + player.velocity().x * 5 / 6,
          player.y + this.pl1.y + player.velocity().y * 5 / 6,
          player.velocity().angle());
      }else if(scl <= 1){
        Effects.effect(this.trailEffectC,
          player.x + this.pl1.x + player.velocity().x * 5 / 6,
          player.y + this.pl1.y + player.velocity().y * 5 / 6,
          player.velocity().angle());
      }
    }
    if(scl >= 0.75){
      if(Mathf.chance((player.velocity().len() / this.maxSpeed * 0.08))){
        this.pl2.trns(player.rotation - 90, 0, this.weaponOffsetY);
        var dir = player.velocity().angle() + Mathf.random(-this.plasmaCone, this.plasmaCone);
        Calls.createBullet(halberdBullet2, player.getTeam(),
          player.x + this.pl2.x, player.y + this.pl2.y,
          dir, 1, 1
        );
      }
    }
  },
});
halberd.trailEffectA = newEffect(30, e => {
  Draw.blend(Blending.additive);
  Draw.color(plib.frontColorCyan, plib.backColorCyan, e.fin());
  Fill.circle(e.x, e.y, e.fout() * 0.5 * halberd.engineSize);
  Draw.blend();
  Draw.color();
});
halberd.trailEffectB = newEffect(30, e => {
  Draw.blend(Blending.additive);
  Draw.color(plib.frontColorCyan, plib.backColorCyan, e.fin());
  Fill.circle(e.x, e.y, e.fout() * halberd.engineSize);
  Draw.blend();
  Draw.color();
});
halberd.trailEffectC = newEffect(30, e => {
  Draw.blend(Blending.additive);
  Draw.color(plib.frontColorCyan, plib.backColorCyan, e.fin());
  Fill.circle(e.x, e.y, e.fout() * 1.5 * halberd.engineSize);
  Draw.blend();
  Draw.color();
});
halberd.plasmaCone = 30;
halberd.pl1 = new Vec2();
halberd.pl2 = new Vec2();
halberd.flying = true;
halberd.drillPower = 4;
halberd.mineSpeed = 1.4;
halberd.speed = 0.16;
halberd.maxSpeed = 12;
halberd.drag = 0.008;
halberd.mass = 4;
halberd.health = 420; // WEED
halberd.itemCapacity = 80;
halberd.engineColor = plib.frontColorCyan;
halberd.cellTrnsY = 1;
halberd.buildPower = 1.2;
halberd.weapon = halberdGun;

const halberdPad = extendContent(MechPad, "halberd-ship-pad", {});
halberdPad.mech = halberd;
