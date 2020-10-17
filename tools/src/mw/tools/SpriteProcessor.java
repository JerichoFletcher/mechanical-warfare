package mw.tools;

import arc.*;
import arc.files.*;
import arc.graphics.g2d.*;
import arc.graphics.g2d.TextureAtlas.*;
import arc.struct.*;
import arc.util.*;
import mindustry.core.*;
import mindustry.mod.Mods.*;
import mw.*;

import java.awt.image.*;
import java.io.*;

import javax.imageio.*;

import static mindustry.Vars.*;

public class SpriteProcessor{
    static ObjectMap<String, TextureRegion> regionCache = new ObjectMap<>();
    static ObjectMap<String, BufferedImage> spriteCache = new ObjectMap<>();

    static MechanicalWarfare mod = new MechanicalWarfare();

    public static void main(String[] args) throws Exception{
        headless = true;

        content = new ContentLoader();
        content.createBaseContent();

        //setup dummy loaded mod to load mw contents properly
        content.setCurrentMod(new LoadedMod(null, null, mod, new ModMeta(){{
            name = "mechanical-warfare";
        }}));

        mod.loadContent();

        content.setCurrentMod(null);

        Fi.get("./sprites").walk(path -> {
            if(!path.extEquals("png")) return;

            path.copyTo(Fi.get("./sprites-gen"));
        });

        Fi.get("./sprites-gen").walk(path -> {
            String fname = path.nameWithoutExtension();

            try{
                BufferedImage sprite = ImageIO.read(path.file());
                if(sprite == null) throw new IOException("sprite " + path.absolutePath() + " is corrupted or invalid!");

                GenRegion region = new GenRegion(fname, path){{
                    width = sprite.getWidth();
                    height = sprite.getHeight();
                    u2 = v2 = 1f;
                    u = v = 0f;
                }};

                regionCache.put(fname, region);
                spriteCache.put(fname, sprite);
            }catch(IOException e){
                throw new RuntimeException(e);
            }
        });

        Core.atlas = new TextureAtlas(){
            @Override
            public AtlasRegion find(String name){
                if(!regionCache.containsKey(name)){
                    GenRegion region = new GenRegion(name, null);
                    region.invalid = true;

                    return region;
                }

                return (AtlasRegion)regionCache.get(name);
            }

            @Override
            public AtlasRegion find(String name, TextureRegion def){
                if(!regionCache.containsKey(name)){
                    return (AtlasRegion)def;
                }

                return (AtlasRegion)regionCache.get(name);
            }

            @Override
            public AtlasRegion find(String name, String def){
                if(!regionCache.containsKey(name)){
                    return (AtlasRegion)regionCache.get(def);
                }

                return (AtlasRegion)regionCache.get(name);
            }

            @Override
            public boolean has(String name){
                return regionCache.containsKey(name);
            }
        };

        Generators.generate();

        Sprite.dispose();
    }

    public static BufferedImage buffer(TextureRegion reg){
        return spriteCache.get(((AtlasRegion)reg).name.replaceFirst("mechanical-warfare-", ""));
    }

    public static boolean has(String name){
        return Core.atlas.has(name);
    }

    public static boolean has(TextureRegion region){
        return has(((AtlasRegion)region).name.replaceFirst("mechanical-warfare-", ""));
    }

    public static Sprite get(String name){
        return get(Core.atlas.find(name));
    }

    public static Sprite get(TextureRegion region){
        GenRegion.validate(region);

        return new Sprite(spriteCache.get(((AtlasRegion)region).name.replaceFirst("mechanical-warfare-", "")));
    }

    static void err(String message, Object... args){
        throw new IllegalArgumentException(Strings.format(message, args));
    }

    static class GenRegion extends AtlasRegion{
        boolean invalid = false;
        Fi path;

        GenRegion(String name, Fi path){
            if(name == null) throw new IllegalArgumentException("name is null");
            this.name = name;
            this.path = path;
        }

        @Override
        public boolean found(){
            return !invalid;
        }

        static void validate(TextureRegion region){
            if(((GenRegion)region).invalid){
                err("Region does not exist: @", ((GenRegion)region).name);
            }
        }
    }
}
