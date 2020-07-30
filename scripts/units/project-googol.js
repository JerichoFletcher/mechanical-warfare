const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const wormlib = require("mechanical-warfare/units/worm-base");

const projGoogol = extendContent(UnitType, "project-googol", {
	load(){
		this.super$load();
		this.region = Core.atlas.find(this.name + "-head");
		this.bodyRegion = Core.atlas.find(this.name + "-body");
		this.tailRegion = Core.atlas.find(this.name + "-tail");
		this.cellRegion = Core.atlas.find(this.name + "-head-cell");
		this.cellBodyRegion = Core.atlas.find(this.name + "-body-cell");
		this.cellTailRegion = Core.atlas.find(this.name + "-tail-cell");
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
			body: this.cellBodyRegion,
			tail: this.cellTailRegion
		}
	}
});

const googolBullet = extend(BasicBulletType, {});
googolBullet.keepVelocity = false;
googolBullet.damage = 11;
googolBullet.speed = 5;
googolBullet.lifetime = 30;

const googolBlaster = extendContent(Weapon, "googol-blaster", {
	load(){
		this.region = Core.atlas.find("clear");
	}
});
googolBlaster.alternate = false;
googolBlaster.reload = 45;
googolBlaster.bullet = googolBullet;
googolBlaster.shootSound = Sounds.shootSnap;

projGoogol.weapon = googolBlaster;
projGoogol.shootCone = 90;
projGoogol.create(prov(() => {
	unit = wormlib.newBase(15, 13, 0.1, 48, true, base => {
		if(base.dat("carry") !== undefined && (base.dat("carryUnit") !== undefined || base.dat("carryUnit") !== null)){
			for(var i = 0; i < 2; i++){
				if(base.dat("carry")[i]){
					sign = Mathf.signs[i];
					region = base.dat("carryUnit");
					Tmp.v1.trns(base.rotation + 90 * sign, 10);
					Draw.rect(region, base.x + Tmp.v1.x, base.y + Tmp.v1.y, base.rotation + 90 * (sign - 1));
				}
			}
		}
	}, null, base => {
		if(base.dat("relT") < 60)base.provDat("relT", val => ++val);
		if(base.target != null && base.dat("carry") !== undefined){
			side = Angles.backwardDistance(base.rotation, Angles.angle(base.x, base.y, base.target.x, base.target.y)) > Angles.forwardDistance(base.rotation, Angles.angle(base.x, base.y, base.target.x, base.target.y)) ? 0 : 1;
			if(side == 0 && !base.dat("carry")[side] && base.dat("carry")[1])side = 1;
			if(side == 1 && !base.dat("carry")[side] && base.dat("carry")[0])side = 0;
			if(base.target.getTeam().isEnemy(base.getTeam()) && base.dst(base.target) < base.getWeapon().bullet.range() * 1.33 && base.dat("relT") >= 60){
				if(base.dat("carry")[side]){
					angle = base.rotation + 90 * Mathf.signs[side];
					Tmp.v1.trns(angle, 10);
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
	}, ["carryUnit", UnitTypes.wraith, "carry", [true, true], "relT", 0]);
	//unit._carryUnit = UnitTypes.wraith;
	//unit._carry = [true, true];
	return unit;
}));
