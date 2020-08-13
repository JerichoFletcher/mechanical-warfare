const elib = require("mechanical-warfare/effectlib");
const legLib = require("mechanical-warfare/units/multi-leg-base");
const multiWeap = require("mechanical-warfare/units/multi-weapon-base");
const bulletLib = require("mechanical-warfare/bulletlib");
const trailLib = require("mechanical-warfare/traillib");

const absoluteBeam = extend(BasicBulletType, {
	init(b){
		if(typeof(b) !== "undefined"){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.range());
		}
	},
	range(){
		return 120;
	},
	draw(b){
        f = Mathf.curve(b.fin(), 0, 0.2);
        baseLen = this.range() * f;
        width = this.bulletWidth;
        Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
        Lines.precise(true);
        for(var i = 0; i < this.colors.length; i++){
			color = this.colors[i];
            Draw.color(color);
			stroke = (width *= this.lengthFalloff) * b.fout();
            Lines.stroke(stroke);
            Lines.lineAngle(b.x, b.y, b.rot(), baseLen, CapStyle.none);
            Tmp.v1.trns(b.rot(), baseLen);
            Drawf.tri(b.x + Tmp.v1.x, b.y + Tmp.v1.y, stroke * 1.22, width * 2 + width / 2, b.rot());
			elib.fillCircleWCol(b.x, b.y, 1 * width * b.fout());
            for(var i = 0; i < 2; i++){
				sign = Mathf.signs[i];
                Drawf.tri(b.x, b.y, this.sideWidth * b.fout() * width, this.sideLength * this.compound, b.rot() + this.sideAngle * sign);
            }
            this.compound *= this.lengthFalloff;
        }
        Lines.precise(false);
        Draw.reset();
	}
});
absoluteBeam.compound = 1;
absoluteBeam.sideWidth = 0.7;
absoluteBeam.sideLength = 29;
absoluteBeam.sideAngle = 90;
absoluteBeam.lengthFalloff = 0.5;
absoluteBeam.colors = [
	Pal.lancerLaser.cpy().mul(1, 1, 1, 0.7),
	Pal.lancerLaser,
	Color.white
];
absoluteBeam.bulletWidth = 15;
absoluteBeam.damage = 150;
absoluteBeam.speed = 0.01;
absoluteBeam.lifetime = 16;
absoluteBeam.keepVelocity = false;
absoluteBeam.hitEffect = Fx.hitLancer;
absoluteBeam.despawnEffect = Fx.none;
absoluteBeam.shootEffect = Fx.lancerLaserShoot;
absoluteBeam.smokeEffect = Fx.lancerLaserShootSmoke;
absoluteBeam.collides = false;
absoluteBeam.collidesAir = false;
absoluteBeam.collidesTiles = false;
absoluteBeam.collidesTeam = false;
absoluteBeam.hitTiles = false;
absoluteBeam.pierce = true;

const att = {
	load(){
		this.legBaseOffset = 18;
		this.visualElevation = 0.7;
		this.elevation = 0.7;
		this.legLength = 64;
		this.legLengthScl = 1;
		this.legTrns = 0.6;
		this.legSpeed = 0.5;
		this.legGroupSize = 4;
		this.legMoveSpace = 3;
		this.maxStretch = 1.75;
		this.legPairOffset = 3;
		this.flipBackLegs = true;
		this.landShake = 4;
		this.kinematicScl = 1;
		
		this.weaponCount = 4;
		this.rotateWeapon = [true, true, true, true, true];
		this.weaponAngles = [
			[0.0, 0.0],
			[0.0, 0.0],
			[0.0, 0.0],
			[0.0, 0.0],
			[0.0, 0.0]
		];
		this.shootCone = [30, 30, 20, 20, 10];
		this.weaponOffsetY = [16, -16, 12, -12, 0];
		this.targetAir = [false, false, true, true, true];
		this.targetGround = [true, true, true, true, true];
		this.weapon = [];
		
		for(var i = 0; i < 2; i++){
			this.weapon[i] = multiWeap.newWeapon("absolute-beamer", i, null, null);
			this.weapon[i].alternate = true;
			this.weapon[i].reload = 60 - (i * 12);
			this.weapon[i].bullet = absoluteBeam;
			this.weapon[i].shootSound = Sounds.laser;
			this.weapon[i].width = 8;
			this.weapon[i].length = this.weaponOffsetY[i] + 8;
		}
		
		for(var i = 2; i < 4; i++){
			this.weapon[i] = multiWeap.newWeapon("absolute-gun", i, null, null);
			this.weapon[i].alternate = true;
			this.weapon[i].reload = 16 - ((i - 2) * 4);
			this.weapon[i].bullet = Bullets.standardThoriumBig;
			this.weapon[i].shootSound = Sounds.shootBig;
			this.weapon[i].width = 16;
			this.weapon[i].length = this.weaponOffsetY[i] + 8;
			this.weapon[i].shots = 2;
			this.weapon[i].shotDelay = 2;
			this.weapon[i].spacing = 0;
			this.weapon[i].inaccuracy = 2;
		}
	}
}

