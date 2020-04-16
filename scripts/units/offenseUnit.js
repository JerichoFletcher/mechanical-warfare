// CopterUnit
require("units/copterUnit")

// Serpent
const serpent = extendContent(UnitType, "serpent", {
  create(mainConstructor){
    const cons = prov(new CopterUnit);
    this.constructor = cons;
    this.description = Core.bundle.getOrNull("unit." + name + ".description");
    this.typeID = new TypeID(name, cons);
  },
  load(){
    this.super$load();
    this.rotorBladeRegion = Core.atlas.find(this.name + "-rotor-blade");
    this.rotorTopRegion = Core.atlas.find(this.name + "-rotor-top");
    this.rotorSpeed = 9;
    this.rotorOffset = 4;
  },
});
