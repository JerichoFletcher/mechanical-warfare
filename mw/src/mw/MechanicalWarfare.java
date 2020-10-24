package mw;

import arc.*;
import arc.util.*;
import mindustry.*;
import mindustry.ctype.*;
import mindustry.game.EventType.*;
import mindustry.mod.*;
import mw.content.*;

public class MechanicalWarfare extends Mod{
    private ContentList[] contents = {
        new MWItems(),
        //new MWStatusEffects(),
        new MWLiquids(),
        new MWBullets(),
        //new MWAmmoTypes(),
        new MWUnitTypes(),
        new MWBlocks(),
        //new MWLoadouts(),
        //new MWWeathers(),
        //new MWPlanets(),
        //new MWSectorPresets(),
        //new MWTechTree()
    };

    public MechanicalWarfare(){
        Vars.enableConsole = true;

        Events.on(DisposeEvent.class, e -> {
            MWSounds.dispose();
        });
    }

    @Override
    public void loadContent(){
        for(ContentList list : contents){
            list.load();

            Log.info("Loaded '@' content: '@'", getClass().getSimpleName(), list.getClass().getSimpleName());
        }

        if(!Vars.headless){
            Core.app.post(() -> MWSounds.load());
        }
    }
}
