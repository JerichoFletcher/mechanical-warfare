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
