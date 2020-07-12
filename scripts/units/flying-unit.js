const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");

const bullheadWeap = extendContent(Weapon, "bullhead-gun", {
	load(){
		this.region = Core.atlas.find("mechanical-warfare-bullhead-gun-equip");
	}
});
bullheadWeap.width = 4;
bullheadWeap.length = 5.75;
bullheadWeap.recoil = 1;
bullheadWeap.alternate = true;
bullheadWeap.reload = 12;
bullheadWeap.shootSound = Sounds.pew;
bullheadWeap.bullet = Bullets.standardDense;
bullheadWeap.ejectEffect = Fx.shellEjectSmall;
bullheadWeap.inaccuracy = 2;

const bullhead = extendContent(UnitType, "bullhead", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find("mechanical-warfare-bullhead");
	}
});
bullhead.weapon = bullheadWeap;

bullhead.create(prov(() => {
	const unit = extend(MinerDrone, {
		_mine: new UnitState(){
			entered(){
				unit.target = null;
			},
			update(){
				entity = unit.getClosestCore();
				if(entity == null){return;}
				unit.findItem();
				if(
					unit.targetItem != null &&
					entity.block.acceptStack(unit.targetItem, 1, entity.tile, unit) == 0
				){
					unit.clearItem();
					return;
				}
				targetEnemy = Units.closestEnemy(unit.team, unit.x, unit.y, unit.type.range, boolf(e => !e.isDead()));
				if(targetEnemy != null){
					unit.target = targetEnemy;
					unit.setState(unit._attack);
					return;
				}else if(
					unit.item().amount >= unit.getItemCapacity() || 
					(unit.targetItem != null && !unit.acceptsItem(unit.targetItem))
				){
					unit.setState(unit._drop);
				}else{
					if(unit.retarget() && unit.targetItem != null){
						unit.target = Vars.indexer.findClosestOre(unit.x, unit.y, unit.targetItem);
					}
					if(unit.target instanceof Tile){
						unit.moveTo(unit.type.range / 1.5);
						if(
							unit.dst(unit.target) < unit.type.range &&
							unit.mineTile != unit.target
						){
							unit.setMineTile(unit.target);
						}
						if(unit.target.block() != Blocks.air){
							unit.setState(unit._drop);
						}
					}else if(unit.getSpawner() != null){
						unit.target = unit.getSpawner();
						unit.circle(40);
					}
				}
			},
			exited(){
				unit.setMineTile(null);
			}
		},
		_drop: new UnitState(){
			entered(){
				unit.target = null;
			},
			update(){
				if(
					unit.item().amount == 0 ||
					unit.item().item.type != ItemType.material
				){
					unit.clearItem();
					unit.setState(unit._mine);
					return;
				}
				unit.target = unit.getClosestCore();
				targetEnemy = Units.closestEnemy(unit.team, unit.x, unit.y, unit.type.range, boolf(e => !e.isDead()));
				if(unit.target == null || targetEnemy != null){
					unit.target = targetEnemy;
					unit.setState(unit._attack);
					return;
				}
				entity = unit.target;
				if(unit.dst(unit.target) < unit.type.range){
					if(entity.block.acceptStack(unit.item().item, unit.item().amount, entity.tile, unit) > 0){
						Call.transferItemTo(unit.item().item, unit.item().amount, unit.x, unit.y, entity.tile);
					}
					unit.clearItem();
					unit.setState(unit._mine);
				}
				unit.circle(unit.type.range / 1.8);
			}
		},
		_attack: new UnitState(){
			update(){
				if(
					!(unit.target instanceof Unit) ||
					Units.invalidateTarget(unit.target, unit.team, unit.x, unit.y)
				){
					unit.target = null;
					unit.setState(unit._mine);
					return;
				}
				unit.attack(unit.type.attackLength);
				if(
					(Angles.near(unit.angleTo(unit.target), unit.rotation, unit.type.shootCone) || unit.getWeapon().ignoreRotation) &&
					unit.dst(unit.target) < unit.getWeapon().bullet.range()
				){
					ammo = unit.getWeapon().bullet;
					to = Predict.intercept(unit, unit.target, ammo.speed);
					unit.getWeapon().update(unit, to.x, to.y);
				}
			}
		},
		getStartState(){
			return this._mine;
		},
		update(){
			this.super$update();
			if(this.state.current() != this._attack){
				this.updateMining();
			}
			this.state.current().update();
		}
	});
	return unit;
}));

const bullheadFactory = extendContent(UnitFactory, "bullhead-factory", {});
bullheadFactory.unitType = bullhead;