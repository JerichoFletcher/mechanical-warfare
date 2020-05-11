module.exports = {
  bulletTrail: function(lifetime, startSize, endSize, col){
    const trail = newEffect(lifetime, e => {
      Draw.color(col);
      Fill.circle(e.x, e.y, e.fout() * (startSize - endSize) + endSize);
      Draw.color();
    });
    return trail;
  },
  shockCircle(x, y, col, thickness, radius){
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
  quakeHit: function(lifetime, cColor, cThickness, cStartSize, cEndSize, c2Color, c2StartSize, c2EndSize, lColor, lThickness, lCount, lStart, lEnd, lStartSize, lEndSize){
    const hit = newEffect(lifetime, e => {
      /*Draw.color(cColor);
      Lines.stroke(cThickness * e.fout());
      Lines.circle(e.x, e.y, e.fin() * (cEndSize - cStartSize) + cStartSize);*/
      this.splashCircle(e.x, e.y, cColor, cThickness * e.fout(), Mathf.lerp(cStartSize, cEndSize, e.fin()));
      
      /*Draw.color(c2Color);
      Draw.alpha(e.fin() * 0.7 + 0.3);
      Fill.circle(e.x, e.y, e.fout() * (c2StartSize - c2EndSize) + c2EndSize);*/
      this.fillCircle(e.x, e.y, c2Color, e.fin() * 0.7 + 0.3, Mathf.lerp(c2StartSize, c2EndSize, e.fout()));
      
      Draw.color(lColor);
      Lines.stroke(e.fout() * lThickness);
      Angles.randLenVectors(e.id, lCount, e.finpow() * (lEnd - lStart) + lStart, new Floatc2(){get: (x, y) => {
        Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), e.fout() * (lEndSize - lStartSize) + lStartSize);
      }});
      Draw.color();
    });
    return hit;
  }
};
