package mw.annotations;

import java.lang.annotation.*;

public class Annotations{
    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.SOURCE)
    public @interface Component{
        boolean base() default false;
    }

    @Retention(RetentionPolicy.SOURCE)
    public @interface EntityDef{
        Class<?>[] value();

        boolean isFinal() default true;

        boolean pooled() default false;

        boolean serialize() default true;

        boolean genio() default true;
    }

    @Target({ElementType.FIELD})
    @Retention(RetentionPolicy.SOURCE)
    public @interface Import{
    }
}
