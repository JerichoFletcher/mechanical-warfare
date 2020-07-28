const elib = require("mechanical-warfare/effectlib");
const bulletLib = require("mechanical-warfare/bulletlib");
const prox = require("mechanical-warfare/prox-block-lib");

const marsShootBlast = newEffect(20, e => {
	e.scaled(8, cons(i => {
		Draw.color(Pal.lightOrange, Pal.lighterOrange, i.fslope());
		Draw.alpha(e.fout());
		Drawf.tri(e.x, e.y, i.fout() * 32, i.fslope() * 240, e.rotation);
	}));
	e.scaled(16, cons(i => {
		Draw.color(Color.white, Pal.lighterOrange, i.fin());
		Draw.alpha(i.fout());
		for(var j = 0; j < 2; j++){
			sign = Mathf.signs[j];
			Drawf.tri(e.x, e.y, i.fout() * 8, 16 + i.fout() * 72, e.rotation - 90 * sign);
		}
		Draw.color(Pal.lighterOrange, Pal.lightOrange, i.fin());
		for(var j = 0; j < 2; j++){
			sign = Mathf.signs[j];
			Drawf.tri(e.x, e.y, i.fout() * 6, 12 + i.fout() * 32, e.rotation - (90 * sign) + (45 * sign));
		}
	}));
	Draw.color();
	elib.fillCircle(e.x, e.y, Color.white.cpy().mul(0.6 + e.fout() * 0.4), 0.6 + e.fout() * 0.4, e.fout() * 8);
});

const marsSmokeBlast = newEffect(48, e => {
	Angles.randLenVectors(e.id, 16, e.finpow() * 160, e.rotation, 12, new Floatc2(){get: (x, y) => {
		elib.fillCircle(e.x + x, e.y + y, Color.lightGray.cpy().mul(0.4 + e.fout() * 0.6), 0.4 + e.fout() * 0.6, e.fout() * 8);
	}});
});

const marsBlast = bulletLib.bullet(BasicBulletType, 16, 16, 0, 0, 800, 8000, 56, 3, 37.5, 24, cons(b => {
	Draw.color(marsBlast.backColor);
    Draw.rect(marsBlast.backRegion, b.x, b.y, marsBlast.bulletWidth, marsBlast.bulletHeight, b.rot() - 90);
	Drawf.tri(b.x, b.y, marsBlast.bulletWidth * 0.8, b.velocity().len() * 5, b.rot() + 180);
	
    Draw.color(marsBlast.frontColor);
    Draw.rect(marsBlast.frontRegion, b.x, b.y, marsBlast.bulletWidth, marsBlast.bulletHeight, b.rot() - 90);
    Draw.color();
}), cons(b => {
	Effects.effect(marsBlast.trailEffect, b.x, b.y, b.rot());
}), null, null);
marsBlast.trailEffect = newEffect(60, e => {
	elib.fillCircle(e.x, e.y, marsBlast.frontColor, 1, e.fout() * 4);
});
marsBlast.shootEffect = Fx.flakExplosionBig;
marsBlast.ammoMultiplier = 1;
marsBlast.shootEffect = marsShootBlast;
marsBlast.smokeEffect = marsSmokeBlast;
marsBlast.inaccuracy = 0;

