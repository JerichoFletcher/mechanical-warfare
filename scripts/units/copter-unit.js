const copterLib = require("units/copter-base");
importPackage(Packages.mindustry.net);
importPackage(Packages.mindustry.io);
tempBuffer = java.nio.ByteBuffer.allocate(4096);

// Serpent
const serpentBullet = extend(BasicBulletType, {});
serpentBullet.bulletWidth = 6;
serpentBullet.bulletHeight = 9;
serpentBullet.speed = 9;
serpentBullet.lifetime = 14;
serpentBullet.damage = 8;
serpentBullet.shootEffect = Fx.shootSmall;
serpentBullet.smokeEffect = Fx.shootSmallSmoke;
serpentBullet.hitEffect = Fx.hitBulletSmall;

const serpentMissile = extend(MissileBulletType, {});
serpentMissile.bulletWidth = 9;
serpentMissile.bulletHeight = 12;
serpentMissile.speed = 2.8;
serpentMissile.lifetime = 50;
serpentMissile.damage = 24;
serpentMissile.drag = -0.01;
serpentMissile.homingPower = 0.075;
serpentMissile.homingRange = 120;
serpentMissile.shootEffect = Fx.shootBig;
serpentMissile.smokeEffect = Fx.shootBigSmoke;
serpentMissile.hitEffect = Fx.blastExplosion;

const serpentWeapon = extendContent(Weapon, "serpent-gun", {
  load(){
    this.region = Core.atlas.find("mechanical-warfare-serpent-gun-equip");
  }
});
serpentWeapon.width = 6.5;
serpentWeapon.length = 5;
serpentWeapon.reload = 12;
serpentWeapon.alternate = true;
serpentWeapon.recoil = 1.5;
serpentWeapon.shake = 0;
serpentWeapon.inaccuracy = 3;
serpentWeapon.ejectEffect = Fx.shellEjectSmall;
serpentWeapon.shootSound = Sounds.shootSnap;
serpentWeapon.bullet = serpentBullet;

const serpentUnit = extendContent(UnitType, "serpent", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
	},
	getAttributes(){
		att = {
			weaponCount: 1,
			weapon: [],
			rotorCount: 1,
			rotor: [],
		}
		att.rotor[0] = {
			offset: 5,
			width: 0,
			speed: 39,
			scale: 1.4,
			bladeCount: 4,
			bladeRegion: Core.atlas.find("mechanical-warfare-rotor-blade"),
			topRegion: Core.atlas.find("mechanical-warfare-rotor-top")
		}
		att.weapon[0] = extendContent(Weapon, "serpent-launcher", {
			getRegion(){
				return Core.atlas.find("mechanical-warfare-serpent-launcher-equip");
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
				if(shooter.getTimer2().get(shooter.getShootTimer2(left), this.reload)){
					shooter.getTimer2().reset(shooter.getShootTimer2(!left), this.reload / 2.0);
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
				shooter.getTimer2().get(shooter.getShootTimer2(left), weap.reload);
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
				return (1.0 - Mathf.clamp(shooter.getTimer2().getTime(shooter.getShootTimer2(left)) / this.reload)) * this.recoil;
			}
		});
		att.weapon[0].width = 4.25;
		att.weapon[0].length = 1;
		att.weapon[0].recoil = 1.5;
		att.weapon[0].alternate = true;
		att.weapon[0].inaccuracy = 3;
		att.weapon[0].reload = 80;
		att.weapon[0].shootCone = 45;
		att.weapon[0].ejectEffect = Fx.shellEjectBig;
		att.weapon[0].shootSound = Sounds.missile;
		att.weapon[0].bullet = serpentMissile;
		return att;
	}
});
serpentUnit.weapon = serpentWeapon;
serpentUnit.create(prov(() => {
	const base = extend(HoverUnit, {
		update(){
			this.super$update();
			if(this.target !== null){
				if(this.target.getTeam().isEnemy(this.getTeam())){
					copterLib.updateWeapons(this);
				}
			}
		},
		draw(){
			this.drawWeapons();
			copterLib.drawBase(this);
		},
		drawWeapons(){
			copterLib.drawWeapons(this);
		},
		drawStats(){
			this.super$drawStats();
			copterLib.drawRotor(this);
		},
		drawEngine(){},
		getTimer2(){
			return this._timer;
		},
		setTimer2(val){
			this._timer = val;
		},
		getShootTimer2(left){
			return left ? this.getShootTimers2().timerShootLeft : this.getShootTimers2().timerShootRight;
		},
		getShootTimers2(){
			return this._timerShoot;
		},
		setShootTimers2(obj){
			this._timerShoot = obj;
		}
	});
	base.setTimer2(new Interval(2));
	base.setShootTimers2({
		timerShootLeft: 0,
		timerShootRight: 1
	});
	return base;
}));

const serpentFactory = extendContent(UnitFactory, "serpent-factory", {
	load(){
		this.region = Core.atlas.find(this.name);
		this.topRegion = Core.atlas.find("clear");
	},
	generateIcons: function(){
		return [Core.atlas.find(this.name)];
	}
});
serpentFactory.unitType = serpentUnit;

/*// Viper
const viperBullet = extend(BasicBulletType, {});
viperBullet.bulletWidth = 9;
viperBullet.bulletHeight = 14;
viperBullet.speed = 8;
viperBullet.lifetime = 16;
viperBullet.damage = 14;
viperBullet.shootEffect = Fx.shootBig;
viperBullet.smokeEffect = Fx.shootBigSmoke;
viperBullet.hitEffect = Fx.hitBulletBig;

const viperGun = extendContent(Weapon, "viper-gun", {
	load(){
		this.region = Core.atlas.find("clear");
	}
});
viperGun.reload = 10;
viperGun.alternate = true;
viperGun.recoil = 1.5;
viperGun.shake = 0;
viperGun.inaccuracy = 3;
viperGun.ejectEffect = Fx.shellEjectSmall;
viperGun.shootSound = Sounds.shootSBig;
viperGun.bullet = viperBullet;

const viper = extendContent(UnitType, "viper", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
	},
	getAttributes(){
	}
});
viper.weapon = viperGun;*/
