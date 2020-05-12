//const elib = require("effectlib");
//const plib = require("plib");

const blowShell = extend(BasicBulletType, {
  update(b){
    if(Mathf.chance(0.3)){
      Effects.effect(this.trailEffect, b.x, b.y, b.rot());
    }
  }
});
blowShell.pierce = false;
blowShell.damage = 30;
blowShell.speed = 12;
blowShell.lifetime = 20;
blowShell.bulletWidth = 9;
blowShell.bulletHeight = 21;
blowShell.frontColor = Color.valueOf("ddffaa");
blowShell.backColor = Color.valueOf("aacc66");
blowShell.ammoMultiplier = 5;
blowShell.trailEffect = newEffect(30, e => {
  //elib.fillCircle(e.x, e.y, blowShell.frontColor, 1, Mathf.lerp(2, 0.2, e.fin()));
});
blowShell.hitEffect = newEffect(13, e => {
  /*var lThickness = e.fout() * 1.2;
  var lDistance = Mathf.lerp(0, 20, e.finpow());
  var lLength = Mathf.lerp(2, 0.2, e.fin());
  var lCount = 6;
  elib.splashLines(e.x, e.y, seismAP.backColor, lThickness, lDistance, lLength, lCount, e.id);*/
});
blowShell.despawnEffect = blowShell.hitEffect;

const blow = extendContent(DoubleTurret, "blow", {
  load(){
    this.super$load();
  },
  init(){
    this.ammo(
      Vars.content.getByName(ContentType.item, modName + "-ap-shell"), blowShell
    );
    this.super$init();
  },
  shoot(tile, ammo){
    var entity = tile.ent();

    //this.tr3.trns.(entity.rotation - 90, this.shotWidth * i, (this.size * Vars.tilesize / 2) - entity.recoil);    

    for(var i = 0; i < this.shots; i++){
      Time.run(this.burstSpacing * i, run(() => {
        if(!tile.entity instanceof Turret.TurretEntity || !this.hasAmmo(tile)){return;}
        entity.recoil = this.recoil;
        entity.heat = 1;
        for(var a = 0; a < 2; a++){
          var i = Mathf.signs[a];
          this.tr.trns(entity.rotation, this.shotWidth * i, (this.size * Vars.tilesize / 2) - entity.recoil);
          Calls.createBullet(
            ammo, tile.getTeam(),
            tile.drawx() + this.tr.x,
            tile.drawy() + this.tr.y,
            entity.rotation + Mathf.range(this.inaccuracy + type.inaccuracy),
            1, 1
          );
          this.effects(tile);
          this.useAmmo(tile);
        }
      }));
    }
  },
});
blow.shots = 4;
blow.burstSpacing = 3;
