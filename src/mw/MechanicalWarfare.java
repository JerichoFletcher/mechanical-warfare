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
        new MWLiquids(),
        new MWBlocks()
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
