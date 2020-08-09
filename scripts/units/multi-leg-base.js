matlib = require("mechanical-warfare/mathlib");
legOffset = new Vec2();
v1 = new Vec2();
v2 = new Vec2();
v3 = new Vec2();
v4 = new Vec2();
v5 = new Vec2();
v6 = new Vec2();
module.exports = {
	drawLegs(base){
		if(!(base instanceof(GroundUnit)))return;
		att = base.type.getAttributes();
		shadowColor = Color.toFloatBits(0, 0, 0, 0.22);
		shadowTX = -12;
		shadowTY = -13;
		ft = Mathf.sin(base.walkTime, 3, 3);
		legOffset.trns(base.baseRotation, 0, Mathf.lerpDelta(ft * 0.18 * att.sway, 0, att.elevation));
		legs = base.getLegs();
		region = base.type.getReg();
		ssize = region["foot"].getWidth() * Draw.scl * 1.5;
		rotation = base.baseRotation;
		for(var i = 0; i < legs.length; i++){
			leg = legs[i];
			angle = base.legAngle(base.rotation, i);
			flip = i >= legs.length / 2;
			flips = Mathf.sign(flip);
			position = legOffset.trns(angle, att.legBaseOffset).add(base.x, base.y);
			if(leg.moving && att.visualElevation > 0){
				scl = att.visualElevation;
				elev = matlib.slope(1 - leg.stage) * scl;
				Draw.color(shadowColor);
				Draw.rect(region["foot"], leg.base.x + shadowTX * elev, leg.base.y + shadowTY * elev, position.angleTo(leg.base));
				Draw.color();
			}
			Draw.rect(region["foot"], leg.base.x, leg.base.y, position.angleTo(leg.base));
			Lines.stroke(region["leg"].getHeight() * Draw.scl * flips);
			Lines.line(region["leg"], position.x, position.y, leg.joint.x, leg.joint.y, CapStyle.none, 0);
			Lines.stroke(region["legBase"].getHeight() * Draw.scl * flips);
			Lines.line(region["legBase"], leg.joint.x, leg.joint.y, leg.base.x, leg.base.y, CapStyle.none, 0);
			Draw.rect(region["joint"], leg.joint.x, leg.joint.y);
			Draw.rect(region["baseJoint"], leg.joint.x, leg.joint.y);
		}
		Draw.reset();
	},
	updateLegs(base){
		if(!(base instanceof(GroundUnit)))return;
		att = base.type.getAttributes();
		rot = base.baseRotation;
		legLength = att.legLength;
		legs = base.getLegs();
		moveSpeed = att.legSpeed;
		div = Math.max(legs.length / att.legGroupSize, 2);
		base.setMoveSpace(legLength / 1.6 / div / 2 * att.legMoveSpace);
		base.setTotalLength(base.getTotalLength() + Mathf.dst(base.getDelta().x, base.getDelta().y));
		trns = base.getMoveSpace() * 0.85 * att.legTrns;
		moveOffset = v4.trns(rot, trns);
		moving = base.isMoving();
		for(var i = 0; i < legs.length; i++){
			dstRot = base.legAngle(rot, i);
			baseOffset = v5.trns(dstRot, att.legBaseOffset).add(base.x, base.y);
			l = legs[i];
			l.joint.sub(baseOffset).limit(att.maxStretch * legLength / 2).add(baseOffset);
			l.base.sub(baseOffset).limit(att.maxStretch * legLength).add(baseOffset);
			stageF = (base.getTotalLength() + i * att.legPairOffset) / base.getMoveSpace();
			stage = Math.floor(stageF);
			group = stage % div;
			move = (i % div == group);
			side = (i < legs.length / 2);
			backLeg = (Math.abs(i + 0.5 - legs.length / 2) <= 0.501);
			if(backLeg && att.flipBackLegs)side = !side;
			l.moving = move;
			l.stage = moving ? (stageF % 1.0) : Mathf.lerpDelta(l.stage, 0, 0.1);
			if(l.group != group){
				if(!move && i % div == l.group){
					tmp = Vars.world.tileWorld(l.base.x, l.base.y);
					floor3 = (tmp == null ? Blocks.air.asFloor() : tmp.floor());
					if(floor3.isLiquid){
						Effects.effect(floor3.walkEffect, floor3.color, l.base.x, l.base.y);
					}else{
						Effects.effect(Fx.unitLand, floor3.color, l.base.x, l.base.y);
					}
					if(att.landShake > 0){
						Effect.shake(att.landShake, att.landShake, l.base.x, l.base.y);
					}
				}
				l.group = group;
			}
			legDest = v1.trns(dstRot, legLength * att.legLengthScl).add(baseOffset).add(moveOffset);
			jointDest = v2;
			matlib.IKsolveSide(legLength / 2, legLength / 2, v6.set(l.base).sub(baseOffset), side, jointDest);
			jointDest.add(baseOffset);
			jointDest.lerp(v6.set(baseOffset).lerp(l.base, 0.5), 1 - att.kinematicScl);
			if(move){
				moveFract = stageF % 1.0;
				l.base.lerpDelta(legDest, moveFract);
				l.joint.lerpDelta(jointDest, moveFract / 2);
			}
			l.joint.lerpDelta(jointDest, moveSpeed / 4);
		}
	},
	newLeg(){
		leg = {
			joint: new Vec2(),
			base: new Vec2(),
			group: -1,
			moving: false,
			stage: 0.0
		}
		return leg;
	}
}