const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const bulletLib = require("mechanical-warfare/bulletlib");

const blowShell = bulletLib.bullet(BasicBulletType, 8, 14, 0, 0, 84, 0, -1, 0, 12, 20, null, cons(b => {
	if(Mathf.chance(0.3)){
		Effects.effect(blowShell.trailEffect, b.x, b.y, b.rot());
	}
}), null, null, null);
blowShell.ammoMultiplier = 3;
blowShell.frontColor = plib.frontColorAP;
blowShell.backColor = plib.backColorAP;
blowShell.trailEffect = newEffect(30, e => {
	elib.fillCircle(e.x, e.y, blowShell.frontColor, 1, 0.2 + e.fout() * 1.5);
});
blowShell.hitEffect = Fx.hitBulletSmall;

const blow = extendContent(DoubleTurret, "blow", {
	init(){
		this.ammo(
			Vars.content.getByName(ContentType.item, "mechanical-warfare-ap-shell"), blowShell // Raw DPS: 756
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
				for(var j = 0; j < 2; j++){
					this.tr.trns(entity.rotation - 90, this.shotWidth * Mathf.signs[j], (this.size * Vars.tilesize / 2) - entity.recoil);
					this.bullet(tile, ammo, entity.rotation + Mathf.range(this.inaccuracy));
					this.effects(tile);
					this.useAmmo(tile);
				}
			}));
		}
	},
});
blow.shots = 3;
blow.burstSpacing = 3;
