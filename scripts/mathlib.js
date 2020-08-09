// Additional math functions and algorithms.
// Lib by JerichoFletcher
mat1 = [new Vec2(), new Vec2()];
mat2 = [new Vec2(), new Vec2()];
temp = new Vec2();
temp2 = new Vec2();
at1 = new Vec2();
module.exports = {
	lerpThreshold: function(x1, y1, x2, y2, amount){
		if(x1 == x2){
			return amount < x1 ? y1 : y2;
		}
		return Mathf.clamp((amount - x1) * (y2 - y1) / (x2 - x1) + y1, y1, y2);
	},
	slope(fin){
		return 1 - Math.abs(fin - 0.5) * 2;
	},
	IKsolveSide(lengthA, lengthB, end, side, result){
		at1.set(end).rotate(side ? 1 : -1).setLength(lengthA + lengthB).add(end.x / 2, end.y / 2);
		return this.IKsolveVec(lengthA, lengthB, end, at1, result);
	},
	IKsolveVec(lengthA, lengthB, end, attractor, result){
		axis = mat2[0].set(end).nor();
		mat2[1].set(attractor).sub(temp2.set(axis).scl(attractor.dot(axis))).nor();
		mat1[0].set(mat2[0].x, mat2[1].x);
		mat1[1].set(mat2[0].y, mat2[1].y);
		result.set(mat2[0].dot(end), mat2[1].dot(end));
		len = result.len();
		dist = Math.max(0, Math.min(lengthA, (len + (lengthA * lengthA - lengthB * lengthB) / len) / 2));
		src = temp.set(dist, Mathf.sqrt(lengthA * lengthA - dist * dist));
		result.set(mat1[0].dot(src), mat1[1].dot(src));
		return (dist > 0 && dist < lengthA);
	}
}
