// Crusher Drill
const crusherDrill = extendContent(Drill, "crusher-drill", {
	draw(tile){
		this.super$draw(tile);
		var entity = tile.ent();
		if(entity.dominantItem != null){
			Draw.color(entity.dominantItem.color);
			Draw.rect(Core.atlas.find(this.name + "-item"), tile.drawx(), tile.drawy());
			Draw.color();
		}
	},
});

// Chemical Drill
const chemicalDrill = extendContent(Drill, "chemical-drill", {
  load(){
    this.baseRegion = Core.atlas.find(this.name + "-base");
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.region = Core.atlas.find(this.name + "-bottom");
    this.rimRegion = Core.atlas.find(this.name + "-rim");
    this.rotatorRegion = Core.atlas.find(this.name + "-rotator");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  generateIcons: function(){
    return [
      Core.atlas.find(this.name + "-base"),
      Core.atlas.find(this.name + "-bottom"),
      Core.atlas.find(this.name + "-rotator"),
      Core.atlas.find(this.name + "-top")
    ];
  },
  draw(tile){
    Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
    Draw.color(tile.entity.liquids.current().color);
    Draw.alpha(tile.entity.liquids.total() / this.liquidCapacity);
    Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
    Draw.color();
    this.super$draw(tile);
  },
});

// Stone floors
const stoneFloor = [Blocks.stone, Blocks.craters, Blocks.charr, Blocks.ignarock, Blocks.holostone];
function isStone(floor){
	for(var i = 0; i < 5; i++){
		if(floor === stoneFloor[i]){return true;}
	}
	return false;
}

// Quarry
const quarry = extendContent(GenericCrafter, "quarry", {
	load(){
		this.region = Core.atlas.find(this.name);
		this.rotatorRegion = Core.atlas.find(this.name + "-rotator");
		this.topRegion = Core.atlas.find(this.name + "-top");
		this.rimRegion = Core.atlas.find(this.name + "-rim");
	},
	generateIcons: function(){
		return [
			Core.atlas.find(this.name),
			Core.atlas.find(this.name + "-rotator"),
			Core.atlas.find(this.name + "-top")
		];
	},
	canPlaceOn: function(tile){
		return tile.getLinkedTilesAs(this, this.tempTiles).contains(boolf(other => isStone(other.floor())));
	},
	update(tile){
		this.super$update(tile);
		var entity = tile.ent();
		entity.setHeat(Mathf.lerpDelta(entity.getHeat(), entity.efficiency() > 0 ? entity.power.status : 0, 0.02));
		entity.setRotation(entity.getRotation() + this.rotateSpeed * entity.delta() * entity.getHeat());
		entity.setEfficiency(Mathf.lerpDelta(entity.getEfficiency(), entity.efficiency(), 0.02));
	},
	draw(tile){
		var entity = tile.ent();
		Draw.rect(this.region, tile.drawx(), tile.drawy());
		
		Draw.color(Color.black, Pal.turretHeat, entity.getHeat() * (0.7 + Mathf.absin(Time.time(), 3, 0.3)));
		Draw.blend(Blending.additive);
		Draw.rect(this.rimRegion, tile.drawx(), tile.drawy());
		Draw.blend();
		Draw.color();
		
		Draw.rect(this.rotatorRegion, tile.drawx(), tile.drawy(), entity.getRotation());
		Draw.rect(this.topRegion, tile.drawx(), tile.drawy())
	},
	drawPlace(x, y, rotation, valid){
		var c = 0;
		var t = Vars.world.tile(x, y);
		if(t != null){
			t.getLinkedTilesAs(this, this.tempTiles).each(
				boolf(other => isStone(other.floor())),
				cons(other => c++)
			);
		}
		this.drawPlaceText(Core.bundle.formatFloat("bar.efficiency", c / 9 * 100, 1), x, y, valid);
	},
	setBars(){
		this.super$setBars();
		this.bars.add("efficiency", func(entity => new Bar(prov(() =>
			Core.bundle.formatFloat("bar.efficiency",
				entity.getEfficiency() * 100, 1
			)),
			prov(() => Pal.ammo),
			floatp(() => entity.getEfficiency())
		)));
	}
});
quarry.rotateSpeed = 3;
quarry.entityType = prov(() => {
	const entity = extend(GenericCrafter.GenericCrafterEntity, {
		getRotation: function(){
			return this._rot;
		},
		setRotation: function(val){
			this._rot = val % 360;
		},
		efficiency: function(){
			var count = 0;
			var res;
			this.tile.getLinkedTilesAs(this.tile.block(), this.tile.block().tempTiles).each(boolf(other => isStone(other.floor())), cons(other => count++));
			if(this.items.total() != this.tile.block().itemCapacity){
				res = this.power.status * count / 9;
			}else{
				res = 0;
			}
			return res;
		},
		getHeat: function(){
			return this._heat;
		},
		setHeat: function(val){
			this._heat = val;
		},
		getEfficiency: function(){
			return this._efficiency;
		},
		setEfficiency: function(val){
			this._efficiency = val;
		}
	});
	entity.setRotation(0);
	entity.setHeat(0);
	entity.setEfficiency(0);
	return entity;
});