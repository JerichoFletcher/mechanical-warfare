const elib = require("mechanical-warfare/effectlib");

const spectrumLaser = extend(BasicBulletType, {
	draw(b){
		entity = b.getOwner();
		tile = entity.tile;
		block = entity.block;
		if(entity == null || tile == null || tile.ent() == null){return;}
		col = Color.valueOf("ffaaaa").shiftHue(entity.getPrismPeriod());
		tx = tile.drawx() + Angles.trnsx(entity.rotation - 90, 0, block.getPrismTop(tile));
		ty = tile.drawy() + Angles.trnsy(entity.rotation - 90, 0, block.getPrismTop(tile));
		angle = Angles.angle(tx, ty, b.x, b.y);
		dst = Mathf.dst(tx, ty, b.x, b.y);
		Lines.precise(true);
		Lines.stroke(b.fout() * 2.8);
		Draw.color(col, 0.3 + b.fout() * 0.7);
		Lines.lineAngle(tx, ty, angle, dst);
		Lines.stroke(1);
		Lines.precise(false);
		Drawf.tri(b.x, b.y, b.fout() * 2.8, 10, angle);
		Draw.color();
	},
	init(b){
		if(typeof(b) !== "undefined"){
			this.super$init(b);
			entity = b.getOwner();
			tile = entity.tile;
			block = entity.block;
			tx = tile.drawx() + Angles.trnsx(entity.rotation - 90, 0, block.getPrismTop(tile));
			ty = tile.drawy() + Angles.trnsy(entity.rotation - 90, 0, block.getPrismTop(tile));
			angle = Angles.angle(tx, ty, b.x, b.y);
			dst = Mathf.dst(tx, ty, b.x, b.y);
			Damage.collideLine(b, b.getTeam(), this.hitEffect, tx, ty, angle, dst);
		}
	},
	hit(b, x, y){
		entity = b.getOwner();
		color1 = Color.valueOf("ffaaaa").shiftHue(entity.getPrismPeriod());
		color2 = Color.valueOf("ccaaaa").shiftHue(entity.getPrismPeriod());
		Effects.effect(this.hitEffect2, b.x, b.y, b.rot(), {
			colorA: color1,
			colorB: color2
		});
	}
});
spectrumLaser.damage = 99;
spectrumLaser.despawnEffect = Fx.none;
spectrumLaser.hitEffect2 = newEffect(30, e => {
	Draw.color(e.data.colorA, e.data.colorB, e.fin());
	elib.splashLinesWCol(e.x, e.y, e.fout(), 4 + e.finpow() * 12, e.fout() * 3, 3, e.id);
	Draw.color();
});
spectrumLaser.lifetime = 25;
spectrumLaser.speed = 0.001;
spectrumLaser.pierce = true;
spectrumLaser.collides = false;
spectrumLaser.hitTiles = false;
spectrumLaser.collidesTiles = false;
spectrumLaser.collidesAir = false;
spectrumLaser.collidesTeam = false;

