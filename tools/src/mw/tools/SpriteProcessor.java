package mw.tools;

import arc.files.*;
import arc.func.*;
import arc.graphics.*;
import mindustry.core.*;

import java.io.*;
import java.util.*;

import javax.imageio.*;
import java.awt.image.*;

import static mindustry.Vars.*;

public class SpriteProcessor{
    public static void main(String[] args) throws Exception{
        headless = true;

        content = new ContentLoader();
        content.createBaseContent();

        Fi.get("./sprites-gen").walk(path -> {
            if(!path.extEquals("png")) return;

            try{
                BufferedImage image = ImageIO.read(path.file());
                if(image == null) throw new IOException("image " + path.absolutePath() + " is corrupted or invalid!");

                BufferedImage antialiased = antialias(path);
                ImageIO.write(antialiased, "png", path.file());
            }catch(IOException e){
                throw new RuntimeException(e);
            }
        });
    }

    public static BufferedImage antialias(Fi path) throws IOException{
        BufferedImage image = ImageIO.read(path.file());
        BufferedImage out = ImageIO.read(path.file());

        Func2<Integer, Integer, Integer> getRGB = (ix, iy) -> {
            return image.getRGB(Math.max(Math.min(ix, image.getWidth() - 1), 0), Math.max(Math.min(iy, image.getHeight() - 1), 0));
        };

        Color color = new Color();
        Color sum = new Color();
        Color suma = new Color();
        int[] p = new int[9];

        for(int x = 0; x < image.getWidth(); x++){
            for(int y = 0; y < image.getHeight(); y++){
                int A = getRGB.get(x - 1, y + 1),
                    B = getRGB.get(x, y + 1),
                    C = getRGB.get(x + 1, y + 1),
                    D = getRGB.get(x - 1, y),
                    E = getRGB.get(x, y),
                    F = getRGB.get(x + 1, y),
                    G = getRGB.get(x - 1, y - 1),
                    H = getRGB.get(x, y - 1),
                    I = getRGB.get(x + 1, y - 1);

                Arrays.fill(p, E);

                if(D == B && D != H && B != F) p[0] = D;
                if((D == B && D != H && B != F && E != C) || (B == F && B != D && F != H && E != A)) p[1] = B;
                if(B == F && B != D && F != H) p[2] = F;
                if((H == D && H != F && D != B && E != A) || (D == B && D != H && B != F && E != G)) p[3] = D;
                if((B == F && B != D && F != H && E != I) || (F == H && F != B && H != D && E != C)) p[5] = F;
                if(H == D && H != F && D != B) p[6] = D;
                if((F == H && F != B && H != D && E != G) || (H == D && H != F && D != B && E != I)) p[7] = H;
                if(F == H && F != B && H != D) p[8] = F;

                suma.set(0);

                for(int val : p){
                    color.argb8888(val);
                    suma.r += color.r * color.a;
                    suma.g += color.g * color.a;
                    suma.b += color.b * color.a;
                    suma.a += color.a;
                }

                float fm = suma.a <= 0.001f ? 0f : 1f / suma.a;
                suma.mul(fm, fm, fm, fm);

                float total = 0f;
                sum.set(0);

                for(int val : p){
                    color.argb8888(val);
                    float a = color.a;
                    color.lerp(suma, 1f - a);
                    sum.r += color.r;
                    sum.g += color.g;
                    sum.b += color.b;
                    sum.a += a;
                    total += 1f;
                }

                fm = (float)(1f / total);
                sum.mul(fm, fm, fm, fm);
                out.setRGB(x, y, sum.argb8888());
                sum.set(0);
            }
        }

        return out;
    }
}
