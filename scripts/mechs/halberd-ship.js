const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const bulletLib = require("mechanical-warfare/bulletlib");

const halberdBullet = bulletLib.bullet(BasicBulletType, 6, 12, 0, 0, 12, 0, -1, 0, 9, 18, null, null, null, null, null);
halberdBullet.frontColor = plib.frontColorCyan;
halberdBullet.backColor = plib.backColorCyan;
halberdBullet.hitEffect = Fx.hitBulletSmall;
halberdBullet.shootEffect = Fx.shootBig;
halberdBullet.smokeEffect = Fx.shootBigSmoke;

const halberdBullet2 = bulletLib.bullet(BasicBulletType, 1, 1, 0, 0.05, 0, 0, -1, 0, 12, 60, cons(b => {
	elib.fillCircle(b.x, b.y, Pal.lancerLaser, 1, 6);
}), cons(b => {
	Effects.effect(halberdBullet2.trailEffect, b.x, b.y, b.rot());
}), cons(b => {
	if(Mathf.chance(0.1)){
		cone = 45;
		rot = b.rot() + Mathf.range(cone);
		Lightning.create(b.getTeam(), Pal.lancerLaser, Vars.state.rules.playerDamageMultiplier * 10, b.x, b.y, rot, 10);
	}
}), cons(b => {
	for(var i = 0; i < 3; i++){
		Lightning.create(b.getTeam(), Pal.lancerLaser, Vars.state.rules.playerDamageMultiplier * 10, b.x, b.y, Mathf.random(360), 15);
	}
}), null);
halberdBullet2.hitTiles = false;
halberdBullet2.collidesTile = false;
halberdBullet2.collides = false;
halberdBullet2.shootEffect = Fx.shootBig;
halberdBullet2.smokeEffect = Fx.shootBigSmoke;
halberdBullet2.trailEffect = newEffect(30, e => {
  elib.fillCircle(e.x, e.y, Pal.lancerLaser, 1, Mathf.lerp(6, 0.2, e.fin()));
});
halberdBullet2.despawnEffect = newEffect(20, e => {
  e.scaled(1.2, cons(i => {
	elib.outlineCircle(e.x, e.y, Pal.lancerLaser, i.fout() * 6, 1 + i.fin() * 14);
  }));
  elib.fillCircle(e.x, e.y, Pal.lancerLaser, 0.2 + e.fout() * 0.8, Mathf.lerp(6 * 2, 0.2, e.fin()));
});
halberdBullet2.hitEffect = halberdBullet2.despawnEffect;

const halberdGun = extendContent(Weapon, "gatling", {
  load(){
    this.region = Core.atlas.find("mechanical-warfare-gatling-equip");
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
		if(!Vars.state.isPaused()){
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
		}
  },
  updateAlt(player){
    var scl = player.velocity().len() / this.maxSpeed;
    if(scl >= 0.75){
      if(Mathf.chance((player.velocity().len() / this.maxSpeed * 0.08))){
        this.pl2.trns(player.rotation - 90, 0, this.weaponOffsetY);
        var dir = player.velocity().angle() + Mathf.range(this.plasmaCone);
        Bullet.create(halberdBullet2, player, player.getTeam(),
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
