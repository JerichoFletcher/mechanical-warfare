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
  draw(b){
	elib.fillCircle(b.x, b.y, Pal.lancerLaser, 1, this._size);
	Effects.effect(this.trailEffect, b.x, b.y, b.rot());
  },
  update(b){
    if(Mathf.chance(0.1)){
      var cone = this.lightningCone;
      var rot = b.rot() + Mathf.random(-cone, cone);
      Calls.createLighting(b.id + Mathf.random(50), b.getTeam(), Pal.lancerLaser, Vars.state.rules.playerDamageMultiplier * this.lightningDamage, b.x, b.y, rot, 10);
    }
  },
  hit(b, x, y){
    this.super$hit(b, b.x, b.y);
    for(var i = 0; i < 3; i++){
      Calls.createLighting(b.id + Mathf.random(50), b.getTeam(), Pal.lancerLaser, Vars.state.rules.playerDamageMultiplier * this.lightningDamage, b.x, b.y, Mathf.random(360), 15);
    }
  }
});
halberdBullet2.lightningDamage = 10;
halberdBullet2.lightningCone = 45;
halberdBullet2.hitTiles = false;
halberdBullet2.collidesTile = false;
halberdBullet2.collides = false;
halberdBullet2.damage = 0;
halberdBullet2.speed = 12;
halberdBullet2.drag = 0.05;
halberdBullet2.lifetime = 60;
halberdBullet2.shootEffect = Fx.shootBig;
halberdBullet2.smokeEffect = Fx.shootBigSmoke;
halberdBullet2._size = 6;
halberdBullet2.trailEffect = newEffect(30, e => {
  elib.fillCircle(e.x, e.y, Pal.lancerLaser, 1, Mathf.lerp(halberdBullet2._size, 0.2, e.fin()));
});
halberdBullet2.despawnEffect = newEffect(20, e => {
  elib.outlineCircle(e.x, e.y, Pal.lancerLaser, e.fout() * halberdBullet2._size, 1 + e.fin() * 14);
  elib.fillCircle(e.x, e.y, Pal.lancerLaser, 0.2 + e.fout() * 0.8, Mathf.lerp(halberdBullet2._size * 2, 0.2, e.fin()));
});
halberdBullet2.hitEffect = halberdBullet2.despawnEffect;

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
	
	var scl = player.velocity().len() / this.maxSpeed;
	for(var i = 0; i < 2; i++){
	  var angle = player.rotation - 90;
	  var cx = Angles.trnsx(angle, Mathf.signs[i] * -22 / 4, -21 / 4);
	  var cy = Angles.trnsy(angle, Mathf.signs[i] * -22 / 4, -21 / 4);
	  if(scl > 0.5){
		Effects.effect(this._trailEffect,
		  player.x + cx + player.velocity().x * 5 / 6,
		  player.y + cy + player.velocity().y * 5 / 6,
		  player.velocity().angle(), scl
		);
	  }else{
		Effects.effect(this._trailEffect,
		  player.x + cx + player.velocity().x * 5 / 6,
		  player.y + cy + player.velocity().y * 5 / 6,
		  player.velocity().angle(), this._trailMinSize / this._trailSize
		);
	  }
    }
  },
  updateAlt(player){
    var scl = player.velocity().len() / this.maxSpeed;
    if(scl >= 0.75){
      if(Mathf.chance((player.velocity().len() / this.maxSpeed * 0.08))){
        this.pl2.trns(player.rotation - 90, 0, this.weaponOffsetY);
        var dir = player.velocity().angle() + Mathf.random(-this.plasmaCone, this.plasmaCone);
        Calls.createBullet(halberdBullet2, player.getTeam(),
          player.x + this.pl2.x, player.y + this.pl2.y,
          dir, 1, 1
        );
        this.plasmaShootSound.at(player.x, player.y, Mathf.random(0.9, 1.1))
      }
    }
  },
});
halberd._trailEffect = newEffect(30, e => {
  Draw.blend(Blending.additive);
  Draw.color(plib.frontColorCyan, plib.backColorCyan, e.fin());
  Fill.circle(e.x, e.y, e.fout() * halberd._trailSize * e.data);
  Draw.blend();
  Draw.color();
});
halberd._trailMinSize = 1.25;
halberd._trailSize = 4;
halberd.plasmaShootSound = Sounds.missile;
halberd.plasmaCone = 30;
halberd.pl2 = new Vec2();
halberd.flying = true;
halberd.drillPower = 4;
halberd.mineSpeed = 1.4;
halberd.speed = 0.16;
halberd.maxSpeed = 12;
halberd.drag = 0.008;
halberd.mass = 4;
halberd.health = 320;
halberd.itemCapacity = 80;
halberd.engineColor = plib.engineColorCyan;
halberd.cellTrnsY = 1;
halberd.buildPower = 1.2;
halberd.weapon = halberdGun;

const halberdPad = extendContent(MechPad, "halberd-ship-pad", {});
halberdPad.mech = halberd;
