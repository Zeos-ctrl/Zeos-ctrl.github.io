// --- Component ---
import React, { useRef, useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import { useLenis } from "lenis/react";
import { ANOMALY_PALETTES } from "./anomalyPalettes";

const clamp01 = (v) => Math.max(0, Math.min(1, v));

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

export function GenerativeArtScene({ progressRef, variant = "default" }) {
  const mountRef = useRef(null);
  const lightRef = useRef(null);
  const materialRef = useRef(null);

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

    let frameId;
    const animate = (t) => {
      material.uniforms.time.value = t * 0.0003;
      mesh.rotation.y += 0.0005;
      mesh.rotation.x += 0.0002;
      // Scroll-driven zoom: pull the camera from z=3 toward and slightly past
      // the mesh center (radius 1.2), so we end up "inside" the wireframe.
      const p = progressRef && progressRef.current ? progressRef.current : 0;
      const eased = p * p; // ease-in: accelerate as we approach
      camera.position.z = 5 - eased * 3.4;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate(0);

    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
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
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

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

export function AnomalousMatterHero({
  title = "",
  subtitle = "",
  description = "",
}) {
  const progressRef = useRef(0);
  const scrollRef = useRef(null); // the tall wrapper that provides scroll room
  const textRef = useRef(null);
  const visualRef = useRef(null); // anomaly canvas + overlays, faded out on exit
  const [variant, setVariant] = useState("default"); // anomaly palette

  // Lenis fires this on every (smoothed) scroll frame. We compute 0→1 progress
  // through the tall .hero-scroll wrapper while its sticky child stays pinned,
  // and drive the effects imperatively — no React re-render per frame.
  useLenis(() => {
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
    // Fade the whole anomaly visual out near the end, revealing the noisy
    // background behind it so the transition into the next section keeps grain.
    if (visualRef.current) {
      visualRef.current.style.opacity = String(1 - clamp01((p - 0.45) / 0.25));
    }
  });

  return (
    <div ref={scrollRef} className="hero-scroll">
      <section
        role="banner"
        className="hero-sticky text-foreground"
      >
        <div ref={visualRef} className="hero-visual">
          <Suspense fallback={<div className="w-full h-full" />}>
            <GenerativeArtScene progressRef={progressRef} variant={variant} />
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

        <div
          ref={textRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-20 md:pb-32 text-center"
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
    </div>
  );
}

