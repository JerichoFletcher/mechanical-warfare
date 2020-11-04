package mw.annotations.entity;

import arc.func.*;
import arc.struct.*;
import arc.util.*;
import arc.util.io.*;
import arc.util.pooling.Pool.*;

import com.squareup.javapoet.*;
import nova.*;
import nova.model.elements.*;
import mw.annotations.Annotations.*;
import mw.annotations.entity.TypeIOResolver.*;

import java.lang.annotation.*;
import javax.annotation.processing.*;
import javax.lang.model.element.*;
import javax.lang.model.type.*;

@SupportedAnnotationTypes({
    "mw.annotations.Annotations.Component",
    "mw.annotations.Annotations.EntityDef",
    "mw.annotations.Annotations.EntityPointer",
    "mw.annotations.Annotations.EntityInterface"
})
public class EntityProcess extends NovaProcessor{
    Seq<NovaType> baseComponents = new Seq<>();
    Seq<NovaElement<?>> allDefs = new Seq<>();
    Seq<NovaElement<?>> allPointers = new Seq<>();
    ObjectMap<String, NovaType> componentNames = new ObjectMap<>();
    ObjectMap<NovaType, Seq<NovaType>> componentDependencies = new ObjectMap<>();
    ObjectMap<NovaElement<?>, Seq<NovaType>> defComponents = new ObjectMap<>();
    ObjectMap<String, String> varInitializers = new ObjectMap<>();
    ObjectMap<String, String> methodBlocks = new ObjectMap<>();
    ObjectMap<NovaType, ObjectSet<NovaType>> baseClassDeps = new ObjectMap<>();
    Seq<TypeSpec.Builder> baseClasses = new Seq<>();
    ClassSerializer serializer;

    {
        packageName = "mw.gen";
        rounds = 3;
    }

