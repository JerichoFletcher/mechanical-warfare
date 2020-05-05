module.exports = {
  drawBase(base){
    Draw.mixcol(Color.white, base.hitTime / base.hitDuration);
    Draw.rect(base.type.region, base.x, base.y, base.rotation - 90);
    base.drawWeapons();
    base.drawRotor();
    Draw.mixcol();
  },
  drawRotor(base){
    var bladeRegion = Core.atlas.isFound(base.type.rotorBladeRegion()) ?
      base.type.rotorBladeRegion() : Core.atlas.find(modName + "-rotor-blade");
    var topRegion = Core.atlas.isFound(base.type.rotorTopRegion()) ?
      base.type.rotorTopRegion() : Core.atlas.find(modName + "-rotor-top");
    var offx = Angles.trnsx(base.rotation, base.type.rotorOffset(), base.type.rotorWidth());
    var offy = Angles.trnsy(base.rotation, base.type.rotorOffset(), base.type.rotorWidth());
    var w = bladeRegion.getWidth() * base.type.rotorScale() * Draw.scl;
    var h = bladeRegion.getHeight() * base.type.rotorScale() * Draw.scl;
    var angle = Time.time() * base.type.rotorSpeed() % 360;
    var angle2 = base.type.alternateRotor() ? 360 - (angle % 360) : 90 + angle;
    if(base.type.isTwinBlade()){
      for(var i = 0; i < 2; i++){
        var sign = Mathf.signs[i];
        var twinOffX = offx * sign;
        var twinOffY = offy * sign;
        Draw.rect(bladeRegion, base.x + twinOffX, base.y + twinOffY, w, h, angle);
        Draw.rect(bladeRegion, base.x + twinOffX, base.y + twinOffY, w, h, angle2);
        Draw.rect(topRegion, base.x + twinOffX, base.y + twinOffY);
      }
    }else{
      Draw.rect(bladeRegion, base.x + offx, base.y + offy, w, h, angle);
      Draw.rect(bladeRegion, base.x + offx, base.y + offy, w, h, angle2);
      Draw.rect(topRegion, base.x + offx, base.y + offy);
    }
  },
  drawWeapons(base){
    for(var i = 0; i <= 1; i++){
      var sign = Mathf.signs[i];
      var angle = base.rotation - 90;
      var trY = base.type.weaponOffsetY - base.type.weapon.getRecoil(base, (sign > 0));
      var w = -sign * base.type.weapon.region.getWidth() * Draw.scl;
      var h = base.type.weapon.region.getHeight() * Draw.scl;
      Draw.rect(base.type.weaponRegion(), 
        base.x + Angles.trnsx(angle, base.getWeapon().width * sign, trY),
        base.y + Angles.trnsy(angle, base.getWeapon().width * sign, trY),
        w, h, angle
      );
    }
    //print(Core.atlas.isFound(Core.atlas.find(base.type.weapon.name + "-equip")));
  },
};
