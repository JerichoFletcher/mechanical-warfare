const coreSword = extendContent(CoreBlock, "core-sword", {
	init(){
		this.ammo = OrderedMap.of([
			Items.copper, Bullets.standardCopper,
            Items.graphite, Bullets.standardDense,
            Items.silicon, Bullets.standardHoming,
            Items.thorium, Bullets.standardThorium
		]);
		this.super$init();
	},
	load(){
		this.super$load();
		this.region = Core.atlas.find(this.name);
		this.turretRegion = Core.atlas.find(this.name + "-mount");
		this.heatRegion = Core.atlas.find(this.name + "-mount-heat");
	},
	draw(tile){
		Draw.rect(this.region, tile.drawx(), tile.drawy());
		Draw.color();
	},
	drawLayer2(tile){
		var entity = tile.ent();
		this.tr2.trns(entity.getRot() - 90, 0, -entity.getRec());
		this.turretDrawer.get(tile, entity);
		this.heatDrawer.get(tile, entity);
	},
	setStats(){
		this.consumes.add(new ConsumeLiquidFilter(boolf(liquid => liquid.temperature <= 0.5 && liquid.flammability < 0.1), 0.2)).update(false).boost();
		this.consumes.add(extendContent(ConsumeItemFilter, boolf(i => this.ammo.containsKey(i)), {
			build(tile, table){
				Vars.content.items().each(
					boolf(item => {
						return this.filter.get(item) && (!Vars.world.isZone() || Vars.data.isUnlocked(item));
					}),
					cons(item => {
						table.add(new ReqImage(new ItemImage(item.icon(Cicon.medium)),
							boolp(() => tile.entity != null && tile.entity.items.get(item) > 0)
						)).size(32);
					})
				);
			},
			valid(entity){
				return entity.items.get(entity.getItemAmmo()) > 0;
			},
			display(stats){}
		}));
		this.stats.add(BlockStat.shootRange, this.range / Vars.tilesize, StatUnit.blocks);
        this.stats.add(BlockStat.inaccuracy, this.inaccuracy, StatUnit.degrees);
        this.stats.add(BlockStat.reload, 60 / this.reload, StatUnit.none);
        this.stats.add(BlockStat.shots, this.shots, StatUnit.none);
        this.stats.add(BlockStat.targetsAir, this.targetAir);
        this.stats.add(BlockStat.targetsGround, this.targetGround);
		this.stats.add(BlockStat.booster, new BoosterListValue(this.reload, this.consumes.get(ConsumeType.liquid).amount, this.coolantMultipler, true, boolf(l => this.consumes.liquidfilters.get(l.id))));
		this.stats.add(BlockStat.ammo, new AmmoListValue(this.ammo));
		this.super$setStats();
	},
	buildConfiguration(tile, table){
		var entity = tile.ent();
		var group = new ButtonGroup();
		group.setMinCheckCount(0);
		group.setMaxCheckCount(-1);
		this.ammo.each(new Cons2(){get: (key, val) => {
			var button = table.addImageButton(Tex.whiteui, Styles.clearToggleTransi, 30, run(() => {
				tile.configure(key.id);
			}))
				.size(40)
				.group(group).get();
			button.getStyle().imageUp = new TextureRegionDrawable(key.icon(Cicon.small));
			button.update(run(() => {
				button.setChecked(entity.getItemAmmo() === key);
			}));
		}});
		this.super$buildConfiguration(tile, table);
	},
	configured(tile, player, value){
		this.super$configured(tile, player, value);
		tile.ent().setItemAmmo(Vars.content.getByID(ContentType.item, value));
	},
	handleLiquid(tile, source, liquid, amount){
		if(tile.entity.liquids.currentAmount() <= 0.001){
			Events.fire(EventType.Trigger.turretCool);
		}
		this.super$handleLiquid(tile, source, liquid, amount);
	},
	drawSelect(tile){
		this.super$drawSelect(tile);
		Drawf.dashCircle(tile.drawx(), tile.drawy(), this.range, tile.getTeam().color);
	},
	update(tile){
		this.super$update(tile);
		var entity = tile.ent();
		entity.setRec(Mathf.lerpDelta(entity.getRec(), 0, this.restitution));
		entity.setHeat(Mathf.lerpDelta(entity.getHeat(), 0, this.cooldown));
		if(this.hasAmmo(tile)){
			if(entity.timer.get(this.timerTarget, 20)){
				this.findTarget(tile);
			}
			if(this.validateTarget(tile)){
				var entity = tile.ent();
				var type = this.ammo.get(entity.getItemAmmo());
				var speed = type.speed;
				var result = Predict.intercept(entity, entity.getTarget(), speed);
				if(result.isZero()){
					result.set(entity.getTarget().getX(), entity.getTarget().getY());
				}
				var targetRot = result.sub(tile.drawx(), tile.drawy()).angle();
				if(this.shouldTurn(tile)){
					this.turnToTarget(tile, targetRot);
				}
				if(Angles.angleDist(entity.getRot(), targetRot) < this.shootCone){
					this.updateShooting(tile);
				}
			}
		}
	},
	hasAmmo(tile){
		return tile.ent().items.get(tile.ent().getItemAmmo()) > 0;
	},
	shouldTurn(tile){
		return true;
	},
	turnToTarget(tile, targetRot){
		var entity = tile.ent();
		entity.setRot(Angles.moveToward(entity.getRot(), targetRot, this.rotatespeed * entity.delta() * this.baseReloadSpeed(tile)));
	},
	validateTarget(tile){
		var entity = tile.ent();
		return !Units.invalidateTarget(entity.getTarget(), tile.getTeam(), tile.drawx(), tile.drawy());
	},
	findTarget(tile){
		var entity = tile.ent();
		entity.setTarget(Units.closestTarget(tile.getTeam(), tile.drawx(), tile.drawy(), this.range, boolf(e => !e.isDead())));
	},
	baseReloadSpeed(tile){
		return 1;
	},
	updateShooting(tile){
		var entity = tile.ent();
		if(entity.getRel() >= this.reload){
			var type = this.ammo.get(entity.getItemAmmo());
			this.shoot(tile, type);
			entity.setRel(0);
		}else{
			entity.setRel(entity.getRel() + entity.delta() * this.ammo.get(entity.getItemAmmo()).reloadMultiplier * this.baseReloadSpeed(tile));
		}
		var maxUsed = this.consumes.get(ConsumeType.liquid).amount;
		var liquid = entity.liquids.current();
		var used = Math.min(Math.min(entity.liquids.get(liquid), maxUsed * Time.delta()), Math.max(0, ((this.reload - entity.getRel()) / this.coolantMultipler) / liquid.heatCapacity)) * this.baseReloadSpeed(tile);
		entity.setRel(entity.getRel() + used * liquid.heatCapacity * this.coolantMultipler);
		entity.liquids.remove(liquid, used);
		if(Mathf.chance(0.06 * used)){
			Effects.effect(this.coolEffect, tile.drawx() + Mathf.range(this.size * Vars.tilesize / 2), tile.drawy() + Mathf.range(this.size * Vars.tilesize / 2));
		}
	},
	shoot(tile, type){
		var entity = tile.ent();
		entity.setRec(this.recoil);
		entity.setHeat(1.0);
		this.tr.trns(entity.getRot() - 90, 0, 2 * Vars.tilesize / 2);
		for(var i = 0; i < this.shots; i++){
			Time.run(this.burstSpacing * i, run(() => {
				if(!this.hasAmmo(tile)){return;}
				this.bullet(tile, type, entity.getRot() + Mathf.range(this.inaccuracy + type.inaccuracy));
				this.effects(tile);
			}));
		}
		this.useAmmo(tile);
	},
	useAmmo(tile){
		if(tile.isEnemyCheat()){return;}
		tile.ent().items.remove(tile.ent().getItemAmmo(), 1);
	},
	bullet(tile, type, angle){
		Bullet.create(type, tile.entity, tile.getTeam(), tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, angle);
	},
	effects(tile){
		var entity = tile.ent();
		Effects.effect(this.shootEffect, tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, entity.getRot());
		Effects.effect(this.smokeEffect, tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, entity.getRot());
		this.shootSound.at(tile, Mathf.random(0.9, 1.1));
		Effects.shake(this.shootShake, this.shootShake, tile.entity);
		entity.setRec(this.recoil);
	}
});
coreSword.turretDrawer = new Cons2(){get: (tile, entity) => {
	Draw.rect(coreSword.turretRegion, tile.drawx() + coreSword.tr2.x, tile.drawy() + coreSword.tr2.y, entity.getRot() - 90);
}}
coreSword.heatDrawer = new Cons2(){get: (tile, entity) => {
	if(entity.getHeat() <= 0.00001){return;}
	Draw.color(coreSword.heatColor, entity.getHeat());
	Draw.blend(Blending.additive);
	Draw.rect(coreSword.heatRegion, tile.drawx() + coreSword.tr2.x, tile.drawy() + coreSword.tr2.y, entity.getRot() - 90);
	Draw.blend();
	Draw.color();
}}
coreSword.ammo = new ObjectMap();
coreSword.coolantMultipler = 5;
coreSword.coolEffect = Fx.fuelburn;
coreSword.restitution = 0.03;
coreSword.cooldown = 0.03;
coreSword.shootCone = 8.0;
coreSword.rotatespeed = 5;
coreSword.timerTarget = coreSword.timers++;
coreSword.targetInterval = 20;
coreSword.targetAir = true;
coreSword.targetGround = true;
coreSword.inaccuracy = 3;
coreSword.shootEffect = Fx.shootBig;
coreSword.smokeEffect = Fx.shootBigSmoke;
coreSword.shootSound = Sounds.shootBig;
coreSword.range = 150;
coreSword.reload = 38;
coreSword.recoil = 3;
coreSword.shootShake = 2;
coreSword.burstSpacing = 3;
coreSword.shots = 4;
coreSword.flags = EnumSet.of(BlockFlag.core, BlockFlag.producer, BlockFlag.turret);
coreSword.heatColor = Pal.turretHeat;
coreSword.recoil = 3;
coreSword.tr = new Vec2();
coreSword.tr2 = new Vec2();
coreSword.entityType = prov(() => {
	const entity = extendContent(CoreBlock.CoreEntity, coreSword, {
		getRot: function(){
			return this._rot;
		},
		setRot: function(val){
			this._rot = val;
		},
		getHeat: function(){
			return this._heat;
		},
		setHeat: function(val){
			this._heat = val;
		},
		getRec: function(){
			return this._recoil;
		},
		setRec: function(val){
			this._recoil = val;
		},
		getRel: function(){
			return this._reload;
		},
		setRel: function(val){
			this._reload = val;
		},
		getTarget: function(){
			return this._target;
		},
		setTarget: function(val){
			this._target = val;
		},
		getItemAmmo: function(){
			return this._itemAmmo;
		},
		setItemAmmo: function(val){
			this._itemAmmo = val;
		},
		write(stream){
			this.super$write(stream);
			stream.writeShort(this._itemAmmo.id);
		},
		read(stream, revision){
			this.super$read(stream, revision);
			this._itemAmmo = Vars.content.getByID(ContentType.item, stream.readShort());
			if(this._itemAmmo == null){this.setItemAmmo(Items.copper);}
		}
	});
	entity.setRot(90.0);
	entity.setHeat(0.0);
	entity.setRec(0.0);
	entity.setRel(0.0);
	entity.setItemAmmo(Items.copper);
	return entity;
});