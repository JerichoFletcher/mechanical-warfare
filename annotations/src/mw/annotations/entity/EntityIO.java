package mw.annotations.entity;

import arc.files.*;
import arc.math.*;
import arc.struct.*;
import arc.util.*;
import arc.util.serialization.*;
import mw.annotations.Annotations.*;
import mw.annotations.entity.TypeIOResolver.*;

import com.squareup.javapoet.*;

import nova.NovaProcessor;
import nova.model.elements.*;

import javax.lang.model.element.*;

public class EntityIO{
    final static Json json = new Json();
    final static String targetSuf = "_TARGET_", lastSuf = "_LAST_";
    final static StringMap replacements = StringMap.of("mindustry.entities.units.BuildRequest", "mindustry.entities.units.BuildPlan");

    final ClassSerializer serializer;
    final String name;
    final TypeSpec.Builder type;
    final Fi directory;
    final Seq<Revision> revisions = new Seq<>();

    boolean write;
    MethodSpec.Builder method;
    ObjectSet<String> presentFields = new ObjectSet<>();

    EntityIO(String name, TypeSpec.Builder type, Seq<FieldSpec> typeFields, ClassSerializer serializer, Fi directory){
        this.directory = directory;
        this.type = type;
        this.serializer = serializer;
        this.name = name;

        json.setIgnoreUnknownFields(true);

        directory.mkdirs();

        for(Fi fi : directory.list()){
            revisions.add(json.fromJson(Revision.class, fi));
        }

        revisions.sort(r -> r.version);

        int nextRevision = revisions.isEmpty() ? 0 : revisions.max(r -> r.version).version + 1;

        Seq<FieldSpec> fields = typeFields.select(spec ->
            !spec.hasModifier(Modifier.TRANSIENT) &&
            !spec.hasModifier(Modifier.STATIC) &&
            !spec.hasModifier(Modifier.FINAL));

        fields.sortComparing(f -> f.name);

        presentFields.addAll(fields.map(f -> f.name));

        Revision previous = revisions.isEmpty() ? null : revisions.peek();

        if(revisions.isEmpty() || !revisions.peek().equal(fields)){
            revisions.add(new Revision(nextRevision,
                fields.map(f -> new RevisionField(f.name, f.type.toString()))));
            Log.warn("Adding new revision @ for @.\nPre = @\nNew = @\n", nextRevision, name, previous == null ? null : previous.fields.toString(", ", f -> f.name + ":" + f.type), fields.toString(", ", f -> f.name + ":" + f.type.toString()));
            //write revision
            directory.child(nextRevision + ".json").writeString(json.toJson(revisions.peek()));
        }
    }

    void write(MethodSpec.Builder method, boolean write) throws Exception{
        this.method = method;
        this.write = write;

        method.addAnnotation(CallSuper.class);

        if(write){
            st("write.s($L)", revisions.peek().version);

            for(RevisionField field : revisions.peek().fields){
                io(field.type, "this." + field.name);
            }
        }else{
            st("short REV = read.s()");

            for(int i = 0; i < revisions.size; i++){
                Revision rev = revisions.get(i);
                if(i == 0){
                    cont("if(REV == $L)", rev.version);
                }else{
                    ncont("else if(REV == $L)", rev.version);
                }

                for(RevisionField field : rev.fields){
                    io(field.type, presentFields.contains(field.name) ? "this." + field.name + " = " : "");
                }
            }

            ncont("else");
            st("throw new IllegalArgumentException(\"Unknown revision '\" + REV + \"' for entity type '" + name + "'\")");
            econt();
        }
    }

    void writeSync(MethodSpec.Builder method, boolean write, Seq<NovaVar> syncFields, Seq<NovaVar> allFields) throws Exception{
        this.method = method;
        this.write = write;

        if(write){
            for(RevisionField field : revisions.peek().fields){
                io(field.type, "this." + field.name);
            }
        }else{
            Revision rev = revisions.peek();

            st("if(lastUpdated != 0) updateSpacing = $T.timeSinceMillis(lastUpdated)", Time.class);
            st("lastUpdated = $T.millis()", Time.class);
            st("boolean islocal = isLocal()");

            for(RevisionField field : rev.fields){
                NovaVar var = allFields.find(s -> s.name().equals(field.name));
                boolean sf = var.has(SyncField.class), sl = var.has(SyncLocal.class);

                if(sl) cont("if(!islocal)");

                if(sf){
                    st(field.name + lastSuf + " = this." + field.name);
                }

                io(field.type, "this." + (sf ? field.name + targetSuf : field.name) + " = ");

                if(sl){
                    ncont("else" );

                    io(field.type, "");

                    if(sf){
                        st(field.name + lastSuf + " = this." + field.name);
                        st(field.name + targetSuf + " = this." + field.name);
                    }

                    econt();
                }
            }

            st("afterSync()");
        }
    }

    void writeSyncManual(MethodSpec.Builder method, boolean write, Seq<NovaVar> syncFields) throws Exception{
        this.method = method;
        this.write = write;

        if(write){
            for(NovaVar field : syncFields){
                st("buffer.put(this.$L)", field.name());
            }
        }else{
            st("if(lastUpdated != 0) updateSpacing = $T.timeSinceMillis(lastUpdated)", Time.class);
            st("lastUpdated = $T.millis()", Time.class);

            for(NovaVar field : syncFields){
                st("this.$L = this.$L", field.name() + lastSuf, field.name());

                st("this.$L = buffer.get()", field.name() + targetSuf);
            }
        }
    }

