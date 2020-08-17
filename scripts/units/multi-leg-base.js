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
			Draw.color(0, 0, 0, 0.4);
			Draw.rect(Core.atlas.find("circle-shadow"), leg._get("base").x, leg._get("base").y, ssize, ssize);
			if(leg._get("moving") && att.visualElevation > 0){
				scl = att.visualElevation;
				elev = matlib.slope(1 - leg._get("stage")) * scl;
				Draw.color(shadowColor);
				Draw.rect(region["foot"], leg._get("base").x + shadowTX * elev, leg._get("base").y + shadowTY * elev, position.angleTo(leg._get("base")));
			}
			Draw.color();
			Draw.rect(region["foot"], leg._get("base").x, leg._get("base").y, position.angleTo(leg._get("base")));
			Lines.stroke(region["leg"].getHeight() * Draw.scl * flips);
			Lines.line(region["leg"], position.x, position.y, leg._get("joint").x, leg._get("joint").y, CapStyle.none, 0);
			Lines.stroke(region["legBase"].getHeight() * Draw.scl * flips);
			Lines.line(region["legBase"], leg._get("joint").x, leg._get("joint").y, leg._get("base").x, leg._get("base").y, CapStyle.none, 0);
			Draw.rect(region["joint"], leg._get("joint").x, leg._get("joint").y);
			Draw.rect(region["baseJoint"], position.x, position.y, rotation);
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
			l._set("joint", l._get("joint").sub(baseOffset).limit(att.maxStretch * legLength / 2).add(baseOffset));
			l._set("base", l._get("base").sub(baseOffset).limit(att.maxStretch * legLength).add(baseOffset));
			stageF = (base.getTotalLength() + i * att.legPairOffset) / base.getMoveSpace();
			stage = Math.floor(stageF);
			group = stage % div;
			move = (i % div == group);
			side = (i < legs.length / 2);
			backLeg = (Math.abs(i + 0.5 - legs.length / 2) <= 0.501);
			if(backLeg && att.flipBackLegs)side = !side;
			l._set("moving", move);
			l._set("stage", moving ? (1 - (stageF - stage)) : Mathf.lerpDelta(l._get("stage"), 0, 0.1));
			if(l._get("group") != group){
				if(!move && i % div == l._get("group")){
					tmp = Vars.world.tileWorld(l._get("base").x, l._get("base").y);
					floor3 = (tmp == null ? Blocks.air.asFloor() : tmp.floor());
					if(floor3.isLiquid){
						Effects.effect(floor3.walkEffect, floor3.color, l._get("base").x, l._get("base").y);
					}else{
						Effects.effect(Fx.unitLand, floor3.color, l._get("base").x, l._get("base").y);
					}
					if(att.landShake > 0){
						Effects.shake(att.landShake, att.landShake, l._get("base").x, l._get("base").y);
					}
				}
				l._set("group", group);
			}
			legDest = v1.trns(dstRot, legLength * att.legLengthScl).add(baseOffset).add(moveOffset);
			jointDest = v2;
			matlib.IKsolveSide(legLength / 2, legLength / 2, v6.set(l._get("base")).sub(baseOffset), side, jointDest);
			jointDest.add(baseOffset);
			jointDest.lerp(v6.set(baseOffset).lerp(l._get("base"), 0.5), 1 - att.kinematicScl);
			if(move){
				moveFract = stageF % 1;
				l._set("base", l._get("base").lerpDelta(legDest, moveFract));
				l._set("joint", l._get("joint").lerpDelta(jointDest, moveFract / 2));
			}
			l._set("joint", l._get("joint").lerpDelta(jointDest, moveFract / 4));
		}
	},
	newLeg(){
		leg = {
			_set(key, value){
				this[key] = value;
			},
			_get(key){
				return this[key];
			}
		}
		leg._set("joint", new Vec2());
		leg._set("base", new Vec2());
		leg._set("group", Math.floor(-1));
		leg._set("moving", false);
		leg._set("stage", 0);
		return new Object(leg);
	}
}