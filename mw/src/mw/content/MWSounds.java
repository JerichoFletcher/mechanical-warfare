package mw.content;

import arc.*;
import arc.assets.*;
import arc.audio.*;
import arc.mock.*;
import mindustry.*;
import mindustry.mod.*;

public class MWSounds{
    public static Sound

    blowshot,
    fireAuraActive,
    heatrayActive,
    hypernovaActive,
    hypernovaShoot,
    quakemk2shot,
    quakeshot,
    supernovaActive,
    supernovaShoot,
    voltmeterActive,
    voltmeterIdle;

    public static void load(){
        blowshot = loadSound("blowshot");
        fireAuraActive = loadSound("fireAuraActive");
        heatrayActive = loadSound("heatrayActive");
        hypernovaActive = loadSound("hypernovaActive");
        hypernovaShoot = loadSound("hypernovaShoot");
        quakemk2shot = loadSound("quakemk2shot");
        quakeshot = loadSound("quakeshot");
        supernovaActive = loadSound("supernovaActive");
        supernovaShoot = loadSound("supernovaShoot");
        voltmeterActive = loadSound("voltmeterActive");
        voltmeterIdle = loadSound("voltmeterIdle");
    }

    public static void dispose(){
        blowshot = disposeSound("blowshot");
        fireAuraActive = disposeSound("fireAuraActive");
        heatrayActive = disposeSound("heatrayActive");
        hypernovaActive = disposeSound("hypernovaActive");
        hypernovaShoot = disposeSound("hypernovaShoot");
        quakemk2shot = disposeSound("quakemk2shot");
        quakeshot = disposeSound("quakeshot");
        supernovaActive = disposeSound("supernovaActive");
        supernovaShoot = disposeSound("supernovaShoot");
        voltmeterActive = disposeSound("voltmeterActive");
        voltmeterIdle = disposeSound("voltmeterIdle");
    }

    static Sound loadSound(String n){
        if(Vars.headless) return new MockSound();

        String name = "sounds/" + n;
        String path = Vars.tree.get(name + ".ogg").exists() && !Vars.ios ? name + ".ogg" : name + ".mp3";

        if(Core.assets.contains(path, Sound.class)) return Core.assets.get(path, Sound.class);

        ModLoadingSound sound = new ModLoadingSound();

        AssetDescriptor<?> desc = Core.assets.load(path, Sound.class);
        desc.loaded = result -> sound.sound = (Sound)result;
        desc.errored = Throwable::printStackTrace;

        return sound;
    }

    static Sound disposeSound(String n){
        String name = "sounds/" + n;
        String path = Vars.tree.get(name + ".ogg").exists() && !Vars.ios ? name + ".ogg" : name + ".mp3";

        if(Core.assets.contains(path, Sound.class)){
            Core.assets.get(path, Sound.class).dispose();
            Core.assets.unload(path);
        }

        return null;
    }
}
