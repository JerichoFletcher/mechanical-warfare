importPackage(Packages.arc.util.pooling);
module.exports = {
	newTrail(len){
		trail = {
			length: len,
			points: new Packages.arc.struct.Array(len),
			lastX: -1,
			lastY: -1,
			update(x, y){
				if(this.points.size > this.length){
					Pools.free(this.points.first());
					this.points.remove(0);
				}
				angle = -Angles.angle(x, y, this.lastX, this.lastY);
				this.points.add(Pools.obtain(Vec3, prov(() => new Vec3)).set(x, y, angle * Mathf.degRad));
				this.lastX = x;
				this.lastY = y;
			},
			draw(color, width){
				Draw.color(color);
				for(var i = 0; i < this.points.size - 1; i++){
					if(!(this.points.get(i) instanceof Vec3))return;
					c = this.points.get(i);
					n = this.points.get(i + 1);
					size = width * 1 / this.length;
					cx = Mathf.sin(c.z) * i * size;
					cy = Mathf.cos(c.z) * i * size;
					nx = Mathf.sin(n.z) * (i + 1) * size;
					ny = Mathf.cos(n.z) * (i + 1) * size;
					Fill.quad(c.x - cx, c.y - cy, c.x + cx, c.y + cy, n.x + nx, n.y + ny, n.x - nx, n.y - ny);
				}
				Draw.reset();
			}
		}
		return trail;
	}
}
