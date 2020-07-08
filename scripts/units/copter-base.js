module.exports = {
	drawBase(base){
		Draw.mixcol(Color.white, base.hitTime / base.hitDuration);
		Draw.rect(base.type.region, base.x, base.y, base.rotation - 90);
		Draw.mixcol();
	},
	drawRotor(base){
		att = base.type.getAttributes();
		Draw.mixcol(Color.white, base.hitTime / base.hitDuration);
		for(var i = 0; i < att.rotorCount; i++){
			rotor = att.rotor[i];
			region = rotor.bladeRegion;
			topRegion = rotor.topRegion;
			offx = Angles.trnsx(base.rotation - 90, rotor.width, rotor.offset);
			offy = Angles.trnsy(base.rotation - 90, rotor.width, rotor.offset);
			w = region.getWidth() * rotor.scale * Draw.scl;
			h = region.getHeight() * rotor.scale * Draw.scl;
			for(var j = 0; j < rotor.bladeCount; j++){
				angle = ((base.id * 24) + (Time.time() * rotor.speed) + ((360 / rotor.bladeCount) * j)) % 360;
				Draw.alpha(Vars.state.isPaused() ? 1 : Time.time() % 2);
				Draw.rect(region, base.x + offx, base.y + offy, w, h, angle);
			}
			Draw.alpha(1);
			Draw.rect(topRegion, base.x + offx, base.y + offy, base.rotation);
		}
		Draw.mixcol();
	},
	drawWeapons(base){
		att = base.type.getAttributes();
		// Primary weapon
		Draw.mixcol(Color.white, base.hitTime / base.hitDuration);
		for(var i = 0; i < 2; i++){
			var sign = Mathf.signs[i];
			var angle = base.rotation - 90;
			var trY = base.type.weaponOffsetY - base.type.weapon.getRecoil(base, (sign > 0));
			var w = -sign * base.type.weapon.region.getWidth() * Draw.scl;
			var h = base.type.weapon.region.getHeight() * Draw.scl;
			Draw.rect(base.type.weapon.region, 
				base.x + Angles.trnsx(angle, base.getWeapon().width * sign, trY),
				base.y + Angles.trnsy(angle, base.getWeapon().width * sign, trY),
				w, h, angle
			);
		}
		// Custom weapons
		for(var i = 0; i < att.weaponCount; i++){
			weap = att.weapon[i];
			region = weap.getRegion();
			tra = base.rotation - 90;
			for(var j = 0; j < 2; j++){
				k = Mathf.signs[j];
				trY = -weap.getRecoil(base, (k > 0));
				w = (-k * region.getWidth()) * Draw.scl;
				h = region.getHeight() * Draw.scl;
				Draw.rect(region,
					base.x + Angles.trnsx(tra, weap.width * k, trY),
					base.y + Angles.trnsy(tra, weap.width * k, trY),
					w, h, tra
				);
			}
		}
		Draw.mixcol();
	},
	updateWeapons(base){
		att = base.type.getAttributes();
		for(var i = 0; i < att.weaponCount; i++){
			weap = att.weapon[i];
			ammo = weap.bullet;
			if(
				base.dst(base.target) < weap.bullet.range()
			){
				to = Predict.intercept(base, base.target, ammo.speed);
				weap.update(base, to.x, to.y);
			}
		}
	}
};
