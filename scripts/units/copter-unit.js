const copterBase = prov(() => extend(HoverUnit, {
  draw(){
    this.super$draw();
    const offset = 1;
    const rotorSpeed = 3;
    var offx = Angles.trnsx(this.rotation, offset);
    var offy = Angles.trnsy(this.rotation, offset);
    var rotorBladeRegion = Core.atlas.find(this.type.name + "-rotor-blade");
    var rotorTopRegion = Core.atlas.find(this.type.name + "-rotor-top");
    if(Core.atlas.isFound(rotorBladeRegion) && Core.atlas.isFound(rotorTopRegion)){
      var width = rotorBladeRegion.getWidth() * this.type.rotorScale();
      var height = rotorBladeRegion.getHeight() * this.type.rotorScale();
      Draw.rect(rotorBladeRegion, this.x + offx, this.y + offy, Time.time() * rotorSpeed);
      Draw.rect(rotorBladeRegion, this.x + offx, this.y + offy, Time.time() * -rotorSpeed);
      Draw.rect(rotorTopRegion, this.x + offx, this.y + offy);
    }
  },
}));

// Serpent
const serpentUnit = extendContent(UnitType, "serpent", {
  load(){
    this.weapon.load();
    this.region = Core.atlas.find("revenant");
  },
  rotorScale: function(){
    return 1.4;
  },
});
serpentUnit.create(copterBase);

const serpentFactory = extendContent(UnitFactory, "serpent-factory", {
  load(){
    this.region = Core.atlas.find("revenant-factory");
    this.topRegion = Core.atlas.find("revenant-factory-top");
  }
});
serpentFactory.unitType = serpentUnit;
