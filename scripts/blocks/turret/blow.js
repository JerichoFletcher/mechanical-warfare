const elib = require("effectlib");
const plib = require("plib");

const blowShell = extend(BasicBulletType, {
  draw(b){
	this.super$draw(b);
    if(Mathf.chance(0.3)){
      Effects.effect(this.trailEffect, b.x, b.y, b.rot());
    }
  }
});
blowShell.pierce = false;
blowShell.damage = 84;
blowShell.speed = 12;
blowShell.lifetime = 20;
blowShell.bulletWidth = 6;
blowShell.bulletHeight = 14;
blowShell.frontColor = plib.frontColorAP;
blowShell.backColor = plib.backColorAP;
blowShell.ammoMultiplier = 3;
blowShell.trailEffect = newEffect(30, e => {
  elib.fillCircle(e.x, e.y, blowShell.frontColor, 1, Mathf.lerp(1.5, 0.2, e.fin()));
});
blowShell.hitEffect = newEffect(18, e => {
  e.scaled(6, cons(i => {
    var cThickness = i.fout() * 2;
    var cRadius = i.fin() * 8;
    elib.outlineCircle(e.x, e.y, blowShell.frontColor, cThickness, cRadius);
  }));
  
  var lThickness = e.fout() * 1.2;
  var lDistance = Mathf.lerp(0, 20, e.finpow());
  var lLength = Mathf.lerp(2, 0.2, e.fin());
  elib.splashLines(e.x, e.y, blowShell.frontColor, lThickness, lDistance, lLength, 6, e.id);
});
blowShell.despawnEffect = blowShell.hitEffect;

const blow = extendContent(DoubleTurret, "blow", {
  load(){
    this.super$load();
  },
  init(){
    this.ammo(
      Vars.content.getByName(ContentType.item, modName + "-ap-shell"), blowShell // Raw DPS: 756
    );
    this.super$init();
  },
  hasAmmo(tile){
    var entity = tile.ent();
    return entity.ammo.size > 0 && entity.ammo.peek().amount >= this.ammoPerShot * this.shots;
  },
  shoot(tile, ammo){
    var entity = tile.ent();

    if(this.hasAmmo(tile)){
      for(var i = 0; i < this.shots; i++){
        Time.run(this.burstSpacing * i, run(() => {
          if(tile.entity instanceof Turret.TurretEntity){
            if(this.hasAmmo(tile)){
              entity.recoil = this.recoil;
              entity.heat = 1;
              for(var a = 0; a < 2; a++){
                var i = Mathf.signs[a];
                this.tr.trns(entity.rotation - 90, this.shotWidth * i, (this.size * Vars.tilesize / 2) - entity.recoil);
                this.bullet(tile, ammo, entity.rotation + Mathf.range(this.inaccuracy));
                this.effects(tile);
                this.useAmmo(tile);
              }
            }
          }
        }));
      }
    }
  },
});
blow.shots = 3;
blow.burstSpacing = 3;
