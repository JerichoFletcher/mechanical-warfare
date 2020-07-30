const elib = require("mechanical-warfare/effectlib");
const bulletLib = require("mechanical-warfare/bulletlib");
const prox = require("mechanical-warfare/prox-block-lib");

const marsShoot = newEffect(20, e => {
	e.scaled(8, cons(i => {
		Draw.color(Pal.lighterOrange, Pal.lightOrange, i.fslope());
		Draw.alpha(e.fout());
		Drawf.tri(e.x, e.y, i.fout() * 32, i.fout() * 240, e.rotation);
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

const marsSmoke = newEffect(48, e => {
	Angles.randLenVectors(e.id, 16, e.finpow() * 160, e.rotation, 12, new Floatc2(){get: (x, y) => {
		elib.fillCircle(e.x + x, e.y + y, Color.lightGray.cpy().mul(0.4 + e.fout() * 0.6), 0.4 + e.fout() * 0.6, e.fout() * 8);
	}});
});

const marsHitBlast = newEffect(30, e => {
	e.scaled(10, cons(i => {
		elib.outlineCircle(e.x, e.y, Pal.missileYellow, i.fout() * 2, i.fin() * 64);
		elib.outlineCircle(e.x, e.y, Pal.missileYellow, i.fout() * 3, i.fin() * 48);
	}));
	elib.splashCircles(e.x, e.y, Color.gray, 1, 1 + e.fout() * 5, 12 + e.finpow() * 84, 8, e.id);
	elib.splashLines(e.x, e.y, Pal.missileYellowBack, 1.5 * e.fout(), 12 + e.finpow() * 96, 1 + e.fout() * 5, 12, e.id + 1);
});

const marsCopper = bulletLib.bullet(BasicBulletType, 12, 12, 0, 0, 720, 960, 24, 3, 37.5, 24, cons(b => {
	Draw.color(marsCopper.backColor);
    Draw.rect(marsCopper.backRegion, b.x, b.y, marsCopper.bulletWidth, marsCopper.bulletHeight, b.rot() - 90);
	angle = Angles.angle(b.x, b.y, b.getData().vec.x, b.getData().vec.y);
	dst = Mathf.clamp(Mathf.dst(b.x, b.y, b.getData().vec.x, b.getData().vec.y), 0, b.velocity().len() * 5);
	Drawf.tri(b.x, b.y, marsCopper.bulletWidth * 0.8, dst, angle);
	
    Draw.color(marsCopper.frontColor);
    Draw.rect(marsCopper.frontRegion, b.x, b.y, marsCopper.bulletWidth, marsCopper.bulletHeight, b.rot() - 90);
    Draw.color();
}), cons(b => {
	Effects.effect(marsCopper.trailEffect, b.x, b.y, b.rot());
}), null, null);
marsCopper.trailEffect = newEffect(60, e => {
	elib.fillCircle(e.x, e.y, marsCopper.frontColor, 1, e.fout() * 3);
});
marsCopper.bulletSprite = "shell";
marsCopper.ammoMultiplier = 1;
marsCopper.inaccuracy = 0;
marsCopper.hitEffect = Fx.blastExplosion;
marsCopper.despawnEffect = Fx.blastExplosion;
marsCopper.hitSound = Sounds.explosion;

const marsBlast = bulletLib.bullet(BasicBulletType, 16, 16, 0, 0, 640, 9600, 56, 3, 37.5, 24, cons(b => {
	Draw.color(marsBlast.backColor);
    Draw.rect(marsBlast.backRegion, b.x, b.y, marsBlast.bulletWidth, marsBlast.bulletHeight, b.rot() - 90);
	angle = Angles.angle(b.x, b.y, b.getData().vec.x, b.getData().vec.y);
	dst = Mathf.clamp(Mathf.dst(b.x, b.y, b.getData().vec.x, b.getData().vec.y), 0, b.velocity().len() * 5);
	Drawf.tri(b.x, b.y, marsBlast.bulletWidth * 0.8, dst, angle);
	
    Draw.color(marsBlast.frontColor);
    Draw.rect(marsBlast.frontRegion, b.x, b.y, marsBlast.bulletWidth, marsBlast.bulletHeight, b.rot() - 90);
    Draw.color();
}), cons(b => {
	Effects.effect(marsBlast.trailEffect, b.x, b.y, b.rot());
}), null, null);
marsBlast.trailEffect = newEffect(60, e => {
	elib.fillCircle(e.x, e.y, marsBlast.frontColor, 1, e.fout() * 4);
});
marsBlast.bulletSprite = "shell";
marsBlast.ammoMultiplier = 1;
marsBlast.inaccuracy = 0;
marsBlast.hitEffect = marsHitBlast;
marsBlast.despawnEffect = marsHitBlast;
marsBlast.hitSound = Sounds.explosion;

const tmpExplosion = extend(BasicBulletType, {
	draw(b){}
});
tmpExplosion.splashDamage = 16;
tmpExplosion.splashDamageRadius = 24;
tmpExplosion.hitEffect = Fx.blastExplosion;
tmpExplosion.despawnEffect = Fx.blastExplosion;
tmpExplosion.speed = 0.1;
tmpExplosion.lifetime = 1;
tmpExplosion.instantDisappear = true;

/*const lightning1 = function(tile, vec){
	if(tile == null){return;}
	entity = tile.ent();
	angle = Angles.angle(tile.drawx(), tile.drawy(), tile.drawx() + vec.x, tile.drawy() + vec.y);
	dst = tile.block().size * 4;
	Sounds.laser.at(tile.drawx(), tile.drawy(), Mathf.random(0.6, 0.8));
	for(var i = 0; i < 6; i++){
		Time.run(i, run(() => {
			if(entity == null){return}
			x = Angles.trnsx(angle, dst);
			y = Angles.trnsy(angle, dst);
			Lightning.create(tile.getTeam(), Pal.surge, 12, tile.drawx() + x, tile.drawy() + y, angle, 20);
			Sounds.spark.at(tile.drawx() + x, tile.drawy() + y, Mathf.random(0.9, 1.3));
		}));
	}
}

const lightning2 = function(tile, vec){
	if(tile == null){return;}
	entity = tile.ent();
	angle = Angles.angle(tile.drawx(), tile.drawy(), tile.drawx() + vec.x, tile.drawy() + vec.y);
	dst = tile.block().size * 4;
	Sounds.laser.at(tile.drawx(), tile.drawy(), Mathf.random(0.4, 0.6));
	for(var i = 0; i < 12; i++){
		Time.run(i, run(() => {
			if(entity == null){return;}
			x = Angles.trnsx(angle, dst);
			y = Angles.trnsy(angle, dst);
			Lightning.create(tile.getTeam(), Pal.surge, 12, tile.drawx() + x, tile.drawy() + y, angle, 36);
			Sounds.spark.at(tile.drawx() + x, tile.drawy() + y, Mathf.random(0.6, 0.8));
		}));
	}
}*/

const explosion = function(tile, vec){
	if(tile == null){return;}
	entity = tile.ent();
	if(entity == null){return;}
	block = tile.block();
	dst = block.size * 4;
	Angles.randLenVectors(entity.id, 10, 96, entity.rotation, 30, new Floatc2(){get: (x, y) => {
		Bullet.create(tmpExplosion, entity, tile.getTeam(), tile.drawx() + vec.x + x, tile.drawy() + vec.y + y, entity.rotation, 1, 1);
		Sounds.explosion.at(tile.drawx() + x, tile.drawy() + y, Mathf.random(0.8, 1.2));
	}});
}

const mars = extendContent(ItemTurret, "mars", {
	init(){
		this.ammo(
			Items.copper, marsCopper,
			Items.blastCompound, marsBlast
		);
		this.shootAtt = OrderedMap.of([
			marsCopper, /** lightning1*/explosion,
			marsBlast, explosion
		]);
		this.consumes.powerCond(this.powerUse, boolf(entity => entity.target != null));
		this.amplifier = Vars.content.getByName(ContentType.block, "mechanical-warfare-power-amplifier");
		this.super$init();
	},
	onDestroyed(tile){
		prox.eachLinkedBlock(tile, boolf(t => {
			e = t.ent();
			return t.block() == this.amplifier && e.cons.valid();
		}), cons(t => t.ent().setWorking(false)));
		this.super$onDestroyed(tile);
	},
	removed(tile){
		prox.eachLinkedBlock(tile, boolf(t => {
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
							prox.getLinkedBlock(
								entity.tile, this.amplifier, boolf(tile => {
									return tile.block() == this.amplifier && tile.ent().cons.valid();
								})
							), 0, this.minAmplifier
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
				prox.eachLinkedBlock(tile, boolf(t => {
					e = t.ent();
					return t.block() == this.amplifier && e.cons.valid();
				}), cons(t => t.ent().setWorking(true)));
			}else{
				entity.setCharging(false);
			}
			if(entity.isCharging()){
				entity.setLength(
					Mathf.clamp(
						entity.getLength() + ((this.lineLength / this.chargeTime) * entity.power.status * (
							prox.getLinkedBlock(tile, this.amplifier, boolf(tile => {
								return tile.block() == this.amplifier && tile.ent().isWorking();
							}))
						/ 3)), 0, this.lineLength
					)
				);
			}else{
				entity.setLength(Mathf.lerpDelta(entity.getLength(), 0, this.cooldown));
			}
		}else{
			entity.setLength(Mathf.lerpDelta(entity.getLength(), 0, this.cooldown));
			Core.app.post(run(() => {
				if(tile == null || entity == null){return;}
				prox.eachLinkedBlock(tile, boolf(t => {
					e = t.ent();
					return t.block() == this.amplifier && e.isWorking();
				}), cons(t => t.ent().setWorking(false)));
			}));
		}
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
	bullet(tile, type, angle){
		bullet = Bullet.create(type, tile.entity, tile.getTeam(), tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, angle, 1, 1);
		tx = tile.drawx() + this.tr.x;
		ty = tile.drawy() + this.tr.y;
		bullet.setData({vec: {
			x: tx,
			y: ty
		}});
		this.shootAtt.get(type)(tile, this.tr);
	},
	baseReloadSpeed(tile){
		return tile.isEnemyCheat() ? 1 : tile.ent().power.status * (
			Mathf.clamp(prox.getLinkedBlock(tile, this.amplifier, boolf(t => {
				return t.block() == this.amplifier && t.ent().isWorking();
			})), 0, this.minAmplifier) / 3
		);
	},
	hasAmmo(tile){
		return this.super$hasAmmo(tile) && tile.ent().power.status > 0;
	}
});
mars.shootEffect = marsShoot;
mars.smokeEffect = marsSmoke;
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
