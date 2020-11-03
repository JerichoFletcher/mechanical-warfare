package mw.annotations.entity;

import nova.*;

import javax.annotation.processing.*;

@SupportedAnnotationTypes({
    "mw.annotations.Annotations.Component",
    "mw.annotations.Annotations.EntityDef"
})
public class EntityProcess extends NovaProcessor{
    {
        rounds = 3;
    }

    @Override
    public void process(RoundEnvironment env) throws Exception{
        
    }
}
