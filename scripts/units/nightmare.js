const legLib = require("mechanical-warfare/units/multi-leg-base");

const att = {
	load(){
		this.sway = 1;
		this.legBaseOffset = 4;
		this.visualElevation = 0.3;
		this.legExtension = 0;
		this.elevation = 0.5;
		this.legLength = 18;
		this.legLengthScl = 1;
		this.legTrns = 0.4;
		this.legSpeed = 0.04;
		this.legGroupSize = 3;
		this.legMoveSpace = 6;
		this.maxStretch = 1.75;
		this.legPairOffset = 0;
		this.flipBackLegs = true;
		this.landShake = 0;
		this.kinematicScl = 1;
	}
}

const nightmareShell = extend(ArtilleryBulletType, {});
nightmareShell.bulletWidth = 20;
nightmareShell.bulletHeight = 20;
nightmareShell.bulletSprite = "shell";
nightmareShell.speed = 5;
nightmareShell.lifetime = 60;
nightmareShell.inaccuracy = 2;
nightmareShell.hitTiles = true;
nightmareShell.collidesTiles = true;
nightmareShell.collides = true;
nightmareShell.collidesAir = true;
nightmareShell.damage = 30;
nightmareShell.splashDamage = 20;
nightmareShell.splashDamageRadius = 12;
nightmareShell.shootEffect = Fx.shootBig;
nightmareShell.smokeEffect = Fx.shootBigSmoke;
nightmareShell.hitEffect = Fx.blastExplosion;

const nightmareCannon = extendContent(Weapon, "nightmare-cannon", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-nightmare-cannon-equip");
	}
});
nightmareCannon.width = 13.75;
nightmareCannon.length = 8;
nightmareCannon.shots = 4;
nightmareCannon.spacing = 1;
nightmareCannon.inaccuracy = 2;
nightmareCannon.shotDelay = 2;
nightmareCannon.recoil = 2.4;
nightmareCannon.ejectEffect = Fx.shellEjectBig;
nightmareCannon.bullet = nightmareShell;
nightmareCannon.reload = 60;
nightmareCannon.alternate = true;
nightmareCannon.shootSound = Sounds.artillery;
nightmareCannon.velocityRnd = 0.3;

const nightmare = extendContent(UnitType, "nightmare", {
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
			baseJoint: Core.atlas.find("clear")
		}
	}
});
nightmare.weapon = nightmareCannon;
nightmare.create(prov(() => {
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
			this.super$draw();
		}
	});
	unit.setLegs([]);
	for(var i = 0; i < 6; i++){
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
