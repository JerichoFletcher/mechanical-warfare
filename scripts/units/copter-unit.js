const copterBase = prov(() => extend(HoverUnit, {
  draw(){
    this.super$draw();
    var offset = 1;
    var offx = Angles.trnsx(this.rotation, offset);
    var offy = Angles.trnsy(this.rotation, offset);
    Draw.rect(this.type.rotorBladeRegion, this.x + offx, this.y + offy, Time.time());
    Draw.rect(this.type.rotorTopRegion, this.x + offx, this.y + offy);
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
});
serpentUnit.create(copterBase);

const serpentFactory = extendContent(UnitFactory, "serpent-factory", {
  load(){
    this.region = Core.atlas.find("revenant-factory");
    this.topRegion = Core.atlas.find("revenant-factory-top");
  }
});
serpentFactory.unitType = serpentUnit;
