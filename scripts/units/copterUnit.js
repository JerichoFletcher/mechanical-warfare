const CopterUnit = extend(HoverUnit, {
  draw(){
    Draw.mixcol(Color.white, this.hitTime / this.hitDuration);
    Draw.rect(this.type.region, this.x, this.y, this.rotation - 90);
    this.drawWeapons();
    // draw rotor
    for (const i of Mathf.signs) {
      Draw.rect(this.type.rotorBladeRegion, this.x, this.y - this.type.rotorOffset * Vars.tilesize, Time.time() * this.type.rotorSpeed * i);
    }
    Draw.rect(this.type.rotorTopRegion, this.x, this.y - this.type.rotorOffset * Vars.tilesize);
    // end draw rotor
    Draw.mixcol();
  },
});
