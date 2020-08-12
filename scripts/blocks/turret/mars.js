const elib = require("mechanical-warfare/effectlib");
const bulletLib = require("mechanical-warfare/bulletlib");
const prox = require("mechanical-warfare/prox-block-lib");
const trailLib = require("mechanical-warfare/traillib");

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

const marsSandSmoke = newEffect(64, e => {
	Angles.randLenVectors(e.id, 128, e.finpow() * 300, e.rotation, 18, new Floatc2(){get: (x, y) => {
		elib.fillCircle(e.x + x, e.y + y, Pal.lighterOrange.cpy().mul(0.4 + e.fout() * 0.6), 0.4 + e.fout() * 0.6, e.fout() * 4);
	}});
});

const bulletDraw = function(b, type){
	Draw.color(type.backColor);
    Draw.rect(type.backRegion, b.x, b.y, type.bulletWidth, type.bulletHeight, b.rot() - 90);
	b.getData().trail.draw(type.backColor, type.bulletWidth * 0.3);
	
    Draw.color(type.frontColor);
    Draw.rect(type.frontRegion, b.x, b.y, type.bulletWidth, type.bulletHeight, b.rot() - 90);
    Draw.color();
}

const marsSand = bulletLib.bullet(BasicBulletType, 10, 10, 0, 0, 320, 480, 27, 6, 37.5, 32, cons(b => {
	bulletDraw(b, marsSand);
}), cons(b => {
	Effects.effect(marsSand.trailEffect, b.x, b.y, b.rot());
}), cons(b => {
	Core.app.post(run(() => {
		if(b == null || b.getData() == null)return;
		b.getData().trail.update(b.x, b.y);
	}));
}), null, cons(b => {
	b.setData({
		trail: trailLib.newTrail(6)
	});
}));
marsSand.trailEffect = newEffect(60, e => {
	elib.fillCircle(e.x, e.y, marsSand.frontColor, 1, e.fout() * 3);
});
marsSand.bulletSprite = "shell";
marsSand.ammoMultiplier = 15;
marsSand.inaccuracy = 15;
marsSand.hitEffect = Fx.flakExplosion;
marsSand.despawnEffect = Fx.flakExplosion;
marsSand.hitSound = Sounds.explosion;
marsSand.pierce = true;
marsSand.drawSize = 225;

const marsCopper = bulletLib.bullet(BasicBulletType, 12, 12, 0, 0, 1920, 1280, 24, 3, 37.5, 32, cons(b => {
	bulletDraw(b, marsCopper);
}), cons(b => {
	Effects.effect(marsCopper.trailEffect, b.x, b.y, b.rot());
}), cons(b => {
	Core.app.post(run(() => {
		if(b == null || b.getData() == null)return;
		b.getData().trail.update(b.x, b.y);
	}));
}), null, cons(b => {
	b.setData({
		trail: trailLib.newTrail(6)
	});
}));
marsCopper.trailEffect = newEffect(60, e => {
	elib.fillCircle(e.x, e.y, marsCopper.frontColor, 1, e.fout() * 3);
});
marsCopper.bulletSprite = "shell";
marsCopper.ammoMultiplier = 10;
marsCopper.inaccuracy = 10;
marsCopper.hitEffect = Fx.blastExplosion;
marsCopper.despawnEffect = Fx.blastExplosion;
marsCopper.hitSound = Sounds.explosion;
marsCopper.pierce = true;
marsCopper.drawSize = 225;

const marsSilicon = bulletLib.bullet(BasicBulletType, 13, 13, 0, 0, 2400, 800, 18, 4, 37.5, 32, cons(b => {
	bulletDraw(b, marsSilicon);
}), cons(b => {
	Effects.effect(marsSilicon.trailEffect, b.x, b.y, b.rot());
}), cons(b => {
	Core.app.post(run(() => {
		if(b == null || b.getData() == null)return;
		b.getData().trail.update(b.x, b.y);
	}));
}), null, cons(b => {
	b.setData({
		trail: trailLib.newTrail(6)
	});
}));
marsSilicon.trailEffect = newEffect(60, e => {
	elib.fillCircle(e.x, e.y, marsSilicon.frontColor, 1, e.fout() * 3.2);
});
marsSilicon.bulletSprite = "shell";
marsSilicon.ammoMultiplier = 5;
marsSilicon.inaccuracy = 5;
marsSilicon.homingPower = 2;
marsSilicon.homingRange = 160;
marsSilicon.hitEffect = Fx.blastExplosion;
marsSilicon.despawnEffect = Fx.blastExplosion;
marsSilicon.hitSound = Sounds.explosion;
marsSilicon.pierce = true;
marsSilicon.drawSize = 225;

