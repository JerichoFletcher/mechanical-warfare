const copterBase = prov(() => extend(HoverUnit, {
  draw(){
    this.super$draw();
    var offx = Angles.trnsx(this.rotation, this.type.rotorOffset());
    var offy = Angles.trnsy(this.rotation, this.type.rotorOffset());
    var rotorBladeRegion = Core.atlas.isFound(this.type.rotorBladeRegion()) ?
      this.type.rotorBladeRegion() : Core.atlas.find(modName + "-rotor-blade");
    var rotorTopRegion = Core.atlas.isFound(this.type.rotorTopRegion()) ?
      this.type.rotorTopRegion() : Core.atlas.find(modName + "-rotor-top");
    if(Core.atlas.isFound(rotorBladeRegion) && Core.atlas.isFound(rotorTopRegion)){
      var width = rotorBladeRegion.getWidth() * this.type.rotorScale();
      var height = rotorBladeRegion.getHeight() * this.type.rotorScale();
      Draw.mixcol(Color.white, this.hitTime / this.hitDuration);
      Draw.rect(rotorBladeRegion, this.x + offx, this.y + offy, Time.time() * this.type.rotorSpeed());
      Draw.rect(rotorBladeRegion, this.x + offx, this.y + offy, 90 + Time.time() * this.type.rotorSpeed());
      Draw.rect(rotorTopRegion, this.x + offx, this.y + offy);
      Draw.mixcol();
    }
  },
}));

// Serpent
const serpentUnit = extendContent(UnitType, "serpent", {
  load(){
    this.weapon.load();
    this.region = Core.atlas.find("revenant");
    //this.bladeRegion = Core.atlas.find(this.name + "-rotor-blade");
    //this.topRegion = Core.atlas.find(this.name + "-rotor-top");
  },
  rotorBladeRegion: function(){
    return typeof(this.bladeRegion) !== "undefined" ? this.bladeRegion : Core.atlas.find("error");
  },
  rotorTopRegion: function(){
    return typeof(this.topRegion) !== "undefined" ? this.topRegion : Core.atlas.find("error");
  },
  rotorScale: function(){
    return 1.4;
  },
  rotorSpeed: function(){
    return 15;
  },
  rotorOffset: function(){
    return 1;
  },
});
serpentUnit.create(copterBase);

const serpentFactory = extendContent(UnitFactory, "serpent-factory", {
  load(){
    this.region = Core.atlas.find(modName + "-phantasm-factory");
    this.topRegion = Core.atlas.find(modName + "-phantasm-factory-top");
  }
});
serpentFactory.unitType = serpentUnit;