    void writeInterpolate(MethodSpec.Builder method, Seq<NovaVar> fields) throws Exception{
        this.method = method;

        cont("if(lastUpdated != 0 && updateSpacing != 0)");

        st("float timeSinceUpdate = Time.timeSinceMillis(lastUpdated)");
        st("float alpha = Math.min(timeSinceUpdate / updateSpacing, 2f)");

        for(NovaVar field : fields){
            String name = field.name(), targetName = name + targetSuf, lastName = name + lastSuf;
            st("$L = $L($T.$L($L, $L, alpha))", name, field.annotation(SyncField.class).clamped() ? "arc.math.Mathf.clamp" : "", Mathf.class, field.annotation(SyncField.class).value() ? "lerp" : "slerp", lastName, targetName);
        }

        ncont("else if(lastUpdated != 0)");

        for(NovaVar field : fields){
            String name = field.name(), targetName = name + targetSuf;
            st("$L = $L", name, targetName);
        }

        econt();
    }

    private void io(String type, String field) throws Exception{
        type = type.replace("mindustry.gen.", "");
        type = replacements.get(type, type);

        if(NovaProcessor.isPrimitive(type)){
            s(type.equals("boolean") ? "bool" : type.charAt(0) + "", field);
        }else if(NovaProcessor.instanceOf(type, "mindustry.ctype.Content")){
            if(write){
                s("s", field + ".id");
            }else{
                st(field + "mindustry.Vars.content.getByID(mindustry.ctype.ContentType.$L, read.s())", NovaProcessor.simpleName(type).toLowerCase().replace("type", ""));
            }
        }else if(serializer.writers.containsKey(type) && write){
            st("$L(write, $L)", serializer.writers.get(type), field);
        }else if(serializer.mutatorReaders.containsKey(type) && !write && !field.replace(" = ", "").contains(" ") && !field.isEmpty()){
            st("$L$L(read, $L)", field, serializer.mutatorReaders.get(type), field.replace(" = ", ""));
        }else if(serializer.readers.containsKey(type) && !write){
            st("$L$L(read)", field, serializer.readers.get(type));
        }else if(type.endsWith("[]")){
            String rawType = type.substring(0, type.length() - 2);

            if(write){
                s("i", field + ".length");
                cont("for(int INDEX = 0; INDEX < $L.length; INDEX ++)", field);
                io(rawType, field + "[INDEX]");
            }else{
                String fieldName = field.replace(" = ", "").replace("this.", "");
                String lenf = fieldName + "_LENGTH";
                s("i", "int " + lenf + " = ");
                if(!field.isEmpty()){
                    st("$Lnew $L[$L]", field, type.replace("[]", ""), lenf);
                }
                cont("for(int INDEX = 0; INDEX < $L; INDEX ++)", lenf);
                io(rawType, field.replace(" = ", "[INDEX] = "));
            }

            econt();
        }else if(type.startsWith("arc.struct") && type.contains("<")){ //it's some type of data structure
            String struct = type.substring(0, type.indexOf("<"));
            String generic = type.substring(type.indexOf("<") + 1, type.indexOf(">"));

            if(struct.equals("arc.struct.Queue") || struct.equals("arc.struct.Seq")){
                if(write){
                    s("i", field + ".size");
                    cont("for(int INDEX = 0; INDEX < $L.size; INDEX ++)", field);
                    io(generic, field + ".get(INDEX)");
                }else{
                    String fieldName = field.replace(" = ", "").replace("this.", "");
                    String lenf = fieldName + "_LENGTH";
                    s("i", "int " + lenf + " = ");
                    if(!field.isEmpty()){
                        st("$L.clear()", field.replace(" = ", ""));
                    }
                    cont("for(int INDEX = 0; INDEX < $L; INDEX ++)", lenf);
                    io(generic, field.replace(" = ", "_ITEM = ").replace("this.", generic + " "));
                    if(!field.isEmpty()){
                        String temp = field.replace(" = ", "_ITEM").replace("this.", "");
                        st("if($L != null) $L.add($L)", temp, field.replace(" = ", ""), temp);
                    }
                }

                econt();
            }else{
                Log.warn("Missing serialization code for collection '@' in '@'", type, name);
            }
        }else{
            Log.warn("Missing serialization code for type '@' in '@'", type, name);
        }
    }

    private void cont(String text, Object... fmt){
        method.beginControlFlow(text, fmt);
    }

    private void econt(){
        method.endControlFlow();
    }

    private void ncont(String text, Object... fmt){
        method.nextControlFlow(text, fmt);
    }

    private void st(String text, Object... args){
        method.addStatement(text, args);
    }

    private void s(String type, String field){
        if(write){
            method.addStatement("write.$L($L)", type, field);
        }else{
            method.addStatement("$Lread.$L()", field, type);
        }
    }

    public static class Revision{
        int version;
        Seq<RevisionField> fields;

        Revision(int version, Seq<RevisionField> fields){
            this.version = version;
            this.fields = fields;
        }

        Revision(){}

        boolean equal(Seq<FieldSpec> specs){
            if(fields.size != specs.size) return false;

            for(int i = 0; i < fields.size; i++){
                RevisionField field = fields.get(i);
                FieldSpec spec = specs.get(i);
                if(!field.type.replace("mw.gen.", "").equals(spec.type.toString().replace("mw.gen.", ""))){
                    return false;
                }
            }
            return true;
        }
    }

    public static class RevisionField{
        String name, type;

        RevisionField(String name, String type){
            this.name = name;
            this.type = type;
        }

        RevisionField(){}
    }
}