const marsGraphite = bulletLib.bullet(BasicBulletType, 15, 15, 0, 0, 3240, 640, 12, 5, 37.5, 32, cons(b => {
	bulletDraw(b, marsGraphite);
}), cons(b => {
	Effects.effect(marsGraphite.trailEffect, b.x, b.y, b.rot());
}), cons(b => {
	Core.app.post(run(() => {
		if(b == null || b.getData() == null)return;
		b.getData().trail.update(b.x, b.y);
	}));
}), null, cons(b => {
	b.setData({
		trail: trailLib.newTrail(6)
	});
}));
marsGraphite.trailEffect = newEffect(60, e => {
	elib.fillCircle(e.x, e.y, marsGraphite.frontColor, 1, e.fout() * 3.5);
});
marsGraphite.bulletSprite = "shell";
marsGraphite.ammoMultiplier = 3;
marsGraphite.inaccuracy = 3;
marsGraphite.hitEffect = Fx.blastExplosion;
marsGraphite.despawnEffect = Fx.blastExplosion;
marsGraphite.hitSound = Sounds.explosion;
marsGraphite.pierce = true;
marsGraphite.drawSize = 225;

const marsTitanium = bulletLib.bullet(BasicBulletType, 15, 15, 0, 0, 4800, 600, 12, 5.5, 37.5, 32, cons(b => {
	bulletDraw(b, marsTitanium);
}), cons(b => {
	Effects.effect(marsTitanium.trailEffect, b.x, b.y, b.rot());
}), cons(b => {
	Core.app.post(run(() => {
		if(b == null || b.getData() == null)return;
		b.getData().trail.update(b.x, b.y);
	}));
}), null, cons(b => {
	b.setData({
		trail: trailLib.newTrail(6)
	});
}));
marsTitanium.trailEffect = newEffect(60, e => {
	elib.fillCircle(e.x, e.y, marsTitanium.frontColor, 1, e.fout() * 4);
});
marsTitanium.bulletSprite = "shell";
marsTitanium.ammoMultiplier = 3;
marsTitanium.inaccuracy = 3;
marsTitanium.hitEffect = Fx.blastExplosion;
marsTitanium.despawnEffect = Fx.blastExplosion;
marsTitanium.hitSound = Sounds.explosion;
marsTitanium.pierce = true;
marsTitanium.drawSize = 225;

const marsCoal = bulletLib.bullet(BasicBulletType, 13, 13, 0, 0, 2400, 480, 24, 4, 37.5, 32, cons(b => {
	bulletDraw(b, marsCoal);
}), cons(b => {
	Effects.effect(marsCoal.trailEffect, b.x, b.y, b.rot());
}), cons(b => {
	Core.app.post(run(() => {
		if(b == null || b.getData() == null)return;
		b.getData().trail.update(b.x, b.y);
	}));
}), null, cons(b => {
	b.setData({
		trail: trailLib.newTrail(6)
	});
}));
marsCoal.trailEffect = newEffect(60, e => {
	elib.fillCircle(e.x, e.y, marsCoal.frontColor, 1, e.fout() * 4);
});
marsCoal.bulletSprite = "shell";
marsCoal.ammoMultiplier = 3;
marsCoal.inaccuracy = 3;
marsCoal.hitEffect = Fx.blastExplosion;
marsCoal.despawnEffect = Fx.blastExplosion;
marsCoal.hitSound = Sounds.explosion;
marsCoal.status = StatusEffects.burning;
marsCoal.frontColor = Pal.lighterOrange;
marsCoal.backColor = Pal.lightOrange;
marsCoal.pierce = true;
marsCoal.drawSize = 225;

