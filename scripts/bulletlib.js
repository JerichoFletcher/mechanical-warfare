const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
module.exports = {
	bullet(type, width, height, shrink, drag, dmg, sdmg, srad, knockback, speed, lifetime, drawer, trail, u, h, i){
		temp = extend(type, {
			init(b){
				if(typeof(b) !== "undefined"){
					this.super$init();
					if(i !== null)i.get(b);
				}
			},
			draw(b){
				if(drawer !== null){
					drawer.get(b);
				}else{
					this.super$draw(b);
				}
				if(trail !== null){
					if(!Vars.state.isPaused())trail.get(b);
				}
			},
			update(b){
				this.super$update(b);
				if(u !== null)u.get(b);
			},
			hit(b, x, y){
				this.super$hit(b, b.x, b.y);
				if(h !== null)h.get(b);
			}
		});
		temp.bulletWidth = width;
		temp.bulletHeight = height;
		temp.bulletShrink = shrink;
		temp.drag = drag;
		temp.damage = dmg;
		temp.splashDamage = sdmg;
		temp.splashDamageRadius = srad;
		temp.knockback = knockback;
		temp.speed = speed;
		temp.lifetime = lifetime;
		return temp;
	},
	laserBullet(length, colors){
		temp = extend(BasicBulletType, {
			init(b){
				if(typeof(b) !== "undefined"){
					Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), this.range());
				}
			},
			range(){
				return length;
			},
			draw(b){
				f = Mathf.curve(b.fin(), 0, 0.2);
				baseLen = this.range() * f;
				width = this.bulletWidth;
				Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
				Lines.precise(true);
				for(var i = 0; i < this.colors.length; i++){
					color = this.colors[i];
					Draw.color(color);
					stroke = (width *= this.lengthFalloff) * b.fout();
					Lines.stroke(stroke);
					Lines.lineAngle(b.x, b.y, b.rot(), baseLen, CapStyle.none);
					Tmp.v1.trns(b.rot(), baseLen);
					Drawf.tri(b.x + Tmp.v1.x, b.y + Tmp.v1.y, stroke * 1.22, width * 2 + width / 2, b.rot());
					elib.fillCircleWCol(b.x, b.y, 1 * width * b.fout());
					for(var i = 0; i < 2; i++){
						sign = Mathf.signs[i];
						Drawf.tri(b.x, b.y, this.sideWidth * b.fout() * width, this.sideLength * this.compound, b.rot() + this.sideAngle * sign);
					}
					this.compound *= this.lengthFalloff;
				}
				Lines.precise(false);
				Draw.reset();
			}
		});
		temp.compound = 1;
		temp.sideWidth = 0.7;
		temp.sideLength = 29;
		temp.sideAngle = 90;
		temp.lengthFalloff = 0.5;
		temp.colors = colors;
		temp.damage = 150;
		temp.speed = 0.01;
		temp.lifetime = 16;
		temp.keepVelocity = false;
		temp.despawnEffect = Fx.none;
		temp.collides = false;
		temp.collidesAir = false;
		temp.collidesTiles = false;
		temp.collidesTeam = false;
		temp.hitTiles = false;
		temp.pierce = true;
		return temp;
	}
};