const absoluteMissile = bulletLib.bullet(MissileBulletType, 8, 8, 0, -0.003, 24, 18, 8, 0, 5, 60, null, null, null, null, null);
absoluteMissile.hitEffect = Fx.blastExplosion;
absoluteMissile.despawnEffect = Fx.blastExplosion;
absoluteMissile.shootEffect = Fx.shootBig;
absoluteMissile.smokeEffect = Fx.shootBigSmoke;
absoluteMissile.weaveScale = 8;
absoluteMissile.weaveMag = 3;

const absoluteLauncher = extendContent(Weapon, "absolute-launcher", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-absolute-launcher-equip");
	}
});
absoluteLauncher.width = 24;
absoluteLauncher.reload = 30;
absoluteLauncher.shots = 4;
absoluteLauncher.spacing = 7.5;
absoluteLauncher.shotDelay = 2;
absoluteLauncher.bullet = absoluteMissile;
absoluteLauncher.shootSound = Sounds.missile;

const absolute = extendContent(UnitType, "absolute", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find("clear");
		this.baseRegion = Core.atlas.find("clear");
		this.legRegion = Core.atlas.find("clear");
		att.load();
	},
	getReg(){
		name = "mechanical-warfare-recluse";
		return {
			foot: Core.atlas.find(name + "-foot"),
			leg: Core.atlas.find(name + "-leg"),
			legBase: Core.atlas.find(name + "-leg-base"),
			joint: Core.atlas.find(name + "-joint"),
			baseJoint: Core.atlas.find(name + "-joint-base")
		}
	},
	getAttributes(){
		return att;
	},
	displayInfo(table){
		table.table(cons(title => {
			title.addImage(this.icon(Cicon.xlarge)).size(48);
			title.add("[accent]" + this.localizedName).padLeft(5);
		}));
		table.row();
		table.addImage().height(3).color(Color.lightGray).pad(15).padLeft(0).padRight(0).fillX();
		table.row();
		
		table.add(this.displayDescription()).padLeft(5).padRight(5).width(400).wrap().fillX();
		table.row();
		table.addImage().height(3).color(Color.lightGray).pad(15).padLeft(0).padRight(0).fillX();
		table.row();
		
		table.left().defaults().fillX();
		table.add(Core.bundle.format("unit.health", [this.health * 2]));
		table.row();
		table.add(Core.bundle.format("unit.speed", [Strings.fixed(this.speed, 1)]));
		table.row();
		table.row();
	},
});
absolute.weapon = absoluteLauncher;
absolute.create(prov(() => {
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
		damage(amount){
			this.super$damage(amount / 2);
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
			att = this.type.getAttributes();
			print("stageF: " + (this._totalLength + 1 * att.legPairOffset) / this._moveSpace);
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
			for(var i = 0; i < 4; i++){
				multiWeap.drawSecWeapons(this, i);
			}
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
	unit.setTimer2(new Interval(9));
	unit.setShootTimers2([{
		timerShootLeft: 0,
		timerShootRight: 1
	}, {
		timerShootLeft: 2,
		timerShootRight: 3
	}, {
		timerShootLeft: 4,
		timerShootRight: 5
	}, {
		timerShootLeft: 6,
		timerShootRight: 7
	}, {
		timerShoot: 8
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