const marsPyra = bulletLib.bullet(BasicBulletType, 13, 13, 0, 0, 3840, 720, 30, 4, 37.5, 32, cons(b => {
	bulletDraw(b, marsPyra);
}), cons(b => {
	Effects.effect(marsPyra.trailEffect, b.x, b.y, b.rot());
}), cons(b => {
	Core.app.post(run(() => {
		if(b == null || b.getData() == null)return;
		b.getData().trail.update(b.x, b.y);
	}));
}), null, cons(b => {
	b.setData({
		trail: trailLib.newTrail(6)
	});
}));
marsPyra.trailEffect = newEffect(60, e => {
	elib.fillCircle(e.x, e.y, marsPyra.frontColor, 1, e.fout() * 4);
});
marsPyra.bulletSprite = "shell";
marsPyra.ammoMultiplier = 3;
marsPyra.inaccuracy = 3;
marsPyra.hitEffect = Fx.blastExplosion;
marsPyra.despawnEffect = Fx.blastExplosion;
marsPyra.hitSound = Sounds.explosion;
marsPyra.status = StatusEffects.burning;
marsPyra.frontColor = Pal.lighterOrange;
marsPyra.backColor = Pal.lightOrange;
marsPyra.pierce = true;
marsPyra.drawSize = 225;

const marsBlast = bulletLib.bullet(BasicBulletType, 15, 15, 0, 0, 3840, 9600, 56, 3, 37.5, 32, cons(b => {
	bulletDraw(b, marsBlast);
}), cons(b => {
	Effects.effect(marsBlast.trailEffect, b.x, b.y, b.rot());
}), cons(b => {
	Core.app.post(run(() => {
		if(b == null || b.getData() == null)return;
		b.getData().trail.update(b.x, b.y);
	}));
}), null, cons(b => {
	b.setData({
		trail: trailLib.newTrail(6)
	});
}));
marsBlast.trailEffect = newEffect(60, e => {
	elib.fillCircle(e.x, e.y, marsBlast.frontColor, 1, e.fout() * 4);
});
marsBlast.bulletSprite = "shell";
marsBlast.ammoMultiplier = 1;
marsBlast.inaccuracy = 0;
marsBlast.hitEffect = marsHitBlast;
marsBlast.despawnEffect = marsHitBlast;
marsBlast.hitSound = Sounds.explosion;
marsBlast.frontColor = Pal.missileYellow;
marsBlast.backColor = Pal.missileYellowBack;
marsBlast.pierce = false;
marsBlast.drawSize = 225;

const marsSurge = bulletLib.bullet(BasicBulletType, 15, 15, 0, 0, 12800, 1440, 27, 6, 37.5, 32, cons(b => {
	bulletDraw(b, marsSurge);
}), cons(b => {
	Effects.effect(marsSurge.trailEffect, b.x, b.y, b.rot());
}), cons(b => {
	Core.app.post(run(() => {
		if(b == null || b.getData() == null)return;
		b.getData().trail.update(b.x, b.y);
	}));
}), null, cons(b => {
	b.setData({
		trail: trailLib.newTrail(6)
	});
}));
marsSurge.trailEffect = newEffect(60, e => {
	elib.fillCircle(e.x, e.y, marsSurge.frontColor, 1, e.fout() * 4);
});
marsSurge.bulletSprite = "shell";
marsSurge.ammoMultiplier = 1;
marsSurge.inaccuracy = 0;
marsSurge.hitEffect = Fx.flakExplosionBig;
marsSurge.despawnEffect = Fx.flakExplosionBig;
marsSurge.hitSound = Sounds.explosion;
marsSurge.lightining = 6;
marsSurge.lightningLength = 18;
marsSurge.status = StatusEffects.shocked;
marsSurge.pierce = false;
marsSurge.drawSize = 225;

const tmpExplosion = extend(BasicBulletType, {
	draw(b){}
});
tmpExplosion.splashDamage = 300;
tmpExplosion.splashDamageRadius = 30;
tmpExplosion.hitEffect = Fx.blastExplosion;
tmpExplosion.despawnEffect = Fx.blastExplosion;
tmpExplosion.speed = 0.1;
tmpExplosion.lifetime = 1;
tmpExplosion.instantDisappear = true;

