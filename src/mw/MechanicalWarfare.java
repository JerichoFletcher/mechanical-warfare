package mw;

import mindustry.ctype.*;
import mindustry.mod.*;
import mw.content.*;

public class MechanicalWarfare extends Mod{
    private ContentList[] contents = {
        new MWItems(),
        new MWLiquids(),
        new MWBlocks()
    };

    @Override
    public void init(){
        // TODO create sounds
    }

    @Override
    public void loadContent(){
        for(ContentList list : contents){
            list.load();
        }
    }
}
