package mw.tools;

import arc.func.*;
import arc.graphics.*;
import arc.graphics.g2d.*;
import arc.graphics.g2d.TextureAtlas.*;
import arc.struct.*;
import arc.util.*;
import mindustry.graphics.*;
import mindustry.type.*;

import static mindustry.Vars.*;

public class OutlineGenerator implements Generator{
    @Override
    public void generate(){
        content.units().each(type -> {
            if(type.minfo.mod == null) return;

            ObjectSet<String> outlined = new ObjectSet<>();

            try{
                type.load();
                type.init();

                Color outc = Pal.darkerMetal;
                Func<Sprite, Sprite> outline = i -> i.outline(3, outc);
                Cons<TextureRegion> outliner = t -> {
                    if(t != null){
                        String fname = ((AtlasRegion)t).name.replaceFirst("mechanical-warfare-", "");

                        if(SpriteProcessor.has(fname)){
                            outline.get(SpriteProcessor.get(fname)).save(fname + "-outline");
                        }else{
                            Log.warn("@ not found", fname);
                        }
                    }
                };

                for(Weapon weapon : type.weapons){
                    String fname = weapon.name.replaceFirst("mechanical-warfare-", "");

                    if(outlined.add(fname) && SpriteProcessor.has(fname)){
                        outline.get(SpriteProcessor.get(fname)).save(fname + "-outline");
                    }
                }

                outliner.get(type.jointRegion);
                outliner.get(type.footRegion);
                outliner.get(type.legBaseRegion);
                outliner.get(type.baseJointRegion);
                outliner.get(type.legRegion);
                outliner.get(type.region);
            }catch(IllegalArgumentException e){
                Log.warn("Skipping unit @: @", type.name, e.getMessage());
            }
        });
    }
}
