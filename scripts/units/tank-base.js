module.exports = {
	attackState(base){
		state = extend(UnitState, {
			entered(){
				base.target = null;
			},
			update(){
				core = base.getClosestEnemyCore();
				if(core == null){
					closestSpawn = base.getClosestSpawner();
					if(
						closestSpawn == null ||
						!base.withinDst(closestSpawn, Vars.state.rules.dropZoneRadius + 85)
					){
						if(!base.withinDst(base.target, base.type.attackLength)){
							base.moveToCore(PathFinder.PathTarget.enemyCores);
						}
					}else{
						dst = base.dst(core);
						if(dst < base.getWeapon().bullet.range() / 1.1){
							base.target = core;
						}
						if(dst > base.type.attackLength){
							base.moveToCore(PathFinder.PathTarget.enemyCores);
						}
					}
				}
			}
		});
		return state;
	},
	rallyState(base){
		update(){
			target = base.getClosest(BlockFlag.rally);
			if(target != null && base.dst(target) > 80){
				base.moveToCore(Pathfinder.PathTarget.rallyPoints);
			}
		}
	},
	drawBase(base){
		for(var i = 0; i < 2; i++){
			sign = Mathf.signs[i];
			tra = base.rotation - 90;
			reg = Core.atlas.find(base.type.name + "-track" + base.frame());
			w = reg.getWidth() * sign * Draw.scl;
			h = reg.getHeight() * Draw.scl;
			Draw.rect(reg, base.x, base.y,
				w, h, tra
			);
		}
		Draw.rect(base.type.region, base.x, base.y, tra);
	}
}
