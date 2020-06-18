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
				b.rot() + Mathf.range(30)
			);
		}
	},
	hit(b, x, y){
		Effects.effect(this.hitEffect, this.colors[2], x, y);
		if(Mathf.chance(0.4)){
			Fire.create(Vars.world.tileWorld(x + Mathf.range(5), y + Mathf.range(5)));
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
		elib.fillCircle(
			tile.drawx() + this.tr.x,
			tile.drawy() + this.tr.y,
			plib.frontColorCyan, 1, entity.getSmoothCharge() * this.starRadius * 0.67
		);
		if(!Vars.state.isPaused()){
			var a = Mathf.random(360);
			var d = 0.3;
			Effects.effect(supernovaStar,
				tile.drawx() - Angles.trnsx(entity.rotation, this.starOffset + entity.recoil) + Angles.trnsx(a, d),
				tile.drawy() - Angles.trnsy(entity.rotation, this.starOffset + entity.recoil) + Angles.trnsy(a, d),
				entity.rotation, entity.getSmoothCharge() * this.starRadius
			);
		}
	},
	setStats(){
		this.super$setStats();
		this.stats.remove(BlockStat.booster);
		this.stats.add(BlockStat.input, new BoosterListValue(this.reload, (this.consumes.get(ConsumeType.liquid)).amount, this.coolantMultiplier, false, boolf(l => this.consumes.liquidfilters.get(l.id))));
		this.stats.remove(BlockStat.damage);
		this.stats.add(BlockStat.damage, this.shootType.damage * 60 / 5, StatUnit.perSecond);
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
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, -17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, -17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelOutRightRegion,
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelBottomLeftRegion,
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelBottomRightRegion,
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelMidBottomRegion,
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 0, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 0, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelMidLeftRegion,
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelMidRightRegion,
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
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
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, -17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, -17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelOutRightOutlineRegion,
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsx(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 17 / 4 * matlib.lerpThreshold(0.2, 0, 0.8, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, -6 / 4 * matlib.lerpThreshold(0, 0, 0.2, 1, entity.getSpriteCharge())) + Angles.trnsy(entity.rotation - 90, 0, 6 / 4 * matlib.lerpThreshold(0.4, 0, 0.8, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelBottomLeftOutlineRegion,
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelBottomRightOutlineRegion,
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.2, 0, 0.7, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelMidBottomOutlineRegion,
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 0, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 0, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelMidLeftOutlineRegion,
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, -4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		entity.rotation - 90
	);
	Draw.rect(supernova.panelMidRightOutlineRegion,
		tile.drawx() + supernova.tr2.x + Angles.trnsx(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
		tile.drawy() + supernova.tr2.y + Angles.trnsy(entity.rotation - 90, 4 / 4 * matlib.lerpThreshold(0.4, 0, 0.9, 1, entity.getSpriteCharge())),
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
supernova.turretLength = 7 / 2;
supernova.outlineIcon = false;
supernova.starRadius = 8;
supernova.starOffset = 8 / 4;
supernova.shootType = supernovaLaser;
supernova.firingMoveFract = 0.167;
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
		getScaledSpriteCharge(scl){
			return Mathf.clamp(this.getSpriteCharge() * scl, 0, 1);
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
