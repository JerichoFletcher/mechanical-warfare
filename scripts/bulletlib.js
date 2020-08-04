const elib = require("mechanical-warfare/effectlib");
const plib = require("mechanical-warfare/plib");
module.exports = {
	bullet(type, width, height, shrink, drag, dmg, sdmg, srad, knockback, speed, lifetime, drawer, trail, update, hit){
		temp = extend(type, {
			draw(b){
				if(drawer !== null){
					drawer.get(b);
				}else{
					this.super$draw(b);
				}
				if(trail !== null){
					if(!Vars.state.isPaused()){
						trail.get(b);
					}
				}
			},
			update(b){
				this.super$update(b);
				if(update !== null){
					update.get(b);
				}
			},
			hit(b, x, y){
				this.super$hit(b, b.x, b.y);
				if(hit !== null){
					hit.get(b);
				}
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
	}
};