const mars = extendContent(ItemTurret, "mars", {
	init(){
		this.ammo(
			Items.blastCompound, marsBlast
		);
		this.consumes.powerCond(this.powerUse, boolf(entity => entity.target != null));
		this.amplifier = Vars.content.getByName(ContentType.block, "mechanical-warfare-power-amplifier");
		this.super$init();
	},
	onDestroyed(tile){
		tile.ent().proximity().each(boolf(t => {
			e = t.ent();
			return t.block() == this.amplifier && e.cons.valid();
		}), cons(t => t.ent().setWorking(false)));
		this.super$onDestroyed(tile);
	},
	removed(tile){
		tile.ent().proximity().each(boolf(t => {
			e = t.ent();
			return t.block() == this.amplifier && e.cons.valid();
		}), cons(t => t.ent().setWorking(false)));
		this.super$removed(tile);
	},
	load(){
		this.super$load();
		this.baseRegion = Core.atlas.find("mechanical-warfare-block-8");
		this.region = Core.atlas.find(this.name);
	},
	generateIcons(){
		return [
			Core.atlas.find("mechanical-warfare-block-8"),
			Core.atlas.find(this.name)
		];
	},
	draw(tile){
		Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
		Draw.color();
	},
	setBars(){
		this.super$setBars();
		this.bars.add(
			"amplifier", func(entity => {
				return new Bar(
					prov(() => Core.bundle.get("bar.input")),
					prov(() => Pal.accent),
					floatp(() => {
						count = Mathf.clamp(
							prox.getLinkedBlock(entity.tile, this.amplifier, boolf(tile => tile.block() == this.amplifier && tile.ent().isWorking())),
							0, this.minAmplifier
						) / this.minAmplifier;
						return count;
					})
				)
			})
		);
	},
	drawLayer2(tile){
		entity = tile.ent();
		for(var i = 0; i < this.lineWidths.length; i++){
			Tmp.v1.trns(entity.rotation, this.lineOffset - entity.recoil);
			x = Angles.trnsx(entity.rotation, this.lineOffset - entity.recoil);
			y = Angles.trnsy(entity.rotation, this.lineOffset - entity.recoil);
			Draw.color(this.lineColors[i].r, this.lineColors[i].g, this.lineColors[i].b, (entity.getLength() / this.lineLength) * this.lineColors[i].a);
			Draw.blend(Blending.additive);
			Lines.stroke(this.lineWidths[i]);
			Lines.precise(true);
			Lines.lineAngle(tile.drawx() + x, tile.drawy() + y, entity.rotation, entity.getLength());
			Lines.precise(false);
			Draw.blend();
			Draw.reset();
		}
	},
	update(tile){
		entity = tile.ent();
		if(!this.validateTarget(tile)){entity.target = null;}
		entity.recoil = Mathf.lerpDelta(entity.recoil, 0, this.restitution);
		entity.heat = Mathf.lerpDelta(entity.heat, 0, this.cooldown);
		if(this.hasAmmo(tile)){
			if(entity.timer.get(this.timerTarget, this.targetInterval)){
				this.findTarget(tile);
			}
			if(this.validateTarget(tile)){
				type = this.peekAmmo(tile);
				speed = type.speed;
				if(speed < 0.1){speed = 9999999;}
				result = Predict.intercept(entity, entity.target, speed);
				if(result.isZero()){
					result.set(entity.target.getX(), entity.target.getY());
				}
				targetRot = result.sub(tile.drawx(), tile.drawy()).angle();
				if(this.shouldTurn(tile)){
					this.turnToTarget(tile, targetRot);
				}
				this.updateCharging(tile, targetRot);
			}
			if(entity.isCharging()){
				entity.setLength(Mathf.clamp(entity.getLength() + ((this.lineLength / this.chargeTime) * entity.power.status * (prox.getLinkedBlock(tile, this.amplifier, boolf(tile => tile.block() == this.amplifier && tile.ent().isWorking())) / 3)), 0, this.lineLength));
			}
		}else{
			entity.setLength(Mathf.lerpDelta(entity.getLength(), 0, this.cooldown));
		}
		entity.proximity().each(boolf(t => {
			e = t.ent();
			return t.block() == this.amplifier && e.cons.valid();
		}), cons(t => t.ent().setWorking(true)));
	},
	updateCharging(tile, targetRot){
		entity = tile.ent();
		if(entity.reload >= this.reload){
			entity.setCharging(true);
			if(
				Angles.angleDist(entity.rotation, targetRot) < this.shootCone &&
				entity.getLength() >= this.lineLength
			){
				type = this.peekAmmo(tile);
				this.shoot(tile, type);
				entity.reload = 0;
				entity.setLength(0);
				entity.setCharging(false);
			}
		}else if(!entity.isCharging()){
			entity.reload += (entity.delta() * this.peekAmmo(tile).reloadMultiplier * this.baseReloadSpeed(tile));
			maxUsed = this.consumes.get(ConsumeType.liquid).amount;
			liquid = entity.liquids.current();
			used = Math.min(
				Math.min(
					entity.liquids.get(liquid), maxUsed * Time.delta()
				),
				Math.max(
					0,
					(this.reload - entity.reload) / this.coolantMultiplier / liquid.heatCapacity
				)
			) * this.baseReloadSpeed(tile);
			entity.reload += (used * liquid.heatCapacity * this.coolantMultiplier);
			entity.liquids.remove(liquid, used);
			if(Mathf.chance(0.06 * used)){
				Effects.effect(this.coolEffect, tile.drawx() + Mathf.range(this.size * 4), tile.drawy() + Mathf.range(this.size * 4));
			}
		}
	},
	shoot(tile, type){
		entity = tile.ent();
		entity.recoil = this.recoil;
		entity.heat = 1;
		this.tr.trns(entity.rotation, this.size * 4, Mathf.range(this.xRand));
		for(var i = 0; i < type.ammoMultiplier; i++){
			this.bullet(tile, type, entity.rotation + Mathf.range(this.inaccuracy + type.inaccuracy));
			this.useAmmo(tile);
		}
		this.effects(tile);
	},
	baseReloadSpeed(tile){
		return tile.isEnemyCheat() ? 1 : tile.ent().power.status * (prox.getLinkedBlock(tile, this.amplifier, boolf(tile => tile.block() == this.amplifier && tile.ent().isWorking())) / 3);
	}
});
mars.tmpArray = new Packages.arc.struct.Array(64);
mars.shootEffect = Fx.none;
mars.smokeEffect = Fx.none;
mars.lineOffset = -8;
mars.lineLength = 33.75;
mars.lineColors = [
	Color.valueOf("bc4500cd"),
	Color.valueOf("bc450080"),
	Color.valueOf("bc450048"),
	Color.valueOf("bc450016")
];
mars.lineWidths = [1.5, 3, 5.5, 7];
mars.chargeTime = 84;
mars.powerUse = 320;
mars.minAmplifier = 3;
mars.entityType = prov(() => {
	const entity = extendContent(ItemTurret.ItemTurretEntity, mars, {
		setCharging(bool){
			this._charge = bool;
		},
		isCharging(){
			return this._charge;
		},
		setLength(val){
			this._length = val;
		},
		getLength(){
			return this._length;
		}
	});
	entity.setCharging(false);
	entity.setLength(0);
	return entity;
});
