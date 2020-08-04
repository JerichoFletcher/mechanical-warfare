// Shortcuts for common draw methods used in effects.
// Lib by JerichoFletcher
module.exports = {
  outlineCircle(x, y, col, thickness, radius){
    Draw.color(col);
    Lines.stroke(thickness);
    Lines.circle(x, y, radius);
    Draw.color();
    Lines.stroke(1);
  },
  outlineCircleWCol(x, y, thickness, radius){
    Lines.stroke(thickness);
    Lines.circle(x, y, radius);
    Lines.stroke(1);
	},
  fillCircle(x, y, col, alpha, radius){
    Draw.color(col);
    Draw.alpha(alpha);
    Fill.circle(x, y, radius);
    Draw.color();
  },
  fillCircleWCol(x, y, radius){
    Fill.circle(x, y, radius);
  },
  fillPolygon(x, y, col, alpha, sides, size, rot){
	Draw.color(col);
	Draw.alpha(alpha);
	Fill.poly(x, y, sides, size, rot);
	Draw.color();
  },
  fillPolygonWCol(x, y, sides, size, rot){
	Fill.poly(x, y, sides, size, rot);
  },
  splashLines(x, y, col, thickness, distance, length, count, seed){
    Draw.color(col);
    Lines.stroke(thickness);
    Angles.randLenVectors(seed, count, distance, new Floatc2(){get: (a, b) => {
      Lines.lineAngle(x + a, y + b, Mathf.angle(a, b), length);
    }});
    Draw.color();
    Lines.stroke(1);
  },
  splashLinesWCol(x, y, thickness, distance, length, count, seed){
    Lines.stroke(thickness);
    Angles.randLenVectors(seed, count, distance, new Floatc2(){get: (a, b) => {
      Lines.lineAngle(x + a, y + b, Mathf.angle(a, b), length);
    }});
    Lines.stroke(1);
  },
  splashCircles(x, y, col, alpha, radius, distance, count, seed){
    Angles.randLenVectors(seed, count, distance, new Floatc2(){get: (a, b) => {
      this.fillCircle(x + a, y + b, col, alpha, radius);
    }});
  },
  splashCirclesWCol(x, y, radius, distance, count, seed){
    Angles.randLenVectors(seed, count, distance, new Floatc2(){get: (a, b) => {
      this.fillCircle(x + a, y + b, radius);
    }});
  },
};