const lightning1 = function(tile, vec){
	if(tile == null){return;}
	entity = tile.ent();
	if(entity == null){return;}
	block = tile.block();
	dst = block.size * 4;
	Sounds.laser.at(tile.drawx() + vec.x, tile.drawy() + vec.y, Mathf.random(0.7, 0.9));
	Angles.randLenVectors(entity.id, 6, 48, entity.rotation, 30, new Floatc2(){get: (x, y) => {
		Lightning.create(tile.getTeam(), Pal.surge, 12, tile.drawx() + vec.x + x, tile.drawy() + vec.y + y, entity.rotation, 18);
		Sounds.spark.at(tile.drawx() + vec.x + x, tile.drawy() + vec.y + y, Mathf.random(0.7, 0.9));
	}});
}

const lightning2 = function(tile, vec){
	if(tile == null){return;}
	entity = tile.ent();
	if(entity == null){return;}
	block = tile.block();
	dst = block.size * 4;
	Sounds.laser.at(tile.drawx() + vec.x, tile.drawy() + vec.y, Mathf.random(0.5, 0.8));
	Angles.randLenVectors(entity.id, 12, 64, entity.rotation, 30, new Floatc2(){get: (x, y) => {
		Lightning.create(tile.getTeam(), Pal.surge, 17, tile.drawx() + vec.x + x, tile.drawy() + vec.y + y, entity.rotation, 36);
		Sounds.spark.at(tile.drawx() + vec.x + x, tile.drawy() + vec.y + y, Mathf.random(0.5, 0.8));
	}});
}

const explosion = function(tile, vec){
	if(tile == null){return;}
	entity = tile.ent();
	if(entity == null){return;}
	block = tile.block();
	dst = block.size * 4;
	Angles.randLenVectors(entity.id, 10, 96, entity.rotation, 30, new Floatc2(){get: (x, y) => {
		Bullet.create(tmpExplosion, entity, tile.getTeam(), tile.drawx() + vec.x + x, tile.drawy() + vec.y + y, entity.rotation, 1, 1);
		Sounds.explosion.at(tile.drawx() + vec.x + x, tile.drawy() + vec.y + y, Mathf.random(0.8, 1.2));
	}});
}

const sandSmoke = function(tile, vec){
	if(tile == null){return;}
	entity = tile.ent();
	if(entity == null){return;}
	block = tile.block();
	dst = block.size * 4;
	Effects.effect(marsSandSmoke, tile.drawx() + vec.x, tile.drawy() + vec.y, entity.rotation);
}

const fire1 = function(tile, vec){
	if(tile == null){return;}
	entity = tile.ent();
	if(entity == null){return;}
	block = tile.block();
	dst = block.size * 4;
	x = tile.drawx() + vec.x;
	y = tile.drawy() + vec.y;
	Angles.randLenVectors(entity.id, 12, 160, entity.rotation, 24, new Floatc2(){get: (a, b) => {
		angle = Angles.angle(x, y, x + a, y + b);
		velocityScl = Mathf.dst(x, y, x + a, y + b) / 80;
		Bullet.create(Bullets.fireball, entity, tile.getTeam(), x, y, angle, velocityScl, 1);
	}});
	Sounds.flame.at(x, y, Mathf.random(0.8, 1.2));
}

const fire2 = function(tile, vec){
	if(tile == null){return;}
	entity = tile.ent();
	if(entity == null){return;}
	block = tile.block();
	dst = block.size * 4;
	x = tile.drawx() + vec.x;
	y = tile.drawy() + vec.y;
	Angles.randLenVectors(entity.id, 18, 240, entity.rotation, 30, new Floatc2(){get: (a, b) => {
		angle = Angles.angle(x, y, x + a, y + b);
		velocityScl = Mathf.dst(x, y, x + a, y + b) / 120;
		Bullet.create(Bullets.fireball, entity, tile.getTeam(), x, y, angle, velocityScl, 1);
	}});
	Sounds.flame.at(x, y, Mathf.random(0.5, 0.8));
}

