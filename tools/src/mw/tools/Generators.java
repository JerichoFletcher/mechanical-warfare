package mw.tools;

import arc.util.*;

public class Generators {
    public static final Generator[] generators = {
        new IconGenerator()
    };

    public static void generate(){
        for(Generator generator : generators){
            Log.info("Executing generator '@'...", generator.getClass().getSimpleName());

            generator.generate();
        }
    }
}
