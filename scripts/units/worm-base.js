const flareEffect = newEffect(18, e => {
	Draw.color(Pal.lightFlame, Pal.darkFlame, e.fin());
	Lines.stroke(e.fout());
	Angles.randLenVectors(e.id, 4, 5 * e.fin(), e.rotation, 15, new Floatc2(){get: (x, y) => {
		Lines.lineAngle(e.x + x, e.y + y, Angles.angle(x, y), 6 * e.fin());
	}});
	Lines.stroke(1);
	Draw.color();
});

module.exports = {
	newBase(segments, segmentOffset, turnSpeed, headDamage){
		base = extend(FlyingUnit, {
			added(){
				this.super$added();
				//print("id: " + this.id + ", loaded: " + this.loaded + ", savedAsHead: " + this._savedAsHead);
				//if(this.loaded){print("_healths: " + this._healths);}
				Core.app.post(run(() => {
					if((this.loaded && this._savedAsHead) || (!this.loaded && this.isHead())){
						this._head = this.id;
						child = [];
						var seg = this.loaded ? this._healths.length : segments;
						for(var i = 0; i < seg; i++){
							child[i] = this.type.create(this.getTeam());
							child[i].set(this.x + Angles.trnsx(this.rotation + 180, segmentOffset * i), this.y + Angles.trnsy(this.rotation + 180, segmentOffset * i));
							child[i].rotate(this.rotation);
							child[i].add();
							if(this.isBoss()){
								child[i].applyEffect(StatusEffects.boss, 999999);
							}
							if(this.loaded){
								child[i].health(this._healths[i]);
							}else{
								child[i].health(this.maxHealth());
							}
							if(i == 0){
								this.setChild(child[i]);
							}else{
								child[i - 1].setChild(child[i]);
							}
						}
					}else if(this.loaded){
						this.remove();
					}
				}));
			},
			behavior(){
				this.super$behavior();
				if(this.timer.get(4, 5)){
					h = this.type.hitsize;
					Damage.damage(this.getTeam(), this.x, this.y, h * 2, headDamage);
					Units.nearbyEnemies(this.getTeam(), this.x - 2 * h, this.y - 2 * h, h * 4, h * 4, cons(other => {
						if(other.withinDst(this, 2 * h)){
							Effects.effect(flareEffect, (this.x + other.getX()) / 2, (this.y + other.getY()) / 2, this.rotation + this.angleTo(other) / 2);
						}
					}));
				}
			},
			updateVelocityStatus(){
				this.super$updateVelocityStatus();
				/*if(!this.isTail() && this.child() != null){
					if(!Mathf.equal(this.dst(this.parent()), segmentOffset, 0.01)){
						Tmp.v1.set(this.parent().angleTo(this), segmentOffset);
						this.x = Mathf.lerpDelta(this.x, this.parent().x + Tmp.v1.x * Vars.tilesize, 0.4);
						this.y = Mathf.lerpDelta(this.y, this.parent().y + Tmp.v1.y * Vars.tilesize, 0.4);
						//Tmp.v1.set(this.parent().x - this.x, this.parent().y - this.y);
						//Tmp.v1.setLength(2 * this.type.speed * Time.delta());
						//this.velocity().add(Tmp.v1);
					}else if(!this.withinDst(this.parent(), segmentOffset * 0.9)){
						this.velocity().add(Tmp.v1.trns(this.angleTo(this.parent()), this.type.speed * this.dst(this.parent()) * Time.delta()));
					}
					if(this.withinDst(this.parent(), segmentOffset / 3)){
						this.velocity().add(Tmp.v1.trns(-this.angleTo(this.parent()), (segmentOffset / 3 - this.dst(this.parent())) * Time.delta()));
					}*/
					/*if(!Mathf.equal(this.dst(this.child()), segmentOffset, 0.01)){
						Tmp.v1.set(this.angleTo(this.child()) + 180, this.dst(this.child()) - segmentOffset).scl(2 * Time.delta());
						//this.child().moveBy(Tmp.v1.x, Tmp.v1.y);
						this.child().velocity().add(Tmp.v1);
					}
				}*/
				if(!this.isHead()){
					if(this.withinDst(this.parent(), segmentOffset * 0.95)){
						this.velocity().add(Tmp.v1.trns(this.angleTo(this.parent()) + 180, (segmentOffset - this.dst(this.parent())) * Time.delta()));
					}
					Tmp.v1.trns(this.angleTo(this.parent()), this.parent().velocity().len());
					if(!this.withinDst(this.parent(), segmentOffset)){
						Tmp.v1.scl(1.01 * this.dst(this.parent()) / segmentOffset);
					}
					this.velocity().add(Tmp.v1);
					//this.velocity().setLength(this.parent().velocity().len()).rotate(this.angleTo(this.parent())).scl(Time.delta() * segmentOffset / this.dst(this.parent()));
				}
			},
			updateRotation(){
				if(this.isHead()){
					this.rotation = this.velocity().angle();
					return;
				}
				Tmp.v2.trns(this.parent().rotation + 180, segmentOffset / 4);
				this.rotation = this.angleTo(this.parent().x + Tmp.v2.x, this.parent().y + Tmp.v2.y);
			},
			circle(circleLength, speed){
				if(!this.isHead()){return;}
				this.super$circle(circleLength, speed);
			},
			moveTo(circleLength){
				if(!this.isHead()){return;}
				this.super$moveTo(circleLength);
			},
			attack(circleLength){
				if(!this.isHead()){return;}
				Tmp.v1.set(this.target.getX() - this.x, this.target.getY() - this.y);
				var ang = this.angleTo(this.target);
				var diff = Angles.angleDist(ang, this.rotation);
				if(diff > 100 && Tmp.v1.len() < circleLength){
					Tmp.v1.setAngle(this.velocity().angle());
				}else{
					var m = 1;
					if(this.child() != null){m = this.childs().length / segments;}
					Tmp.v1.setAngle(Mathf.slerpDelta(this.velocity().angle(), Tmp.v1.angle(), m * turnSpeed));
				}
				Tmp.v1.setLength(this.type.speed * Time.delta());
				this.velocity().add(Tmp.v1);
			},
			onDeath(){
				if(!this.isTail() && this.child() != null){
					this.child().setParent(null);
				}
				if(!this.isHead() && this.parent() != null){
					this.parent().setChild(null);
				}
				this.super$onDeath();
			},
			draw(){
				//if(!this.isTail()){return;}
				this.drawB();
			},
			drawB(){
				Draw.mixcol(Color.white, this.hitTime / 9);
				/*if(this.isHead()){
					Draw.rect(this.type.region, this.x, this.y, this.rotation - 90);
				}else if(this.isBody()){
					Draw.rect(this.type.getBodyReg(), this.x, this.y, this.rotation - 90);
				}else if(this.isTail()){
					Draw.rect(this.type.getTailReg(), this.x, this.y, this.rotation - 90);
				}*/
				Draw.rect(this.type.getReg()[this.segmentName()], this.x, this.y, this.rotation - 90);
				this.drawWeapons();
				Draw.mixcol();
				this.drawStats();
				if(!this.isHead()){this.parent().drawB();}
			},
			drawAll(){
				if(!this.isDead()){
					this.draw();
				}
			},
			drawUnder(){
				if(this.isHead() && this._child < 0){
					this.drawEngine();
				}
			},
			getPowerCellRegion(){
				return this.type.getCellReg()[this.segmentName()];
			},
			getIconRegion(){
				return this.type.getReg()[this.segmentName()];
			},
			segmentName(){
				return this.isHead() ? "head" : (this.isBody() ? "body" : "tail");
			},
			parent(){
				if(this._parent < 0){return null;}
				return Vars.unitGroup.getByID(this._parent);
			},
			child(){
				if(this._child < 0){return null;}
				return Vars.unitGroup.getByID(this._child);
			},
			childs(){
				temp = this;
				cgroup = [];
				e = 0;
				while(!temp.isTail()){
					temp = temp.child();
					cgroup[e] = temp.id;
					e++;
				}
				return cgroup;
			},
			head(){
				if(this.isHead()){return this;}
				return Vars.unitGroup.getByID(this._head);
			},
			tail(){
				if(this.isTail()){return this;}
				temp = this;
				while(!temp.isTail()){
					temp = temp.child();
				}
				return temp;
			},
			setParent(unit){
				if(unit == null || (unit.child() != null && unit.child() != this)){
					this._parent = -1;
					return;
				}
				this._parent = unit.id;
			},
			setChild(unit){
				if(unit == null){
					this._child = -1;
					return;
				}
				this._child = unit.id;
				this.child().setParent(this);
				if(this.isHead()){
					this.child().setHead(this);
				}else if(this._head >= 0){
					this.child().setHeadByID(this._head);
				}else{
					this.child().findHead();
				}
			},
			setHeadByID(id){
				this._head = id;
			},
			setHead(unit){
				this._head = unit.id;
			},
			findHead(){
				temp = this;
				while(!temp.isHead()){
					temp = temp.parent();
				}
				this._head = temp.id;
			},
			isHead(){
				if(this._savedAsHead){this._parent = -1;}
				return this._parent < 0;
			},
			isBody(){
				return !this.isHead() && !this.isTail();
			},
			isTail(){
				return !this.isHead() && this._child < 0;
			},
			write(data){
				this.super$write(data);
				data.writeByte(this.isHead() ? 1 : 0);
				if(this.isHead()){
					data.writeByte(this.childs().length);
					for(var i = 0; i < this.childs().length; i++){
						data.writeShort(Vars.unitGroup.getByID(this.childs()[i]).health());
					}
				}
			},
			read(data){
				this.super$read(data);
				this._savedAsHead = data.readByte() == 1 ? true : false;
				if(this._savedAsHead){
					var seg = data.readByte();
					this._healths = [];
					for(var i = 0; i < seg; i++){
						this._healths[i] = data.readShort();
					}
				}
			},
			writeSave(stream, net){
				//this.super$writeSave(stream, net);
				//print("writeSave()");
				if(this.item.item == null){this.item.item = Items.copper;}
				stream.writeByte(this.team.id);
				stream.writeBoolean(this.isDead());
				stream.writeFloat(net ? this.getInterpolator().target.x : this.x);
				stream.writeFloat(net ? this.getInterpolator().target.y : this.y);
				stream.writeByte(Mathf.clamp(this.velocity().x, -15.875, 15.875) * 8);
				stream.writeByte(Mathf.clamp(this.velocity().y, -15.875, 15.875) * 8);
				stream.writeShort(this.rotation * 2);
				stream.writeShort(this.health);
				stream.writeByte(this.item.item.id);
				stream.writeShort(typeof(this.item.amount) === "undefined" ? 0 : this.item.amount);
				this.status.writeSave(stream);
				stream.writeByte(this.type.id);
				stream.writeInt(this.spawner);
				
				stream.writeBoolean(this.isHead());
				if(this.isHead()){
					stream.writeByte(this.childs().length);
					for(var i = 0; i < this.childs().length; i++){
						stream.writeShort(Vars.unitGroup.getByID(this.childs()[i]).health());
					}
				}
			},
			readSave(stream, version){
				//this.super$readSave(stream, version);
				team = stream.readByte();
				dead = stream.readBoolean();
				x = stream.readFloat();
				y = stream.readFloat();
				xv = stream.readByte();
				yv = stream.readByte();
				rotation = stream.readShort() / 2;
				health = stream.readShort();
				itemID = stream.readByte();
				itemAmount = stream.readShort();
				this.status.readSave(stream, version);
				this.item.amount = itemAmount;
				this.item.item = Vars.content.item(itemID);
				this.dead = dead;
				this.team = Team.get(team);
				this.health = health;
				this.x = x;
				this.y = y;
				this.velocity().set(xv, yv);
				this.rotation = rotation;
				this.loaded = true;
				
				type = stream.readByte();
				this.spawner = stream.readInt();
				this.type = Vars.content.getByID(ContentType.unit, type);
				
				this._savedAsHead = stream.readBoolean();
				if(this._savedAsHead){
					var seg = stream.readByte();
					this._healths = [];
					for(var i = 0; i < seg; i++){
						this._healths[i] = stream.readShort();
					}
				}
				this.add();
			}
		});
		base._savedAsHead = false;
		base._parent = -1;
		base._child = -1;
		base._head = -1;
		base._healths = [];
		return base;
	},
};
