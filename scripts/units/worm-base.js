const flareEffect = newEffect(18, e => {
	Draw.color(Pal.lightFlame, Pal.darkFlame, e.fin());
	Lines.stroke(e.fout());
	Angles.randLenVectors(e.id, 4, 5 * e.fin(), e.rotation, 15, new Floatc2(){get: (x, y) => {
		Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), 6 * e.fin());
	}});
	Lines.stroke(1);
	Draw.color();
});

module.exports = {
	newBase(segments, segmentOffset, turnSpeed, headDamage, canSplit, drawUnder, drawOver, customBehavior, customSave, customLoad, dataList){
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
						if(this._postAddSchedule != null)this._postAddSchedule(child);
					}else if(this.loaded){
						this.remove();
					}
				}));
			},
			behavior(){
				this.super$behavior();
				if(headDamage > 0 && this.timer.get(4, 5)){
					h = this.type.hitsize * 1.4;
					m = this.isHead() ? 1 : 0.25;
					Damage.damage(this.getTeam(), this.x, this.y, h, headDamage * m);
					Units.nearbyEnemies(this.getTeam(), this.x - h, this.y - h, h * 2, h * 2, cons(other => {
						if(other.withinDst(this, h)){
							Tmp.v1.trns(this.angleTo(other), this.dst(other) / 2);
							Effects.effect(flareEffect, this.x + Tmp.v1.x, this.y + Tmp.v1.y, this.rotation);
						}
					}));
				}
				if(customBehavior != null)customBehavior(this);
			},
			updateVelocityStatus(){
				this.super$updateVelocityStatus();
				if(!this.isHead()){
					Tmp.v1.trns(this.parent().velocity().angle(), -segmentOffset / 2.5);
					angle = Angles.angle(this.x, this.y, this.parent().x + Tmp.v1.x, this.parent().y + Tmp.v1.y);
					dst = Mathf.dst(this.x, this.y, this.parent().x, this.parent().y) - segmentOffset;
					if(this.dst(this.parent().x, this.parent().y) > segmentOffset){
						Tmp.v2.trns(angle, dst);
						this.velocity().add(Tmp.v3.trns(
							angle,
							Math.max(this.parent().velocity().len(), this.velocity().len())
						));
						if(Mathf.within(this.x + this.velocity().x, this.y + this.velocity().y, this.parent().x, this.parent().y, segmentOffset)){
							this.moveBy(Tmp.v2.x, Tmp.v2.y);
						}
						dst = Mathf.dst(this.x, this.y, this.parent().x, this.parent().y) - segmentOffset;
						if(dst < 0){
							angle = Angles.angle(this.x, this.y, this.parent().x, this.parent().y);
							Tmp.v2.trns(angle, dst);
							this.moveBy(Tmp.v2.x * 0.25, Tmp.v2.y * 0.25);
						}
					}
				}
			},
			collides(other){
				if(this.isDead() || other.type == this.type)return false;
				return this.super$collides(other);
			},
			updateRotation(){
				if(this.isHead()){
					this.rotation = this.velocity().angle();
					return;
				}
				/*Tmp.v2.trns(this.parent().rotation, -segmentOffset);
				this.rotation = this.angleTo(this.parent().x + Tmp.v2.x, this.parent().y + Tmp.v2.y);*/
				Tmp.v1.trns(this.parent().rotation, -segmentOffset / 4);
				Tmp.v1.add(this.parent().x, this.parent().y);
				this.rotation = Angles.angle(this.x, this.y, Tmp.v1.x, Tmp.v1.y);
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
					if(this.child() != null){m = 1 - 0.33 * this.childs().length / segments;}
					Tmp.v1.setAngle(Mathf.slerpDelta(this.velocity().angle(), Tmp.v1.angle(), m * turnSpeed));
				}
				Tmp.v1.setLength(this.type.speed * Time.delta());
				this.velocity().add(Tmp.v1);
			},
			damage(amount){
				if(canSplit){
					this.super$damage(amount);
				}else{
					if(this.isHead()){
						for(var i = this.childs().length - 1; i >= 0; i--){
							Vars.unitGroup.getByID(this.childs()[i]).damageB(amount / (this.childs().length + 1));
						}
						this.super$damage(amount / (this.childs().length + 1));
					}else{
						this.head().damage(amount);
					}
				}
			},
			damageB(amount){
				this.super$damage(amount);
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
				if(this.isTail() || (this.isHead() && this.child() == null)){
					this.drawB();
				}
			},
			drawSize(){
				return !this.isTail() ? (this.type.hitsize * segments) : (segments * segmentOffset * 2);
			},
			drawB(){
				Draw.mixcol(Color.white, this.hitTime / 9);
				if(drawUnder != null)drawUnder(this);
				Draw.rect(this.type.getReg()[this.segmentName()], this.x, this.y, this.rotation - 90);
				this.drawWeapons();
				if(drawOver != null)drawOver(this);
				Draw.mixcol();
				this.drawStats();
				if(!this.isHead())this.parent().drawB();
			},
			drawAll(){
				if(!this.isDead()){
					this.draw();
				}
			},
			drawUnder(){
				if(this.isSolitary()){
					this.drawEngine();
				}
			},
			getPowerCellRegion(){
				cellReg = Core.atlas.find("power-cell");
				if(typeof(this.type.getCellReg) !== "undefined"){
					regObj = this.type.getCellReg();
					if(regObj != null)cellReg = regObj[this.segmentName()];
				}
				return cellReg;
			},
			getIconRegion(){
				return this.type.getReg()[this.segmentName()];
			},
			segmentName(){
				return this.isHead() ? "head" : (this.isBody() ? "body" : "tail");
			},
			parent(){
				if(this._parent < 0)return null;
				return Vars.unitGroup.getByID(this._parent);
			},
			child(){
				if(this._child < 0)return null;
				return Vars.unitGroup.getByID(this._child);
			},
			childs(){
				temp = this;
				cgroup = [];
				e = 0;
				while(!temp.isTail()){
					temp = temp.child();
					if(temp == null)break;
					cgroup[e] = temp.id;
					e++;
				}
				return cgroup;
			},
			head(){
				if(this.isHead())return this;
				return Vars.unitGroup.getByID(this._head);
			},
			tail(){
				if(this.isTail())return this;
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
					this.findHead();
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
			isSolitary(){
				return this.isHead() && this._child < 0;
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
				if(customSave != null)customSave(this, data, false);
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
				if(customLoad != null)customLoad(this, data, 0);
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
				if(customSave != null)customSave(this, stream, net);
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
				if(customLoad != null)customLoad(this, stream, version);
			},
			savedAsHead(){
				return this._savedAsHead;
			},
			dataObj(){
				return this._data;
			},
			dat(name){
				return this.dataObj()[name];
			},
			setDat(name, val){
				this._data[name] = val;
			},
			provDat(name, provider){
				this._data[name] = provider(this.dat(name));
			},
			postAdd(method){
				this._postAddSchedule = method;
			},
		});
		base._savedAsHead = false;
		base._parent = -1;
		base._child = -1;
		base._head = -1;
		base._healths = [];
		base._postAddSchedule = null;
		base._data = {};
		for(var i = 0; i < dataList.length; i += 2){
			if(i + 1 >= dataList.length){
				print("Warning: dataList with odd number of elements, ignoring: " + dataList[i]);
				break;
			}
			base._data[dataList[i]] = dataList[i + 1];
		}
		return base;
	},
};
