const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const bulletLib = require("mechanical-warfare/bulletlib");

const windstormShell = bulletLib.bullet(BasicBulletType, 12, 21, 0, 0, 96, 0, -1, 0, 14, 24, null, cons(b => {
	if(Mathf.chance(0.5)){
		Effects.effect(windstormShell.trailEffect, b.x, b.y, b.rot());
	}
}), null, null, null);
windstormShell.ammoMultiplier = 4;
windstormShell.frontColor = plib.frontColorAP;
windstormShell.backColor = plib.backColorAP;
windstormShell.trailEffect = newEffect(30, e => {
	elib.fillCircle(e.x, e.y, windstormShell.frontColor, 1, 0.2 + e.fout() * 2);
});
windstormShell.hitEffect = Fx.hitBulletBig;

const windstorm = extendContent(DoubleTurret, "windstorm", {
	init(){
		this.ammo(
			Vars.content.getByName(ContentType.item, "mechanical-warfare-ap-shell"), windstormShell // Raw DPS: 1152
		);
		this.super$init();
	},
	hasAmmo(tile){
		var entity = tile.ent();
		return entity.ammo.size > 0 && entity.ammo.peek().amount >= this.ammoPerShot * this.shots;
	},
	shoot(tile, ammo){
		var entity = tile.ent();
		for(var i = 0; i < this.shots; i++){
			Time.run(i * this.burstSpacing, run(() => {
				if(!(tile.entity instanceof Turret.TurretEntity) || !this.hasAmmo(tile)){return;}
				entity.recoil = this.recoil;
				entity.heat = 1;
				for(var j = 0; j < 3; j++){
					this.tr.trns(entity.rotation - 90, this.xSpacing[j] * this.shotWidth, (this.size * Vars.tilesize / 2) + (this.ySpacing[j] * this.shotWidthY));
					this.bullet(tile, ammo, entity.rotation + Mathf.range(this.inaccuracy));
					this.effects(tile);
					this.useAmmo(tile);
				}
			}));
		}
	}
});
windstorm.xSpacing = [-1, 0, 1];
windstorm.ySpacing = [-1, 0, -1];
windstorm.shotWidthY = 9;
windstorm.shots = 4;
windstorm.burstSpacing = 3;