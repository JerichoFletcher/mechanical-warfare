const r = 450;

const spotlight = extendContent(LightBlock, "spotlight", {
	load(){
		this.super$load();
		this.baseRegion = Core.atlas.find("block-1");
	},
	generateIcons(){
		return [Core.atlas.find("block-1"), Core.atlas.find(this.name)];
	},
	draw(tile){
		Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
	},
	drawLayer(tile){
		var entity = tile.ent();
		Draw.rect(this.region, tile.drawx(), tile.drawy(), entity.getRot() - 90);
	},
	buildConfiguration(tile, table){
		var entity = tile.ent();
		table.addImageButton(Icon.left, run(() => {
			tile.configure(this.angleIncr);
		})).size(50);
		table.addImageButton(Icon.right, run(() => {
			tile.configure(-this.angleIncr);
		})).size(50);
	},
	drawConfigure(tile){
		this.super$drawConfigure(tile);
		var entity = tile.ent();
		Draw.color(tile.getTeam().color);
		Lines.stroke(1);
		var tx = Angles.trnsx(entity.getTargetRot(), this.radius);
		var ty = Angles.trnsy(entity.getTargetRot(), this.radius);
		Lines.dashLine(tile.drawx(), tile.drawy(), tile.drawx() + tx, tile.drawy() + ty, Mathf.round(this.radius / 3));
		Draw.color();
		Lines.stroke(1);
	},
	configured(tile, player, value){
		//print("configure value: " + value);
		tile.ent().setTargetRot(tile.ent().getTargetRot() + value);
	},
	playerPlaced(tile){},
	update(tile){
		this.super$update(tile);
		var entity = tile.ent();
		entity.updateRot();
	},
	drawLight(tile){
		var entity = tile.ent();
		if(Mathf.randomSeed(Mathf.round(Time.time() + entity.id)) <= (entity.efficiency())){
			for(var i = 0; i < 2; i++){
				var s = Mathf.signs[i];
				var a = entity.getRot() + 3 * s;
				Vars.renderer.lights.line(tile.drawx(), tile.drawy(), tile.drawx() + Angles.trnsx(a, this.radius), tile.drawy() + Angles.trnsy(a, this.radius));
				var b = entity.getRot() + 2 * s;
				Vars.renderer.lights.line(tile.drawx(), tile.drawy(), tile.drawx() + Angles.trnsx(b, this.radius), tile.drawy() + Angles.trnsy(b, this.radius));
				var c = entity.getRot() + 1 * s;
				Vars.renderer.lights.line(tile.drawx(), tile.drawy(), tile.drawx() + Angles.trnsx(c, this.radius), tile.drawy() + Angles.trnsy(c, this.radius));
			}
			Vars.renderer.lights.line(tile.drawx(), tile.drawy(), tile.drawx() + Angles.trnsx(entity.getRot(), this.radius), tile.drawy() + Angles.trnsy(entity.getRot(), this.radius));
		}
	},
});
spotlight.layer = Layer.turret;
spotlight.radius = r;
spotlight.angleIncr = 15;
spotlight.entityType = prov(() => {
	var entity = extend(TileEntity, {
		updateRot(){
			this._rot = Angles.moveToward(this._rot, this._trot, 3.33 * this.efficiency());
		},
		getRot(){
			if(typeof(this._rot) === "undefined"){this.setRot(90.0);}
			return this._rot;
		},
		setRot(val){
			this._rot = (val < 0 ? val + 360 : val) % 360;
		},
		getTargetRot(){
			if(typeof(this._trot) === "undefined"){this.setTargetRot(this.getRot());}
			return this._trot;
		},
		setTargetRot(val){
			this._trot = (val < 0 ? val + 360 : val) % 360;
		},
		config(){
			return this._trot;
		},
		write(stream){
			this.super$write(stream);
			stream.writeFloat(this._trot);
		},
		read(stream, revision){
			this.super$read(stream, revision);
			this._trot = stream.readFloat();
			this._rot = this._trot;
		}
	});
	entity.setRot(90.0);
	entity.setTargetRot(90.0);
	return entity;
});
