module.exports = {
  bulletTrail: function(lifetime, startSize, endSize, col){
    const trail = newEffect(lifetime, e => {
      Draw.color(col);
      Fill.circle(e.x, e.y, e.fout() * (startSize - endSize) + endSize);
      Draw.color();
    });
    return trail;
  },
  quakeHit: function(lifetime, cColor, cThickness, cStartSize, cEndSize, c2Color, c2StartSize, c2EndSize, lColor, lThickness, lCount, lStart, lEnd, lStartSize, lEndSize){
    const hit = newEffect(lifetime, e => {
      Draw.color(cColor);
      Lines.stroke(cThickness * e.fout());
      Lines.circle(e.x, e.y, e.fin() * (cEndSize - cStartSize) + cStartSize);
      
      Draw.color(c2Color);
      Draw.alpha(e.fin() * 0.7 + 0.3);
      Fill.circle(e.x, e.y, e.fout() * (c2StartSize - c2EndSize) + c2EndSize);
      
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
