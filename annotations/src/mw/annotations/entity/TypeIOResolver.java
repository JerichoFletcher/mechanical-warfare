package mw.annotations.entity;

import arc.struct.*;
import nova.*;
import nova.model.elements.*;
import mw.annotations.Annotations.*;

import javax.lang.model.element.*;

public class TypeIOResolver{
    public static ClassSerializer resolve(NovaProcessor processor){
        ClassSerializer out = new ClassSerializer(new ObjectMap<>(), new ObjectMap<>(), new ObjectMap<>());

        for(NovaType type : processor.types(TypeIOHandler.class)){
            Seq<NovaMethod> methods = type.methods();
            for(NovaMethod meth : methods){
                if(meth.is(Modifier.PUBLIC) && meth.is(Modifier.STATIC)){
                    Seq<NovaVar> params = meth.params();

                    if(params.size == 2 && params.first().tname().toString().equals("arc.util.io.Writes")){
                        out.writers.put(fix(params.get(1).tname().toString()), type.fullName() + "." + meth.name());
                    }else if(params.size == 1 && params.first().tname().toString().equals("arc.util.io.Reads") && !meth.isVoid()){
                        out.readers.put(fix(meth.retn().toString()), type.fullName() + "." + meth.name());
                    }else if(params.size == 2 && params.first().tname().toString().equals("arc.util.io.Reads") && !meth.isVoid() && meth.ret().equals(meth.params().get(1).mirror())){
                        out.mutatorReaders.put(fix(meth.retn().toString()), type.fullName() + "." + meth.name());
                    }
                }
            }
        }

        return out;
    }

    private static String fix(String str){
        return str.replace("mw.gen", "");
    }

    public static class ClassSerializer{
        public final ObjectMap<String, String> writers, readers, mutatorReaders;

        public ClassSerializer(ObjectMap<String, String> writers, ObjectMap<String, String> readers, ObjectMap<String, String> mutatorReaders){
            this.writers = writers;
            this.readers = readers;
            this.mutatorReaders = mutatorReaders;
        }
    }
}
