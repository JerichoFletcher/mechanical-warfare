const elib = require("effectlib");
const plib = require("plib");

const vortexBullet = extend(BasicBulletType, {
	draw(b){
		elib.fillCircle(b.x, b.y, this.frontColor, 1, this.bulletWidth);
		elib.outlineCircle(b.x, b.y, this.backColor, 1, this.bulletWidth);
	},
	update(b){
		if(b.timer.get(0, 3)){
			Effects.effect(this.trailEffectA, b.x, b.y, b.rot());
		}
		Effects.effect(this.trailEffectB, b.x, b.y, b.rot());
	}
});
vortexBullet.damage = 100;
vortexBullet.speed = 4;
vortexBullet.lifetime = 60;
vortexBullet.bulletWidth = vortexBullet.bulletHeight = 6;
vortexBullet.frontColor = plib.frontColorPurple;
vortexBullet.backColor = plib.backColorPurple;
vortexBullet.shootEffect = Fx.shootBig;
vortexBullet.smokeEffect = Fx.shootBigSmoke;
vortexBullet.trailEffectA = newEffect(30, e => {
	elib.fillCircle(e.x, e.y, vortexBullet.backColor, 1, 0.2 + e.fout() * 4.8);
});
vortexBullet.trailEffectB = newEffect(48, e => {
	var angle = (Time.time() + Mathf.randomSeed(e.id, 360)) % 360;
	var dist = vortexBullet.bulletWidth + 1 - e.fout() * 1.5;
	elib.fillCircle(e.x + Angles.trnsx(angle, dist), e.y + Angles.trnsy(angle, dist), vortexBullet.backColor, 1, e.fout() * 1.1);
});
vortexBullet.hitEffect = newEffect(18, e => {
	elib.fillCircle(e.x, e.y, vortexBullet.frontColor, 0.2 + e.fin() * 0.8, 0.2 + e.fout() * 11.8);
	
	var thickness = e.fout() * 3;
	var radius = e.fin() * 15;
	elib.outlineCircle(e.x, e.y, vortexBullet.backColor, thickness, radius);
});
vortexBullet.despawnEffect = vortexBullet.hitEffect;

const vortexLance = extendContent(Weapon, "vortex-lance", {
	load(){
		this.region = Core.atlas.find("clear");
	}
});
vortexLance.shots = 1;
vortexLance.shake = 1;
vortexLance.width = 0;
vortexLance.alternate = true;
vortexLance.reload = 50;
vortexLance.recoil = 2;
vortexLance.inaccuracy = 3;
vortexLance.ejectEffect = Fx.shellEjectBig;
vortexLance.shootSound = Sounds.shootBig;
vortexLance.bullet = vortexBullet;

const vortex = extendContent(Mech, "vortex-ship", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
	},
	draw(player){
		this.pl1.trns(player.rotation - 90, 0, -(this.weapon.getRecoil(player, true) + this.weapon.getRecoil(player, false)));
		Draw.rect(Core.atlas.find(modName + "-vortex-lance-equip"), player.x + this.pl1.x, player.y + this.pl1.y, player.rotation - 90);
		
		if(player.shootHeat > 0.01){
			Draw.color(Color.black, this.engineColor, player.shootHeat / 3);
			Draw.blend(Blending.additive);
			for(var i = 0; i < 3; i++){
				var rot = (Time.time() * this.shieldRotSpeed[i]) % 360;
				Draw.rect(Core.atlas.find(this.name + "-shield" + i), player.x, player.y, rot);
			}
			Draw.blend();
			Draw.color();
		}
	},
	updateAlt(player){
		if(player.timer.get(4, (10 - (player.velocity().len() / this.maxSpeed) * 9) / 60)){
			Effects.effect(this.trailEffect, player.x, player.y, player.rotation);
		}
	},
	getExtraArmor: function(player){
		return player.shootHeat * 60;
	}
});
vortex.shieldRotSpeed = [20, 50, 100];
//vortex.shieldWarmup = 0.008;
vortex.pl1 = new Vec2();
vortex.flying = true;
vortex.drillPower = 6;
vortex.mineSpeed = 1.6;
vortex.speed = 0.3;
vortex.maxSpeed = 4.33;
vortex.drag = 0.01;
vortex.mass = 4.5;
vortex.health = 420; // WEED
vortex.itemCapacity = 50;
vortex.engineColor = plib.engineColorPurple;
vortex.cellTrnsY = 2;
vortex.buildPower = 1.2;
vortex.weapon = vortexLance;
vortex.trailEffect = newEffect(16, e => {
	var angle = Mathf.randomSeed(e.id, 360);
	var offset = 0.3 + e.fin() * 0.4;
	Draw.color(vortex.engineColor);
	Draw.alpha(0.33 + e.fout() * 0.33);
	Draw.rect(Core.atlas.find(modName + "-vortex-ship-trail"), e.x + Angles.trnsx(angle, offset), e.y + Angles.trnsy(angle, offset), e.rotation - 90);
	Draw.color();
});

const vortexPad = extendContent(MechPad, "vortex-ship-pad", {});
vortexPad.mech = vortex;