// Reinforced Wall
const reinforcedWall = extendContent(SurgeWall, "reinforced-wall", {
  update(tile) {
    const mendPower = tile.entity.maxHealth() / 15;
    const mendTimer = 90;
    if (tile.entity.health() < tile.entity.maxHealth() & tile.entity.timer.get(0, mendTimer)) {
      tile.entity.healBy(mendPower);
      Effects.effect(Fx.healBlockFull, Tmp.c1.set(Color.valueOf("efefff")), tile.drawx(), tile.drawy(), tile.block().size);
    }
  }
});

// Large Reinforced Wall
const reinforcedWallLarge = extendContent(SurgeWall, "reinforced-wall-large", {
  update(tile){
    const mendPower = tile.entity.maxHealth() / 15;
    const mendTimer = 90;
    if (tile.entity.health() < tile.entity.maxHealth() & tile.entity.timer.get(0, mendTimer)) {
      tile.entity.healBy(mendPower);
      Effects.effect(Fx.healBlockFull, Tmp.c1.set(Color.valueOf("efefff")), tile.drawx(), tile.drawy(), tile.block().size);
    }
  }
});

// Insulator Wall
const insulatorWall = extendContent(PowerGenerator, "insulator-wall", {
	update(tile){
		this.super$update(tile);
		var entity = tile.ent();
		entity.productionEfficiency = Mathf.lerpDelta(entity.productionEfficiency, 0, 0.05);
	},
	handleBulletHit(entity, bullet){
		this.super$handleBulletHit(entity, bullet);
		if(entity != null && bullet != null){
			if(bullet instanceof Lightning){
				entity.productionEfficiency += (bullet.damage() / 150) * this.lightningMultiplier;
			}else{
				entity.productionEfficiency += (bullet.damage() / 150);
			}
		}
	},
	canReplace: function(other){
		return other != this && other.group == BlockGroup.walls && other.group == this.group && this.health > other.health;
	}
});
insulatorWall.group = BlockGroup.walls;
insulatorWall.lightningMultiplier = 15;

// Large Insulator Wall
const insulatorWallLarge = extendContent(PowerGenerator, "insulator-wall-large", {
	update(tile){
		this.super$update(tile);
		var entity = tile.ent();
		entity.productionEfficiency = Mathf.lerpDelta(entity.productionEfficiency, 0, 0.05);
	},
	handleBulletHit(entity, bullet){
		this.super$handleBulletHit(entity, bullet);
		if(entity != null && bullet != null){
			if(bullet instanceof Lightning){
				entity.productionEfficiency += (bullet.damage() / 150) * this.lightningMultiplier;
			}else{
				entity.productionEfficiency += (bullet.damage() / 150);
			}
		}
	},
	canReplace: function(other){
		return other != this && other.group == BlockGroup.walls && other.group == this.group && this.health > other.health;
	}
});
insulatorWall.group = BlockGroup.walls;
insulatorWall.lightningMultiplier = 30;
