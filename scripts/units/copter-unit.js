const copterBase = prov(() => extend(HoverUnit, {
  draw(){
    this.super$draw();
    var offset = this.type.rotorOffset;
    var offx = Angles.trnsx(this.rotation, offset);
    var offy = Angles.trnsy(this.rotation, offset);
    var rotorWidth = this.type.rotorBladeRegion.getWidth() * this.type.rotorScale;
    var rotorHeight = this.type.rotorBladeRegion.getHeight() * this.type.rotorScale;
    Draw.rect(this.type.rotorBladeRegion, this.x + offx, this.y + offy, rotorWidth, rotorHeight, Time.time() * this.type.rotorSpeed);
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
serpentUnit.rotorOffset = 1;
serpentUnit.rotorScale = 1;
serpentUnit.rotorSpeed = 1;

const serpentFactory = extendContent(UnitFactory, "serpent-factory", {
  load(){
    this.region = Core.atlas.find("revenant-factory");
    this.topRegion = Core.atlas.find("revenant-factory-top");
  }
});
serpentFactory.unitType = serpentUnit;
