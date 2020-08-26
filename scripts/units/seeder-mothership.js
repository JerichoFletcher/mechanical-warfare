const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const wormlib = require("mechanical-warfare/units/worm-base");

// Seeder
const hiddenHoverUnit = prov(() => extend(HoverUnit, {
	drawEngine(){
		Draw.color(this.type.getEngineColor());
		var ox = Angles.trnsx(this.rotation + 180, this.type.engineOffset);
		var oy = Angles.trnsy(this.rotation + 180, this.type.engineOffset);
		var oSize = Mathf.absin(Time.time(), 2, this.type.engineSize / 4);
		Fill.circle(this.x + ox, this.y + oy, this.type.engineSize + oSize);
		
		Draw.color(Color.white);
		var ix = Angles.trnsx(this.rotation + 180, this.type.engineOffset - 1);
		var iy = Angles.trnsy(this.rotation + 180, this.type.engineOffset - 1);
		var iSize = Mathf.absin(Time.time(), 2, this.type.engineSize / 4);
		Fill.circle(this.x + ix, this.y + iy, (this.type.engineSize + oSize) / 2);
		Draw.color();
	},
	isHidden(){
		return true;
	},
}));

const seederMissile = extend(MissileBulletType, {});
seederMissile.keepVelocity = false;
seederMissile.damage = 14;
seederMissile.speed = 3;
seederMissile.lifetime = 60;
seederMissile.bulletWidth = 7;
seederMissile.bulletHeight = 7;
seederMissile.bulletShrink = 0;
seederMissile.drag = -0.003;
seederMissile.homingRange = 40;
seederMissile.splashDamage = 9;
seederMissile.splashDamageRadius = 24;
seederMissile.trailColor = Color.gray;
seederMissile.frontColor = plib.frontColorCyan;
seederMissile.backColor = plib.backColorCyan;
seederMissile.despawnEffect = Fx.blastExplosion;
seederMissile.weaveScale = 7;
seederMissile.weaveMag = 2;

const seederLauncher = extendContent(Weapon, "seeder-launcher", {
	load(){
		this.region = Core.atlas.find("clear");
	},
});
seederLauncher.alternate = true;
seederLauncher.width = 0;
seederLauncher.reload = 90;
seederLauncher.bullet = seederMissile;
seederLauncher.shootSound = Sounds.missile;
seederLauncher.ejectEffect = Fx.shellEjectBig;

const seeder = extendContent(UnitType, "seeder", {
	getEngineColor(){
		return plib.engineColorCyan;
	},
});
seeder.weapon = seederLauncher;
seeder.create(hiddenHoverUnit);

// Mothership
const seederShip = extendContent(UnitType, "seeder-mothership", {
	load(){
		this.super$load();
		this.region = Core.atlas.find(this.name);
		this.bodyRegion = Core.atlas.find(this.name + "-body");
		this.tailRegion = Core.atlas.find(this.name + "-tail");
		this.cellRegion = Core.atlas.find(this.name + "-cell");
	},
	getReg(){
		return {
			head: this.region,
			body: this.bodyRegion,
			tail: this.tailRegion
		}
	},
	getCellReg(){
		return {
			head: this.cellRegion,
			body: this.cellRegion,
			tail: this.cellRegion
		}
	}
});

const seederShipMissile = extend(MissileBulletType, {});
seederShipMissile.keepVelocity = false;
seederShipMissile.damage = 18;
seederShipMissile.speed = 2.6;
seederShipMissile.lifetime = 75;
seederShipMissile.bulletWidth = 8;
seederShipMissile.bulletHeight = 8;
seederShipMissile.bulletShrink = 0;
seederShipMissile.drag = -0.007;
seederShipMissile.homingRange = 60;
seederShipMissile.splashDamage = 12;
seederShipMissile.splashDamageRadius = 30;
seederShipMissile.trailColor = Color.gray;
seederShipMissile.frontColor = plib.frontColorCyan;
seederShipMissile.backColor = plib.backColorCyan;
seederShipMissile.despawnEffect = Fx.blastExplosion;
seederShipMissile.weaveScale = 6;
seederShipMissile.weaveMag = 1.5;