    @Override
    public void process(RoundEnvironment env) throws Exception{
        allDefs.addAll(elements(EntityDef.class));
        allPointers.addAll(elements(EntityPointer.class));

        if(round == 1){
            Seq<NovaType> allComponents = types(Component.class);

            for(NovaType comp : allComponents){
                componentNames.put(comp.name(), comp);
            }

            for(NovaType comp : allComponents){
                TypeSpec.Builder inter = TypeSpec.interfaceBuilder(interfaceName(comp))
                .addModifiers(Modifier.PUBLIC).addAnnotation(EntityInterface.class);

                inter.addJavadoc("Interface for {@link $L}", comp.fullName());

                for(NovaType extraInter : comp.interfaces().select(i -> !isCompInterface(i))){
                    inter.superinterfaces.add(tname(extraInter.fullName()));
                }

                Seq<NovaType> depends = getDependencies(comp);
                for(NovaType type : depends){
                    inter.addSuperinterface(ClassName.get(packageName, interfaceName(type)));
                }

                write(inter);
            }
        }else if(round == 2){
            ObjectMap<String, NovaElement<?>> usedNames = new ObjectMap<>();
            ObjectMap<NovaElement<?>, ObjectSet<String>> extraNames = new ObjectMap<>();

            for(NovaElement<?> type : allDefs){
                EntityDef ann = type.annotation(EntityDef.class);

                Seq<NovaType> components = allComponents(type);
                ObjectMap<String, Seq<NovaMethod>> methods = new ObjectMap<>();
                ObjectMap<FieldSpec, NovaVar> specVariables = new ObjectMap<>();
                ObjectSet<String> usedFields = new ObjectSet<>();

                Seq<NovaType> baseClasses = components.select(s -> s.annotation(Component.class).base());
                if(baseClasses.size > 2){
                    Log.err("[@] No entity may have more than 2 base classes. Base classes: @", type.name(), baseClasses.toString());
                }

                NovaType baseClassType = baseClasses.any() ? baseClasses.first() : null;
                @Nullable TypeName baseClass = baseClasses.any() ? tname(packageName + "." + baseName(baseClassType)) : null;

                boolean typeIsBase = baseClassType != null && type.has(Component.class) && type.annotation(Component.class).base();

                if(type.isType() && (!type.name().endsWith("Def") && !type.name().endsWith("Comp"))){
                    Log.err("[@] All entity def names must end with 'Def'/'Comp'", type.e);
                }

                String name = type.isType() ?
                    type.name().replace("Def", "").replace("Comp", "") :
                    createName(type);

                if(!typeIsBase && baseClass != null && name.equals(baseName(baseClassType))){
                    name += "Entity";
                }

                if(usedNames.containsKey(name)){
                    extraNames.get(usedNames.get(name), ObjectSet::new).add(type.name());
                    continue;
                }

                usedNames.put(name, type);
                extraNames.get(type, ObjectSet::new).add(name);
                if(!type.isType()){
                    extraNames.get(type, ObjectSet::new).add(type.name());
                }

                TypeSpec.Builder builder = TypeSpec.classBuilder(name).addModifiers(Modifier.PUBLIC);

                builder.addMethod(MethodSpec.methodBuilder("serialize").addModifiers(Modifier.PUBLIC).returns(boolean.class).addStatement("return " + ann.serialize()).build());

                Seq<NovaVar> syncedFields = new Seq<>();
                Seq<NovaVar> allFields = new Seq<>();
                Seq<FieldSpec> allFieldSpecs = new Seq<>();

                boolean isSync = components.contains(s -> s.name().contains("Sync"));

                for(NovaType comp : components){
                    boolean isShadowed = baseClass != null && !typeIsBase && baseClassDeps.get(baseClassType).contains(comp);

                    Seq<NovaVar> fields = comp.fields().select(f -> !f.has(Import.class));
                    for(NovaVar f : fields){
                        if(!usedFields.add(f.name())){
                            Log.err("Field '" + f.name() + "' of component '" + comp.name() + "' redefines a field in entity '" + type.name() + "'");

                            continue;
                        }

                        FieldSpec.Builder fbuilder = FieldSpec.builder(f.tname(), f.name());

                        if(f.is(Modifier.STATIC)){
                            fbuilder.addModifiers(Modifier.STATIC);
                            if(f.is(Modifier.FINAL)) fbuilder.addModifiers(Modifier.FINAL);
                        }

                        if(f.is(Modifier.TRANSIENT)){
                            fbuilder.addModifiers(Modifier.TRANSIENT);
                        }

                        if(varInitializers.containsKey(f.descString())){
                            fbuilder.initializer(varInitializers.get(f.descString()));
                        }

                        fbuilder.addModifiers(f.has(ReadOnly.class) ? Modifier.PROTECTED : Modifier.PUBLIC);
                        fbuilder.addAnnotations(f.annotations().map(AnnotationSpec::get));
                        FieldSpec spec = fbuilder.build();

                        boolean isVisible = !f.is(Modifier.STATIC) && !f.is(Modifier.PRIVATE) && !f.has(ReadOnly.class);

                        if(!isShadowed || !isVisible){
                            builder.addField(spec);
                        }

                        specVariables.put(spec, f);

                        allFieldSpecs.add(spec);
                        allFields.add(f);

                        if(f.has(SyncField.class) && isSync){
                            if(!f.tname().toString().equals("float")) Log.err("[@] All SyncFields must be of type float", f);

                            syncedFields.add(f);

                            builder.addField(FieldSpec.builder(float.class, f.name() + EntityIO.targetSuf).addModifiers(Modifier.TRANSIENT, Modifier.PRIVATE).build());

                            builder.addField(FieldSpec.builder(float.class, f.name() + EntityIO.lastSuf).addModifiers(Modifier.TRANSIENT, Modifier.PRIVATE).build());
                        }
                    }

                    for(NovaMethod elem : comp.methods()){
                        methods.get(elem.toString(), Seq::new).add(elem);
                    }
                }

                syncedFields.sortComparing(NovaElement::name);

                builder.addMethod(MethodSpec.methodBuilder("toString")
                    .addAnnotation(Override.class)
                    .returns(String.class)
                    .addModifiers(Modifier.PUBLIC)
                    .addStatement("return $S + $L", name + "#", "id").build());

                EntityIO io = new EntityIO(type.name(), builder, allFieldSpecs, serializer, rootDirectory.child("annotations/src/main/resources/revisions").child(type.name()));

                boolean hasIO = ann.genio() && (components.contains(s -> s.name().contains("Sync")) || ann.serialize());

                for(ObjectMap.Entry<String, Seq<NovaMethod>> entry : methods){
                    if(entry.value.contains(m -> m.has(Replace.class))){
                        if(entry.value.count(m -> m.has(Replace.class)) > 1){
                            Log.err("Type " + type + " has multiple components replacing method " + entry.key + ".");
                        }

                        NovaMethod base = entry.value.find(m -> m.has(Replace.class));
                        entry.value.clear();
                        entry.value.add(base);
                    }

                    if(entry.value.count(m -> !m.isAny(Modifier.NATIVE, Modifier.ABSTRACT) && !m.isVoid()) > 1){
                        Log.err("Type " + type + " has multiple components implementing non-void method " + entry.key + ".");
                    }

                    entry.value.sort(Structs.comps(Structs.comparingFloat(m -> m.has(MethodPriority.class) ? m.annotation(MethodPriority.class).value() : 0), Structs.comparing(NovaElement::name)));

                    NovaMethod first = entry.value.first();

                    if(first.has(InternalImpl.class)){
                        continue;
                    }

                    MethodSpec.Builder mbuilder = MethodSpec.methodBuilder(first.name()).addModifiers(first.is(Modifier.PRIVATE) ? Modifier.PRIVATE : Modifier.PUBLIC);

                    if(entry.value.contains(s -> s.has(CallSuper.class))) mbuilder.addAnnotation(CallSuper.class);
                    if(first.is(Modifier.STATIC)) mbuilder.addModifiers(Modifier.STATIC);

                    mbuilder.addTypeVariables(first.typeVariables().map(TypeVariableName::get));
                    mbuilder.returns(first.retn());
                    mbuilder.addExceptions(first.thrownt());

                    for(NovaVar var : first.params()){
                        mbuilder.addParameter(var.tname(), var.name());
                    }

                    boolean writeBlock = first.ret().toString().equals("void") && entry.value.size > 1;

                    if((entry.value.first().is(Modifier.ABSTRACT) || entry.value.first().is(Modifier.NATIVE)) && entry.value.size == 1 && !entry.value.first().has(InternalImpl.class)){
                        Log.err(entry.value.first().up().getSimpleName() + "#" + entry.value.first() + " is an abstract method and must be implemented in some component", type);
                    }

                    if(first.name().equals("add") || first.name().equals("remove")){
                        mbuilder.addStatement("if(added == $L) return", first.name().equals("add"));
                    }

                    if(hasIO){
                        if((first.name().equals("read") || first.name().equals("write"))){
                            io.write(mbuilder, first.name().equals("write"));
                        }

                        if((first.name().equals("readSync") || first.name().equals("writeSync"))){
                            io.writeSync(mbuilder, first.name().equals("writeSync"), syncedFields, allFields);
                        }

                        if((first.name().equals("readSyncManual") || first.name().equals("writeSyncManual"))){
                            io.writeSyncManual(mbuilder, first.name().equals("writeSyncManual"), syncedFields);
                        }

                        if(first.name().equals("interpolate")){
                            io.writeInterpolate(mbuilder, syncedFields);
                        }

                        if(first.name().equals("snapSync")){
                            mbuilder.addStatement("updateSpacing = 16");
                            mbuilder.addStatement("lastUpdated = $T.millis()", Time.class);
                            for(NovaVar field : syncedFields){
                                mbuilder.addStatement("$L = $L", field.name() + EntityIO.lastSuf, field.name() + EntityIO.targetSuf);
                                mbuilder.addStatement("$L = $L", field.name(), field.name() + EntityIO.targetSuf);
                            }
                        }

                        if(first.name().equals("snapInterpolation")){
                            mbuilder.addStatement("updateSpacing = 16");
                            mbuilder.addStatement("lastUpdated = $T.millis()", Time.class);
                            for(NovaVar field : syncedFields){
                                mbuilder.addStatement("$L = $L", field.name() + EntityIO.lastSuf, field.name());
                                mbuilder.addStatement("$L = $L", field.name() + EntityIO.targetSuf, field.name());
                            }
                        }
                    }

                    for(NovaMethod elem : entry.value){
                        String descStr = elem.descString();

                        if(elem.is(Modifier.ABSTRACT) || elem.is(Modifier.NATIVE) || !methodBlocks.containsKey(descStr)) continue;

                        String str = methodBlocks.get(descStr);
                        String blockName = elem.up().getSimpleName().toString().toLowerCase().replace("comp", "");

                        if(str.replace("{", "").replace("\n", "").replace("}", "").replace("\t", "").replace(" ", "").isEmpty()){
                            continue;
                        }

                        if(writeBlock){
                            str = str.replace("return;", "break " + blockName + ";");
                            mbuilder.addCode(blockName + ": {\n");
                        }

                        str = str.substring(2, str.length() - 1);

                        mbuilder.addCode(str);

                        if(writeBlock) mbuilder.addCode("}\n");
                    }

                    if(first.name().equals("remove") && ann.pooled()){
                        mbuilder.addStatement("mindustry.gen.Groups.queueFree(($T)this)", Poolable.class);
                    }

                    builder.addMethod(mbuilder.build());
                }

                if(ann.pooled()){
                    builder.addSuperinterface(Poolable.class);
                    MethodSpec.Builder resetBuilder = MethodSpec.methodBuilder("reset").addModifiers(Modifier.PUBLIC);
                    for(FieldSpec spec : allFieldSpecs){
                        @Nullable NovaVar variable = specVariables.get(spec);
                        if(variable != null && variable.isAny(Modifier.STATIC, Modifier.FINAL)) continue;
                        String desc = variable.descString();

                        if(spec.type.isPrimitive()){
                            resetBuilder.addStatement("$L = $L", spec.name, variable != null && varInitializers.containsKey(desc) ? varInitializers.get(desc) : getDefault(spec.type.toString()));
                        }else{
                            if(!varInitializers.containsKey(desc)){
                                resetBuilder.addStatement("$L = null", spec.name);
                            }
                        }
                    }

                    builder.addMethod(resetBuilder.build());
                }

                builder.addMethod(MethodSpec.constructorBuilder().addModifiers(Modifier.PROTECTED).build());

                builder.addMethod(MethodSpec.methodBuilder("create").addModifiers(Modifier.PUBLIC, Modifier.STATIC)
                .returns(tname(packageName + "." + name))
                .addStatement(ann.pooled() ? "return Pools.obtain($L.class, " +name +"::new)" : "return new $L()", name).build());

                definitions.add(new EntityDefinition(packageName + "." + name, builder, type, typeIsBase ? null : baseClass, components, groups, allFieldSpecs));
            }

            StringMap map = new StringMap();
            Fi idProps = rootDirectory.child("annotations/resources/classids.properties");
            if(!idProps.exists()) idProps.writeString("");
            PropertiesUtils.load(map, idProps.reader());

            Integer max = map.values().toSeq().map(Integer::parseInt).max(i -> i);
            int maxID = max == null ? 0 : max + 1;

            definitions.sort(Structs.comparing(t -> t.naming.toString()));
            for(EntityDefinition def : definitions){
                String name = def.naming.fullName();
                if(map.containsKey(name)){
                    def.classID = map.getInt(name);
                }else{
                    def.classID = maxID++;
                    map.put(name, def.classID + "");
                }
            }

            OrderedMap<String, String> res = new OrderedMap<>();
            res.putAll(map);
            res.orderedKeys().sort();

            PropertiesUtils.store(res, idProps.writer(false), "Maps entity names to IDs. Autogenerated.");

            TypeSpec.Builder idBuilder = TypeSpec.classBuilder("MWEntityMapping").addModifiers(Modifier.PUBLIC)
            .addField(FieldSpec.builder(TypeName.get(Prov[].class), "idMap", Modifier.PUBLIC, Modifier.STATIC).initializer("new Prov[256]").build())
            .addField(FieldSpec.builder(ParameterizedTypeName.get(ClassName.get(ObjectMap.class),
                tname(String.class), tname(Prov.class)),
                "nameMap", Modifier.PUBLIC, Modifier.STATIC).initializer("new ObjectMap<>()").build())
            .addMethod(MethodSpec.methodBuilder("map").addModifiers(Modifier.PUBLIC, Modifier.STATIC)
                .returns(TypeName.get(Prov.class)).addParameter(int.class, "id").addStatement("return idMap[id]").build())
            .addMethod(MethodSpec.methodBuilder("map").addModifiers(Modifier.PUBLIC, Modifier.STATIC)
                .returns(TypeName.get(Prov.class)).addParameter(String.class, "name").addStatement("return nameMap.get(name)").build());

            CodeBlock.Builder idStore = CodeBlock.builder();

            for(EntityDefinition def : definitions){
                idStore.addStatement("idMap[$L] = $L::new", def.classID, def.name);
                extraNames.get(def.naming).each(extra -> {
                    idStore.addStatement("nameMap.put($S, $L::new)", extra, def.name);
                    if(!Strings.camelToKebab(extra).equals(extra)){
                        idStore.addStatement("nameMap.put($S, $L::new)", Strings.camelToKebab(extra), def.name);
                    }
                });

                def.builder.addMethod(MethodSpec.methodBuilder("classId").addAnnotation(Override.class)
                    .returns(int.class).addModifiers(Modifier.PUBLIC).addStatement("return " + def.classID).build());
            }

            idBuilder.addStaticBlock(idStore.build());

            write(idBuilder);
        }
    }

