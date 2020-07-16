const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
const matlib = require("mechanical-warfare/mathlib");

const laserLen = 240;
const supernovaLaser = extend(BasicBulletType, {
	load(){},
	update(b){
		if(b.timer.get(1, 5)){
			Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.length, true);
		}
		Effects.shake(1.5, 1, b.x, b.y);
		for(var i = 0; i < 2; i++){
			var f = Mathf.random(this.length * b.fout());
			Effects.effect(this.flameEffect,
				b.x + Angles.trnsx(b.rot(), f) + Mathf.range(6),
				b.y + Angles.trnsy(b.rot(), f) + Mathf.range(6),
				b.rot() + Mathf.range(85)
			);
		}
	},
	hit(b, x, y){
		Effects.effect(this.hitEffect, this.colors[2], b.x, b.y);
		if(Mathf.chance(0.4)){
			Fire.create(Vars.world.tileWorld(b.x + Mathf.range(5), b.y + Mathf.range(5)));
		}
	},
	draw(b){
		var baseLen = this.length * b.fout();
		var phase = 1 + Mathf.absin(1, 0.1);
		Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
		for(var s = 0; s < 4; s++){
			Draw.color(this.tmpColor.set(this.colors[s]).mul(phase));
			Draw.alpha(1);
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.rot() + 180, (this.lenscales[i] - 1) * 35);
				Lines.stroke((9 + Mathf.absin(0.8, 1.5)) * b.fout() * this.strokes[s] * this.tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(), baseLen * this.lenscales[i], CapStyle.none);
			}
		}
		Draw.reset();
	},
});
supernovaLaser.flameEffect = newEffect(36, e => {
	Draw.color(Color.white, plib.backColorCyan, e.fin());
	elib.fillCircleWCol(
		e.x + Angles.trnsx(e.rotation, e.fin() * 24),
		e.y + Angles.trnsy(e.rotation, e.fin() * 24),
		e.fout() * 5
	);
	Draw.color();
});
supernovaLaser.lifetime = 16;
supernovaLaser.speed = 0.001;
supernovaLaser.damage = 160;
supernovaLaser._lightningDamage = 12;
supernovaLaser.tmpColor = new Color();
supernovaLaser.colors = [
	Color.valueOf("4be3ca55"),
	Color.valueOf("91eedeaa"),
	plib.frontColorCyan,
	Color.white
];
supernovaLaser.tscales = [1, 0.7, 0.5, 0.2];
supernovaLaser.strokes = [2, 1.5, 1, 0.3];
supernovaLaser.lenscales = [1, 1.12, 1.15, 1.17];
supernovaLaser.length = laserLen;
supernovaLaser.pierce = true;
supernovaLaser.despawnEffect = Fx.none;

const supernovaStar = newEffect(45, e => {
	var a = Mathf.randomSeed(e.id, 360);
	var d = 0.5 + e.fout() * 0.5;
	const r = e.data;
	elib.fillCircle(e.x + Angles.trnsx(a, d), e.y + Angles.trnsy(a, d), plib.frontColorCyan, 0.6 * e.fout(), r);
});
const supernovaStarHeatwave = newEffect(40, e => {
	elib.outlineCircle(e.x, e.y, plib.frontColorCyan, e.fout() * 3, 120 * e.fin());
});
const supernovaCharge = newEffect(20, e => {
	const r = e.data;
	elib.fillCircle(e.x, e.y, plib.frontColorCyan, 0.6 * e.fout(), Mathf.lerp(0.2, 1, e.fout()) * r);
});
const supernovaChargeBegin = newEffect(27, e => {
	/*Draw.color(plib.frontColorCyan);
	Angles.randLenVectors(e.id, Mathf.round(2 * e.data), 1 + 27 * e.fout(), new Floatc2(){get: (x, y) => {
		Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), (1 + e.fslope() * 6) * e.data);
	}});
	Draw.color();*/
	elib.splashLines(e.x, e.y, plib.frontColorCyan, 1, 1 + 27 * e.fout(), (1 + e.fslope() * 6) * e.data, Mathf.round(2 * e.data), e.id);
});
const supernovaChargeStar = newEffect(30, e => {
	elib.outlineCircle(e.x, e.y, plib.frontColorCyan, e.fin() * 2 * e.data, 150 * e.fout() * Mathf.lerp(0.1, 1, e.data));
});
const supernovaChargeStar2 = newEffect(27, e => {
	const r = e.data;
	elib.splashCircles(e.x, e.y, plib.frontColorCyan, 1, 2 * e.fin(), e.fout() * ((90 + r * 150) * (0.3 + Mathf.randomSeed(e.id, 0.7))), Mathf.round(3 * r), e.id);
});

