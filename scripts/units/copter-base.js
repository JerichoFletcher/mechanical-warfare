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
	},
	weapon(name, index){
		const temp = extendContent(Weapon, name, {
			getRegion(){
				return Core.atlas.find("mechanical-warfare-" + name + "-equip");
			},
			update(shooter, pointerX, pointerY){
				for(var i = 0; i < 2; i++){
					j = Mathf.booleans[i];
					Tmp.v1.set(pointerX, pointerY).sub(shooter.getX(), shooter.getY());
					if(Tmp.v1.len() < this.minPlayerDist){Tmp.v1.setLength(this.minPlayerDist);}
					cx = Tmp.v1.x + shooter.getX();
					cy = Tmp.v1.y + shooter.getY();
					ang = Tmp.v1.angle();
					Tmp.v1.trns(ang - 90.0, this.width * Mathf.sign(j), this.length + Mathf.range(this.lengthRand));
					this.updateB(shooter,
						shooter.getX() + Tmp.v1.x,
						shooter.getY() + Tmp.v1.y,
						Angles.angle(shooter.getX() + Tmp.v1.x, shooter.getY() + Tmp.v1.y, cx, cy),
						j
					);
				}
			},
			updateB(shooter, mountX, mountY, angle, left){
				if(shooter.getTimer2().get(shooter.getShootTimer2(index, left), this.reload)){
					shooter.getTimer2().reset(shooter.getShootTimer2(index, !left), this.reload / 2.0);
					this.shootDirectB(shooter, mountX - shooter.getX(), mountY - shooter.getY(), angle, left);
				}
			},
			shootDirectB(shooter, offsetX, offsetY, rotation, left){
				x = shooter.getX() + offsetX;
				y = shooter.getY() + offsetY;
				baseX = shooter.getX();
				baseY = shooter.getY();
				
				weap = shooter.type.getAttributes().weapon[0];
				weap.shootSound.at(x, y, Mathf.random(0.8, 1.0));
				Angles.shotgun(weap.shots, weap.spacing, rotation, new Floatc(){get: f => {
					weap.bulletB(shooter, x, y, f + Mathf.range(weap.inaccuracy));
				}});
				ammo = weap.bullet;
				Tmp.v1.trns(rotation + 180, ammo.recoil);
				shooter.velocity().add(Tmp.v1);
				Tmp.v1.trns(rotation, 3);
				Effects.effect(weap.ejectEffect, x, y, rotation * -Mathf.sign(left));
				Effects.effect(ammo.shootEffect, x + Tmp.v1.x, y + Tmp.v1.y, rotation, shooter);
				Effects.effect(ammo.smokeEffect, x + Tmp.v1.x, y + Tmp.v1.y, rotation, shooter);
				shooter.getTimer2().get(shooter.getShootTimer2(index, left), weap.reload);
				// Synchronize
				if(Vars.net.server()){
					packet = Pools.obtain(Packets.invokePacket, prov(() => {return new Packets.invokePacket}));
					packet.writeBuffer = tempBuffer;
					packet.priotity = 0;
					packet.type = 19;
					tempBuffer.position(0);
					TypeIO.writeShooter(tempBuffer, shooter);
					tempBuffer.putFloat(x);
					tempBuffer.putFloat(y);
					tempBuffer.putFloat(rotation);
					tempBuffer.put(left ? 1 : 0);
					packet.writeLength = tempBuffer.position();
					Vars.net.send(packet, Net.SendMode.udp);
				}
			},
			bulletB(owner, x, y, angle){
				if(owner == null){return;}
				Tmp.v1.trns(angle, 3.0);
				Bullet.create(this.bullet, owner, owner.getTeam(), x + Tmp.v1.x, y + Tmp.v1.y, angle, 1.0 - this.velocityRnd + Mathf.random(this.velocityRnd));
			},
			getRecoil(shooter, left){
				return (1.0 - Mathf.clamp(shooter.getTimer2().getTime(shooter.getShootTimer2(index, left)) / this.reload)) * this.recoil;
			}
		});
		return temp;
	}
};
