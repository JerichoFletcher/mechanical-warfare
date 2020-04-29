const copterBase = prov(() => extend(HoverUnit, {
  draw(){
    this.super$draw();
    const offset = 1;
    const rotorSpeed = 3;
    var offx = Angles.trnsx(this.rotation, offset);
    var offy = Angles.trnsy(this.rotation, offset);
    var rotorBladeRegion = Core.atlas.isFound(this.type.rotorBladeRegion) ? this.type.rotorBladeRegion : Core.atlas.find("clear");
    var rotorTopRegion = Core.atlas.isFound(this.type.rotorTopRegion) ? this.type.rotorTopRegion : Core.atlas.find("clear");
    Draw.rect(rotorBladeRegion, this.x + offx, this.y + offy, Time.time() * rotorSpeed);
    Draw.rect(rotorTopRegion, this.x + offx, this.y + offy);
  },
}));

// Serpent
const serpentUnit = extendContent(UnitType, "serpent", {
  load(){
    this.weapon.load();
    //this.region = Core.atlas.find(this.name);
    this.region = Core.atlas.find("revenant");
    this.rotorBladeRegion = Core.atlas.find(this.name + "-rotor-blade");
    this.rotorTopRegion = Core.atlas.find(this.name + "-rotor-top");
    if(!Core.atlas.isFound(this.rotorBladeRegion) || !Core.atlas.isFound(this.rotorTopRegion)){
      print("the error, damn you donkey!");
    }else{
      print("gud boi sprite has been found");
    }
  },
  generateIcons: function(){
    return [Core.atlas.find("revenant")];
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