const spectrum = extendContent(PowerTurret, "spectrum", {
	update(tile){
		this.super$update(tile);
		entity = tile.ent();
		entity.setPrismPower(Mathf.lerpDelta(entity.getPrismPower(), entity.efficiency(), this.cooldown));
		entity.setPrismRot(entity.getPrismRot() + 2 * entity.getPrismPower());
		entity.setPrismSize((1 + Mathf.sin(Time.time(), 15, 0.08 * entity.getPrismPower())) * entity.getPrismPower());
	},
	drawLayer(tile){
		entity = tile.ent();
		col = Color.valueOf("ffcccc").shiftHue(entity.getPrismPeriod()).mul(0.5 + entity.getPrismPower() * 0.5);
		x = tile.drawx() + Angles.trnsx(entity.rotation - 90, 0, -entity.recoil / 2);
		y = tile.drawy() + Angles.trnsy(entity.rotation - 90, 0, -entity.recoil / 2);
		x1 = tile.drawx() + Angles.trnsx(entity.rotation - 90, 0, -entity.recoil / 2 + this.size * 4);
		y1 = tile.drawy() + Angles.trnsy(entity.rotation - 90, 0, -entity.recoil / 2 + this.size * 4);
		x2 = tile.drawx() + Angles.trnsx(entity.rotation - 90, 0, this.getPrismOffset() - entity.recoil);
		y2 = tile.drawy() + Angles.trnsy(entity.rotation - 90, 0, this.getPrismOffset() - entity.recoil);
		
		Draw.rect(this.region, x, y, entity.rotation - 90);
		
		Draw.color(col, entity.getPrismPower());
		
		elib.fillCircleWCol(x1, y1, 1.2 * entity.getPrismPower() + (Mathf.absin(5, 0.6) * entity.getPrismPower()));
		elib.fillCircleWCol(x2, y2, 1.2 * entity.getPrismPower() + (Mathf.absin(5, 0.6) * entity.getPrismPower()));
		
		Lines.precise(true);
		Lines.stroke(0.9 * entity.getPrismPower() + (Mathf.absin(5, 0.4) * entity.getPrismPower()));
		Lines.line(x1, y1, x2, y2);
		Lines.precise(false);
		
		Draw.color(Color.white, entity.getPrismPower());
		
		elib.fillCircleWCol(x1, y1, 0.6 * entity.getPrismPower() + (Mathf.absin(5, 0.3) * entity.getPrismPower()));
		elib.fillCircleWCol(x2, y2, 0.6 * entity.getPrismPower() + (Mathf.absin(5, 0.3) * entity.getPrismPower()));
		
		Lines.precise(true);
		Lines.stroke(0.4 * entity.getPrismPower() + (Mathf.absin(5, 0.2) * entity.getPrismPower()));
		Lines.line(x1, y1, x2, y2);
		Lines.stroke(1);
		Lines.precise(false);
		
		for(var i = 0; i < 2; i++){
			j = Mathf.signs[i];
			Drawf.tri(x1, y1,
				1.2 * entity.getPrismPower() + (Mathf.absin(2, 0.6) * entity.getPrismPower()),
				8.5 * entity.getPrismPower() + (Mathf.absin(2, 3.5) * entity.getPrismPower()),
				entity.rotation + 90 * j
			);
		}
		
		Draw.reset();
	},
	drawLayer2(tile){
		entity = tile.ent();
		// The following code was originally made by EyeOfDarkness; I just changed the shape to prism so it wouldn't be exactly the same
		// Define basic parameters and rotation axises
		rot1 = entity.rotation - 90;
		rot2 = entity.getPrismRot();
		size = entity.getPrismSize();
		a = entity.getPrismPower();
		width = 6;
		axisY = new Vec3(0, 1, 0);
		axisZ = new Vec3(0, 0, -1);
		shade = 3; // The maximum amount of sides that appear on screen, so one side's color won't be same with another
		
		// Set X and Y position for the prism
		x = tile.drawx() + Angles.trnsx(entity.rotation - 90, 0, this.getPrismOffset() - entity.recoil);
		y = tile.drawy() + Angles.trnsy(entity.rotation - 90, 0, this.getPrismOffset() - entity.recoil);
		
		// Define prism corners
		const p1 = new Vec3();
		const p2 = new Vec3();
		const p3 = new Vec3();
		const p4 = new Vec3();
		const p5 = new Vec3();
		const p6 = new Vec3();
		
		// Set X, Y, and Z positions of the prism corners
		p1.set(p6.set(width, -width, width).rotate(axisY, rot2)).rotate(axisZ, rot1);
		p2.set(p6.set(width, -width, -width).rotate(axisY, rot2)).rotate(axisZ, rot1);
		p3.set(p6.set(-width, -width, width).rotate(axisY, rot2)).rotate(axisZ, rot1);
		p4.set(p6.set(-width, -width, -width).rotate(axisY, rot2)).rotate(axisZ, rot1);
		p5.set(p6.set(0, width, 0).rotate(axisY, rot2)).rotate(axisZ, rot1);
		
		// Check if a prism side is in the back; if so, then it won't be drawn
		a1 = (p2.z + p1.z + p5.z) <= 0 ? 0 : 1 * a;
		a2 = (p2.z + p4.z + p5.z) <= 0 ? 0 : 1 * a;
		a3 = (p3.z + p1.z + p5.z) <= 0 ? 0 : 1 * a;
		a4 = (p3.z + p4.z + p5.z) <= 0 ? 0 : 1 * a;
		a5 = (p1.z + p2.z + p3.z + p4.z) <= 0 ? 0 : 1 * a;
		
		// Set prism sides' color according to their Z position
		c1 = Mathf.clamp((p2.z + p1.z + p5.z) / width / shade);
		c2 = Mathf.clamp((p2.z + p4.z + p5.z) / width / shade);
		c3 = Mathf.clamp((p3.z + p1.z + p5.z) / width / shade);
		c4 = Mathf.clamp((p3.z + p4.z + p5.z) / width / shade);
		c5 = Mathf.clamp((p1.z + p2.z + p3.z + p4.z) / width / shade);
		
		// Move the prism to the defined X and Y positions scaled by size
		p1x = p1.x * size + x;
		p1y = p1.y * size + y;
		p2x = p2.x * size + x;
		p2y = p2.y * size + y;
		p3x = p3.x * size + x;
		p3y = p3.y * size + y;
		p4x = p4.x * size + x;
		p4y = p4.y * size + y;
		p5x = p5.x * size + x;
		p5y = p5.y * size + y;
		
		// Draw the prism
		col = Color.valueOf("ffcccc").shiftHue(entity.getPrismPeriod()).mul(0.5 + entity.getPrismPower() * 0.5);
		
		if(entity.timer.get(this.trailTimer, 1 / entity.getPrismPower())){
			rand = Mathf.range(width / 1.6) * size;
			Effects.effect(this.trailEffect,
				tile.drawx() + Angles.trnsx(rot1, rand, this.getPrismOffset() - (width * size) - entity.recoil),
				tile.drawy() + Angles.trnsy(rot1, rand, this.getPrismOffset() - (width * size) - entity.recoil),
				rot1 - 180, {
					color: col,
					dist: Mathf.random(0.8, 1.2),
					size: a
				}
			);
		}
		
		Draw.color(col.cpy().mul(c1, c1, c1, a1));
		Fill.tri(p2x, p2y, p1x, p1y, p5x, p5y);
		Draw.color(col.cpy().mul(c2, c2, c2, a2));
		Fill.tri(p2x, p2y, p4x, p4y, p5x, p5y);
		Draw.color(col.cpy().mul(c3, c3, c3, a3));
		Fill.tri(p3x, p3y, p1x, p1y, p5x, p5y);
		Draw.color(col.cpy().mul(c4, c4, c4, a4));
		Fill.tri(p3x, p3y, p4x, p4y, p5x, p5y);
		Draw.color(col.cpy().mul(c5, c5, c5, a5));
		Fill.quad(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y);
		
		Draw.reset();
	},
	findTarget(tile){
		entity = tile.ent();
		radius = this.range;
		targetFin = null;
		lastTargetCount = 0;
		targetRad = 64;
		Units.nearbyEnemies(tile.getTeam(), tile.drawx() - radius, tile.drawy() - radius, radius * 2, radius * 2, cons(unit => {
			if(unit.withinDst(tile.drawx(), tile.drawy(), radius) && !unit.withinDst(tile.drawx(), tile.drawy(), this.getMinDst())){
				count = 0;
				Units.nearbyEnemies(tile.getTeam(), unit.x - targetRad, unit.y - targetRad, targetRad * 2, targetRad * 2, cons(target => {
					if(target.withinDst(unit.x, unit.y, targetRad)){
						count++;
					}
				}));
				if(count > lastTargetCount){
					targetFin = unit;
					lastTargetCount = count;
				}
			}
		}));
		if(targetFin === null){
			target = Units.findEnemyTile(tile.getTeam(), tile.drawx(), tile.drawy(), this.range, boolf(t => !t.isDead()));
			if(target === null){
				entity.target = null;
				return;
			}
			if(!target.withinDst(tile.drawx(), tile.drawy(), this.getMinDst())){
				entity.target = target;
			}
		}else{
			entity.target = targetFin;
		}
	},
	shoot(tile, type){
		entity = tile.ent();
		radius = this.range;
		count = 0;
		if(!(entity.target instanceof TileEntity)){
			Units.nearbyEnemies(tile.getTeam(), tile.drawx() - radius, tile.drawy() - radius, radius * 2, radius * 2, cons(unit => {
				if(
					unit.withinDst(tile.drawx(), tile.drawy(), radius) &&
					Angles.within(entity.rotation, Angles.angle(tile.drawx(), tile.drawy(), unit.x, unit.y), this.shootCone) &&
					count <= 10
				){	
					count++;
					this.laser(tile, type, unit);
				}
			}));
			entity.setTargetCount(count);
		}else{
			this.laser(tile, type, entity.target);
			entity.setTargetCount(1);
		}
		entity.recoil = this.recoil;
		this.effects(tile);
		this.useAmmo(tile);
	},
	effects(tile){
		entity = tile.ent();
		x = tile.drawx() + Angles.trnsx(entity.rotation - 90, 0, this.getPrismTop(tile));
		y = tile.drawy() + Angles.trnsy(entity.rotation - 90, 0, this.getPrismTop(tile));
		Effects.effect(this.shootEffect2, x, y, entity.rotation, {
			col: Color.valueOf("ffaaaa").shiftHue(entity.getPrismPeriod())
		});
		pitch = Mathf.clamp(2 - 0.5 * entity.getTargetCount() / 10, 1.5, 2);
		this.shootSound.at(x, y, pitch + Mathf.range(0.1));
	},
	laser(tile, type, target){
		Bullet.create(type, tile.entity, tile.getTeam(), target.x, target.y, 0, 1, 1);
	},
	getPrismOffset(){
		return 24;
	},
	getMinDst(){
		return this.getPrismOffset() + 8;
	},
	getPrismTop(tile){
		entity = tile.ent();
		return (this.getPrismOffset() + 6 * entity.getPrismSize()) - entity.recoil;
	}
});
spectrum.trailTimer = spectrum.timers++;
spectrum.prismRotateSpeed = 1.5;
spectrum.shootType = spectrumLaser;
spectrum.trailEffect = newEffect(24, e => {
	dist = e.finpow() * 8 * e.data.dist;
	x = e.x + Angles.trnsx(e.rotation, 0, dist);
	y = e.y + Angles.trnsy(e.rotation, 0, dist);
	elib.fillCircle(x, y, e.data.color, 1, (e.fout() * 1.2) * e.data.size);
});
spectrum.shootEffect2 = newEffect(30, e => {
	elib.fillCircle(e.x, e.y, e.data.col, 1, e.fout() * 3.5);
	Draw.color(e.data.col);
	for(var i = 0; i < 2; i++){
		j = Mathf.signs[i];
		Drawf.tri(e.x, e.y, e.fout() * 4, 15, e.rotation + 90 * j);
	}
	Draw.color();
});
spectrum.entityType = prov(() => {
	const entity = extend(Turret.TurretEntity, {
		getPrismRot(){
			return this._rot;
		},
		setPrismRot(val){
			this._rot = val;
		},
		getPrismPower(){
			return this._power <= 0.001 ? 0 : this._power;
		},
		setPrismPower(val){
			this._power = val;
		},
		getPrismSize(){
			return this._size;
		},
		setPrismSize(val){
			this._size = val;
		},
		getPrismPeriod(){
			return this._period;
		},
		setPrismPeriod(val){
			this._period = val;
		},
		getTargetCount(){
			return this._count;
		},
		setTargetCount(val){
			this._count = val;
		},
		update(){
			this.super$update();
			this.setPrismPeriod(this.getPrismPeriod() + this.getPrismPower() * 2);
		}
	});
	entity.setPrismRot(0);
	entity.setPrismPower(0);
	entity.setPrismPeriod(0);
	entity.setTargetCount(0);
	return entity;
});