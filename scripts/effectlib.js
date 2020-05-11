module.exports = {
  outlineCircle(x, y, col, thickness, radius){
    Draw.color(col);
    Lines.stroke(thickness);
    Lines.circle(x, y, radius);
    Draw.color();
    Lines.stroke(1);
  },
  fillCircle(x, y, col, alpha, radius){
    Draw.color(col);
    Draw.alpha(alpha);
    Fill.circle(x, y, radius);
    Draw.color();
  },
  splashLines(cx, cy, col, thickness, distance, length, count, seed){
    Draw.color(col);
    Lines.stroke(thickness);
    Angles.randLenVectors(seed, count, distance, new Floatc2(){get: (x, y) => {
      Lines.lineAngle(cx + x, cy + u, Mathf.angle(offx, offy), length);
    }});
    Draw.color();
    Lines.stroke(1);
  },
};
