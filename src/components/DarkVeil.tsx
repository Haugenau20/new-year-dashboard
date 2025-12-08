import { useRef, useEffect, memo } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';
import './DarkVeil.css';

const vertex = `
attribute vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}
`;

const fragment = `
#ifdef GL_ES
precision lowp float;
#endif
uniform vec2 uResolution;
uniform float uTime;
uniform float uHueShift;
uniform float uNoise;
uniform float uScan;
uniform float uScanFreq;
uniform float uWarp;
#define iTime uTime
#define iResolution uResolution

float rand(vec2 c){return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453);}

mat3 rgb2yiq=mat3(0.299,0.587,0.114,0.596,-0.274,-0.322,0.211,-0.523,0.312);
mat3 yiq2rgb=mat3(1.0,0.956,0.621,1.0,-0.272,-0.647,1.0,-1.106,1.703);

vec3 hueShiftRGB(vec3 col,float deg){
    vec3 yiq=rgb2yiq*col;
    float rad=radians(deg);
    float cosh=cos(rad),sinh=sin(rad);
    vec3 yiqShift=vec3(yiq.x,yiq.y*cosh-yiq.z*sinh,yiq.y*sinh+yiq.z*cosh);
    return clamp(yiq2rgb*yiqShift,0.0,1.0);
}

// Simplified pattern generation - replaces complex CPPN neural network
vec4 pattern_fn(vec2 coord,float in0,float in1,float in2){
    vec2 p=coord;
    float r=length(p);

    // Layer 1: Organic flow patterns
    vec2 q=vec2(
        cos(p.x*1.2+in0*3.0)+sin(p.y*1.3+in1*2.0),
        sin(p.x*1.3+in1*2.5)+cos(p.y*1.2+in2*3.0)
    );

    // Layer 2: Add complexity with modulated waves
    vec2 w=vec2(
        sin(q.x*2.1+r+in0)*cos(q.y*1.8),
        cos(q.x*1.9+in2)*sin(q.y*2.2+r)
    );

    // Layer 3: Final pattern intensity calculation
    float d1=dot(q,w)*0.5+0.5;
    float d2=length(q+w)*0.3;
    float d3=sin(r*2.0+in1*5.0)*0.5+0.5;

    // Combine into a single intensity value for more monochromatic base
    float intensity=d1*0.4+d2*0.3+d3*0.3;

    // Add subtle color variation (much less than before)
    vec3 col=vec3(
        intensity*0.95+d1*0.05,
        intensity*0.9+d2*0.1,
        intensity*0.85+d3*0.15
    );

    // Smooth clamping
    col=smoothstep(0.0,1.0,col);

    return vec4(col,1.0);
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv=fragCoord/uResolution.xy*2.-1.;
    uv.y*=-1.;
    uv+=uWarp*vec2(sin(uv.y*6.283+uTime*0.5),cos(uv.x*6.283+uTime*0.5))*0.05;
    fragColor=pattern_fn(uv,0.1*sin(0.3*uTime),0.1*sin(0.69*uTime),0.1*sin(0.44*uTime));
}

void main(){
    vec4 col;mainImage(col,gl_FragCoord.xy);
    col.rgb=hueShiftRGB(col.rgb,uHueShift);
    float scanline_val=sin(gl_FragCoord.y*uScanFreq)*0.5+0.5;
    col.rgb*=1.-(scanline_val*scanline_val)*uScan;
    col.rgb+=(rand(gl_FragCoord.xy+uTime)-0.5)*uNoise;
    gl_FragColor=vec4(clamp(col.rgb,0.0,1.0),1.0);
}
`;

type Props = {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
};

const DarkVeil = memo(function DarkVeil({
  hueShift = 0,
  noiseIntensity = 0,
  scanlineIntensity = 0,
  speed = 0.5,
  scanlineFrequency = 0,
  warpAmount = 0,
  resolutionScale = 0.5
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    const parent = canvas.parentElement as HTMLElement;

    // Apply resolutionScale to DPR for performance
    const effectiveDpr = Math.min(window.devicePixelRatio, 2) * resolutionScale;

    const renderer = new Renderer({
      dpr: effectiveDpr,
      canvas
    });

    const gl = renderer.gl;
    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2() },
        uHueShift: { value: hueShift },
        uNoise: { value: noiseIntensity },
        uScan: { value: scanlineIntensity },
        uScanFreq: { value: scanlineFrequency },
        uWarp: { value: warpAmount }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = parent.clientWidth,
        h = parent.clientHeight;

      // Render at reduced resolution for performance
      const renderW = Math.floor(w * resolutionScale);
      const renderH = Math.floor(h * resolutionScale);

      renderer.setSize(renderW, renderH);

      // CSS size fills parent (upscales the low-res render)
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      // Shader uses the scaled resolution
      program.uniforms.uResolution.value.set(renderW, renderH);
    };

    window.addEventListener('resize', resize);
    resize();

    const start = performance.now();
    let frame = 0;

    const loop = () => {
      program.uniforms.uTime.value = ((performance.now() - start) / 1000) * speed;
      program.uniforms.uHueShift.value = hueShift;
      program.uniforms.uNoise.value = noiseIntensity;
      program.uniforms.uScan.value = scanlineIntensity;
      program.uniforms.uScanFreq.value = scanlineFrequency;
      program.uniforms.uWarp.value = warpAmount;
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount, resolutionScale]);
  return (
    <div style={{ width: '100%', height: '100%', display: 'block', position: 'relative' }}>
      <canvas ref={ref} className="darkveil-canvas" />
    </div>
  );
});

export default DarkVeil;
