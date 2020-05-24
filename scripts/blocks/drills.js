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
		entity.setRotation(entity.getRotation() + (this.rotateSpeed * entity.warmup));
	},
	draw(tile){
		var entity = tile.ent();
		Draw.rect(this.region, tile.drawx(), tile.drawy());
		
		Draw.color(Color.black, Pal.turretHeat, entity.warmup * (0.7 + Mathf.absin(Time.time(), 3, 0.3)));
		Draw.blend(Blending.additive);
		Draw.rect(this.rimRegion, tile.drawx(), tile.drawy());
		Draw.blend();
		Draw.color();
		
		Draw.rect(this.rotatorRegion, tile.drawx(), tile.drawy(), entity.getRotation());
		Draw.rect(this.topRegion, tile.drawx(), tile.drawy())
	}
});
quarry.rotateSpeed = 4;
quarry.entityType = prov(() => {
	const entity = extend(GenericCrafter.GenericCrafterEntity, {
		getRotation: function(){
			return this._rot;
		},
		setRotation: function(val){
			this._rot = val;
		}
	});
	entity.setRotation(0);
	return entity;
});
