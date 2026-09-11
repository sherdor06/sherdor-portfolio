"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_shift;

#define PI 3.14159265359
#define CYCLE_DURATION 7.0
#define TEAR_SPEED 1.0
#define GLOW_INTENSITY 1.0

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash2(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p, int octaves) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    v += a * vnoise(p);
    p = rot * p * 2.1 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

// High-detail FBM for the fibrous tear edge.
float fibrousFbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 7; i++) {
    v += a * vnoise(p);
    p = rot * p * 2.0 + vec2(3.1, 7.4);
    a *= 0.52;
  }
  return v;
}

// x = progress within the phase, y = phase (0 calm, 1 tear, 2 open, 3 reform).
// Seconds out of the 7s cycle: calm 1.5, tear 1.5, open 2, reform 2.
vec2 getPhase(float t, float speed) {
  float cycle = CYCLE_DURATION / speed;
  float norm = mod(t, cycle) / cycle;
  float p0 = 1.5 / 7.0;
  float p1 = p0 + 1.5 / 7.0;
  float p2 = p1 + 2.0 / 7.0;
  if (norm < p0) return vec2(norm / p0, 0.0);
  if (norm < p1) return vec2((norm - p0) / (p1 - p0), 1.0);
  if (norm < p2) return vec2((norm - p1) / (p2 - p1), 2.0);
  return vec2((norm - p2) / (1.0 - p2), 3.0);
}

