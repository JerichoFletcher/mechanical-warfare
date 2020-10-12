package mw.content;

import arc.*;
import arc.audio.*;
import arc.mock.*;

public class MWSounds{
    public static Sound
        blowshot = new MockSound(),
        fireAuraActive = new MockSound(),
        heatrayActive = new MockSound(),
        hypernovaActive = new MockSound(),
        hypernovaShoot = new MockSound(),
        quakemk2shot = new MockSound(),
        quakeshot = new MockSound(),
        supernovaActive = new MockSound(),
        supernovaShoot = new MockSound(),
        voltmeterActive = new MockSound(),
        voltmeterIdle = new MockSound();

    public static void load(){
        Core.assets.load("sounds/blowshot.ogg", Sound.class).loaded = sound -> blowshot = (Sound)sound;
        Core.assets.load("sounds/fireAuraActive.ogg", Sound.class).loaded = sound -> fireAuraActive = (Sound)sound;
        Core.assets.load("sounds/heatrayActive.ogg", Sound.class).loaded = sound -> heatrayActive = (Sound)sound;
        Core.assets.load("sounds/hypernovaActive.ogg", Sound.class).loaded = sound -> hypernovaActive = (Sound)sound;
        Core.assets.load("sounds/hypernovaShoot.ogg", Sound.class).loaded = sound -> hypernovaShoot = (Sound)sound;
        Core.assets.load("sounds/quakemk2shot.ogg", Sound.class).loaded = sound -> quakemk2shot = (Sound)sound;
        Core.assets.load("sounds/quakeshot.ogg", Sound.class).loaded = sound -> quakeshot = (Sound)sound;
        Core.assets.load("sounds/supernovaActive.ogg", Sound.class).loaded = sound -> supernovaActive = (Sound)sound;
        Core.assets.load("sounds/supernovaShoot.ogg", Sound.class).loaded = sound -> supernovaShoot = (Sound)sound;
        Core.assets.load("sounds/voltmeterActive.ogg", Sound.class).loaded = sound -> voltmeterActive = (Sound)sound;
        Core.assets.load("sounds/voltmeterIdle.ogg", Sound.class).loaded = sound -> voltmeterIdle = (Sound)sound;
    }

    public static void dispose(){
        Core.assets.unload("sounds/blowshot.ogg");
        blowshot = null;
        Core.assets.unload("sounds/fireAuraActive.ogg");
        fireAuraActive = null;
        Core.assets.unload("sounds/heatrayActive.ogg");
        heatrayActive = null;
        Core.assets.unload("sounds/hypernovaActive.ogg");
        hypernovaActive = null;
        Core.assets.unload("sounds/hypernovaShoot.ogg");
        hypernovaShoot = null;
        Core.assets.unload("sounds/quakemk2shot.ogg");
        quakemk2shot = null;
        Core.assets.unload("sounds/quakeshot.ogg");
        quakeshot = null;
        Core.assets.unload("sounds/supernovaActive.ogg");
        supernovaActive = null;
        Core.assets.unload("sounds/supernovaShoot.ogg");
        supernovaShoot = null;
        Core.assets.unload("sounds/voltmeterActive.ogg");
        voltmeterActive = null;
        Core.assets.unload("sounds/voltmeterIdle.ogg");
        voltmeterIdle = null;
    }
}