const mars = extendContent(ItemTurret, "mars", {
	init(){
		this.ammo(
			Items.sand, marsSand,
			Items.copper, marsCopper,
			Items.silicon, marsSilicon,
			Items.graphite, marsGraphite,
			Items.titanium, marsTitanium,
			Items.coal, marsCoal,
			Items.pyratite, marsPyra,
			Items.blastCompound, marsBlast,
			Items.surgealloy, marsSurge
		);
		this.shootAtt = OrderedMap.of([
			marsSand, sandSmoke,
			marsCopper, lightning1,
			marsSilicon, lightning1,
			marsGraphite, lightning1,
			marsTitanium, lightning1,
			marsCoal, fire1,
			marsPyra, fire2,
			marsBlast, explosion,
			marsSurge, lightning2
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
			Draw.color(this.lineColors[i].r, this.lineColors[i].g, this.lineColors[i].b, (entity.getLength() / this.lineLength) * this.lineColors[i].a);
			Draw.blend(Blending.additive);
			Lines.stroke(this.lineWidths[i]);
			Lines.precise(true);
			Lines.lineAngle(tile.drawx() + Tmp.v1.x, tile.drawy() + Tmp.v1.y, entity.rotation, entity.getLength());
			Lines.precise(false);
			Draw.blend();
			Draw.reset();
		}
		for(var i = 0; i < this.circleScales.length; i++){
			Tmp.v1.trns(entity.rotation, this.circleOffset - entity.recoil);
			Draw.color(this.circleColors[i].r, this.circleColors[i].g, this.circleColors[i].b, (entity.getRadius() / this.circleRadius) * this.circleColors[i].a);
			Draw.blend(Blending.additive);
			elib.fillCircleWCol(tile.drawx() + Tmp.v1.x, tile.drawy() + Tmp.v1.y, entity.getRadius() * this.circleScales[i]);
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
				Core.app.post(run(() => {
					if(tile == null || entity == null){return;}
					prox.eachLinkedBlock(tile, boolf(t => {
						e = t.ent();
						return t.block() == this.amplifier && e.isWorking();
					}), cons(t => t.ent().setWorking(false)));
				}));
			}
			if(entity.isCharging()){
				entity.setLength(
					Mathf.clamp(
						entity.getLength() + ((this.lineLength / this.chargeTime) * entity.power.status * (
							prox.getLinkedBlock(tile, this.amplifier, boolf(tile => {
								return tile.block() == this.amplifier && tile.ent().isWorking();
							}))
						/ 3)) * entity.timeScale, 0, this.lineLength
					)
				);
				entity.setRadius(
					Mathf.clamp(
						entity.getRadius() + ((this.circleRadius / this.chargeTime) * entity.power.status * (
							prox.getLinkedBlock(tile, this.amplifier, boolf(tile => {
								return tile.block() == this.amplifier && tile.ent().isWorking();
							}))
						/ 3)) * entity.timeScale, 0, this.circleRadius
					)
				);
			}else{
				entity.setLength(Mathf.lerpDelta(entity.getLength(), 0, this.cooldown));
				entity.setRadius(Mathf.lerpDelta(entity.getRadius(), 0, this.cooldown));
			}
		}else{
			entity.setLength(Mathf.lerpDelta(entity.getLength(), 0, this.cooldown));
			entity.setRadius(Mathf.lerpDelta(entity.getRadius(), 0, this.cooldown));
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
				(
					entity.getLength() >= this.lineLength ||
					entity.getRadius() >= this.circleRadius
				)
			){
				type = this.peekAmmo(tile);
				this.shoot(tile, type);
				entity.reload = 0;
				entity.setLength(0);
				entity.setRadius(0);
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
		this.shootAtt.get(type)(tile, this.tr);
		this.effects(tile);
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
mars.circleOffset = -8.75;
mars.circleRadius = 16;
mars.circleColors = [
	Color.valueOf("bc4500cd"),
	Color.valueOf("bc450064"),
	Color.valueOf("bc450016")
];
mars.circleScales = [0.3, 0.6, 1];
mars.lineOffset = 2.25;
mars.lineLength = 22;
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
		},
		setRadius(val){
			this._radius = val;
		},
		getRadius(){
			return this._radius;
		}
	});
	entity.setCharging(false);
	entity.setLength(0);
	entity.setRadius(0);
	return entity;
});
