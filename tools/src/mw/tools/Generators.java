package mw.tools;

public class Generators{
    public static final Generator[] generators = {
        new OutlineGenerator()
    };

    public static void generate(){
        for(Generator generator : generators){
            generator.generate();
        }
    }
}
