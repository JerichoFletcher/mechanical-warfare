package mw.content;

import arc.*;
import arc.audio.*;
import arc.func.*;
import arc.mock.*;
import arc.util.Log;
import mindustry.*;

import static mindustry.Vars.*;

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
        Func<String, Sound> loadSound = soundName -> {
            Sound result = mods.getScripts().loadSound(soundName);
            Log.info("Loaded sound: @", result.toString());

            return result;
        };

        blowshot = loadSound.get("blowshot");
        fireAuraActive = loadSound.get("fireAuraActive");
        heatrayActive = loadSound.get("heatrayActive");
        hypernovaActive = loadSound.get("hypernovaActive");
        hypernovaShoot = loadSound.get("hypernovaShoot");
        quakemk2shot = loadSound.get("quakemk2shot");
        quakeshot = loadSound.get("quakeshot");
        supernovaActive = loadSound.get("supernovaActive");
        supernovaShoot = loadSound.get("supernovaShoot");
        voltmeterActive = loadSound.get("voltmeterActive");
        voltmeterIdle = loadSound.get("voltmeterIdle");
    }

    public static void dispose(){
        Func<String, Sound> disposeSound = soundName -> {
            String name = "sounds/" + soundName;
            String path = !Vars.ios ? name + ".ogg" : name + ".mp3";

            if(Core.assets.contains(path, Sound.class)){
                Core.assets.get(path, Sound.class).dispose();
                Core.assets.unload(path);
            }

            return null;
        };

        blowshot = disposeSound.get("blowshot");
        fireAuraActive = disposeSound.get("fireAuraActive");
        heatrayActive = disposeSound.get("heatrayActive");
        hypernovaActive = disposeSound.get("hypernovaActive");
        hypernovaShoot = disposeSound.get("hypernovaShoot");
        quakemk2shot = disposeSound.get("quakemk2shot");
        quakeshot = disposeSound.get("quakeshot");
        supernovaActive = disposeSound.get("supernovaActive");
        supernovaShoot = disposeSound.get("supernovaShoot");
        voltmeterActive = disposeSound.get("voltmeterActive");
        voltmeterIdle = disposeSound.get("voltmeterIdle");
    }
}
