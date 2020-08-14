module.exports = {
	drawMainWeapons(base){
		Draw.mixcol(Color.white, base.hitTime / base.hitDuration);
		for(var i = 0; i < 2; i++){
			sign = Mathf.signs[i];
			tra = base.rotation - 90;
			trY = base.type.weaponOffsetY - base.type.weapon.getRecoil(base, (sign > 0));
			w = -sign * base.type.weapon.region.getWidth() * Draw.scl;
			h = base.type.weapon.region.getHeight() * Draw.scl;
			wx = base.x + Angles.trnsx(tra, base.getWeapon().width * sign, trY);
			wy = base.y + Angles.trnsy(tra, base.getWeapon().width * sign, trY);
			if(base.type.rotateWeapon){
				wi = (sign + 1) / 2;
				Draw.rect(base.type.weapon.region, wx, wy, w, h, base.weaponAngles[wi] - 90);
			}else{
				Draw.rect(base.type.weapon.region, wx, wy, w, h, tra);
			}
		}
		Draw.mixcol();
	},
	drawSecWeapons(base, index){
		Draw.mixcol(Color.white, base.hitTime / base.hitDuration);
		att = base.type.getAttributes();
		weap = att.weapon[index];
		region = weap.getRegion();
		tra = base.rotation - 90;
		for(var i = 0; i < 2; i++){
			sign = Mathf.signs[i];
			trY = att.weaponOffsetY[index] - weap.getRecoil(base, (sign > 0));
			w = -sign * region.getWidth() * Draw.scl;
			h = region.getHeight() * Draw.scl;
			wx = base.x + Angles.trnsx(tra, weap.width * sign, trY);
			wy = base.y + Angles.trnsy(tra, weap.width * sign, trY);
			if(att.rotateWeapon[index]){
				wi = (sign + 1) / 2;
				Draw.rect(region, wx, wy, w, h, att.weaponAngles[index][wi] - 90);
			}else{
				Draw.rect(region, wx, wy, w, h, tra);
			}
		}
		Draw.mixcol();
	},
	updateWeapons(base){
		att = base.type.getAttributes();
		rotated = false;
		for(var i = 0; i < att.weaponCount; i++){
			weap = att.weapon[i];
			ammo = weap.bullet;
			weap.findTarget(base, i);
			target = weap.getTarget();
			if(
				target != null &&
				(Angles.near(base.angleTo(target), base.rotation, att.shootCone[i]) || weap.ignoreRotation) &&
				base.dst(target) < ammo.range() &&
				target.getTeam().isEnemy(base.getTeam())
			){
				if(att.rotateWeapon[i]){
					rotated = true;
					for(var j = 0; j < 2; j++){
						left = Mathf.booleans[j];
						wi = Mathf.num(left);
						wx = base.x + Angles.trnsx(base.rotation - 90, weap.width * Mathf.sign(left));
						wy = base.y + Angles.trnsy(base.rotation - 90, weap.width * Mathf.sign(left));
						att.weaponAngles[i][wi] = Mathf.clamp(
							Mathf.slerpDelta(att.weaponAngles[i][wi], Angles.angle(wx, wy, target.getX(), target.getY()), 0.1),
							base.rotation - att.shootCone[i] / 2,
							base.rotation + att.shootCone[i] / 2
						);
						Tmp.v2.trns(att.weaponAngles[i][wi], weap.length);
						weap.updateB(base, wx + Tmp.v2.x, wy + Tmp.v2.y, att.weaponAngles[i][wi], left);
					}
				}else{
					speed = ammo.speed <= 0.01 ? 9999999 : ammo.speed;
					to = Predict.intercept(base, target, speed);
					weap.updateA(base, to.x, to.y);
				}
			}
			if(rotated == false){
				for(var j = 0; j < 2; j++){
					left = Mathf.booleans[j];
					wi = Mathf.num(left);
					att.weaponAngles[i][wi] = Mathf.slerpDelta(att.weaponAngles[i][wi], base.rotation, 0.1);
				}
			}
			if(!att.rotateWeapon[i]){
				for(var j = 0; j < 2; j++){
					left = Mathf.booleans[j];
					wi = Mathf.num(left);
					att.weaponAngles[i][wi] = base.rotation;
				}
			}
		}
	},
	newWeapon(name, index, customShoot, customBullet){
		const temp = extendContent(Weapon, name, {
			getRegion(){
				return Core.atlas.find("mechanical-warfare-" + name + "-equip", Core.atlas.find("mechanical-warfare-" + name));
			},
			setTarget(target){
				this._target = target;
			},
			getTarget(){
				return this._target;
			},
			findTarget(shooter, index){
				att = shooter.type.getAttributes();
				weap = att.weapon[index];
				if(att.targetAir[index] && !att.targetGround[index]){
					predicate = boolf(unit => !unit.isDead() && unit.isFlying() && Angles.near(shooter.angleTo(unit), shooter.rotation, att.shootCone[index]));
				}else{
					predicate = boolf(unit => (!unit.isDead() && (!unit.isFlying() || att.targetAir[index]) && (unit.isFlying() || att.targetGround[index])) && Angles.near(shooter.angleTo(unit), shooter.rotation, att.shootCone[index]));
					tilePred = boolf(tile => {
						entity = tile.ent();
						return !entity.isDead() && Angles.near(shooter.angleTo(entity), shooter.rotation, att.shootCone[index]);
					});
				}
				result = null;
				cdist = 0;
				range = weap.bullet.range();
				Units.nearbyEnemies(shooter.getTeam(), shooter.getX() - range, shooter.getY() - range, range * 2, range * 2, cons(unit => {
					if(unit.isDead() || !predicate.get(unit))return;
					dst2 = Mathf.dst2(unit.x, unit.y, shooter.getX(), shooter.getY());
					if(dst2 < range * range && (result == null || dst2 < cdist)){
						result = unit;
						cdist = dst2;
					}
				}));
				if(result != null){
					weap.setTarget(result);
					return;
				}
				if(att.targetGround[index]){
					result = Units.findEnemyTile(shooter.getTeam(), shooter.getX(), shooter.getY(), range, tilePred);
					if(result != null){
						weap.setTarget(result);
						return;
					}
				}
				if(weap.getTarget() == null && shooter.target != null){
					if(shooter.target instanceof TileEntity){
						weap.setTarget(tilePred.get(shooter.target) ? shooter.target : null);
					}else if(shooter.target instanceof Unit){
						weap.setTarget(predicate.get(shooter.target) ? shooter.target : null);
					}
				}
			},
			updateA(shooter, pointerX, pointerY){
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
					if(this.alternate){
						shooter.getTimer2().reset(shooter.getShootTimer2(index, !left), this.reload / 2.0);
					}
					this.shootDirectB(shooter, mountX - shooter.getX(), mountY - shooter.getY(), angle, left);
				}
			},
			shootDirectB(shooter, offsetX, offsetY, rotation, left){
				x = shooter.getX() + offsetX;
				y = shooter.getY() + offsetY;
				baseX = shooter.getX();
				baseY = shooter.getY();
				
				weap = shooter.type.getAttributes().weapon[index];
				if(customShoot == null){
					weap.shootSound.at(x, y, Mathf.random(0.8, 1.0));
					sequenceNum = 0;
					if(weap.shotDelay > 0.01){
						Angles.shotgun(weap.shots, weap.spacing, rotation, new Floatc(){get: f => {
							Time.run(sequenceNum * weap.shotDelay, run(() => {
								weap.bulletB(shooter, x, y, f + Mathf.range(weap.inaccuracy));
							}));
							sequenceNum++;
						}});
					}else{
						Angles.shotgun(weap.shots, weap.spacing, rotation, new Floatc(){get: f => {
							weap.bulletB(shooter, x, y, f + Mathf.range(weap.inaccuracy));
						}});
					}
				}else{
					customShoot(weap, shooter, x, y, rotation, left);
				}
				ammo = weap.bullet;
				Tmp.v1.trns(rotation + 180, ammo.recoil == null ? 0 : ammo.recoil);
				shooter.velocity().add(Tmp.v1);
				Tmp.v1.trns(rotation, 3);
				Effects.effect(weap.ejectEffect, x, y, rotation * -Mathf.sign(left));
				Effects.effect(ammo.shootEffect, x + Tmp.v1.x, y + Tmp.v1.y, rotation, shooter);
				Effects.effect(ammo.smokeEffect, x + Tmp.v1.x, y + Tmp.v1.y, rotation, shooter);
				shooter.getTimer2().get(shooter.getShootTimer2(index, left), weap.reload);
			},
			bulletB(owner, x, y, angle){
				if(owner == null){return;}
				Tmp.v1.trns(angle, 3.0);
				if(customBullet == null){
					Bullet.create(this.bullet, owner, owner.getTeam(), x + Tmp.v1.x, y + Tmp.v1.y, angle, 1.0 - this.velocityRnd + Mathf.random(this.velocityRnd));
				}else{
					customBullet(owner, x, y, angle, Tmp.v1);
				}
			},
			getRecoil(shooter, left){
				return (1.0 - Mathf.clamp(shooter.getTimer2().getTime(shooter.getShootTimer2(index, left)) / this.reload)) * this.recoil;
			}
		});
		temp.setTarget(null);
		return temp;
	}
}