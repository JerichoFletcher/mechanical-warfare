const plib = require("mechanical-warfare/plib");

const nhGraphite = extend(BasicBulletType, {});
nhGraphite.damage = 75;
nhGraphite.speed = 10;
nhGraphite.lifetime = 50;
nhGraphite.bulletSprite = modName + "-hvbullet";
nhGraphite.bulletWidth = 8;
nhGraphite.bulletHeight = 16;
nhGraphite.ammoMultiplier = 2;
nhGraphite.hitEffect = Fx.hitBulletBig;
nhGraphite.despawnEffect = nhGraphite.hitEffect;

const nhTitanium = extend(BasicBulletType, {});
nhTitanium.damage = 98;
nhTitanium.speed = 12;
nhTitanium.lifetime = 42;
nhTitanium.bulletSprite = modName + "-hvbullet";
nhTitanium.bulletWidth = 8;
nhTitanium.bulletHeight = 20;
nhTitanium.ammoMultiplier = 2;
nhTitanium.hitEffect = Fx.hitBulletBig;
nhTitanium.despawnEffect = nhGraphite.hitEffect;

const nhShell = extend(BasicBulletType, {});
nhShell.damage = 140;
nhShell.speed = 14;
nhShell.lifetime = 36;
nhShell.bulletSprite = modName + "-hvbullet";
nhShell.bulletWidth = 8;
nhShell.bulletHeight = 25;
nhShell.ammoMultiplier = 3;
nhShell.frontColor = plib.frontColorAP;
nhShell.backColor = plib.backColorAP;
nhShell.hitEffect = Fx.hitLancer;
nhShell.despawnEffect = nhGraphite.hitEffect;

const nighthawk = extendContent(ItemTurret, "nighthawk", {
	init(){
		this.ammo(
			Items.graphite, nhGraphite,
			Items.titanium, nhTitanium,
			Vars.content.getByName(ContentType.item, modName + "-ap-shell"), nhShell
		);
		this.super$init();
	}
});