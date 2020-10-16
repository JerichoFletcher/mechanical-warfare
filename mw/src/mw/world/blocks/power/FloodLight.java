package mw.world.blocks.power;

import arc.*;
import arc.graphics.*;
import arc.graphics.g2d.*;
import arc.math.*;
import arc.math.geom.*;
import arc.scene.ui.layout.*;
import arc.util.*;
import arc.util.io.*;
import mindustry.game.*;
import mindustry.gen.*;
import mindustry.graphics.*;
import mindustry.world.blocks.power.*;

import static mindustry.Vars.*;

public class FloodLight extends LightBlock{
    public float length = 300f;
    public float width = 20f;
    public float opacity = 1f;
    public int rayCount = 4;

    public float rotateSpeed = 3f;
    public float angleIncr = 15f;

    public TextureRegion baseRegion;

    protected static Rect viewport = new Rect();

    public FloodLight(String name){
        super(name);
        outlineIcon = true;

        config(Float.class, (FloodLightBuild build, Float i) -> build.targetRot += i);
    }

    @Override
    public void load(){
        super.load();

        baseRegion = Core.atlas.find("block-" + size);
    }

    @Override
    protected TextureRegion[] icons(){
        return new TextureRegion[]{baseRegion, region};
    }

    public class FloodLightRay implements Position{
        public FloodLightBuild parent;

        public FloodLightRay(FloodLightBuild parent){
            this.parent = parent;
        }

        @Override
        public float getX(){
            return parent.x;
        }

        @Override
        public float getY(){
            return parent.x;
        }

        public void draw(Color color){
            for(int i = 0; i < rayCount; i++){
                float j = i - (rayCount + 1f) / 2f;

                Tmp.v1.trns(parent.currentRot - 90f, widthf() * j, lengthf());

                Draw.z(Layer.light);
                renderer.lights.line(getX(), getY(), Tmp.v1.x, Tmp.v2.y, widthf(), color, opacf());
            }
        }

        public float lengthf(){
            return length * parent.efficiency();
        }

        public float widthf(){
            return width * parent.efficiency();
        }

        public float opacf(){
            return opacity * parent.efficiency();
        }
    }

    public class FloodLightBuild extends LightBuild{
        public FloodLightRay light;
        public float currentRot = 90f;
        public float targetRot = 90f;

        @Override
        public void created(){
            super.created();

            if(light == null){
                light = new FloodLightRay(this);

                Events.run(EventType.Trigger.draw, () -> {
                    if(light == null || dead()) return;
        
                    Core.camera.bounds(viewport);
        
                    if(viewport.overlaps(x - length / 2f, y - length / 2f, length, length)){
                        light.draw(Tmp.c1.set(color));
                    }
                });
            }
        }

        @Override
        public void buildConfiguration(Table table) {
            table.button(Icon.left, () -> {
                configure(angleIncr);

                Sounds.click.play();
            }).size(50f);

            super.buildConfiguration(table);

            table.button(Icon.right, () -> {
                configure(-angleIncr);

                Sounds.click.play();
            }).size(50f);
        }

        @Override
        public void draw(){
            float z = Draw.z();

            Draw.rect(baseRegion, x, y);

            Draw.z(Layer.turret);
            Draw.rect(region, x, y, currentRot);
            Draw.z(z);
        }

        @Override
        public void drawConfigure(){
            super.drawConfigure();

            Draw.color(team().color);
            Lines.stroke(1f);

            Tmp.v2.trns(targetRot, length).add(this);
            Lines.dashLine(x, y, Tmp.v2.x, Tmp.v2.y, Mathf.round(length / 3f));

            Draw.reset();
        }

        @Override
        public void drawLight(){}

        @Override
        public void updateTile(){
            super.updateTile();

            currentRot = Angles.moveToward(currentRot, targetRot, rotateSpeed);
        }

        @Override
        public void write(Writes write){
            super.write(write);

            write.f(currentRot);
            write.f(targetRot);
        }

        @Override
        public void read(Reads read){
            super.read(read);

            currentRot = read.f();
            targetRot = read.f();
        }
    }
}
