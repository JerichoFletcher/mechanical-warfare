package mw.tools;

import arc.*;
import arc.backend.headless.*;
import arc.files.*;
import arc.graphics.g2d.*;
import arc.graphics.g2d.TextureAtlas.*;
import arc.struct.*;
import arc.util.*;
import arc.util.Log.*;
import mindustry.core.*;
import mindustry.mod.*;
import mindustry.mod.Mods.*;
import mw.*;

import java.awt.image.*;
import java.io.*;
import java.sql.*;

import javax.imageio.*;

import static arc.Core.*;
import static mindustry.Vars.*;

public class SpriteProcessor{
    private static ObjectMap<String, TextureRegion> regionCache = new ObjectMap<>();
    private static ObjectMap<String, BufferedImage> spriteCache = new ObjectMap<>();

    public static MechanicalWarfare mod = new MechanicalWarfare();
    public static Seq<String> log = new Seq<>();

    public static void main(String[] args) throws Exception{
        headless = true;

        Log.logger = (level, text) -> {
            String[] stags = {"&lc&fb[D]", "&lb&fb[I]", "&ly&fb[W]", "&lr&fb[E]", ""};

            String rawText = Log.format(
                stags[level.ordinal()] + "&fr " + text
            );

            System.out.println(rawText);
            log.add(Log.removeColors(rawText));
        };

        Log.info("Setting up base fields...");
        mods = new Mods();
        atlas = new TextureAtlas(){
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
        app = new HeadlessApplication(new ApplicationListener(){
            @Override
            public void dispose(){
                Writer writer = Fi.get("../last_log.txt").writer(false);
                StringBuilder builder = new StringBuilder();

                log.each(str -> {
                    builder.append(str);
                    builder.append("\n");
                });

                try{
                    writer.write(builder.toString());
                    writer.flush();
                }catch(IOException e){
                    try{
                        err(e);
                    }catch(RuntimeException e2){
                        e2.printStackTrace();
                    }
                }
            }
        });

        Log.info("Initializing base contents...");
        content = new ContentLoader();
        content.createBaseContent();

        Log.info("Loading '@' contents...", mod.getClass().getSimpleName());
        content.setCurrentMod(new LoadedMod(null, null, mod, new ModMeta(){{
            name = "mechanical-warfare";
        }}));
        mod.loadContent();
        content.setCurrentMod(null);

        Log.info("Copying files...");
        Fi.get("./sprites").walk(path -> {
            if(!path.extEquals("png")) return;

            path.copyTo(Fi.get("./sprites-gen"));
        });

        Log.info("Adding files to the texture atlas...");
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
                err(e);
            }
        });

        Log.info("Generating additional sprites...");
        Generators.generate();

        Log.info("Saving sprites...");
        Fi.get("./sprites-gen").walk(path -> {
            try{
                BufferedImage image = ImageIO.read(path.file());

                Sprite sprite = new Sprite(image);
                sprite.floorAlpha();
                if(!path.absolutePath().contains("ui")) sprite.antialias();

                sprite.save(path.nameWithoutExtension());
            }catch(IOException e){
                err(e);
            }
        });

        Log.info("Disposing all sprites...");
        Sprite.dispose();

        Core.app.exit();
    }

    static BufferedImage buffer(TextureRegion reg){
        return spriteCache.get(((AtlasRegion)reg).name.replaceFirst("mechanical-warfare-", ""));
    }

    static boolean has(String name){
        return Core.atlas.has(name);
    }

    static boolean has(TextureRegion region){
        return has(((AtlasRegion)region).name.replaceFirst("mechanical-warfare-", ""));
    }

    static Sprite get(String name){
        return get(Core.atlas.find(name));
    }

    static Sprite get(TextureRegion region){
        GenRegion.validate(region);

        return new Sprite(spriteCache.get(((AtlasRegion)region).name.replaceFirst("mechanical-warfare-", "")));
    }

    static void err(String message, Object... args){
        err(new IllegalArgumentException(Strings.format(message, args)));
    }

    static void err(Throwable e){
        StringWriter swriter = new StringWriter();
        PrintWriter writer = new PrintWriter(swriter);
        e.printStackTrace(writer);

        log.add(Strings.format("@[E]@ @", ColorCodes.red, ColorCodes.reset, swriter.toString()));

        throw new RuntimeException(e);
    }

    static class GenRegion extends AtlasRegion{
        boolean invalid;
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
