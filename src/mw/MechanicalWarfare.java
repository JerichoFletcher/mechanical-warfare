package mw;

import arc.*;
import arc.util.*;
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
        //new MWUnitTypes(),
        new MWBlocks(),
        //new MWLoadouts(),
        //new MWWeathers(),
        //new MWPlanets(),
        //new MWSectorPresets(),
        new MWTechTree()
    };

    public MechanicalWarfare(){
        Events.on(ClientLoadEvent.class, e -> {
            MWSounds.load();
        });
    }

    @Override
    public void loadContent(){
        Time.mark();

        for(ContentList list : contents){
            list.load();
        }

        Log.info("Time to load @ contents: @", getClass().getSimpleName(), Time.elapsed());
    }
}
