package mw;

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
    }

    @Override
    public void loadContent(){
        MWSounds.load();

        for(ContentList list : contents){
            list.load();
        }
    }
}
