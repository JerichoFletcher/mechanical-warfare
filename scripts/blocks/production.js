const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");

// Scrap Compactor
const compactor = extendContent(GenericCrafter, "scrap-compactor", {
	load(){
		this.region = Core.atlas.find(this.name);
		this.heatRegion = Core.atlas.find(this.name + "-heat");
	},
	generateIcons: function(){
		return [
			Core.atlas.find(this.name),
			Core.atlas.find(this.name + "-frame0")
		];
	},
	draw(tile){
		this.drawer.get(tile);
	}
});
compactor.drawer = cons(tile => {
	var entity = tile.ent();
	Draw.rect(compactor.region, tile.drawx(), tile.drawy());
	Draw.color(Color.valueOf("ff9b5900"), Color.valueOf("ff9b59"), entity.warmup * 0.7 + Mathf.absin(Time.time(), 8.0, 0.3) * entity.warmup);
	Draw.rect(compactor.heatRegion, tile.drawx(), tile.drawy());
	Draw.color();
	Draw.rect(Core.atlas.find(compactor.name + "-frame" + Mathf.floor(Mathf.absin(entity.totalProgress, 3, 3.999))), tile.drawx(), tile.drawy());
});

// Chemical Station
const chemicalStation = extendContent(LiquidConverter, "chemical-station", {
  load(){
    this.region = Core.atlas.find(this.name);
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  generateIcons: function(){
    return [
      Core.atlas.find(this.name),
      Core.atlas.find(this.name + "-top")
    ];
  },
  setStats(){
	this.super$setStats();
	this.stats.add(BlockStat.booster, new ItemListValue(ItemStack.with(Vars.content.getByName(ContentType.item, "mechanical-warfare-iron"), 1)));
  },
  update(tile){
	  this.super$update(tile);
	  var entity = tile.ent();
	  if(entity.cons.valid() && entity.items.get(Vars.content.getByName(ContentType.item, "mechanical-warfare-iron")) > 0){
		  if(entity.getBoosterProgress() < 1){
			  entity.setBoosterProgress(entity.getBoosterProgress() + this.getProgressIncrease(entity, this.boosterTime));
		  }else{
			  entity.setBoosterProgress(0);
		  }
	  }else{
		  entity.setBoosterProgress(0);
	  }
	  if(this.canBoost(tile)){
		if(entity.getBoosterProgress() >= 1){
			entity.items.remove(Vars.content.getByName(ContentType.item, "mechanical-warfare-iron"), 1);
		}
		entity.timeScaleDuration = Math.max(entity.timeScaleDuration, this.boosterTime + 1);
		entity.timeScale = Math.max(entity.timeScale, this.speedBoost);
	  }
  },
  getProgressIncrease(entity, baseTime){
	  var progress = 1 / baseTime * entity.delta() * entity.efficiency();
	  return progress;
  },
  canBoost(tile){
	  return tile != null && tile.entity.cons.valid() && tile.entity.items.get(Vars.content.getByName(ContentType.item, "mechanical-warfare-iron")) > 0;
  },
  acceptItem(item, tile, source){
	  return (Vars.content.getByName(ContentType.item, "mechanical-warfare-sulfur") == item || Vars.content.getByName(ContentType.item, "mechanical-warfare-iron") == item) && tile.entity.items.get(item) < this.itemCapacity;
  },
  draw(tile){
	this.drawer.get(tile);
  },
});
chemicalStation.drawer = cons(tile => {
	var entity = tile.ent();
	Draw.rect(chemicalStation.region, tile.drawx(), tile.drawy());
	Draw.color(chemicalStation.outputLiquid.liquid.color);
	Draw.alpha(entity.liquids.get(chemicalStation.outputLiquid.liquid) / chemicalStation.liquidCapacity);
	Draw.rect(chemicalStation.liquidRegion, tile.drawx(), tile.drawy());
	Draw.color();
	Draw.rect(chemicalStation.topRegion, tile.drawx(), tile.drawy());
});
chemicalStation.speedBoost = 1.5;
chemicalStation.boosterTime = chemicalStation.craftTime * 1.5;
chemicalStation.entityType = prov(() => {
	const entity = extend(GenericCrafter.GenericCrafterEntity, {
		getBoosterProgress: function(){
			return typeof(this._progress) === "undefined" ? 0 : this._progress;
		},
		setBoosterProgress: function(val){
			this._progress = val;
		},
		write(stream){
			this.super$write(stream);
			stream.writeFloat(this._progress);
		},
		read(stream, revision){
			this.super$read(stream, revision);
			this.setBoosterProgress(stream.readFloat());
		}
	});
	entity.setBoosterProgress(0);
	return entity;
});

// Stone Centrifuge
const stoneCentrifuge = extendContent(GenericCrafter, "stone-centrifuge", {
  load(){
    this.region = Core.atlas.find(this.name)
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  generateIcons: function(){
    return [
      Core.atlas.find(this.name),
      Core.atlas.find(this.name + "-top")
    ];
  },
  draw(tile){
	this.drawer.get(tile);
  },
});
stoneCentrifuge.drawer = cons(tile => {
	Draw.rect(stoneCentrifuge.region, tile.drawx(), tile.drawy());
	Draw.color(tile.entity.liquids.current().color);
	Draw.alpha(tile.entity.liquids.total() / stoneCentrifuge.liquidCapacity);
	Draw.rect(stoneCentrifuge.liquidRegion, tile.drawx(), tile.drawy());
	Draw.color();
	Draw.rect(stoneCentrifuge.topRegion, tile.drawx(), tile.drawy());
});

// Stone Grinder
const stoneGrinder = extendContent(GenericCrafter, "stone-grinder", {
  load(){
    this.bottomRegion = Core.atlas.find(this.name + "-bottom");
    this.rightRotatorRegion = Core.atlas.find(this.name + "-rotator1");
    this.leftRotatorRegion = Core.atlas.find(this.name + "-rotator2");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  generateIcons: function(){
    return [
      Core.atlas.find(this.name)
    ];
  },
  draw(tile){
	  this.drawer.get(tile);
  },
});
stoneGrinder.drawer = cons(tile => {
	var entity = tile.ent();
	Draw.rect(stoneGrinder.bottomRegion, tile.drawx(), tile.drawy());
	Draw.rect(stoneGrinder.rightRotatorRegion, tile.drawx() + 11 / 4, tile.drawy() - 11 / 4, entity.totalProgress * 2);
	Draw.rect(stoneGrinder.leftRotatorRegion, tile.drawx() - 10 / 4, tile.drawy() + 10 / 4, entity.totalProgress * -2);
	Draw.rect(stoneGrinder.topRegion, tile.drawx(), tile.drawy());
});

// Insulating Compound
const electricBall = newEffect(10, e => {
	elib.fillCircle(e.x, e.y, Pal.lancerLaser, 1, e.fout() * 0.8);
});
const insulatingCompound = extendContent(GenericCrafter, "insulating-compound", {
	load(){
		this.super$load();
		this.region = Core.atlas.find(this.name);
		this.topRegion = Core.atlas.find(this.name + "-top");
	},
	draw(tile){
		this.drawer.get(tile);
	},
	update(tile){
		this.super$update(tile);
		var entity = tile.ent();
		if(entity.cons.valid()){
			if(entity.items.get(this.outputItem.item) != this.itemCapacity){
				entity.setBoltChance(Mathf.lerpDelta(entity.getBoltChance(), entity.power.status / 2, 0.02));
			}else{
				entity.setBoltChance(Mathf.lerpDelta(entity.getBoltChance(), 0, 0.02));
			}
		}else{
			entity.setBoltChance(Mathf.lerpDelta(entity.getBoltChance(), 0, 0.02));
		}
	},
	drawLayer2(tile){
		this.super$drawLayer2(tile);
		var entity = tile.ent();
		Draw.blend(Blending.additive);
		for(var i = 0; i < this.boltCount; i++){
			if(Mathf.randomSeed(Mathf.round(Time.time() + entity.id + i)) > entity.getBoltChance()){continue;}
			var rawrot = Time.time() * this.boltRotSpeed[i] * this.boltRotDir[i];
			var truerot =
				rawrot > 0 ?
					(rawrot % 360)
				:
					(360 + (rawrot % 360));
			Draw.mixcol(Color.white, Mathf.absin(Time.time(), this.boltRotSpeed[i] * 0.1, 0.5));
			Draw.alpha(0.9 + Mathf.absin(Time.time(), this.boltRotSpeed[i] * 0.1, 0.1));
			Draw.rect(Core.atlas.find(this.name + "-bolt" + i), tile.drawx(), tile.drawy(), truerot);
			Draw.mixcol();
			Draw.color();
		}
		Draw.blend();
		Draw.reset();
	}
});
insulatingCompound.drawer = cons(tile => {
	var entity = tile.ent();
	Draw.rect(insulatingCompound.region, tile.drawx(), tile.drawy());
	Draw.alpha(entity.getBoltChance());
	Draw.rect(insulatingCompound.topRegion, tile.drawx(), tile.drawy());
	var alpha = (1 - Mathf.absin(Time.time(), 5, 0.3)) * entity.getBoltChance();
	var cr = Mathf.random(0.1);
	elib.fillCircle(tile.drawx(), tile.drawy(), Pal.lancerLaser, alpha, 2 + Mathf.absin(Time.time(), 5, 2) + cr);
	elib.fillCircle(tile.drawx(), tile.drawy(), Color.white, alpha, 0.7 + Mathf.absin(Time.time(), 5, 0.7) + cr);
	Draw.color();
});
insulatingCompound.layer2 = Layer.power;
insulatingCompound.boltCount = 3;
insulatingCompound.boltRotSpeed = [12, 9, 27];
insulatingCompound.boltRotDir = [1, -1, -1];
insulatingCompound.updateEffect = electricBall;
insulatingCompound.craftEffect = Fx.smeltsmoke;
insulatingCompound.entityType = prov(() => {
	const entity = extend(GenericCrafter.GenericCrafterEntity, {
		getBoltChance: function(){
			return this._chance;
		},
		setBoltChance: function(val){
			this._chance = val < 0.0001 ? 0 : val;
		}
	});
	entity.setBoltChance(0);
	return entity;
});

// Polluter
const polluter = extendContent(LiquidConverter, "polluter", {
	load(){
		this.super$load();
		this.region = Core.atlas.find(this.name);
		this.liquidRegion = Core.atlas.find(this.name + "-liquid");
		this.rotatorRegion = Core.atlas.find(this.name + "-rotator");
		this.topRegion = Core.atlas.find(this.name + "-top");
	},
	update(tile){
		this.super$update(tile);
		entity = tile.ent();
		if(entity.cons.valid()){
			entity.warmup = Mathf.lerpDelta(entity.warmup, 1, 0.02);
		}else{
			entity.warmup = Mathf.lerpDelta(entity.warmup, 0, 0.02);
		}
		entity.setRot(entity.getRot() + entity.warmup * this.rotateSpeed);
	},
	generateIcons(){
		return [
			Core.atlas.find(this.name),
			Core.atlas.find(this.name + "-rotator"),
			Core.atlas.find(this.name + "-top")
		];
	}
});
polluter.drawer = cons(tile => {
	entity = tile.ent();
	Draw.rect(polluter.region, tile.drawx(), tile.drawy());
	Draw.color(entity.liquids.current().color);
	Draw.alpha(entity.liquids.total() / polluter.liquidCapacity);
	Draw.rect(polluter.liquidRegion, tile.drawx(), tile.drawy());
	Draw.color();
	Draw.rect(polluter.rotatorRegion, tile.drawx(), tile.drawy(), entity.getRot() - 90);
	Draw.rect(polluter.topRegion, tile.drawx(), tile.drawy());
});
polluter.rotateSpeed = 3;
polluter.entityType = prov(() => {
	const entity = extend(GenericCrafter.GenericCrafterEntity, {
		setRot(val){
			this._rot = val;
		},
		getRot(){
			return this._rot;
		}
	});
	entity.setRot(0);
	return entity;
});

// Dissolver
const dissolver = extendContent(LiquidConverter, "dissolver", {
	load(){
		this.super$load();
		this.region = Core.atlas.find(this.name);
		this.liquidRegion = Core.atlas.find(this.name + "-liquid");
		this.rotatorRegion = Core.atlas.find(this.name + "-rotator");
		this.topRegion = Core.atlas.find(this.name + "-top");
	},
	update(tile){
		this.super$update(tile);
		entity = tile.ent();
		if(entity.cons.valid()){
			entity.warmup = Mathf.lerpDelta(entity.warmup, 1, 0.02);
		}else{
			entity.warmup = Mathf.lerpDelta(entity.warmup, 0, 0.02);
		}
		entity.setRot(entity.getRot() + entity.warmup * this.rotateSpeed);
	},
	generateIcons(){
		return [
			Core.atlas.find(this.name),
			Core.atlas.find(this.name + "-rotator"),
			Core.atlas.find(this.name + "-top")
		];
	}
});
dissolver.drawer = cons(tile => {
	entity = tile.ent();
	Draw.rect(dissolver.region, tile.drawx(), tile.drawy());
	Draw.color(entity.liquids.current().color);
	Draw.alpha(entity.liquids.total() / dissolver.liquidCapacity);
	Draw.rect(dissolver.liquidRegion, tile.drawx(), tile.drawy());
	Draw.color();
	Draw.rect(dissolver.rotatorRegion, tile.drawx(), tile.drawy(), entity.getRot() - 90);
	Draw.rect(dissolver.topRegion, tile.drawx(), tile.drawy());
});
dissolver.rotateSpeed = 4;
dissolver.entityType = prov(() => {
	const entity = extend(GenericCrafter.GenericCrafterEntity, {
		setRot(val){
			this._rot = val;
		},
		getRot(){
			return this._rot;
		}
	});
	entity.setRot(0);
	return entity;
});

const mutator = extendContent(GenericCrafter, "mutator", {
	load(){
		this.super$load();
		this.region = Core.atlas.find(this.name);
		this.liquidRegion = Core.atlas.find(this.name + "-liquid");
		this.topRegion = Core.atlas.find(this.name + "-top");
	},
	generateIcons(){
		return [
			Core.atlas.find(this.name),
			Core.atlas.find(this.name + "-top")
		];
	}
});
mutator.drawer = cons(tile => {
	entity = tile.ent();
	Draw.rect(mutator.region, tile.drawx(), tile.drawy());
	Draw.color(entity.liquids.current().color);
	Draw.alpha(entity.liquids.total() / mutator.liquidCapacity);
	Draw.rect(mutator.liquidRegion, tile.drawx(), tile.drawy());
	Draw.reset();
	Draw.rect(mutator.topRegion, tile.drawx(), tile.drawy());
});

// Dissipator
const dissipator = extendContent(GenericCrafter, "molecular-dissipator", {
	init(){
		this.outputItems = [
			new ItemStack(Items.sporePod, 1),
			new ItemStack(Items.thorium, 3),
			new ItemStack(Vars.content.getByName(ContentType.item, "mechanical-warfare-uranium"), 1)
		];
		this.super$init();
	},
	load(){
		this.super$load();
		this.region = Core.atlas.find(this.name);
		this.rotatorRegion = Core.atlas.find(this.name + "-rotator");
		this.sporeRegion = Core.atlas.find(this.name + "-liquid");
		this.topRegion = Core.atlas.find(this.name + "-top");
	},
	generateIcons(){
		return [
			Core.atlas.find(this.name),
			Core.atlas.find(this.name + "-rotator"),
			Core.atlas.find(this.name + "-top")
		];
	},
	draw(tile){
		this.drawer.get(tile);
	},
	update(tile){
		entity = tile.ent();
		if(entity.cons.valid()){
			entity.progress += this.getProgressIncrease(entity, this.craftTime);
			entity.totalProgress += entity.delta();
			entity.warmup = Mathf.lerpDelta(entity.warmup, 1, 0.02);
			
		}else{
			entity.warmup = Mathf.lerpDelta(entity.warmup, 0, 0.02);
		}
		if(entity.progress >= 1){
			entity.cons.trigger();
			for(var i = 0; i < this.outputItems.length; i++){
				this.useContent(tile, this.outputItems[i].item);
				for(var j = 0; j < this.outputItems[i].amount; j++){
					this.offloadNear(tile, this.outputItems[i].item);
				}
			}
			Effects.effect(this.craftEffect, tile.drawx(), tile.drawy());
			entity.progress = 0;
		}
		if(entity.timer.get(this.timerDump, 5)){
			for(var i = 0; i < this.outputItems.length; i++){
				this.tryDump(tile, this.outputItems[i].item);
			}
		}
		entity.setRot(entity.getRot() + entity.warmup * this.rotateSpeed);
		entity.setAlpha(Mathf.lerpDelta(entity.getAlpha(), entity.items.get(Vars.content.getByName(ContentType.item, "mechanical-warfare-radioactive-spore-pod")) / 10, 0.05));
	}
});
dissipator.drawer = cons(tile => {
	entity = tile.ent();
	Draw.rect(dissipator.region, tile.drawx(), tile.drawy());
	Draw.color(Vars.content.getByName(ContentType.item, "mechanical-warfare-radioactive-spore-pod").color);
	Draw.alpha(entity.getAlpha());
	Draw.rect(dissipator.sporeRegion, tile.drawx(), tile.drawy());
	Draw.color();
	Draw.rect(dissipator.rotatorRegion, tile.drawx(), tile.drawy(), entity.getRot() - 90);
	Draw.rect(dissipator.topRegion, tile.drawx(), tile.drawy());
});
dissipator.rotateSpeed = 5;
dissipator.entityType = prov(() => {
	const entity = extend(GenericCrafter.GenericCrafterEntity, {
		setRot(val){
			this._rot = val;
		},
		getRot(){
			return this._rot;
		},
		setAlpha(val){
			this._alpha = val;
		},
		getAlpha(){
			return this._alpha;
		}
	});
	entity.setRot(0);
	entity.setAlpha(0);
	return entity;
});

const coilWinder = extendContent(GenericCrafter, "coil-winder", {
	load(){
		this.super$load();
		this.region = Core.atlas.find(this.name);
		this.rotatorRegion = Core.atlas.find(this.name + "-rotator");
		this.topRegion = Core.atlas.find(this.name + "-top");
	},
	generateIcons(){
		return [
			Core.atlas.find(this.name),
			Core.atlas.find(this.name + "-rotator"),
			Core.atlas.find(this.name + "-top")
		];
	},
	update(tile){
		this.super$update(tile);
		entity = tile.ent();
		entity.setRot(entity.getRot() + this.rotateSpeed * entity.warmup);
	}
});
coilWinder.rotateSpeed = 8;
coilWinder.drawer = cons(tile => {
	entity = tile.ent();
	block = coilWinder;
	Draw.rect(block.region, tile.drawx(), tile.drawy());
	Draw.rect(block.rotatorRegion, tile.drawx(), tile.drawy(), entity.getRot());
	Draw.rect(block.topRegion, tile.drawx(), tile.drawy());
});
coilWinder.entityType = prov(() => {
	const entity = extend(GenericCrafter.GenericCrafterEntity, {
		setRot(val){
			this._rot = val;
		},
		getRot(){
			return this._rot;
		}
	});
	entity.setRot(0);
	return entity;
});

// MK2 Module Assembler
const mk2Assembler = extendContent(GenericCrafter, "mk2-assembler", {
  load(){
    this.region = Core.atlas.find(this.name);
    this.bottomRegion = Core.atlas.find(this.name + "-bottom");
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
  },
  generateIcons: function(){
    return [
      Core.atlas.find(this.name + "-bottom"),
      Core.atlas.find(this.name)
    ];
  },
  draw(tile){
	  this.drawer.get(tile);
  }
});
mk2Assembler.drawer = cons(tile => {
	const entity = tile.ent();
	Draw.rect(mk2Assembler.bottomRegion, tile.drawx(), tile.drawy());
	Draw.color(Pal.accent);
	Draw.alpha(entity.warmup);
	Lines.lineAngleCenter(
		tile.drawx(),
		tile.drawy() + Mathf.sin(entity.totalProgress, 8, (Vars.tilesize - 1) * mk2Assembler.size / 2),
		0,
		(Vars.tilesize - 1) * mk2Assembler.size
	);
	Draw.reset();
	Draw.rect(mk2Assembler.region, tile.drawx(), tile.drawy());
	Draw.color(entity.liquids.current().color);
	Draw.alpha(entity.liquids.total() / mk2Assembler.liquidCapacity);
	Draw.rect(mk2Assembler.liquidRegion, tile.drawx(), tile.drawy());
	Draw.reset();
});

//AP Shell assembler
const APassembler= extendContent(GenericCrafter, "ap-shell-assembler",{
	load(){
		this.region=Core.atlas.find(this.name);
		this.bar=Core.atlas.find(this.name + "-bar");
		this.topRegion=Core.atlas.find(this.name+ "-top");
	},
	generateIcons:function(){
		return[
			Core.atlas.find(this.name),
			Core.atlas.find(this.name + "-bar"),
			Core.atlas.find(this.name + "-top"),
		];
	},
	
	draw(tile){
		var entity=tile.ent();
		Draw.rect(this.region, tile.drawx(), tile.drawy());
		Draw.rect(this.bar, tile.drawx(), absin(entity.getTotalProgress, 3, 0.9)*entity.warmup);
		Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
	},
});
			
					
