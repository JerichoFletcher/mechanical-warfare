const tbase = require("mechanical-warfare/units/tank-base");

const devastatorShell = extend(BasicBulletType, {
	range(){
		return 110;
	},
});
devastatorShell.damage = 83;
devastatorShell.speed = 7;
devastatorShell.lifetime = 18;

const devastatorGun = extendContent(Weapon, "devastator-gun", {
	load(){
		this.super$load();
		quake = Vars.content.getByName(ContentType.block, "mechanical-warfare-quake");
		if(quake != null)this.shootSound = quake.shootSound;
	},
});
devastatorGun.bullet = devastatorShell;
devastatorGun.reload = 160;

const devastator = extendContent(UnitType, "devastator", {});
devastator.weapon = devastatorGun;
devastator.shootCone = 22.5;
devastator.create(prov(() => {
	base = extend(GroundUnit, {
		getStartState(){
			return tbase.attackState(this);
		},
		onCommand(command){
			this.state.set((command == UnitCommand.retreat) ? this.retreat : ((command == UnitCommand.attack) ? tbase.attackState(this) : ((command == UnitCommand.rally) ? this.rally : null)));
		},
		draw(){
			Draw.mixcol(Color.white, this.hitTime / 9);
			floor = this.getFloorOn();
			if(floor.isLiquid){
				Draw.color(Color.white, floor.color, 0.5);
			}
			tbase.drawTracks(this);
			if(floor.isLiquid){
				Draw.color(Color.white, floor.color, this.drownTime * 0.4);
			}else{
				Draw.color(Color.white);
			}
			Draw.rect(this.type.baseRegion, this.x, this.y, this.baseRotation - 90);
			Tmp.v1.trns(this.rotation - 90, 0, -(this.getWeapon().getRecoil(this, true) + this.getWeapon().getRecoil(this, false)));
			Draw.rect(this.getWeapon().region, this.x + Tmp.v1.x, this.y + Tmp.v1.y, this.rotation - 90);
			Draw.rect(this.type.region, this.x, this.y, this.rotation - 90);
			Draw.mixcol();
		},
		frame(){
			return Math.floor(this.walkTime % 6);
		},
	});
	return base;
}));
