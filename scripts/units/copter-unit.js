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
