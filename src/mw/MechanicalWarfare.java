package mw;

import mindustry.ctype.*;
import mindustry.mod.*;
import mw.content.*;

public class MechanicalWarfare extends Mod{
    ContentList[] contents = {
        new MWItems()
    };

    @Override
    public void loadContent(){
        for(ContentList list : contents){
            list.load();
        }
    }
}