const supernova = extendContent(ChargeTurret, "supernova", {
	load(){
		this.super$load();
		this.baseRegion = Core.atlas.find("mechanical-warfare-block-6");
		this.coreTopRegion = Core.atlas.find(this.name + "-core-top");
		this.barrelRegion = Core.atlas.find(this.name + "-barrel");
		this.panelMidLeftRegion = Core.atlas.find(this.name + "-panel-mid-left");
		this.panelMidRightRegion = Core.atlas.find(this.name + "-panel-mid-right");
		this.panelMidBottomRegion = Core.atlas.find(this.name + "-panel-mid-bottom");
		this.panelBottomLeftRegion = Core.atlas.find(this.name + "-panel-bottom-left");
		this.panelBottomRightRegion = Core.atlas.find(this.name + "-panel-bottom-right");
		this.panelOutLeftRegion = Core.atlas.find(this.name + "-panel-out-left");
		this.panelOutRightRegion = Core.atlas.find(this.name + "-panel-out-right");
		this.coreBottomRegion = Core.atlas.find(this.name + "-core-bottom");
		this.coreTopOutlineRegion = Core.atlas.find(this.name + "-core-top-outline");
		this.barrelOutlineRegion = Core.atlas.find(this.name + "-barrel-outline");
		this.panelMidLeftOutlineRegion = Core.atlas.find(this.name + "-panel-mid-left-outline");
		this.panelMidRightOutlineRegion = Core.atlas.find(this.name + "-panel-mid-right-outline");
		this.panelMidBottomOutlineRegion = Core.atlas.find(this.name + "-panel-mid-bottom-outline");
		this.panelBottomLeftOutlineRegion = Core.atlas.find(this.name + "-panel-bottom-left-outline");
		this.panelBottomRightOutlineRegion = Core.atlas.find(this.name + "-panel-bottom-right-outline");
		this.panelOutLeftOutlineRegion = Core.atlas.find(this.name + "-panel-out-left-outline");
		this.panelOutRightOutlineRegion = Core.atlas.find(this.name + "-panel-out-right-outline");
		this.coreBottomOutlineRegion = Core.atlas.find(this.name + "-core-bottom-outline");
		this.heatLeftRegion = Core.atlas.find(this.name + "-heat-left");
		this.heatRightRegion = Core.atlas.find(this.name + "-heat-right");
		this.heatCoreRegion = Core.atlas.find(this.name + "-heat-core");
		this.heatBarrelRegion = Core.atlas.find(this.name + "-heat-barrel");
	},
	generateIcons(){
		return [Core.atlas.find("mechanical-warfare-block-6"), Core.atlas.find(this.name + "-icon")];
	},
	draw(tile){
		Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
		Draw.color();
	},
	drawLayer(tile){
		var entity = tile.ent();
		this.tr2.trns(entity.rotation - 90, 0, -entity.recoil);
		this.outlineDrawer.get(tile, entity);
		this.drawer.get(tile, entity);
		this.heatDrawer.get(tile, entity);
	},
	drawLayer2(tile){
		var entity = tile.ent();
		elib.fillCircle(
			tile.drawx() - Angles.trnsx(entity.rotation, this.starOffset + entity.recoil),
			tile.drawy() - Angles.trnsy(entity.rotation, this.starOffset + entity.recoil),
			plib.frontColorCyan, 1, entity.getSmoothCharge() * this.starRadius
		);
		if(entity.getBulletLife() <= 0 || entity.getBullet() == null){
			elib.fillCircle(
				tile.drawx() + Angles.trnsx(entity.rotation, this.size * this.turretLength - entity.recoil),
				tile.drawy() + Angles.trnsy(entity.rotation, this.size * this.turretLength - entity.recoil),
				plib.frontColorCyan, 1, entity.getSmoothCharge() * this.starRadius * 0.67
			);
		}
		if(!Vars.state.isPaused()){
			var a = Mathf.random(360);
			var d = 0.3;
			Effects.effect(supernovaStar,
				tile.drawx() - Angles.trnsx(entity.rotation, this.starOffset + entity.recoil) + Angles.trnsx(a, d),
				tile.drawy() - Angles.trnsy(entity.rotation, this.starOffset + entity.recoil) + Angles.trnsy(a, d),
				entity.rotation, entity.getSmoothCharge() * this.starRadius
			);
			Effects.effect(supernovaCharge,
				tile.drawx() + Angles.trnsx(entity.rotation, this.size * this.turretLength - entity.recoil),
				tile.drawy() + Angles.trnsy(entity.rotation, this.size * this.turretLength - entity.recoil),
				entity.rotation, entity.getSmoothCharge() * this.starRadius * 0.67
			);
			if(entity.getBullet() == null && entity.getBulletLife() <= 0){
				if(entity.getCharge() > 0.1 && entity.timer.get(this.timerChargeStar, 20)){
					Effects.effect(supernovaChargeStar,
						tile.drawx() - Angles.trnsx(entity.rotation, this.starOffset + entity.recoil),
						tile.drawy() - Angles.trnsy(entity.rotation, this.starOffset + entity.recoil),
						entity.rotation, entity.getSmoothCharge()
					);
				}
				if(Mathf.chance(entity.getCharge())){
					Effects.effect(supernovaChargeBegin,
						tile.drawx() + Angles.trnsx(entity.rotation, this.size * this.turretLength - entity.recoil),
						tile.drawy() + Angles.trnsy(entity.rotation, this.size * this.turretLength - entity.recoil),
						entity.rotation, entity.getSmoothCharge()
					);
					Effects.effect(supernovaChargeStar2,
						tile.drawx() - Angles.trnsx(entity.rotation, this.starOffset + entity.recoil),
						tile.drawy() - Angles.trnsy(entity.rotation, this.starOffset + entity.recoil),
						entity.rotation, entity.getSmoothCharge()
					);
				}
			}else{
				if(entity.timer.get(this.timerChargeStar, 20)){
					Effects.effect(supernovaStarHeatwave,
						tile.drawx() - Angles.trnsx(entity.rotation, this.starOffset + entity.recoil),
						tile.drawy() - Angles.trnsy(entity.rotation, this.starOffset + entity.recoil),
						entity.rotation
					);
				}
			}
		}
	},
	drawLight(tile){
		this.super$drawLight(tile);
		var entity = tile.ent();
		Vars.renderer.lights.add(tile.drawx(), tile.drawy(), entity.getSmoothCharge() * 120, plib.frontColorCyan, entity.getSmoothCharge());
	},
	setStats(){
		this.super$setStats();
		this.stats.remove(BlockStat.booster);
		this.stats.add(BlockStat.input, new BoosterListValue(this.reload, (this.consumes.get(ConsumeType.liquid)).amount, this.coolantMultiplier, false, boolf(l => this.consumes.liquidfilters.get(l.id))));
		this.stats.remove(BlockStat.damage);
		this.stats.add(BlockStat.damage, this.shootType.damage * 60 / 5, StatUnit.perSecond);
	},
	onDestroyed(tile){
		var entity = tile.ent();
		entity.liquids.each(new LiquidModule.LiquidConsumer(){accept: (liquid, amount) => {
			var splash = Mathf.clamp(amount / 4, 0, 10);
			for(var i = 0; i < Mathf.clamp(amount / 5, 0, 30); i++){
				Time.run(i / 2, run(() => {
					var other = Vars.world.tile(tile.x + Mathf.range(this.size / 2), tile.y + Mathf.range(this.size / 2));
					if(other != null){
						Puddle.deposit(other, liquid, splash);
					}
				}));
			}
		}});
		Damage.dynamicExplosion(tile.worldx(), tile.worldy(), 20, this.baseExplosiveness + entity.getCharge() * 30, 0, (8 * (this.size + entity.getCharge() * 4)) / 2, plib.midColorCyan);
		for(var i = 0; i < 40; i++){
			if(Mathf.chance(entity.getCharge())){
				Lightning.create(tile.getTeam(), plib.frontColorCyan, 16,
					tile.drawx() - Angles.trnsx(entity.rotation, this.starOffset + entity.recoil),
					tile.drawy() - Angles.trnsy(entity.rotation, this.starOffset + entity.recoil),
					Mathf.random(360), Mathf.round(Mathf.randomTriangular(32, 48) * entity.getCharge())
				);
			}
		}
		if(!tile.floor().solid && !tile.floor().isLiquid){
			RubbleDecal.create(tile.drawx(), tile.drawy(), this.size);
		}
	},
	update(tile){
		var entity = tile.ent();
		if(!this.validateTarget(tile)){
			entity.target = null;
		}
		if(!this.validateTarget(tile) || !entity.cons.valid()){
			entity.setCharge(Mathf.lerpDelta(entity.getCharge(), 0, this._chargeCooldown));
		}
		entity.recoil = Mathf.lerpDelta(entity.recoil, 0, this.restitution);
		entity.heat = Mathf.lerpDelta(entity.heat, 0, this.cooldown);
		if(this.hasAmmo(tile)){
			this.updateCharge(tile);
			if(entity.timer.get(this.timerTarget, this.targetInterval)){
				this.findTarget(tile);
			}
			if(this.validateTarget(tile)){
				var targetRot = entity.angleTo(entity.target);
				if(typeof(entity.rotation) === "undefined" || entity.rotation == null){
					entity.rotation = 0;
				}
				if(this.shouldTurn(tile)){
					this.turnToTarget(tile, targetRot);
				}
				if(Angles.angleDist(entity.rotation, targetRot) < this.shootCone){
					this.updateShooting(tile);
				}
			}
		}
		if(entity.getBulletLife() > 0 && entity.getBullet() != null){
			this.tr.trns(entity.rotation, this.size * this.turretLength, 0);
			entity.getBullet().rot(entity.rotation);
			entity.getBullet().set(tile.drawx() + this.tr.x, tile.drawy() + this.tr.y);
			entity.getBullet().time(0);
			entity.heat = 1;
			entity.recoil = this.recoil;
			Lightning.create(tile.getTeam(), plib.frontColorCyan, 18,
				tile.drawx() - Angles.trnsx(entity.rotation, this.starOffset + entity.recoil),
				tile.drawy() - Angles.trnsy(entity.rotation, this.starOffset + entity.recoil),
				Mathf.random(360), Mathf.round(Mathf.randomTriangular(7, 17))
			);
			if(Mathf.chance(0.75)){
				Lightning.create(tile.getTeam(), plib.frontColorCyan, 16,
					tile.drawx() + this.tr.x, tile.drawy() + this.tr.y,
					entity.rotation, Mathf.round(Mathf.randomTriangular(27, 42))
				);
			}
			if(Mathf.chance(0.33)){
				var start = Mathf.random(laserLen);
				Lightning.create(tile.getTeam(), plib.frontColorCyan, 12,
					tile.drawx() + this.tr.x + Angles.trnsx(entity.rotation, start),
					tile.drawy() + this.tr.y + Angles.trnsy(entity.rotation, start),
					entity.rotation + Mathf.range(15), Mathf.round(Mathf.randomTriangular(10, 19))
				);
			}
			entity.setBulletLife(entity.getBulletLife() - Time.delta());
			if(entity.getBulletLife() <= 0){
				entity.setBullet(null);
			}
		}else{
			this.attractUnits(tile);
			if(Mathf.chance(entity.getCharge() * entity.getCharge() * 0.75)){
				Lightning.create(tile.getTeam(), plib.frontColorCyan, 8,
					tile.drawx() - Angles.trnsx(entity.rotation, this.starOffset + entity.recoil),
					tile.drawy() - Angles.trnsy(entity.rotation, this.starOffset + entity.recoil),
					Mathf.random(360), Mathf.round(Mathf.randomTriangular(4, 12))
				);
			}
			if(entity.getCharge() > 0.1){
				Effects.shake(0.33 * entity.getCharge(), entity.getCharge(), tile.drawx(), tile.drawy());
			}
		}
		entity.updateSmoothCharge();
		entity.updateSpriteCharge(entity.cons.valid() && this.hasEnemyInProximity(tile) || (entity.getBulletLife() > 0 && entity.getBullet() != null));
		entity.updateLoop(entity.getCharge(), entity.getCharge());
	},
	hasEnemyInProximity(tile){
		var entity = tile.ent();
		return Units.closestTarget(entity.getTeam(), tile.drawx(), tile.drawy(), this.range, boolf(unit => !unit.isDead())) != null;
	},
	attractUnits(tile){
		var entity = tile.ent();
		Units.nearby(tile.drawx() - this.range * 2, tile.drawy() - this.range * 2, this.range * 4, this.range * 4, cons(unit => {
			if(!unit.isDead() && unit.withinDst(tile.drawx(), tile.drawy(), this.range * 2)){
				Tmp.v1.set(tile.drawx() - unit.x, tile.drawy() - unit.y).rotate(10 * (1 - entity.getCharge())).setLength(this.attractionStrength * entity.getCharge() * Time.delta()).scl(unit.dst(tile) / this.range / 2);
				unit.velocity().add(Tmp.v1);
			}
		}));
	},
	updateCharge(tile){
		var entity = tile.ent();
		if(entity.getBulletLife() > 0 && entity.getBullet() != null || !this.hasEnemyInProximity(tile)){return;}
		var liquid = entity.liquids.current();
		var maxUsed = this.consumes.get(ConsumeType.liquid).amount;
		var used = this.baseReloadSpeed(tile) * (tile.isEnemyCheat() ? maxUsed : Math.min(entity.liquids.get(liquid), maxUsed * Time.delta())) * liquid.heatCapacity * this.coolantMultiplier;
		entity.setCharge(entity.getCharge() + this._chargeWarmup * (1 + used));
		entity.liquids.remove(liquid, used);
		if(Mathf.chance(0.06 * used)){
			Effects.effect(this.coolEffect, tile.drawx() + Mathf.range(this.size * 8 / 2), tile.drawy() + Mathf.range(this.size * 8 / 2));
		}
	},
	updateShooting(tile){
		var entity = tile.ent();
		if(entity.getBulletLife() > 0 && entity.getBullet() != null){
			return;
		}
		if(entity.getCharge() >= 1 && (entity.cons.valid() || tile.isEnemyCheat())){
			var type = this.peekAmmo(tile);
			this.shoot(tile, type);
			entity.setCharge(0.0);
		}
	},
	turnToTarget(tile, targetRot){
		var entity = tile.ent();
		entity.rotation = Angles.moveToward(entity.rotation, targetRot, this.rotatespeed * entity.delta() * (entity.getBulletLife() > 0) ? this.firingMoveFract : 1);
	},
	bullet(tile, type, angle){
		var entity = tile.ent();
		entity.setBullet(Bullet.create(type, tile.entity, tile.getTeam(), tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, angle));
		entity.setBulletLife(this.shootDuration);
	},
	hasAmmo(tile){
		return tile.entity.cons.valid();
	},
	shouldIdleSound(tile){
		//return this.hasAmmo(tile) && !this.shouldActiveSound(tile);
		return false;
	},
	shouldActiveSound(tile){
		var entity = tile.ent();
		return tile != null && entity != null && entity.getBulletLife() > 0 && entity.getBullet() != null;
	}
});
supernova.drawer = new Cons2(){get: (tile, entity) => {
	Draw.rect(supernova.coreBottomRegion, tile.drawx() + supernova.tr2.x, tile.drawy() + supernova.tr2.y, entity.rotation - 90);
	Draw.rect(supernova.panelOutLeftRegion,
		tile.drawx() + entity.getSpriteShake(0, 0.25) + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, -17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		tile.drawy() + entity.getSpriteShake(1, 0.25) + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, -17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelOutRightRegion,
		tile.drawx() + entity.getSpriteShake(2, 0.25) + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		tile.drawy() + entity.getSpriteShake(3, 0.25) + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelBottomLeftRegion,
		tile.drawx() + entity.getSpriteShake(4, 0.25) + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		tile.drawy() + entity.getSpriteShake(5, 0.25) + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelBottomRightRegion,
		tile.drawx() + entity.getSpriteShake(6, 0.25) + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		tile.drawy() + entity.getSpriteShake(7, 0.25) + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelMidBottomRegion,
		tile.drawx() + entity.getSpriteShake(8, 0.125) + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 0, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		tile.drawy() + entity.getSpriteShake(9, 0.125) + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 0, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelMidLeftRegion,
		tile.drawx() + entity.getSpriteShake(10, 0.125) + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		tile.drawy() + entity.getSpriteShake(11, 0.125) + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelMidRightRegion,
		tile.drawx() + entity.getSpriteShake(12, 0.125) + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		tile.drawy() + entity.getSpriteShake(13, 0.125) + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.barrelRegion,
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 0, 4 / 4 * entity.getSpriteCharge()),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 0, 4 / 4 * entity.getSpriteCharge()),
		entity.rotation - 90
	);
	Draw.rect(supernova.coreTopRegion, tile.drawx() + supernova.tr2.x, tile.drawy() + supernova.tr2.y, entity.rotation - 90);
}}
supernova.outlineDrawer = new Cons2(){get: (tile, entity) => {
	Draw.rect(supernova.coreBottomOutlineRegion, tile.drawx() + supernova.tr2.x, tile.drawy() + supernova.tr2.y, entity.rotation - 90);
	Draw.rect(supernova.panelOutLeftOutlineRegion,
		tile.drawx() + entity.getSpriteShake(0, 0.25) + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, -17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		tile.drawy() + entity.getSpriteShake(1, 0.25) + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, -17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelOutRightOutlineRegion,
		tile.drawx() + entity.getSpriteShake(2, 0.25) + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		tile.drawy() + entity.getSpriteShake(3, 0.25) + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelBottomLeftOutlineRegion,
		tile.drawx() + entity.getSpriteShake(4, 0.25) + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		tile.drawy() + entity.getSpriteShake(5, 0.25) + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelBottomRightOutlineRegion,
		tile.drawx() + entity.getSpriteShake(6, 0.25) + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		tile.drawy() + entity.getSpriteShake(7, 0.25) + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelMidBottomOutlineRegion,
		tile.drawx() + entity.getSpriteShake(8, 0.125) + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 0, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		tile.drawy() + entity.getSpriteShake(9, 0.125) + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 0, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelMidLeftOutlineRegion,
		tile.drawx() + entity.getSpriteShake(10, 0.125) + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		tile.drawy() + entity.getSpriteShake(11, 0.125) + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelMidRightOutlineRegion,
		tile.drawx() + entity.getSpriteShake(12, 0.125) + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		tile.drawy() + entity.getSpriteShake(13, 0.125) + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.barrelOutlineRegion,
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 0, 4 / 4 * entity.getSpriteCharge()),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 0, 4 / 4 * entity.getSpriteCharge()),
		entity.rotation - 90
	);
	Draw.rect(supernova.coreTopOutlineRegion, tile.drawx() + supernova.tr2.x, tile.drawy() + supernova.tr2.y, entity.rotation - 90);
}}
supernova.heatDrawer = new Cons2(){get: (tile, entity) => {
	Draw.blend(Blending.additive);
	Draw.color(Color.black, Color.white, entity.getSmoothCharge() * (0.45 + Mathf.absin(1.5, 0.1)));
	Draw.rect(supernova.heatCoreRegion, tile.drawx() + supernova.tr2.x, tile.drawy() + supernova.tr2.y, entity.rotation - 90);
	if(entity.heat > 0.00001){
		Draw.color(Color.black, Color.white, entity.heat * (0.4 + Mathf.absin(1.5, 0.1)));
		Draw.rect(supernova.heatBarrelRegion,
			tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 0, 4 / 4 * entity.getSpriteCharge()),
			tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 0, 4 / 4 * entity.getSpriteCharge()),
			entity.rotation - 90
		);
		Draw.rect(supernova.heatLeftRegion,
			tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
			tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
			entity.rotation - 90
		);
		Draw.rect(supernova.heatRightRegion,
			tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
			tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
			entity.rotation - 90
		);
	}
	Draw.blend();
	Draw.color();
}}
supernova.attractionStrength = 0.85;
supernova.baseExplosiveness = 25;
supernova.timerChargeStar = supernova.timers++;
supernova.turretLength = 7 / 2;
supernova.outlineIcon = false;
supernova.starRadius = 8;
supernova.starOffset = 8 / 4;
supernova.shootType = supernovaLaser;
supernova.firingMoveFract = 0.2;
supernova.shootDuration = 480;
supernova._chargeWarmup = 0.002;
supernova._chargeCooldown = 0.01;
supernova.canOverdrive = false;
supernova.coolantMultiplier = 1;
supernova.entityType = prov(() => {
	const entity = extendContent(ChargeTurret.LaserTurretEntity, supernova, {
		getCharge(){
			if(typeof(this._charge) === "undefined"){this.setCharge(0.0);}
			return this._charge;
		},
		setCharge(val){
			this._charge = Mathf.clamp(val, 0, 1);
		},
		getSmoothCharge(){
			if(typeof(this._scharge) === "undefined"){this._scharge = this.getCharge();}
			return this._scharge;
		},
		updateSmoothCharge(){
			this._scharge = Mathf.lerpDelta(this.getSmoothCharge(), this.getBullet() == null ? this.getCharge() : 1, supernova._chargeCooldown * 5);
			if(this._scharge <= 0.0001){this._scharge = 0;}
		},
		getSpriteCharge(){
			if(typeof(this._pcharge) === "undefined"){this._pcharge = 0;}
			return this._pcharge;
		},
		getSpriteShake(id, scl){
			return (this._bulletLife > 0 && this._bullet != null) ? Angles.trnsx(Mathf.randomSeed(this.id + id + Mathf.round(Time.time()), 360), scl) : 0;
		},
		updateSpriteCharge(up){
			this._pcharge = this.getSpriteCharge() + (up ? 0.008 : -0.008);
			if(this._pcharge <= 0.0001){this._pcharge = 0;}
			if(this._pcharge >= 0.9999){this._pcharge = 1;}
		},
		getBullet(){
			if(typeof(this._bullet) === "undefined"){this.setBullet(null);}
			return this._bullet;
		},
		setBullet(val){
			this._bullet = val;
		},
		getBulletLife(){
			if(typeof(this._bulletLife) === "undefined"){this.setBulletLife(0.0);}
			return this._bulletLife;
		},
		init(tile, shouldAdd){
			this.super$init(tile, shouldAdd);
			this._loop = {
				_sound: supernova.idleSound,
				_baseVolume: supernova.idleSoundVolume,
				_id: -1,
				_update: function(x, y, vol, pitch){
					if(this._baseVolume < 0){return;}
					if(this._id < 0){
						this._id = this._sound.loop(this._sound.calcVolume(x, y) * this._baseVolume * vol, 0.5 + 1.5 * pitch, this._sound.calcPan(x, y));
					}else{
						if(vol <= 0.01){
							this._sound.stop(this._id);
							this._id = -1;
							return;
						}
						this._sound.setPan(this._id, this._sound.calcPan(x, y), this._sound.calcVolume(x, y) * this._baseVolume * vol);
						this._sound.setPitch(this._id, 0.5 + 1.5 * pitch);
					}
				},
				_stop: function(){
					if(this._id != -1){
						this._sound.stop(this._id);
						this._id = -1;
						this._baseVolume = -1.0;
					}
				}
			};
			return this;
		},
		updateLoop(vol, pitch){
			if(this._loop != null){
				this._loop._update(this.x, this.y, vol, pitch);
			}
		},
		removed(){
			this.super$removed();
			if(this._loop != null){
				this._loop._stop();
			}
		},
		setBulletLife(val){
			this._bulletLife = val;
		},
	});
	entity.setCharge(0.0);
	entity.setBullet(null);
	entity.setBulletLife(0.0);
	return entity;
});
supernova.consumes.add(new ConsumeLiquidFilter(boolf(liquid => liquid.temperature <= 0.5 && liquid.flammability < 0.1), 0.75)).update(false);
