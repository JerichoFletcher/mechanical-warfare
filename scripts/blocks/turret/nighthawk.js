const plib = require("mechanical-warfare/plib");
const bulletLib = require("mechanical-warfare/bulletlib");

const nhGraphite = bulletLib.bullet(BasicBulletType, 8, 16, 0, 0, 75, 0, -1, 0, 10, 50, null, null, null, null);
nhGraphite.bulletSprite = "mechanical-warfare-hvbullet";
nhGraphite.ammoMultiplier = 2;
nhGraphite.hitEffect = Fx.hitBulletBig;
nhGraphite.despawnEffect = Fx.hitBulletBig;

const nhTitanium = bulletLib.bullet(BasicBulletType, 8, 20, 0, 0, 98, 0, -1, 0, 12, 42, null, null, null, null);
nhTitanium.bulletSprite = "mechanical-warfare-hvbullet";
nhTitanium.ammoMultiplier = 2;
nhTitanium.hitEffect = Fx.hitBulletBig;
nhTitanium.despawnEffect = Fx.hitBulletBig;

const nhShell = bulletLib.bullet(BasicBulletType, 8, 25, 0, 0, 140, 0, -1, 0, 14, 36, null, null, null, null);
nhShell.bulletSprite = "mechanical-warfare-hvbullet";
nhShell.ammoMultiplier = 3;
nhShell.frontColor = plib.frontColorAP;
nhShell.backColor = plib.backColorAP;
nhShell.hitEffect = Fx.hitLancer;
nhShell.despawnEffect = Fx.hitLancer;

const nighthawk = extendContent(ItemTurret, "nighthawk", {
	init(){
		this.ammo(
			Items.graphite, nhGraphite,
			Items.titanium, nhTitanium,
			Vars.content.getByName(ContentType.item, "mechanical-warfare-ap-shell"), nhShell
		);
		this.super$init();
	}
});
