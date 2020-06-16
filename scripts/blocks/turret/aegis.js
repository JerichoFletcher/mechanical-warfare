const aegis = extendContent(ItemTurret, "aegis", {
	load(){
		this.super$load();
		this.region = Core.atlas.find(this.name);
		this.heatRegion = Core.atlas.find(this.name + "-heat");
		this.bottomRegion = Core.atlas.find(this.name + "-bottom");
		this.topRegion = Core.atlas.find(this.name + "-top")
		this.outline = Core.atlas.find(this.name + "-outline");
		this.bottomOutline = Core.atlas.find(this.name + "-bottom-outline");
		this.topOutline = Core.atlas.find(this.name + "-top-outline");
	},
	generateIcons: function(){
		return [
			Core.atlas.find("block-2"),
			Core.atlas.find(this.name + "-icon")
		];
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
	}
});
aegis.outlineDrawer = new Cons2(){get: (tile, entity) => {
	Draw.rect(aegis.bottomOutline, tile.drawx(), tile.drawy());
	Draw.rect(aegis.outline, tile.drawx() + aegis.tr2.x, tile.drawy() + aegis.tr2.y, entity.rotation - 90);
	Draw.rect(aegis.topOutline, tile.drawx(), tile.drawy());
}}
aegis.drawer = new Cons2(){get: (tile, entity) => {
	Draw.rect(aegis.bottomRegion, tile.drawx(), tile.drawy());
	Draw.rect(aegis.region, tile.drawx() + aegis.tr2.x, tile.drawy() + aegis.tr2.y, entity.rotation - 90);
	if(entity.heat > 0.00001){
		Draw.color(aegis.heatColor, entity.heat);
		Draw.blend(Blending.additive);
		Draw.rect(aegis.heatRegion, tile.drawx() + aegis.tr2.x, tile.drawy() + aegis.tr2.y, entity.rotation - 90);
		Draw.blend();
		Draw.color();
	}
	Draw.rect(aegis.topRegion, tile.drawx(), tile.drawy());
}}
