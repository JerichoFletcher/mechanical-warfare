const slagBomb = extendContent(ShockMine, "slag-bomb", {
	load(){
		this.super$load();
		this.topRegion = Core.atlas.find(this.name + "-top");
	},
	drawLayer(tile){
		Draw.rect(this.region, tile.drawx(), tile.drawy());
		Draw.color(tile.getTeam().color);
		Draw.alpha(Mathf.absin(Time.time() + 360 * Mathf.randomSeed(tile.entity.id), 1.5, 1));
		Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
		Draw.color();
	},
	drawLight(tile){
		Vars.renderer.lights.add(tile.drawx(), tile.drawy(), 20, Liquids.slag.lightColor, 0.2);
	},
	unitOn(tile, unit){
		if(unit.getTeam() != tile.getTeam()){
			Time.run(Mathf.random(5, 10), run(() => {
				const other = Vars.world.tile(tile.x, tile.y);
				if(other != null){
					Puddle.deposit(other, Liquids.slag, this.liquidAmount + Mathf.range(30));
				}
			}));
			for(var i = 0; i < 8; i++){
				Bullet.create(Bullets.glassFrag, tile.entity, tile.entity.getTeam(), tile.drawx(), tile.drawy(), Mathf.random(360), Mathf.random(0.8, 1.2), Mathf.random(0.9, 1.1));
			}
			tile.entity.damage(this.tileDamage);
		}
	},
});
slagBomb.liquidAmount = 150;
