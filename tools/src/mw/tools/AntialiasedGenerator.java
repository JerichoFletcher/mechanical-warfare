package mw.tools;

import arc.files.*;

import java.awt.image.*;
import java.io.*;

import javax.imageio.*;

public class AntialiasedGenerator implements Generator{
    @Override
    public void generate(){
        Fi.get("./sprites-gen").walk(path -> {
            try{
                BufferedImage image = ImageIO.read(path.file());
                Sprite sprite = new Sprite(image).antialias();

                sprite.save(path.nameWithoutExtension());
            }catch(IOException e){
                throw new RuntimeException(e);
            }
        });
    }
}
