// CopterUnit
const CopterUnit = extend(HoverUnit, {
  draw(){
    Draw.mixcol(Color.white, this.hitTime / this.hitDuration);
    Draw.rect(this.type.region, this.x, this.y, this.rotation - 90);
    this.drawWeapons();
    // draw rotor
    Draw.rect(this.type.rotorBladeRegion, this.x, this.y - this.type.rotorOffset * Vars.tilesize, Time.time() * this.type.rotorSpeed);
    Draw.rect(this.type.rotorBladeRegion, this.x, this.y - this.type.rotorOffset * Vars.tilesize, Time.time() * this.type.rotorSpeed * -1);
    Draw.rect(this.type.rotorTopRegion, this.x, this.y - this.type.rotorOffset * Vars.tilesize);
    // end draw rotor
    Draw.mixcol();
  },
});

// Serpent
const serpent = extendContent(UnitType, "serpent", {
  load(){
    this.super$load();
    this.rotorBladeRegion = Core.atlas.find(this.name + "-rotor-blade");
    this.rotorTopRegion = Core.atlas.find(this.name + "-rotor-top");
    this.rotorSpeed = 9;
    this.rotorOffset = 4;
  },
});