const seederShipLauncher = extendContent(Weapon, "seeder-mothership-launcher", {
	load(){
		this.region = Core.atlas.find("clear");
	}
});
seederShipLauncher.alternate = false;
seederShipLauncher.reload = 60;
seederShipLauncher.bullet = seederShipMissile;
seederShipLauncher.shootSound = Sounds.missile;
seederShipLauncher.ejectEffect = Fx.shellEjectBig;

seederShip.weapon = seederShipLauncher;
seederShip.shootCone = 90;
seederShip.create(prov(() => {
	drawCarryWidth = 13;
	unit = wormlib.newBase(7, 14, 0.4, 24, false, base => {
		if(base.dat("carry") !== undefined && (base.dat("carryUnit") !== undefined || base.dat("carryUnit") !== null)){
			for(var i = 0; i < 2; i++){
				if(base.dat("carry")[i]){
					sign = Mathf.signs[i];
					region = base.dat("carryUnit");
					Tmp.v1.trns(base.rotation + 90 * sign, drawCarryWidth);
					Draw.rect(region, base.x + Tmp.v1.x, base.y + Tmp.v1.y, base.rotation + 90 * (sign - 1));
				}
			}
		}
	}, null, base => {
		if(base.dat("relT") < 60)base.provDat("relT", val => ++val);
		if(base.dat("relT") >= 60 && base.target != null && base.dat("carry") !== undefined){
			if(base.target.getTeam().isEnemy(base.getTeam()) && base.dst(base.target) < base.getWeapon().bullet.range() * 1.33){
				//side = Angles.backwardDistance(base.rotation, Angles.angle(base.x, base.y, base.target.x, base.target.y)) > Angles.forwardDistance(base.rotation, Angles.angle(base.x, base.y, base.target.x, base.target.y)) ? 0 : 1;
				side = (base.angleTo(base.target) % 360) - (base.rotation % 360) < 0 ? 0 : 1;
				if(side == 0 && !base.dat("carry")[side] && base.dat("carry")[1])side = 1;
				if(side == 1 && !base.dat("carry")[side] && base.dat("carry")[0])side = 0;
				if(base.dat("carry")[side]){
					angle = base.rotation + 90 * Mathf.signs[side];
					Tmp.v1.trns(angle, drawCarryWidth);
					bailUnit = base.dat("carryUnit").create(base.getTeam());
					bailUnit.set(base.x + Tmp.v1.x, base.y + Tmp.v1.y);
					bailUnit.rotate(base.rotation + 90 * Mathf.signs[side]);
					bailUnit.add();
					if(base.isBoss())bailUnit.applyEffect(StatusEffects.boss, 999999);
					Effects.effect(Fx.unitSpawn, base.x + Tmp.v1.x, base.y + Tmp.v1.y, base.rotation);
					base.setDat("relT", 0);
					base.provDat("carry", val => {
						temp = val;
						temp[side] = false;
						return temp;
					});
				}
			}
		}
	}, (base, stream, net) => {
		if(base.isHead()){
			for(var i = 0; i < 2; i++){
				stream.writeBoolean(base.dat("carry")[i]);
			}
			stream.writeByte(base.childs().length);
			for(var i = 0; i < base.childs().length ; i++){
				for(var j = 0; j < 2; j++){
					stream.writeBoolean(Vars.unitGroup.getByID(base.childs()[i]).dat("carry")[j]);
				}
			}
		}
	}, (base, stream, version) => {
		if(base.savedAsHead()){
			for(var i = 0; i < 2; i++){
				base.provDat("carry", val => {
					temp = val;
					temp[i] = stream.readBoolean();
					return temp;
				});
			}
			var seg = stream.readByte();
			temp = [];
			for(var i = 0; i < seg; i++){
				t2 = [];
				for(var j = 0; j < 2; j++){
					t2[j] = stream.readBoolean();
				}
				temp[i] = t2;
			}
			base.postAdd(childs => {
				for(var i = 0; i < seg; i++){
					childs[i].setDat("carry", temp[i]);
				}
			});
		}
	}, ["carryUnit", seeder, "carry", [true, true], "relT", 0]);
	return unit;
}));
