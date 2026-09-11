"use client";

import { useEffect, useRef } from "react";

/** Glass torus knot adapted from NIDAL's Glass Hero:
 * https://codepen.io/Nidal95/pen/qERKExz
 * Keeps the reference geometry and rotation speeds; the optics are tuned so
 * the knot reads as liquid glass refracting the live torn-paper sheet.
 */
export default function GlassChain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest("section");
    if (!canvas || !hero) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    async function initialize() {
      const [THREE, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("three/addons/environments/RoomEnvironment.js"),
      ]);
      if (cancelled || !canvas || !hero) return;

      const cleanups: Array<() => void> = [];
      dispose = () => { for (const cleanup of cleanups.splice(0).reverse()) cleanup(); };

      // Keep the portfolio usable when WebGL is unavailable.
      const context = canvas.getContext("webgl2", { alpha: true, antialias: true });
      if (!context) return;
      const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
      cleanups.push(() => renderer.dispose());
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.z = 5;

      function createEnvironment() {
        const room = new RoomEnvironment();
        const pmrem = new THREE.PMREMGenerator(renderer);
        try {
          return pmrem.fromScene(room, 0.04);
        } finally {
          room.dispose();
          pmrem.dispose();
        }
      }
      let environment = createEnvironment();
      cleanups.push(() => environment.dispose());
      scene.environment = environment.texture;

      const geometry = new THREE.TorusKnotGeometry(1, 0.3, 300, 48, 2, 3);
      cleanups.push(() => geometry.dispose());
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 1,
        thickness: 1.4,
        ior: 1.5,
        dispersion: 4,
        // A faint warm body tint (close to the sheet, so it deepens rather than
        // greys it) plus brighter rims keeps the glass visible over flat paper.
        attenuationColor: new THREE.Color(0xefe4d4),
        attenuationDistance: 0.35,
        envMapIntensity: 1.4,
        toneMapped: false,
      });
      cleanups.push(() => material.dispose());
      const chain = new THREE.Mesh(geometry, material);
      chain.position.z = 2.2;
      scene.add(chain);

      // The glass refracts what sits behind it: the live torn-paper sheet,
      // uploaded from its canvas, with the hero typography drawn over it. Both
      // backdrop planes write color only in the transmission pass, leaving the
      // accessible HTML, links, and phone visible through the transparent canvas.
      const paper = hero.querySelector<HTMLCanvasElement>("canvas[data-hero-backdrop]");
      const paperReady = () => !!paper && paper.style.display !== "none";
      const paperTexture = paper ? new THREE.CanvasTexture(paper) : null;
      if (paperTexture) {
        paperTexture.colorSpace = THREE.SRGBColorSpace;
        paperTexture.minFilter = THREE.LinearFilter;
        paperTexture.generateMipmaps = false;
        cleanups.push(() => paperTexture.dispose());
      }
      const textCanvas = document.createElement("canvas");
      const context2d = textCanvas.getContext("2d");
      if (!context2d) throw new Error("Canvas text rendering is unavailable");
      const textContext = context2d;
      const texture = new THREE.CanvasTexture(textCanvas);
      cleanups.push(() => texture.dispose());
      texture.colorSpace = THREE.SRGBColorSpace;
      const backdropGeometry = new THREE.PlaneGeometry(1, 1);
      cleanups.push(() => backdropGeometry.dispose());
      const backdropMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        // Over the sheet only the glyphs are opaque. The transmission pass skips
        // transparent objects, so the empty areas are cut out instead.
        alphaTest: 0.5,
        toneMapped: false,
        depthWrite: false,
      });
      cleanups.push(() => backdropMaterial.dispose());
      const backdrop = new THREE.Mesh(backdropGeometry, backdropMaterial);
      backdrop.onBeforeRender = (activeRenderer) => {
        backdropMaterial.colorWrite = activeRenderer.getRenderTarget() !== null;
      };
      backdrop.renderOrder = -1;
      scene.add(backdrop);

      const paperMaterial = new THREE.MeshBasicMaterial({
        map: paperTexture,
        toneMapped: false,
        depthWrite: false,
      });
      cleanups.push(() => paperMaterial.dispose());
      const paperPlane = new THREE.Mesh(backdropGeometry, paperMaterial);
      paperPlane.onBeforeRender = (activeRenderer) => {
        paperMaterial.colorWrite = activeRenderer.getRenderTarget() !== null;
      };
      paperPlane.renderOrder = -2;
      paperPlane.visible = false;
      scene.add(paperPlane);

      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const pointer = new THREE.Vector2();
      const easedPointer = new THREE.Vector2();
      let inView = true;
      let contextLost = false;
      let frame = 0;
      let lastTime = 0;
      let elapsed = 1.6;
      let width = 1;
      let height = 1;
      let backdropLive = false;
      let paperFrame = 0;
      let paperWidth = 0;
      let paperHeight = 0;

      function drawBackdrop() {
        if (cancelled || !hero) return;
        const rect = hero.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio, 1.5);
        const textWidth = Math.round(width * dpr);
        const textHeight = Math.round(height * dpr);
        // three.js allocates immutable texture storage, so a resized source
        // needs a fresh GPU texture rather than an in-place update.
        if (textCanvas.width !== textWidth || textCanvas.height !== textHeight) texture.dispose();
        textCanvas.width = textWidth;
        textCanvas.height = textHeight;
        textContext.setTransform(dpr, 0, 0, dpr, 0, 0);
        backdropLive = paperReady();
        paperPlane.visible = backdropLive;
        if (!backdropLive) drawStudio(rect);
        textContext.textBaseline = "alphabetic";
        drawGlyphs(rect);
        texture.needsUpdate = true;
      }

      // Without the live sheet, a bright studio with narrow contrast bands keeps
      // the reference's clear-glass reflections, even in a dark theme.
      function drawStudio(rect: DOMRect) {
        if (!hero) return;
        const anchor = hero.querySelector("[data-chain-anchor]")!.getBoundingClientRect();
        const studio = textContext.createLinearGradient(
          anchor.left - rect.left, anchor.top - rect.top,
          anchor.right - rect.left, anchor.bottom - rect.top,
        );
        studio.addColorStop(0, "#e9e9e7");
        studio.addColorStop(0.25, "#ffffff");
        studio.addColorStop(0.38, "#d5dce4");
        studio.addColorStop(0.43, "#354151");
        studio.addColorStop(0.47, "#eef1f5");
        studio.addColorStop(0.62, "#ffffff");
        studio.addColorStop(0.72, "#a3b0c0");
        studio.addColorStop(0.8, "#f7f8fa");
        studio.addColorStop(1, "#e9e9e7");
        textContext.fillStyle = studio;
        textContext.fillRect(0, 0, width, height);
      }

      function drawGlyphs(rect: DOMRect) {
        if (!hero) return;
        hero.querySelectorAll<HTMLElement>("[data-chain-refract]").forEach((element) => {
          const typography = getComputedStyle(element);
          textContext.font = `${typography.fontWeight} ${typography.fontSize} ${typography.fontFamily}`;
          // Dark refracted lettering gives the clear glass the same contrast
          // as the reference, independent of the portfolio's text theme.
          textContext.fillStyle = "#111111";
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          const range = document.createRange();
          let node: Node | null;
          while ((node = walker.nextNode())) {
            const value = node.textContent ?? "";
            // Character bounds preserve wrapping and letter spacing on mobile.
            for (let i = 0; i < value.length; i++) {
              if (!value[i].trim()) continue;
              range.setStart(node, i);
              range.setEnd(node, i + 1);
              const bounds = range.getBoundingClientRect();
              const metrics = textContext.measureText(value[i]);
              const ascent = metrics.fontBoundingBoxAscent ?? parseFloat(typography.fontSize) * 0.8;
              const descent = metrics.fontBoundingBoxDescent ?? parseFloat(typography.fontSize) * 0.2;
              const baseline = bounds.top - rect.top + (bounds.height - ascent - descent) / 2 + ascent;
              const letter = typography.textTransform === "uppercase" ? value[i].toUpperCase() : value[i];
              textContext.fillText(letter, bounds.left - rect.left, baseline);
            }
          }
        });
      }

      function refreshPaper() {
        if (!paper || !paperTexture) return;
        if (paper.width !== paperWidth || paper.height !== paperHeight) {
          paperWidth = paper.width;
          paperHeight = paper.height;
          paperTexture.dispose();
          paperTexture.needsUpdate = true;
          return;
        }
        // The sheet moves slowly; re-uploading it every other frame halves the
        // cross-canvas copy without visible lag.
        if (motion.matches || paperFrame++ % 2 === 0) paperTexture.needsUpdate = true;
      }

      function paint() {
        if (cancelled || contextLost) return;
        if (paperReady() !== backdropLive) drawBackdrop();
        if (backdropLive) refreshPaper();
        chain.rotation.set(
          motion.matches ? 0.6 : elapsed * 0.35 + easedPointer.y * 0.15,
          motion.matches ? 0.4 : elapsed * 0.5 + easedPointer.x * 0.2,
          0,
        );
        renderer.render(scene, camera);
      }

      function animate(time: number) {
        frame = 0;
        if (!inView || document.hidden || motion.matches || contextLost || cancelled) return;
        const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
        lastTime = time;
        elapsed += delta;
        easedPointer.lerp(pointer, 1 - Math.exp(-delta * 7));
        paint();
        frame = requestAnimationFrame(animate);
      }

      function syncAnimation() {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
        if (!inView || document.hidden || contextLost || cancelled) return;
        paint();
        if (!motion.matches) frame = requestAnimationFrame(animate);
      }

      function resize() {
        if (cancelled || !hero) return;
        width = hero.clientWidth;
        height = hero.clientHeight;
        if (!width || !height) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 640 ? 1.25 : 1.5));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        const visibleHeight = 2 * 5 * Math.tan(THREE.MathUtils.degToRad(22.5));
        backdrop.scale.set(visibleHeight * camera.aspect, visibleHeight, 1);
        paperPlane.scale.copy(backdrop.scale);

        const heroRect = hero.getBoundingClientRect();
        const anchor = hero.querySelector("[data-chain-anchor]")!.getBoundingClientRect();
        const mobile = width < 640;
        const size = mobile ? 160 : 192;
        const centerX = anchor.left + anchor.width / 2 - heroRect.left;
        const centerY = anchor.top + anchor.height / 2 - heroRect.top;
        const chainHeight = visibleHeight * ((5 - chain.position.z) / 5);
        chain.scale.setScalar((size * chainHeight) / (height * 3.8));
        chain.position.x = (centerX / width - 0.5) * chainHeight * camera.aspect;
        chain.position.y = (0.5 - centerY / height) * chainHeight;
        drawBackdrop();
        syncAnimation();
      }

      function onPointerMove(event: PointerEvent) {
        if (motion.matches || !inView || event.pointerType === "touch" || !hero) return;
        const rect = hero.getBoundingClientRect();
        pointer.set(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          ((event.clientY - rect.top) / rect.height) * 2 - 1,
        );
      }
      function onPointerLeave() { pointer.set(0, 0); }
      function onContextLost(event: Event) {
        event.preventDefault();
        contextLost = true;
        cancelAnimationFrame(frame);
      }
      function onContextRestored() {
        environment.dispose();
        environment = createEnvironment();
        scene.environment = environment.texture;
        contextLost = false;
        resize();
      }
      function refreshBackdrop() { drawBackdrop(); syncAnimation(); }

      const resizeObserver = new ResizeObserver(resize);
      cleanups.push(() => resizeObserver.disconnect());
      const intersectionObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncAnimation();
      });
      cleanups.push(() => intersectionObserver.disconnect());
      const themeObserver = new MutationObserver(refreshBackdrop);
      cleanups.push(() => themeObserver.disconnect());
      cleanups.push(() => {
        cancelAnimationFrame(frame);
        hero.removeEventListener("pointermove", onPointerMove);
        hero.removeEventListener("pointerleave", onPointerLeave);
        hero.removeEventListener("animationend", resize);
        document.removeEventListener("visibilitychange", syncAnimation);
        motion.removeEventListener("change", syncAnimation);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        canvas.removeEventListener("webglcontextrestored", onContextRestored);
      });
      resizeObserver.observe(hero);
      intersectionObserver.observe(hero);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      hero.addEventListener("pointermove", onPointerMove, { passive: true });
      hero.addEventListener("pointerleave", onPointerLeave);
      hero.addEventListener("animationend", resize);
      document.addEventListener("visibilitychange", syncAnimation);
      motion.addEventListener("change", syncAnimation);
      canvas.addEventListener("webglcontextlost", onContextLost);
      canvas.addEventListener("webglcontextrestored", onContextRestored);
      void document.fonts.ready.then(() => { if (!cancelled) resize(); });
      resize();
    }

    void initialize().catch(() => {
      cancelled = true;
      dispose?.();
      canvas.style.visibility = "hidden";
    });
    return () => { cancelled = true; dispose?.(); };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="glass-chain pointer-events-none absolute inset-0 z-[2] h-full w-full" />;
}
