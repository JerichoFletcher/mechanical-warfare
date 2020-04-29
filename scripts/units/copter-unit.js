const copterBase = prov(() => extend(HoverUnit, {
  draw(){
    this.super$draw();
    const offset = 1;
    const rotorSpeed = 3;
    var offx = Angles.trnsx(this.rotation, offset);
    var offy = Angles.trnsy(this.rotation, offset);
    var rotorBladeRegion = this.type.rotorBladeRegion != Core.atlas.find("error") ? this.type.rotorBladeRegion : Core.atlas.find("mechanical-warfare-rotor-blade");
    var rotorTopRegion = this.type.rotorTopRegion != Core.atlas.find("error") ? this.type.rotorTopRegion : Core.atlas.find("mechanical-warfare-rotor-top");
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
    this.rotorBladeRegion = Core.atlas.find("mechanical-warfare-rotor-blade");
    this.rotorTopRegion = Core.atlas.find("mechanical-warfare-rotor-top");
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
