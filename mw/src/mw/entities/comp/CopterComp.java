package mw.entities.comp;

import arc.math.*;
import mindustry.gen.*;
import mindustry.type.*;
import mw.annotations.Annotations.*;
import mw.gen.*;
import mw.type.*;

@Component
abstract class CopterComp implements Copterc, Unitc{
    @Import boolean dead;
    @Import float rotation;
    @Import int id;
    @Import UnitType type;

    @Override
    public void update(){
        if(dead){
            rotation(rotation + ((MWUnitType)type).fallRotateSpeed * Mathf.signs[id % 2]);
        }
    }
}
