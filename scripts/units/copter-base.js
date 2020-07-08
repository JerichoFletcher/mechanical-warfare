module.exports = {
	drawBase(base){
		Draw.mixcol(Color.white, base.hitTime / base.hitDuration);
		Draw.rect(base.type.region, base.x, base.y, base.rotation - 90);
		Draw.mixcol();
	},
	drawRotor(base){
		att = base.type.getAttributes();
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
	},
	drawWeapons(base){
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
	}
};
