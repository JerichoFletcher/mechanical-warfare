// Sabre Mech Factory
const sabreFactory = extendContent(UnitFactory, "sabre-factory", {
  generateIcons: function(){
    return [
      Core.atlas.find(this.name),
      Core.atlas.find(this.name + "-top")
    ];
  },
});

// Phantasm Destroyer Factory
const phantasmFactory = extendContent(UnitFactory, "phantasm-factory", {
  generateIcons: function(){
    return [
      Core.atlas.find(this.name),
      Core.atlas.find(this.name + "-top")
    ];
  },
});

// Shadow Destroyer Factory
const shadowFactory = extendContent(UnitFactory, "shadow-factory", {
  generateIcons: function(){
    return [
      Core.atlas.find(this.name),
      Core.atlas.find(this.name + "-top")
    ];
  },
});

// Scythe Destroyer Factory
const scytheFactory = extendContent(UnitFactory, "scythe-factory", {
  generateIcons: function(){
    return [
      Core.atlas.find(this.name),
      Core.atlas.find(this.name + "-top")
    ];
  },
});
