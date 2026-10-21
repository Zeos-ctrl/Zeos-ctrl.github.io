// --- Component ---
import React, { useRef, useEffect, useState, Suspense } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { useLenis } from "lenis/react";
import { ANOMALY_PALETTES } from "./anomalyPalettes";
import { SECTIONS } from "@/data/sections";

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Immersive (desktop) mode: where each section's page floats inside the
// anomaly once the camera has zoomed in to z = ZOOM_END. [x, y, z, rotY].
const ZOOM_END = 0.3;
// Fraction of the hero scroll the zoom takes; the rest holds at full zoom so
// there's room to look around before the footer arrives.
const ZOOM_DONE = 0.65;
const CARD_POSES = [
  [-0.72, 0.42, -1.3, 0.28],
  [0.78, 0.48, -1.6, -0.25],
  [-0.66, -0.46, -1.5, 0.22],
  [0.74, -0.4, -1.2, -0.2],
];
// Each card is laid out at the full viewport size (the exact page you get
// when you open it), then scaled to CARD_W world units wide.
const CARD_W = 1;

// `progressRef` is a mutable ref holding 0→1 scroll progress. The scene reads
// it every frame to drive the camera zoom, so scrolling never triggers a React
// re-render.
// The "default" palette is white, which is invisible on the light-mode
// background — so in light mode swap it for black. Other palettes are used as-is.
function resolveAnomalyColors(variant) {
  const isLight = !document.documentElement.classList.contains("dark");
  if (variant === "default" && isLight) {
    return { low: "#000000", high: "#000000" };
  }
  return ANOMALY_PALETTES[variant];
}

