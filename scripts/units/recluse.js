const legLib = require("mechanical-warfare/units/multi-leg-base");
const multiWeap = require("mechanical-warfare/units/multi-weapon-base");
const bulletLib = require("mechanical-warfare/bulletlib");
const trailLib = require("mechanical-warfare/traillib");

const recluseMissile = bulletLib.bullet(MissileBulletType, 15, 15, 0, 0, 120, 60, 12, 2, 5, 60, cons(b => {
	Draw.color(recluseMissile.backColor);
    Draw.rect(recluseMissile.backRegion, b.x, b.y, recluseMissile.bulletWidth, recluseMissile.bulletHeight, b.rot() - 90);
	b.getData().trail.draw(recluseMissile.backColor, recluseMissile.bulletWidth * 0.3);
	
    Draw.color(recluseMissile.frontColor);
    Draw.rect(recluseMissile.frontRegion, b.x, b.y, recluseMissile.bulletWidth, recluseMissile.bulletHeight, b.rot() - 90);
    Draw.color();
}), null, cons(b => {
	Core.app.post(run(() => {
		if(b == null || b.getData() == null)return;
		b.getData().trail.update(b.x, b.y);
	}));
}), null, cons(b => {
	b.setData({
		trail: trailLib.newTrail(12)
	});
}));
recluseMissile.shootEffect = Fx.shootBig;
recluseMissile.smokeEffect = Fx.shootBigSmoke;
recluseMissile.hitEffect = Fx.blastExplosion;
recluseMissile.homingPower = 2;
recluseMissile.homingRange = 80;
recluseMissile.hitSound = Sounds.explosion;
recluseMissile.weaveScale = 8;
recluseMissile.weaveMag = 3;

const att = {
	load(){
		this.legBaseOffset = 12;
		this.visualElevation = 0.6;
		this.elevation = 0.6;
		this.legLength = 30;
		this.legLengthScl = 1;
		this.legTrns = 0.4;
		this.legSpeed = 0.4;
		this.legGroupSize = 2;
		this.legMoveSpace = 2;
		this.maxStretch = 1.75;
		this.legPairOffset = 0;
		this.flipBackLegs = true;
		this.landShake = 1;
		this.kinematicScl = 1;
		
		this.weaponCount = 1;
		this.rotateWeapon = [false];
		this.weaponAngles = [[0.0, 0.0]];
		this.shootCone = [30];
		this.weaponOffsetY = [12];
		this.targetAir = [true];
		this.targetGround = [true];
		this.weapon = [];
		this.weapon[0] = multiWeap.newWeapon("recluse-launcher", 0, null, null);
		this.weapon[0].width = 6;
		this.weapon[0].alternate = true;
		this.weapon[0].reload = 40;
		this.weapon[0].bullet = recluseMissile;
		this.weapon[0].shootSound = Sounds.missile;
		this.weapon[0].ejectEffect = Fx.shellEjectBig;
		this.weapon[0].inaccuracy = 2;
		this.weapon[0].shots = 3;
		this.weapon[0].spacing = 4;
		this.weapon[0].shotDelay = 2;
	}
}

const recluseGun = extendContent(Weapon, "recluse-machine-gun", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-recluse-machine-gun-equip");
	}
});
recluseGun.width = 12;
recluseGun.bullet = Bullets.standardThoriumBig;
recluseGun.alternate = true;
recluseGun.reload = 10;
recluseGun.shootSound = Sounds.shootBig;
recluseGun.ejectEffect = Fx.shellEjectBig;
recluseGun.inaccuracy = 2;

const recluse = extendContent(UnitType, "recluse", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find(this.name + "-base");
		this.legRegion = Core.atlas.find("clear");
		att.load();
	},
	getAttributes(){
		return att;
	},
	getReg(){
		name = this.name;
		return {
			foot: Core.atlas.find(name + "-foot"),
			leg: Core.atlas.find(name + "-leg"),
			legBase: Core.atlas.find(name + "-leg-base"),
			joint: Core.atlas.find(name + "-joint"),
			baseJoint: Core.atlas.find(name + "-joint-base")
		}
	}
});
recluse.weapon = recluseGun;
recluse.create(prov(() => {
	const unit = extend(GroundUnit, {
		added(){
			this.super$added();
			att = this.type.getAttributes();
			for(var i = 0; i < this._legs.length; i++){
				rot = this.baseRotation;
				spacing = 360 / this._legs.length;
				legLength = att.legLength;
				this._legs[i].joint.trns(i * spacing + rot, legLength / 2 + att.legBaseOffset).add(this.x, this.y);
				this._legs[i].base.trns(i * spacing + rot, legLength + att.legBaseOffset).add(this.x, this.y);
			}
		},
		setLegs(val){
			this._legs = val;
		},
		setLegsElement(index, val){
			this._legs[index] = val;
		},
		getLegs(){
			return this._legs;
		},
		setMoveSpace(val){
			this._moveSpace = val;
		},
		getMoveSpace(){
			return this._moveSpace;
		},
		setTotalLength(val){
			this._totalLength = val;
		},
		getTotalLength(){
			return this._totalLength;
		},
		setDelta(obj){
			this._delta = obj;
		},
		getDelta(){
			return this._delta;
		},
		isMoving(){
			return this.velocity().isZero(0.01);
		},
		legAngle(rot, index){
			return rot + 360 / this._legs.length * index + 360 / this._legs.length / 2;
		},
		update(){
			this.super$update();
			this.updateLastPosition();
			legLib.updateLegs(this);
			if(this.target != null){
				multiWeap.updateWeapons(this);
			}
		},
		updateLastPosition(){
			this.setDelta({
				x: unit.x - unit.lastX,
				y: unit.y - unit.lastY
			});
			this.lastX = this.x;
			this.lastY = this.y;
		},
		draw(){
			legLib.drawLegs(this);
			multiWeap.drawSecWeapons(this, 0);
			this.super$draw();
		},
		getTimer2(){
			return this._timer;
		},
		setTimer2(val){
			this._timer = val;
		},
		getShootTimer2(index, left){
			return left ? this.getShootTimers2()[index].timerShootLeft : this.getShootTimers2()[index].timerShootRight;
		},
		getShootTimers2(){
			return this._timerShoot;
		},
		setShootTimers2(arr){
			this._timerShoot = arr;
		}
	});
	unit.setTimer2(new Interval(2));
	unit.setShootTimers2([{
		timerShootLeft: 0,
		timerShootRight: 1
	}]);
	unit.setLegs([]);
	for(var i = 0; i < 8; i++){
		unit.setLegsElement(i, legLib.newLeg());
	}
	unit.setMoveSpace(0.0);
	unit.setTotalLength(0.0);
	unit.setDelta({
		x: 0.0,
		y: 0.0
	});
	unit.lastX = 0.0;
	unit.lastY = 0.0;
	return unit;
}));