float easeInQuad(float t) { return t * t; }
float easeInOutCubic(float t) {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

// Signed distance from this cycle's tear line; the sign says which half.
float tearLine(vec2 uv, float cycleIndex) {
  vec2 rnd = hash2(vec2(cycleIndex * 17.31, cycleIndex * 43.71));
  vec2 impactPoint = vec2(rnd.x * 0.6 - 0.3, rnd.y * 0.4 - 0.2);
  float tearAngle = (rnd.x - 0.5) * 0.5;
  vec2 tearDir = normalize(vec2(cos(tearAngle), sin(tearAngle * 0.3)));
  vec2 relUV = uv - impactPoint;
  float along = dot(relUV, tearDir);
  float perp = dot(relUV, vec2(-tearDir.y, tearDir.x));
  float roughness = fibrousFbm(vec2(along * 8.0 + cycleIndex * 7.0, perp * 3.0)) * 0.12;
  roughness += fibrousFbm(vec2(along * 22.0 + cycleIndex * 13.0, perp * 8.0)) * 0.04;
  roughness += vnoise(vec2(along * 50.0 + cycleIndex * 19.0, perp * 15.0)) * 0.015;
  return perp + roughness - 0.01;
}

// Gap width: opens outward from the impact point, widest near its centre.
float tearGap(vec2 uv, float tearProgress, float cycleIndex) {
  vec2 rnd = hash2(vec2(cycleIndex * 17.31, cycleIndex * 43.71));
  vec2 impactPoint = vec2(rnd.x * 0.6 - 0.3, rnd.y * 0.4 - 0.2);
  float distFromImpact = length(uv - impactPoint);
  float propagation = tearProgress * 2.5;
  float reachFactor = smoothstep(propagation, propagation - 0.4, distFromImpact);
  float gapWidth = reachFactor * tearProgress * 0.18;
  gapWidth *= smoothstep(0.0, 0.3, tearProgress);
  float centerBoost = 1.0 - smoothstep(0.0, 0.8, distFromImpact);
  return gapWidth * (1.0 + centerBoost * 0.5);
}

vec3 paperSurface(vec2 uv, float t) {
  float grain = vnoise(uv * 40.0) * 0.04
    + vnoise(uv * 80.0 + vec2(5.5, 3.3)) * 0.02
    + vnoise(uv * 160.0 + vec2(11.1, 7.7)) * 0.01;
  float fiber = vnoise(vec2(uv.x * 3.0, uv.y * 60.0)) * 0.015
    + vnoise(vec2(uv.x * 5.0, uv.y * 100.0 + 33.0)) * 0.008;
  float warmPatch = fbm(uv * 2.5, 3);
  vec3 col = mix(vec3(0.88, 0.85, 0.80), vec3(0.90, 0.86, 0.78), warmPatch) - grain - fiber;
  // Faint crumple shading, and slightly darker edges like old paper.
  col *= 0.95 + fbm(uv * 5.0 + t * 0.003, 4) * 0.1;
  col -= smoothstep(0.4, 1.1, length(uv * 0.8)) * 0.06;
  return col;
}

// Living plasma nebula revealed through the tear.
vec3 underGlow(vec2 uv, float t, float intensity) {
  vec3 deep = vec3(0.04, 0.01, 0.06);

  // Two layers of domain warping for an organic, swirling flow.
  vec2 warp1 = vec2(
    fbm(uv * 2.0 + vec2(t * 0.06, t * 0.04), 4),
    fbm(uv * 2.0 + vec2(t * 0.05 + 5.2, t * 0.03 + 1.3), 4)
  );
  vec2 warp2 = vec2(
    fbm(uv * 3.0 + warp1 * 1.8 + vec2(t * 0.04 + 1.7, 0.0), 4),
    fbm(uv * 3.0 + warp1 * 1.8 + vec2(0.0, t * 0.035 + 9.2), 4)
  );
  float plasma = fbm(uv * 2.5 + warp2 * 1.5, 5);

  // Indigo -> magenta -> hot pink -> amber -> gold.
  vec3 c1 = vec3(0.12, 0.02, 0.18);
  vec3 c2 = vec3(0.55, 0.05, 0.45);
  vec3 c3 = vec3(0.95, 0.25, 0.35);
  vec3 c4 = vec3(1.0, 0.60, 0.12);
  vec3 c5 = vec3(1.0, 0.90, 0.50);
  float p = clamp(plasma, 0.0, 1.0);
  vec3 nebula = p < 0.25 ? mix(c1, c2, p / 0.25)
    : p < 0.5 ? mix(c2, c3, (p - 0.25) / 0.25)
    : p < 0.75 ? mix(c3, c4, (p - 0.5) / 0.25)
    : mix(c4, c5, (p - 0.75) / 0.25);

  // Ridged noise folded into bright veins of light, at two scales.
  float vein = fbm(uv * 5.0 + warp1 * 2.0 + vec2(t * 0.07, -t * 0.05), 5);
  vein = pow(1.0 - abs(vein * 2.0 - 1.0), 4.0);
  float vein2 = fbm(uv * 8.0 + warp2 * 1.5 + vec2(-t * 0.05, t * 0.06), 4);
  vein2 = pow(1.0 - abs(vein2 * 2.0 - 1.0), 5.0);
  vec3 veinCol = vec3(1.0, 0.45, 0.6) * vein * 0.7 + vec3(1.0, 0.7, 0.2) * vein2 * 0.5;

  // Twinkling sparkles: the brightest noise peaks, each cell on its own beat.
  vec2 sparkleUV = uv * 25.0 + vec2(t * 0.1, -t * 0.08);
  vec2 sparkleCell = floor(sparkleUV);
  float twinkle = sin(t * (1.5 + hash(sparkleCell + 0.5) * 3.0) + hash(sparkleCell) * 6.28) * 0.5 + 0.5;
  float sparkle = smoothstep(0.78, 0.92, vnoise(sparkleUV)) * twinkle;
  sparkle = pow(sparkle, 2.0) * 1.5;
  vec3 sparkleCol = mix(vec3(1.0, 0.85, 0.95), vec3(1.0, 0.95, 0.7), hash(sparkleCell + 1.0));

  // Drifting soft glow centres for depth: amber core, magenta, purple.
  vec2 glowUV = uv + vec2(sin(t * 0.15) * 0.12, cos(t * 0.12) * 0.1);
  float g1 = exp(-dot(glowUV, glowUV) * 1.5);
  vec2 g2uv = glowUV - vec2(0.25 + sin(t * 0.1) * 0.05, -0.2);
  float g2 = exp(-dot(g2uv, g2uv) * 2.2);
  vec2 g3uv = glowUV + vec2(0.3, 0.25 + cos(t * 0.08) * 0.05);
  float g3 = exp(-dot(g3uv, g3uv) * 2.8);
  vec3 glowCenters = vec3(1.0, 0.6, 0.15) * g1 * 0.5
    + vec3(0.75, 0.15, 0.55) * g2 * 0.4
    + vec3(0.4, 0.1, 0.5) * g3 * 0.3;

  float pulse = sin(t * 0.8) * 0.1 + sin(t * 1.3 + 1.5) * 0.06 + sin(t * 0.3) * 0.04;

  vec3 glow = deep + nebula * 0.7 + glowCenters;
  glow += veinCol * intensity;
  glow += sparkleCol * sparkle * intensity;
  return glow * (1.0 + pulse) * intensity;
}

// Light leaking from the torn edges: white-amber core, amber bleed, purple haze.
vec3 edgeGlow(float tearDist, float gapWidth, float tearProgress, float intensity) {
  float absDist = abs(tearDist);
  float innerGlow = pow(smoothstep(gapWidth * 0.8, 0.0, absDist), 1.5);
  float midGlow = pow(smoothstep(gapWidth * 2.5, gapWidth * 0.3, absDist), 2.0);
  float outerGlow = pow(smoothstep(gapWidth * 5.0, gapWidth, absDist), 3.0);
  vec3 glow = vec3(1.0, 0.85, 0.6) * innerGlow * 1.2
    + vec3(0.8, 0.4, 0.15) * midGlow * 0.6
    + vec3(0.5, 0.15, 0.3) * outerGlow * 0.25;
  return glow * tearProgress * intensity;
}

// Curling edges: shadow on one side, highlight on the other, lit from below.
vec3 paperCurl(vec3 paperCol, float tearDist, float gapWidth, float tearProgress) {
  float absDist = abs(tearDist);
  float curlZone = smoothstep(gapWidth * 3.0, gapWidth * 0.5, absDist);
  float side = sign(tearDist);
  float shadow = curlZone * smoothstep(gapWidth * 2.0, gapWidth * 0.8, absDist) * 0.3;
  float highlight = curlZone * smoothstep(gapWidth * 1.5, gapWidth * 0.6, absDist) * 0.15;
  paperCol -= shadow * (0.5 + 0.5 * side) * tearProgress;
  paperCol += highlight * (0.5 - 0.5 * side) * tearProgress;
  paperCol += vec3(0.15, 0.06, 0.02) * curlZone * tearProgress * 0.2;
  return paperCol;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);
  float t = u_time;

  float cycleIndex = floor(t / (CYCLE_DURATION / TEAR_SPEED));
  vec2 phase = getPhase(t, TEAR_SPEED);
  float phaseT = phase.x;
  float phaseId = phase.y;

  vec3 col;
  if (phaseId < 0.5) {
    // Calm: the sheet creaks and a faint warmth breathes underneath.
    float breathe = sin(phaseT * PI * 2.0) * 0.02 + 0.01;
    float centerGlow = exp(-dot(uv, uv) * 4.0);
    col = paperSurface(uv + vec2(sin(phaseT * PI) * 0.003, 0.0), t);
    col += vec3(0.15, 0.06, 0.08) * centerGlow * breathe * GLOW_INTENSITY;

    // A hairline crack glows just before the sheet gives way.
    if (phaseT > 0.7) {
      float crackHint = easeInQuad((phaseT - 0.7) / 0.3);
      float crackVis = smoothstep(0.008, 0.0, abs(tearLine(uv, cycleIndex))) * crackHint * 0.3;
      col -= crackVis * 0.15;
      col += vec3(0.4, 0.15, 0.1) * crackVis * GLOW_INTENSITY;
    }
  } else {
    // 0 = intact sheet, 1 = fully open.
    float tearProgress = 1.0;
    if (phaseId < 1.5) {
      tearProgress = easeInQuad(phaseT);
    } else if (phaseId > 2.5) {
      tearProgress = 1.0 - easeInOutCubic(phaseT);
    }

    float tearDist = tearLine(uv, cycleIndex);
    float gapWidth = tearGap(uv, tearProgress, cycleIndex);
    float inGap = smoothstep(gapWidth * 0.5 + 0.003, gapWidth * 0.5 - 0.003, abs(tearDist));
    inGap *= step(0.01, tearProgress);

    // The two halves pull apart, with a little settle while fully open.
    float separationAmount = tearProgress * 0.03;
    if (phaseId > 1.5 && phaseId < 2.5) {
      separationAmount += sin(phaseT * PI) * 0.005;
    }
    vec2 rnd = hash2(vec2(cycleIndex * 17.31, cycleIndex * 43.71));
    float tearAngle = (rnd.x - 0.5) * 0.5;
    vec2 tearPerp = vec2(-sin(tearAngle * 0.3), cos(tearAngle * 0.3));
    vec2 paperOffset = tearPerp * sign(tearDist) * separationAmount;

    vec3 paper = paperCurl(paperSurface(uv + paperOffset, t), tearDist, max(gapWidth, 0.01), tearProgress);
    col = paper + edgeGlow(tearDist, max(gapWidth, 0.005), tearProgress, GLOW_INTENSITY);

    // The nebula only shows through the gap, so skip it everywhere else.
    if (inGap > 0.0) {
      col = mix(col, underGlow(uv + u_shift * 2.0, t, GLOW_INTENSITY), inGap);
    }
  }

  // Vignette, film grain, and slightly warmer shadows.
  float vig = length(uv * vec2(0.8, 0.9));
  col *= (1.0 - smoothstep(0.5, 1.3, vig)) * 0.8 + 0.2;
  col += (hash(gl_FragCoord.xy + fract(t * 43.0) * 1000.0) - 0.5) * 0.025;
  col = max(col, vec3(0.0));
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, col * vec3(1.05, 0.95, 0.9), smoothstep(0.1, 0.0, lum) * 0.3);

  gl_FragColor = vec4(col, 1.0);
}
`;

// The sheet is soft noise, so rendering above CSS-pixel density costs GPU
// time (the hero already runs a second WebGL canvas) without visible gain.
const MAX_PIXEL_RATIO = 1;

// How far the pointer shifts the nebula layer behind the tear.
const PARALLAX_STRENGTH = 0.15;

type Program = {
  program: WebGLProgram;
  buffer: WebGLBuffer | null;
  uTime: WebGLUniformLocation | null;
  uRes: WebGLUniformLocation | null;
  uShift: WebGLUniformLocation | null;
};

/**
 * Animated torn-paper hero background: a cream sheet that tears open along a
 * fibrous edge to reveal a glowing nebula, then mends itself on a 7s cycle.
 * Fills its positioned parent, pauses offscreen, renders one still frame
 * under reduced motion, and hides itself (leaving the parent's paper-coloured
 * background) when WebGL is unavailable.
 */
export default function TornPaperBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const context = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!context) {
      canvas.style.display = "none";
      return;
    }
    const gl: WebGLRenderingContext = context;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
      gl.deleteShader(shader);
      return null;
    };

    const createProgram = (): Program | null => {
      const vertex = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      const program = gl.createProgram();
      if (!vertex || !fragment || !program) return null;
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        return null;
      }
      gl.useProgram(program);

      // One oversized triangle covers the whole viewport.
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "a_pos");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      return {
        program,
        buffer,
        uTime: gl.getUniformLocation(program, "u_time"),
        uRes: gl.getUniformLocation(program, "u_res"),
        uShift: gl.getUniformLocation(program, "u_shift"),
      };
    };

    let current = createProgram();
    if (!current) {
      canvas.style.display = "none";
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const target = { x: 0, y: 0 };
    const shift = { x: 0, y: 0 };
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let inView = true;
    let contextLost = false;

    const draw = () => {
      if (!current || contextLost) return;
      gl.uniform1f(current.uTime, motion.matches ? 0 : elapsed);
      gl.uniform2f(current.uShift, shift.x, shift.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const tick = (time: number) => {
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;
      elapsed += delta;
      // Ease toward the pointer so entering or leaving never snaps the glow.
      const ease = 1 - Math.exp(-delta * 4);
      shift.x += (target.x - shift.x) * ease;
      shift.y += (target.y - shift.y) * ease;
      draw();
      frame = requestAnimationFrame(tick);
    };

    // Time only advances while the sheet is actually animating on screen.
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      if (contextLost || document.hidden || !inView) return;
      if (motion.matches) draw();
      else frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      const width = Math.max(1, Math.round(canvas.clientWidth * scale));
      const height = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      if (!current || contextLost) return;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(current.uRes, width, height);
      // Resizing clears the drawing buffer; repaint before the next paint.
      draw();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      target.x = -(x - 0.5) * PARALLAX_STRENGTH;
      target.y = -(y - 0.5) * PARALLAX_STRENGTH;
    };
    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      current = null;
      sync();
    };
    const onContextRestored = () => {
      contextLost = false;
      current = createProgram();
      if (!current) {
        canvas.style.display = "none";
        return;
      }
      resize();
      sync();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    resize();
    sync();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      if (current) {
        gl.deleteBuffer(current.buffer);
        gl.deleteProgram(current.program);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
