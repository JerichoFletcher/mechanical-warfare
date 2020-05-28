const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");

const cloud = extend(BasicBulletType, {
	draw(b){
		elib.fillPolygon(b.x, b.y, Pal.lancerLaser, 1, 5, 6, b.rot());
		if(b.timer.get(0, 2)){
			Effects.effect(this.trailEffect, b.x, b.y, b.rot());
		}
	}
});
cloud.damage = 80;
cloud.splashDamage = 40;
cloud.splashDamageRadius = 8;
cloud.speed = 6;
cloud.lifetime = 40;
cloud.shootEffect = newEffect(18, e => {
	Draw.color(Pal.lancerLaser);
	for(var i = 0; i < 2; i++){
		var j = Mathf.signs[i];
		Drawf.tri(e.x, e.y, 3 * e.fout(), 20, e.rotation + 90 * j);
	}
	elib.fillCircleWCol(e.x, e.y, 0.2 + e.fout() * 7.8);
	Draw.color();
});
cloud.smokeEffect = newEffect(24, e => {
	var alpha = 0.2 + e.fout() * 0.8;
	var radius = 0.2 + e.fout() * 3.8;
	var distance = e.fin() * 12;
	var length = e.fout() * 2;
	elib.splashCircles(e.x, e.y, Color.gray, alpha, radius, distance, length, 10, e.id);
});
cloud.trailEffect = newEffect(10, e => {
	var alpha = e.fout();
	var size = 0.2 + e.fout() * 5.8;
	elib.fillPolygon(e.x, e.y, Pal.lancerLaser, alpha, 5, size, e.rotation);
});
cloud.hitEffect = Fx.hitLancer;
cloud.despawnEffect = cloud.hitEffect;

const storm = extendContent(ChargeTurret, "storm", {
	load(){
		this.super$load();
		this.region = Core.atlas.find(this.name);
		//this.topRegion = Core.atlas.find(this.name + "-top");
	},
	generateIcons: function(){
		return [
			Core.atlas.find("block-3"),
			Core.atlas.find(this.name)
			//Core.atlas.find(this.name + "-top")
		]
	},
	draw(tile){
		Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
		Draw.color();
	},
	shoot(tile, ammo){
		var entity = tile.ent();
		this.useAmmo(tile);
		this.tr2.trns(entity.rotation - 90, 0, this.barrelOffset);
		Effects.effect(this.chargeBeginEffect, tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation);
		Effects.effect(this.chargeEffect, tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation);
		entity.shooting = true;
		Time.run(this.chargeTime, run(() => {
			if(!this.isTurret(tile)) return;
			this.tr2.trns(entity.rotation, 0, this.barrelOffset);
			entity.recoil = this.recoil;
			entity.heat = 1;
			this.bullet(tile, ammo, entity.rotation + Mathf.range(this.inaccuracy));
			this.effects(tile);
			entity.shooting = false;
		}));
	},
	update(tile){
		this.super$update(tile);
		var entity = tile.ent();
		if(entity.shooting){
			var c = entity.getChargeTime();
			entity.setChargeTime(c < this.chargeTime ? c + 1 : this.chargeTime);
		}else{
			entity.setChargeTime(0);
		}
	},
	drawLayer(tile){
		/*this.super$drawLayer(tile);
		var entity = tile.ent();
		this.tr3.trns(entity.rotation, this.innerChargeOffset + entity.recoil);
		var progress = entity.getChargeTime() / this.chargeTime;
		var alpha = Mathf.clamp(progress * 3);
		Draw.color(Color.black, Pal.lancerLaser, alpha);
		Draw.blend(Blending.additive);
		elib.fillCircleWCol(tile.drawx() - this.tr3.x, tile.drawy() - this.tr3.y, 2.2);
		Lines.stroke(2);
		Lines.lineAngle(tile.drawx() - this.tr3.x, tile.drawy() - this.tr3.y, entity.rotation, progress * this.lineLength);
		Lines.stroke(1);
		Draw.blend();
		Draw.color();
		Draw.rect(Core.atlas.find(this.name + "-top"), tile.drawx() - this.tr3.x * Draw.scl, tile.drawy() - this.tr3.y * Draw.scl, entity.rotation - 90);
		print(progress);*/
		
		this.super$drawLayer(tile);
		var entity = tile.ent();
		this.tr3.trns(entity.rotation, this.innerChargeOffset + entity.recoil);
		var progress = entity.getChargeTime() / this.chargeTime;
		Draw.color(Pal.lancerLaser);
		Draw.blend(Blending.additive);
		elib.fillCircleWCol(tile.drawx() - this.tr3.x, tile.drawy() - this.tr3.y, progress * 2.2);
		Lines.stroke(progress * 2);
		Lines.lineAngle(tile.drawx() - this.tr3.x, tile.drawy() - this.tr3.y, entity.rotation, this.lineLength);
		Lines.stroke(1);
		Draw.blend();
		Draw.color();
		Draw.rect(Core.atlas.find(this.name + "-top"),
			tile.drawx() - Angles.trnsx(entity.rotation, entity.recoil, 0),
			tile.drawy() - Angles.trnsy(entity.rotation, entity.recoil, 0),
			entity.rotation - 90
		);
	}
});
storm.tr2 = new Vec2();
storm.tr3 = new Vec2();
storm.shootType = cloud;
storm.chargeEffect = newEffect(40, e => {
	/*var thickness = e.fin() * 2;
	var distance = e.fout() * 16;
	var length = e.fslope() * 4;
	elib.splashLines(e.x, e.y, Pal.lancerLaser, thickness, length, 5, e.id);*/
	var alpha = e.fin();
	var size = e.fin() * 4;
	var angle = [];
	var dist = [];
	for(var i = 0; i < 5; i++){
		angle[i] = (Time.time() + (i * 72)) % 360;
		dist[i] = 4 + e.fout() * 16;
		elib.fillPolygon(e.x + Angles.trnsx(angle[i], dist[i]), e.y + Angles.trnsy(angle[i], dist[i]), Pal.lancerLaser, alpha, 5, size, angle[i]);
	}
});
storm.chargeBeginEffect = newEffect(50, e => {
	elib.fillCircle(e.x, e.y, Pal.lancerLaser, 1, e.fin() * 4);
});
storm.barrelOffset = 48 / Vars.tilesize;
storm.innerChargeOffset = 46 / Vars.tilesize;
storm.lineLength = 52 / Vars.tilesize;
storm.entityType = prov(() => {
	const entity = extendContent(ChargeTurret.LaserTurretEntity, storm, {
		getChargeTime: function(){
			return this._chargeTime;
		},
		setChargeTime: function(val){
			this._chargeTime = val;
		}
	});
	entity.setChargeTime(0.0);
	return entity;
});