    String interfaceName(NovaType comp){
        String suffix = "Comp";
        if(!comp.name().endsWith(suffix)){
            Log.err("[@] All components must have names that end with 'Comp'", comp.e);
        }

        return comp.name().substring(0, comp.name().length() - suffix.length()) + "c";
    }

    String baseName(NovaType comp){
        String suffix = "Comp";
        if(!comp.name().endsWith(suffix)) Log.err("[@] All components must have names that end with 'Comp'", comp.e);

        return comp.name().substring(0, comp.name().length() - suffix.length());
    }

    @Nullable NovaType interfaceToComp(NovaType type){
        String name = type.name().substring(0, type.name().length() - 1) + "Comp";

        return componentNames.get(name);
    }

    boolean isCompInterface(NovaType type){
        return interfaceToComp(type) != null;
    }

    String createName(NovaElement<?> elem){
        Seq<NovaType> comps = types(elem.annotation(EntityDef.class), EntityDef::value).map(this::interfaceToComp);;
        comps.sortComparing(NovaElement::name);

        return comps.toString("", s -> s.name().replace("Comp", ""));
    }

    Seq<NovaType> getDependencies(NovaType component){
        if(!componentDependencies.containsKey(component)){
            ObjectSet<NovaType> out = new ObjectSet<>();

            out.addAll(component.interfaces().select(this::isCompInterface).map(this::interfaceToComp));
            out.remove(component);

            ObjectSet<NovaType> result = new ObjectSet<>();
            for(NovaType type : out){
                result.add(type);
                result.addAll(getDependencies(type));
            }

            if(component.annotation(BaseComponent.class) == null){
                result.addAll(baseComponents);
            }

            out.remove(component);
            componentDependencies.put(component, result.asArray());
        }

        return componentDependencies.get(component);
    }

    Seq<NovaType> allComponents(NovaElement<?> type){
        if(!defComponents.containsKey(type)){
            Seq<NovaType> interfaces = types(type.annotation(EntityDef.class), EntityDef::value);
            Seq<NovaType> components = new Seq<>();
            for(NovaType i : interfaces){
                NovaType comp = interfaceToComp(i);
                if(comp != null){
                   components.add(comp);
                }else{
                    throw new IllegalArgumentException("Type '" + i + "' is not a component interface!");
                }
            }

            ObjectSet<NovaType> out = new ObjectSet<>();
            for(NovaType comp : components){
                out.add(comp);
                out.addAll(getDependencies(comp));
            }

            defComponents.put(type, out.asArray());
        }

        return defComponents.get(type);
    }

    <T extends Annotation> Seq<NovaType> types(T t, Cons<T> cons){
        try{
            cons.get(t);
        }catch(MirroredTypesException e){
            return Seq.with(e.getTypeMirrors()).map(NovaType::of);
        }

        throw new IllegalArgumentException("Missing types.");
    }
}
