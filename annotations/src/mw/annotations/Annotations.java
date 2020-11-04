package mw.annotations;

import java.lang.annotation.*;

public class Annotations{
    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.SOURCE)
    public @interface Component{
        boolean base() default false;
    }

    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.SOURCE)
    public @interface InternalImpl{
    }

    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.SOURCE)
    public @interface MethodPriority{
        float value();
    }

    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.SOURCE)
    public @interface BaseComponent{
    }

    @Retention(RetentionPolicy.SOURCE)
    public @interface EntityDef{
        Class<?>[] value();

        boolean isFinal() default true;

        boolean pooled() default false;

        boolean serialize() default true;

        boolean genio() default true;
    }

    @Retention(RetentionPolicy.SOURCE)
    public @interface EntityPointer{
        Class<?> value();
    }

    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.SOURCE)
    public @interface EntityInterface{
    }

    @Target({ElementType.FIELD})
    @Retention(RetentionPolicy.SOURCE)
    public @interface Import{
    }

    @Target({ElementType.FIELD})
    @Retention(RetentionPolicy.SOURCE)
    public @interface Replace{
    }

    @Target({ElementType.FIELD})
    @Retention(RetentionPolicy.SOURCE)
    public @interface CallSuper{
    }

    @Target({ElementType.FIELD})
    @Retention(RetentionPolicy.SOURCE)
    public @interface ReadOnly{
    }

    @Target({ElementType.FIELD})
    @Retention(RetentionPolicy.SOURCE)
    public @interface SyncField{
        boolean value();

        boolean clamped() default false;
    }

    @Target({ElementType.FIELD})
    @Retention(RetentionPolicy.SOURCE)
    public @interface SyncLocal{

    }

    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.SOURCE)
    public @interface TypeIOHandler{
    }
}
