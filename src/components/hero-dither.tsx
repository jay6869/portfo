"use client";

import { useEffect, useRef } from "react";
import { THEME_EVENT } from "@/lib/theme";

/**
 * Ordered-dither wave field behind the hero.
 *
 * Ported from React Bits' <Dither/>, but written as one plain WebGL pass
 * instead of pulling in three + postprocessing + @react-three/fiber +
 * @react-three/postprocessing (~400kB). That stack renders the waves to a
 * buffer and dithers in a second post-process pass; dithering is a per-pixel
 * operation on a value this shader already holds, so the two passes collapse
 * into one and the dependencies disappear. Same look, ~4kB.
 *
 * Two further departures from the source:
 *
 * - The Bayer matrix is computed recursively rather than declared as a
 *   `float[64]` literal. Array constructors are GLSL ES 3.00; the literal
 *   version silently fails to compile on a WebGL1 context.
 * - The buffer is rendered at 1/PIXEL scale and upscaled with
 *   `image-rendering: pixelated`, so the pixelation is free instead of being
 *   simulated by quantising UVs at full resolution. At a 1920-wide viewport
 *   that is a quarter of the fragment work, which matters when the pattern
 *   costs eight noise evaluations per pixel.
 */

const PIXEL_DESKTOP = 2; // buffer downscale — larger is chunkier and cheaper
const PIXEL_MOBILE = 3;
const WAVE_SPEED = 0.045;
const WAVE_FREQUENCY = 2.6;
const WAVE_AMPLITUDE = 0.32;
const COLOR_STEPS = 4; // posterisation levels
const MOUSE_RADIUS = 0.21;
const WAVE_INTENSITY = 0.5; // how far the brightest band travels toward signal

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uMouseOn;
uniform vec3  uWave;
uniform vec3  uBase;

vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  for (int i = 0; i < 4; i++) {
    value += amp * abs(cnoise(p));
    p *= ${WAVE_FREQUENCY.toFixed(2)};
    amp *= ${WAVE_AMPLITUDE.toFixed(2)};
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - uTime * ${WAVE_SPEED.toFixed(3)};
  return fbm(p + fbm(p2));
}

/* Recursive ordered Bayer — the array-literal form needs GLSL ES 3.00. */
float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
#define bayer4(a) (bayer2(0.5 * (a)) * 0.25 + bayer2(a))
#define bayer8(a) (bayer4(0.5 * (a)) * 0.25 + bayer2(a))

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv - 0.5;
  p.x *= uRes.x / uRes.y;

  float f = pattern(p);

  if (uMouseOn > 0.5) {
    /* No Y flip here: uMouse is already converted to gl_FragCoord's bottom-up
       space on the JS side. The original shader flips because its JS passes
       raw top-down DOM coordinates — doing both inverts the interaction. */
    vec2 m = uMouse / uRes - 0.5;
    m.x *= uRes.x / uRes.y;
    float d = length(p - m);
    f -= 0.5 * (1.0 - smoothstep(0.0, ${MOUSE_RADIUS.toFixed(2)}, d));
  }

  vec3 col = mix(uBase, uWave, clamp(f, 0.0, 1.0));

  /* Ordered dither, then posterise to COLOR_STEPS bands. gl_FragCoord is
     already in downscaled space, so the 8x8 cell lands on chunky pixels. */
  float threshold = bayer8(gl_FragCoord.xy) - 0.5;
  float bandStep = 1.0 / (${COLOR_STEPS}.0 - 1.0);
  col += threshold * bandStep;
  col = clamp(col, 0.0, 1.0);
  col = floor(col * (${COLOR_STEPS}.0 - 1.0) + 0.5) / (${COLOR_STEPS}.0 - 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

/** Resolve a CSS colour of any syntax to 0–1 RGB by letting canvas 2D parse
 *  it — keeps --signal as the single source of truth rather than duplicating
 *  the hex here, and works for oklch(), which WebGL cannot read directly. */
function cssColorToRgb(value: string, fallback: [number, number, number]) {
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const ctx = c.getContext("2d");
    if (!ctx) return fallback;
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r / 255, g / 255, b / 255] as [number, number, number];
  } catch {
    return fallback;
  }
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function HeroDither() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const root = getComputedStyle(document.documentElement);

    const wave = cssColorToRgb(root.getPropertyValue("--signal").trim(), [0, 1, 0.61]);
    const base = cssColorToRgb(root.getPropertyValue("--background").trim(), [0.07, 0.07, 0.07]);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uMouseOn = gl.getUniformLocation(prog, "uMouseOn");
    const uWave = gl.getUniformLocation(prog, "uWave");
    const uBase = gl.getUniformLocation(prog, "uBase");

    // Brightest band stops short of full signal — at full strength the field
    // competes with the name for the first read.
    const pushWave = (rgb: [number, number, number]) => {
      gl.uniform3f(uWave, rgb[0] * WAVE_INTENSITY, rgb[1] * WAVE_INTENSITY, rgb[2] * WAVE_INTENSITY);
    };
    pushWave(wave);
    gl.uniform3f(uBase, base[0], base[1], base[2]);

    // The accent is read once at init, so a theme change has to say so.
    const onAccent = (e: Event) => {
      const hex = (e as CustomEvent<string>).detail;
      pushWave(cssColorToRgb(hex, wave));
      if (reduced || !running) draw(8);
    };
    window.addEventListener(THEME_EVENT, onAccent);

    const mouse = { x: -9999, y: -9999 };
    let pixel = PIXEL_DESKTOP;

    const resize = () => {
      pixel = window.matchMedia("(max-width: 767px)").matches ? PIXEL_MOBILE : PIXEL_DESKTOP;
      const w = window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w / pixel));
      canvas.height = Math.max(1, Math.floor(h / pixel));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    let raf = 0;
    let running = false;
    let visible = true;
    const start = performance.now();

    const draw = (t: number) => {
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseOn, !reduced && fine && mouse.x > -9000 ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = () => {
      if (!running) return;
      draw((performance.now() - start) / 1000);
      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (running || !visible || reduced) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const onPointer = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - box.left) / pixel;
      // Flip: gl_FragCoord counts up from the bottom.
      mouse.y = (box.height - (e.clientY - box.top)) / pixel;
    };

    const onResize = () => {
      resize();
      if (reduced || !running) draw(reduced ? 8 : (performance.now() - start) / 1000);
    };

    resize();
    draw(8); // one composed frame before the loop, so nothing flashes empty

    if (!reduced && fine) window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
        if (visible) kick();
        else {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVis = () => {
      visible = !document.hidden;
      if (visible) kick();
      else {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    canvas.style.opacity = "1";
    kick();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener(THEME_EVENT, onAccent);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="hero-dither pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-700"
    />
  );
}