// Immersive-mode extras (all optional): `cssMountRef` is the DOM layer the
// floating pages render into, `focusRef` holds the focused section id (read
// every frame), `onCards` receives the card elements so React can portal
// previews into them, `onSelect(id)` fires on a card click and `onArrive()`
// once the camera has finished flying to the focused card.
export function GenerativeArtScene({
  progressRef,
  variant = "default",
  immersive = false,
  cssMountRef,
  focusRef,
  onCards,
  onSelect,
  onArrive,
}) {
  const mountRef = useRef(null);
  const lightRef = useRef(null);
  const materialRef = useRef(null);
  // Latest callbacks, so the long-lived scene effect never sees stale ones.
  const cb = useRef({});
  cb.current = { onCards, onSelect, onArrive };

  useEffect(() => {
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.2, 64);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pointLightPos: { value: new THREE.Vector3(0, 0, 5) },
        colorLow: { value: new THREE.Color(resolveAnomalyColors(variant).low) },
        colorHigh: {
          value: new THREE.Color(resolveAnomalyColors(variant).high),
        },
      },
      vertexShader: `                uniform float time;
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec3 vWorldPosition;

                // Perlin Noise function
                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
                vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
                float snoise(vec3 v) {
                    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                    vec3 i = floor(v + dot(v, C.yyy));
                    vec3 x0 = v - i + dot(i, C.xxx);
                    vec3 g = step(x0.yzx, x0.xyz);
                    vec3 l = 1.0 - g;
                    vec3 i1 = min(g.xyz, l.zxy);
                    vec3 i2 = max(g.xyz, l.zxy);
                    vec3 x1 = x0 - i1 + C.xxx;
                    vec3 x2 = x0 - i2 + C.yyy;
                    vec3 x3 = x0 - D.yyy;
                    i = mod289(i);
                    vec4 p = permute(permute(permute(
                                i.z + vec4(0.0, i1.z, i2.z, 1.0))
                            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                    float n_ = 0.142857142857;
                    vec3 ns = n_ * D.wyz - D.xzx;
                    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                    vec4 x_ = floor(j * ns.z);
                    vec4 y_ = floor(j - 7.0 * x_);
                    vec4 x = x_ * ns.x + ns.yyyy;
                    vec4 y = y_ * ns.x + ns.yyyy;
                    vec4 h = 1.0 - abs(x) - abs(y);
                    vec4 b0 = vec4(x.xy, y.xy);
                    vec4 b1 = vec4(x.zw, y.zw);
                    vec4 s0 = floor(b0) * 2.0 + 1.0;
                    vec4 s1 = floor(b1) * 2.0 + 1.0;
                    vec4 sh = -step(h, vec4(0.0));
                    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
                    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
                    vec3 p0 = vec3(a0.xy, h.x);
                    vec3 p1 = vec3(a0.zw, h.y);
                    vec3 p2 = vec3(a1.xy, h.z);
                    vec3 p3 = vec3(a1.zw, h.w);
                    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
                    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
                    m = m * m;
                    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
                }

                void main() {
                    float displacement = snoise(position * 2.0 + time * 0.5) * 0.2;
                    vec3 newPosition = position + normal * displacement;
                    vec4 worldPos = modelMatrix * vec4(newPosition, 1.0);
                    vWorldPosition = worldPos.xyz;
                    vNormal = normalize(mat3(modelMatrix) * normal);
                    vPosition = position;
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                }`,    // world-space position + normal so lighting is correct
      fragmentShader: `                uniform vec3 colorLow;
                uniform vec3 colorHigh;
                uniform vec3 pointLightPos;
                varying vec3 vNormal;
                varying vec3 vWorldPosition;

                void main() {
                    vec3 normal = normalize(vNormal);
                    vec3 toLight = pointLightPos - vWorldPosition;
                    vec3 lightDir = normalize(toLight);
                    float diffuse = max(dot(normal, lightDir), 0.0);

                    // Point-light distance falloff so the cursor reads as a source.
                    float dist = length(toLight);
                    float atten = 1.0 / (1.0 + 0.07 * dist * dist);

                    // Fresnel rim glow (view ~ +z in world space).
                    float fresnel = 1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0);
                    fresnel = pow(fresnel, 2.0);

                    // Blend the palette across the surface by lighting intensity
                    // (dark shade where dim, bright shade where lit).
                    float intensity = diffuse * atten;
                    vec3 base = mix(colorLow, colorHigh, clamp(intensity, 0.0, 1.0));
                    vec3 lit = base * (0.3 + intensity * 2.6);
                    vec3 finalColor = lit + colorHigh * fresnel * 0.6;

                    gl_FragColor = vec4(finalColor, 1.0);
                }`,  // world-space point light + palette blend
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    materialRef.current = material; // so the palette effect can update it

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 5, 0);
    lightRef.current = pointLight;
    scene.add(pointLight);

    // Floating pages (immersive only): real DOM placed in 3D by a second
    // renderer sharing the camera, layered above the WebGL canvas.
    const cssScene = new THREE.Scene();
    let cssRenderer = null;
    const cards = [];
    if (immersive && cssMountRef?.current) {
      cssRenderer = new CSS3DRenderer();
      cssRenderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      cssMountRef.current.appendChild(cssRenderer.domElement);
      const vw = currentMount.clientWidth;
      const vh = currentMount.clientHeight;
      SECTIONS.forEach((s, i) => {
        const el = document.createElement("div");
        el.className = "hero-card";
        el.style.width = `${vw}px`;
        el.style.height = `${vh}px`;
        el.dataset.cursor = "hover";
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
        el.setAttribute("aria-label", `Open ${s.label}`);
        el.addEventListener("click", () => cb.current.onSelect?.(s.id));
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            cb.current.onSelect?.(s.id);
          }
        });
        const obj = new CSS3DObject(el);
        const [x, y, z, ry] = CARD_POSES[i];
        obj.position.set(x, y, z);
        obj.rotation.y = ry;
        obj.scale.setScalar(CARD_W / vw);
        cssScene.add(obj);
        cards.push({ id: s.id, obj, baseY: y, baseRy: ry });
      });
      cb.current.onCards?.(cards.map((c) => c.obj.element));
    }

    // Don't burn GPU while the hero is scrolled out of view.
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(currentMount);

    const reduce = reducedMotion();
    const target = new THREE.Vector3();
    const targetQ = new THREE.Quaternion();
    let bob = reduce ? 0 : 1; // card drift amount, settles to 0 while focused
    let lastFocus = null;
    let arrived = false;
    let lastT = 0;

    let frameId;
    const animate = (t) => {
      frameId = requestAnimationFrame(animate);
      // Camera follow rate: 8% per 60fps frame, scaled so it's fps-independent.
      const dt = Math.min(t - lastT, 100);
      lastT = t;
      const ease = reduce ? 1 : 1 - Math.pow(0.92, dt / 16.7);
      const p = progressRef && progressRef.current ? progressRef.current : 0;
      // Off-screen, or (non-immersive) already faded out: skip the frame.
      if (!visible || (!immersive && p >= 0.7)) return;

      const time = t * 0.0003;
      material.uniforms.time.value = time;
      mesh.rotation.y += 0.0005;
      mesh.rotation.x += 0.0002;

      if (immersive) {
        const focusId = focusRef?.current;
        const focused = cards.find((c) => c.id === focusId);
        if (focusId !== lastFocus) {
          lastFocus = focusId;
          arrived = false;
        }
        bob += ((focused || reduce ? 0 : 1) - bob) * Math.min(1, ease * 0.6);
        cards.forEach((c, i) => {
          c.obj.position.y = c.baseY + Math.sin(time * 2 + i * 1.7) * 0.04 * bob;
          c.obj.rotation.y = c.baseRy + Math.sin(time * 1.3 + i) * 0.06 * bob;
        });
        if (focused) {
          // Face the card square-on at the distance where it fills the
          // viewport exactly — 1:1 pixels, matching the panel that takes over.
          const halfTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
          const dist = CARD_W / camera.aspect / (2 * halfTan);
          targetQ.copy(focused.obj.quaternion);
          target
            .set(0, 0, dist)
            .applyQuaternion(targetQ)
            .add(focused.obj.position);
        } else {
          // Scroll-driven zoom from z=5 to inside the wireframe (radius 1.2).
          const z = clamp01(p / ZOOM_DONE);
          target.set(0, 0, 5 - z * z * (5 - ZOOM_END));
          targetQ.identity();
        }
        camera.position.lerp(target, ease);
        camera.quaternion.slerp(targetQ, ease);
        if (focused && !arrived && camera.position.distanceTo(target) < 0.03) {
          arrived = true;
          cb.current.onArrive?.();
        }
      } else {
        // Ease-in zoom that completes as the visual finishes fading (p=0.7).
        const e = clamp01(p / 0.7);
        camera.position.z = 5 - e * e * 3.4;
      }

      renderer.render(scene, camera);
      if (cssRenderer) cssRenderer.render(cssScene, camera);
    };
    frameId = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      if (cssRenderer) {
        const vw = currentMount.clientWidth;
        const vh = currentMount.clientHeight;
        cssRenderer.setSize(vw, vh);
        // Keep each card the viewport's size and ratio.
        cards.forEach((c) => {
          c.obj.element.style.width = `${vw}px`;
          c.obj.element.style.height = `${vh}px`;
          c.obj.scale.setScalar(CARD_W / vw);
        });
      }
    };

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      const vec = new THREE.Vector3(x, y, 0.5).unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      // Land the light on a plane in front of the mesh so it sweeps across the
      // surface. Kept just ahead of the camera so it stays in front on zoom-in.
      const zPlane = Math.min(2.0, camera.position.z - 1.0);
      const t = (zPlane - camera.position.z) / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(t));
      lightRef.current.position.copy(pos);
      material.uniforms.pointLightPos.value = pos;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(frameId);
      io.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      currentMount.removeChild(renderer.domElement);
      // Free the GL context so repeat visits don't pile up contexts.
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (cssRenderer) {
        cssRenderer.domElement.remove();
        cb.current.onCards?.([]);
      }
    };
  }, [immersive]);

  // Swap the palette live when `variant` changes — no need to rebuild the scene.
  useEffect(() => {
    const mat = materialRef.current;
    if (!mat) return;
    const apply = () => {
      const c = resolveAnomalyColors(variant);
      mat.uniforms.colorLow.value.set(c.low);
      mat.uniforms.colorHigh.value.set(c.high);
    };
    apply();
    // Re-apply when the site theme (the `dark` class on <html>) toggles.
    const obs = new MutationObserver(apply);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, [variant]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />;
}

// `immersive` (desktop): zoom into the anomaly where the sections float as
// pages. `focusId` is the section being read (driven by the URL hash in Home);
// `onSelect(id)` / `onClose()` ask Home to change it.
export function AnomalousMatterHero({
  title = "",
  subtitle = "",
  description = "",
  immersive = false,
  focusId = null,
  onSelect,
  onClose,
}) {
  const progressRef = useRef(0);
  const scrollRef = useRef(null); // the tall wrapper that provides scroll room
  const textRef = useRef(null);
  const visualRef = useRef(null); // anomaly canvas + overlays, faded out on exit
  const cssRef = useRef(null); // floating-pages layer (immersive)
  const focusRef = useRef(focusId); // read by the Three.js loop
  const [variant, setVariant] = useState("default"); // anomaly palette
  const [cardEls, setCardEls] = useState([]); // portal targets for previews
  const [panelOpen, setPanelOpen] = useState(false);
  const lenis = useLenis();

  // We compute 0→1 progress through the tall .hero-scroll wrapper while its
  // sticky child stays pinned, and drive the effects imperatively — no React
  // re-render per frame. Runs on every (smoothed) Lenis scroll frame, plus on
  // mount/resize so a mid-page reload starts in the right state.
  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const distance = rect.height - window.innerHeight; // scrollable pin length
    const p = distance > 0 ? clamp01(-rect.top / distance) : 0;
    progressRef.current = p; // read by the Three.js loop for the zoom

    // Text fades out over the first 55% of the scroll.
    if (textRef.current) {
      textRef.current.style.opacity = String(clamp01(1 - p / 0.55));
    }
    if (immersive) {
      // Stay inside the anomaly; the floating pages fade in as we arrive.
      if (cssRef.current) {
        const o = clamp01((p - 0.4) / (ZOOM_DONE - 0.4));
        cssRef.current.style.opacity = String(o);
        cssRef.current.style.visibility = o > 0 ? "visible" : "hidden";
      }
    } else if (visualRef.current) {
      // Fade the whole anomaly visual out near the end, revealing the noisy
      // background behind it so the transition into the next section keeps grain.
      visualRef.current.style.opacity = String(1 - clamp01((p - 0.45) / 0.25));
    }
  };
  useLenis(update);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [immersive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focusing a page: hold the page at the end of the zoom (Lenis stopped, so
  // the wheel only scrolls the panel), and let the camera fly to the card.
  // The panel opens once the scene reports arrival.
  useEffect(() => {
    focusRef.current = focusId;
    setPanelOpen(false);
    if (!immersive || !lenis) return;
    if (!focusId) {
      lenis.start();
      return;
    }
    const el = scrollRef.current;
    const end =
      el.getBoundingClientRect().top +
      window.scrollY +
      el.offsetHeight -
      window.innerHeight;
    lenis.stop();
    lenis.scrollTo(end, { force: true, immediate: reducedMotion() });
    // Restart on unmount too (e.g. a link inside the panel navigates away).
    return () => lenis.start();
  }, [focusId, immersive, lenis]);

  useEffect(() => {
    if (!focusId) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusId, onClose]);

  const focused = SECTIONS.find((s) => s.id === focusId);

  return (
    <div
      ref={scrollRef}
      className={immersive ? "hero-scroll hero-scroll--immersive" : "hero-scroll"}
    >
      <section
        role="banner"
        className="hero-sticky text-foreground"
      >
        <div ref={visualRef} className="hero-visual">
          <Suspense fallback={<div className="w-full h-full" />}>
            <GenerativeArtScene
              progressRef={progressRef}
              variant={variant}
              immersive={immersive}
              cssMountRef={cssRef}
              focusRef={focusRef}
              onCards={setCardEls}
              onSelect={onSelect}
              onArrive={() => setPanelOpen(true)}
            />
          </Suspense>

          {/* Palette toggle: switch the anomaly between its default color and the
              footer's orange "ember" shades. */}
          <button
            type="button"
            onClick={() =>
              setVariant((v) => (v === "default" ? "ember" : "default"))
            }
            className="hero-palette"
            aria-label="Toggle anomaly color"
          >
            <span
              className="hero-swatch"
              data-active={variant === "default"}
              style={{ background: "hsl(var(--foreground))" }}
            />
            <span
              className="hero-swatch"
              data-active={variant === "ember"}
              style={{
                background: `linear-gradient(160deg, ${ANOMALY_PALETTES.ember.high}, ${ANOMALY_PALETTES.ember.low})`,
              }}
            />
          </button>

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent z-10" />
        </div>

        {immersive && <div ref={cssRef} className="hero-css3d" />}

        <div
          ref={textRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-20 md:pb-32 text-center pointer-events-none"
        >
          <div className="max-w-3xl px-4">
            <h1 className="text-sm font-mono tracking-widest text-primary/80 uppercase">
              {title}
            </h1>
            <p className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
              {subtitle}
            </p>
            <p className="mt-6 max-w-xl mx-auto text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Floating cards: the section name, with the live page preview fading
          in on hover (and staying on the focused card, so the zoom lands on
          the exact page). The open section's preview is dropped so its ids
          aren't duplicated by the panel. */}
      {cardEls.map((el, i) => {
        const { id, label, Component } = SECTIONS[i];
        if (panelOpen && id === focusId) return null;
        return createPortal(
          <>
            <div
              className="section-panel"
              data-show={id === focusId}
              inert=""
            >
              <Component compact />
            </div>
            <div className="hero-card__label" aria-hidden="true">
              {label}
            </div>
          </>,
          el,
          id
        );
      })}

      {/* Full-screen reading panel: crisp, normal DOM (text inside CSS 3D transforms
          blurs). Portaled to <body> so no ancestor can trap position:fixed. */}
      {panelOpen &&
        focused &&
        createPortal(
          <div className="section-panel__backdrop">
            <div
              className="section-panel"
              role="dialog"
              aria-modal="true"
              aria-label={focused.label}
              data-lenis-prevent
              tabIndex={-1}
              ref={(n) => n && n.focus({ preventScroll: true })}
            >
              <button
                type="button"
                className="section-panel__close"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
              <focused.Component compact />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
