const copterBase = prov(() => extend(HoverUnit, {
  draw(){
    Draw.mixcol(Color.white, this.hitTime / this.hitDuration);
    Draw.rect(this.type.region, this.x, this.y, this.rotation - 90);
    this.drawWeapons();
    this.drawRotor();
    Draw.mixcol();
  },
  drawWeapons(){
    for(var i = 0; i <= 1; i++){
      var sign = Mathf.signs[i];
      var tra = this.rotation - 90;
      var trY = -this.type.weapon.getRecoil(this, (sign > 0)) + this.type.weaponOffsetY;
      var w = -sign * this.type.weapon.region.getWidth() * Draw.scl;
      var h = this.type.weapon.region.getHeight() * Draw.scl;
      Draw.rect(this.type.weapon.region,
        this.x + Angles.trnsx(tra, this.getWeapon().width * sign, trY),
        this.y + Angles.trnsy(tra, this.getWeapon().width * sign, trY),
        w, h, tra
      );
    }
  },
  drawRotor(){
    var offx = Angles.trnsx(this.rotation, this.type.rotorOffset());
    var offy = Angles.trnsy(this.rotation, this.type.rotorOffset());
    var rotorBladeRegion = Core.atlas.isFound(this.type.rotorBladeRegion()) ?
      this.type.rotorBladeRegion() : Core.atlas.find(modName + "-rotor-blade");
    var rotorTopRegion = Core.atlas.isFound(this.type.rotorTopRegion()) ?
      this.type.rotorTopRegion() : Core.atlas.find(modName + "-rotor-top");
    if(Core.atlas.isFound(rotorBladeRegion) && Core.atlas.isFound(rotorTopRegion)){
      var width = rotorBladeRegion.getWidth() * this.type.rotorScale();
      var height = rotorBladeRegion.getHeight() * this.type.rotorScale();
      Draw.rect(rotorBladeRegion, this.x + offx, this.y + offy, Time.time() * this.type.rotorSpeed());
      Draw.rect(rotorBladeRegion, this.x + offx, this.y + offy, 90 + Time.time() * this.type.rotorSpeed());
      Draw.rect(rotorTopRegion, this.x + offx, this.y + offy);
    }
  },
}));

// Serpent
const serpentUnit = extendContent(UnitType, "serpent", {
  load(){
    this.weapon.load();
    this.region = Core.atlas.find(this.name);
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
    return 3;
  },
  isTwinBlade: function(){
    return false;
  },
});
serpentUnit.create(copterBase);

const serpentFactory = extendContent(UnitFactory, "serpent-factory", {
  load(){
    this.region = Core.atlas.find(this.name);
    this.topRegion = Core.atlas.find("clear");
  },
  generateIcons: function(){
    return [this.region];
  }
});
serpentFactory.unitType = serpentUnit;
