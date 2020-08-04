// Liquid Combustion Engine
const liquidCombustion = extendContent(ItemLiquidGenerator, "liquid-combustion-engine", {
	getItemEfficiency: function(item){
		return 0;
	},
	getLiquidEfficiency: function(liquid){
		return liquid.flammability;
	},
	init(){
		this.consumes.add(new ConsumeLiquidFilter(boolf(liquid => this.getLiquidEfficiency(liquid) >= this.minLiquidEfficiency), this.maxLiquidGenerate)).update(false).optional(true, false);
		this.super$init();
	},
	load(){
		this.region = Core.atlas.find(this.name);
		this.liquidRegion = Core.atlas.find(this.name + "-liquid");
		this.topRegion = Core.atlas.find(this.name + "-heat");
	},
	draw(tile){
		var entity = tile.ent();
		Draw.rect(this.region, tile.drawx(), tile.drawy());
		
		Draw.color(entity.liquids.current().color);
		Draw.alpha(entity.liquids.currentAmount() / this.liquidCapacity);
		Draw.rect(this.liquidRegion, tile.drawx(), tile.drawy());
		
		Draw.color(this.heatColor);
		Draw.alpha(entity.heat * 0.4 + Mathf.absin(8, 0.6) * entity.heat);
		Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
		Draw.color();
	},
	update(tile){
		this.super$update(tile);
		var entity = tile.ent();
		var liquid = null;
		var found = false;
		Vars.content.liquids().each(cons(other => {
			if(!found && entity.liquids.get(other) >= 0.001 && this.getLiquidEfficiency(other) >= this.minLiquidEfficiency){
				liquid = other;
				found = true;
				return;
			}
		}));
		if(liquid != null && entity.liquids.get(liquid) >= 0.001){
			var d = entity.delta();
			if(Math.min(entity.liquids.get(liquid) * d, this.maxLiquidGenerate * d) > 0.001){
				entity.generateTime = 1;
			}
		}
		if(entity.generateTime > 0){
			entity.generateTime -= Math.min(1 / 90 * entity.delta() * entity.power.graph.getUsageFraction(), entity.generateTime);
		}
	},
});

// Power Amplifier
const amplifier = extendContent(GenericCrafter, "power-amplifier", {
	load(){
		this.super$load();
		this.region = Core.atlas.find(this.name);
		this.topRegion = Core.atlas.find(this.name + "-top");
	},
	update(tile){
		entity = tile.ent();
		if(entity.isWorking()){
			this.super$update(tile);
			entity.setBoltChance(Mathf.lerpDelta(entity.getBoltChance(), 0.5, 0.02));
		}else{
			entity.setBoltChance(Mathf.lerpDelta(entity.getBoltChance(), 0, 0.02));
		}
		if(!entity.cons.valid()){
			entity.setBoltChance(Mathf.lerpDelta(entity.getBoltChance(), 0, 0.02));
			entity.setWorking(false);
		}
	},
	generateIcons(){
		return [
			Core.atlas.find(this.name),
			Core.atlas.find(this.name + "-top")
		];
	},
	draw(tile){
		entity = tile.ent();
		Draw.rect(this.region, tile.drawx(), tile.drawy());
		Draw.blend(Blending.additive);
		for(var i = 0; i < this.boltCount; i++){
			if(Mathf.randomSeed(Mathf.round(Time.time() + entity.id + i)) > entity.getBoltChance()){continue;}
			var rawrot = Time.time() * this.boltRotSpeed[i] * this.boltRotDir[i];
			var truerot = rawrot > 0 ? (rawrot % 360) : (360 + (rawrot % 360));
			Draw.mixcol(Color.white, Mathf.absin(Time.time(), this.boltRotSpeed[i] * 0.1, 0.5));
			Draw.alpha(0.9 + Mathf.absin(Time.time(), this.boltRotSpeed[i] * 0.1, 0.1));
			Draw.rect(Core.atlas.find(this.name + "-bolt" + i), tile.drawx(), tile.drawy(), truerot);
			Draw.mixcol();
			Draw.color();
		}
		Draw.blend();
		Draw.reset();
		Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
	}
});
amplifier.boltCount = 3;
amplifier.boltRotSpeed = [12, 9, 27];
amplifier.boltRotDir = [1, -1, -1];
amplifier.entityType = prov(() => {
	const entity = extend(GenericCrafter.GenericCrafterEntity, {
		setWorking(bool){
			this._working = bool;
		},
		isWorking(){
			return this._working;
		},
		getBoltChance(){
			return this._chance;
		},
		setBoltChance(val){
			this._chance = val;
		}
	});
	entity.setWorking(false);
	entity.setBoltChance(0);
	return entity;
});
