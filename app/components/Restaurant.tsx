"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import * as THREE from "three";
import { projects, featuredProjectId } from "../projects";

type Vec = [number, number, number];
type Controls = {
  keys: Set<string>;
  yaw: number;
  pitch: number;
  reset: boolean;
};

function Box({
  position,
  size,
  color,
  rotation = [0, 0, 0],
}: {
  position: Vec;
  size: Vec;
  color: string;
  rotation?: Vec;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
  );
}

function Sign({
  text,
  sub = "",
  position,
  width = 2,
  height = 0.7,
  color = "#f8e9cc",
  ink = "#293d34",
  onClick,
}: {
  text: string;
  sub?: string;
  position: Vec;
  width?: number;
  height?: number;
  color?: string;
  ink?: string;
  onClick?: () => void;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = Math.round((1024 * height) / width);
    const ctx = canvas.getContext("2d")!;
    const h = canvas.height;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1024, h);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, 992, h - 32);
    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${Math.min(90, h * 0.33)}px Georgia`;
    ctx.fillText(text, 512, sub ? h * 0.43 : h / 2, 930);
    if (sub) {
      ctx.font = `${Math.min(29, h * 0.13)}px monospace`;
      ctx.fillText(sub, 512, h * 0.72, 920);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [text, sub, color, ink, width, height]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh
      position={position}
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation();
              onClick();
            }
          : undefined
      }
      onPointerOver={
        onClick
          ? () => {
              document.body.style.cursor = "pointer";
            }
          : undefined
      }
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Burger({ position, scale = 1 }: { position: Vec; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.53, 0.2, 40]} />
        <meshStandardMaterial color="#d99744" />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.61, 0.61, 0.13, 32]} />
        <meshStandardMaterial color="#553427" />
      </mesh>
      <Box
        position={[0, 0.33, 0]}
        size={[1.02, 0.04, 1.02]}
        color="#f9bc31"
        rotation={[0, 0.3, 0]}
      />
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.57, 0.58, 0.09, 32]} />
        <meshStandardMaterial color="#b84229" />
      </mesh>
      <mesh position={[0, 0.47, 0]} castShadow>
        <cylinderGeometry args={[0.67, 0.62, 0.07, 12]} />
        <meshStandardMaterial color="#729744" />
      </mesh>
      <mesh position={[0, 0.51, 0]} scale={[1, 0.62, 1]} castShadow>
        <sphereGeometry args={[0.62, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e8aa55" roughness={0.65} />
      </mesh>
      {Array.from({ length: 15 }, (_, i) => {
        const angle = i * 2.4;
        const r = 0.14 + (i % 4) * 0.1;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * r,
              0.51 + Math.sqrt(0.62 ** 2 - r ** 2) * 0.62,
              Math.sin(angle) * r,
            ]}
            rotation={[0.4, angle, 0.3]}
          >
            <capsuleGeometry args={[0.015, 0.055, 3, 6]} />
            <meshStandardMaterial color="#fff1cd" />
          </mesh>
        );
      })}
    </group>
  );
}

function Room({ onSelect }: { onSelect: (id: string) => void }) {
  const special = projects.find((p) => p.id === featuredProjectId)!;
  return (
    <>
      <color attach="background" args={["#e2d5ba"]} />
      <fog attach="fog" args={["#e2d5ba", 16, 32]} />
      <ambientLight intensity={1.6} />
      <hemisphereLight args={["#fff5de", "#8f7a5d", 1.8]} />
      <directionalLight
        position={[2, 9, 6]}
        intensity={3}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.001}
      />
      <Box position={[0, -0.12, 0]} size={[16, 0.2, 20]} color="#e7d9b9" />
      {Array.from({ length: 16 }, (_, x) =>
        Array.from(
          { length: 20 },
          (_, z) =>
            (x + z) % 2 === 0 && (
              <Box
                key={`${x}-${z}`}
                position={[x - 7.5, -0.009, z - 9.5]}
                size={[0.98, 0.02, 0.98]}
                color="#a9b19b"
              />
            ),
        ),
      )}
      <Box position={[0, 3.5, -5.1]} size={[16, 7, 0.3]} color="#f0dfbd" />
      <Box position={[0, 0.75, -4.9]} size={[16, 1.5, 0.12]} color="#385b4b" />
      <Box position={[-7.2, 3, 0]} size={[0.3, 6, 10]} color="#e9d8b6" />
      <Box position={[7.2, 3, 0]} size={[0.3, 6, 10]} color="#e9d8b6" />
      <Sign
        text="STACK HOUSE"
        sub="GOOD TASTE. FULL STACK."
        position={[0, 5.25, -4.85]}
        width={7.8}
        height={1.3}
        color="#294638"
        ink="#f6dfaf"
      />
      <Box position={[0, 1, -2.4]} size={[10.6, 2, 1.5]} color="#b54b32" />
      <Box position={[0, 2.05, -2.35]} size={[11, 0.16, 1.9]} color="#f2deb9" />
      {Array.from({ length: 21 }, (_, i) => (
        <Box
          key={i}
          position={[-5 + i * 0.5, 1, -1.63]}
          size={[0.025, 1.7, 0.025]}
          color="#da8060"
        />
      ))}
      <Sign
        text="ALAN'S"
        sub="BUILT WITH CARE / SERVED WITH CURIOSITY"
        position={[0, 1.15, -1.61]}
        width={3.2}
        height={0.85}
        color="#b54b32"
        ink="#fff0ce"
      />
      {projects.map((p, i) => (
        <group key={p.id}>
          <Box
            position={[-4.05 + i * 2.7, 3.65, -4.78]}
            size={[2.5, 1.95, 0.15]}
            color="#304b3e"
          />
          <Sign
            text={
              p.title === "PHP Announcements API"
                ? "PHP API"
                : p.title === "Relational Workspace"
                  ? "Workspace"
                  : p.title
            }
            sub={`${p.number} / CLICK TO EXPLORE`}
            position={[-4.05 + i * 2.7, 3.65, -4.68]}
            width={2.3}
            height={1.75}
            color="#f3e3bf"
            onClick={() => onSelect(p.id)}
          />
        </group>
      ))}
      <Burger position={[-2.9, 2.14, -2.1]} scale={1.15} />
      <mesh position={[-2.9, 2.15, -2.1]}>
        <cylinderGeometry args={[0.95, 0.95, 0.07, 40]} />
        <meshStandardMaterial color="#eee5d4" />
      </mesh>
      <Sign
        text="HOUSE SPECIAL"
        sub={special.title.toUpperCase()}
        position={[-2.9, 2.65, -1.32]}
        width={1.6}
        height={0.48}
        onClick={() => onSelect(special.id)}
      />
      <Box
        position={[2.9, 2.4, -2.25]}
        size={[0.95, 0.5, 0.7]}
        color="#34473e"
      />
      <Sign
        text="HELLO!"
        sub="LET'S BUILD SOMETHING"
        position={[2.9, 2.62, -1.88]}
        width={0.85}
        height={0.48}
        color="#233a30"
        ink="#d2e3a6"
      />
      {[1.7, 4.8].map((z) => (
        <group key={z} position={[-5.6, 0, z]}>
          <Box position={[0, 0.55, 0]} size={[1.7, 1.1, 2.1]} color="#b94930" />
          <Box
            position={[-0.65, 1.3, 0]}
            size={[0.35, 1.6, 2.1]}
            color="#b94930"
          />
          <Box
            position={[1.1, 1.25, 0]}
            size={[1.6, 0.12, 1.6]}
            color="#e8c887"
          />
          <Box
            position={[1.1, 0.6, 0]}
            size={[0.15, 1.2, 0.15]}
            color="#304b3e"
          />
          <Burger position={[1.1, 1.32, 0]} scale={0.42} />
        </group>
      ))}
      {[0.4, 3.7].map((z) => (
        <group key={z} position={[5.5, 0, z]}>
          <Box position={[0, 0.55, 0]} size={[1.5, 1.1, 1.8]} color="#b94930" />
          <Box
            position={[0.6, 1.3, 0]}
            size={[0.35, 1.6, 1.8]}
            color="#b94930"
          />
          <Box
            position={[-1, 1.25, 0]}
            size={[1.4, 0.12, 1.4]}
            color="#e8c887"
          />
          <Box
            position={[-1, 0.6, 0]}
            size={[0.15, 1.2, 0.15]}
            color="#304b3e"
          />
        </group>
      ))}
      {[-3.4, 0, 3.4].map((x) => (
        <group key={x}>
          <Box
            position={[x, 5.8, -1]}
            size={[0.025, 1.9, 0.025]}
            color="#333e32"
          />
          <mesh position={[x, 4.85, -1]}>
            <coneGeometry args={[0.55, 0.4, 32, 1, true]} />
            <meshStandardMaterial color="#d3a14c" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[x, 4.69, -1]}>
            <sphereGeometry args={[0.12, 12, 8]} />
            <meshBasicMaterial color="#fff1b5" />
          </mesh>
        </group>
      ))}
      <Sign
        text="FRESH IDEAS"
        sub="MADE FROM SCRATCH"
        position={[-6.5, 3.5, -4.8]}
        width={1}
        height={1.7}
        color="#bc4c32"
        ink="#fff1d2"
      />
      <Sign
        text="EST. 2026"
        sub="ALAN HUANG"
        position={[6.5, 3.5, -4.8]}
        width={1}
        height={1.7}
      />
    </>
  );
}

function Walk({
  controls,
  active,
}: {
  controls: RefObject<Controls>;
  active: boolean;
}) {
  useFrame(({ camera }, delta) => {
    const c = controls.current;
    if (c.reset) {
      camera.position.set(0, 2.6, 8);
      Object.assign(c, { yaw: 0, pitch: -0.04, reset: false });
    }
    camera.rotation.order = "YXZ";
    camera.rotation.set(c.pitch, c.yaw, 0);
    if (!active) return;
    const forward =
      Number(c.keys.has("w") || c.keys.has("ArrowUp")) -
      Number(c.keys.has("s") || c.keys.has("ArrowDown"));
    const side =
      Number(c.keys.has("d") || c.keys.has("ArrowRight")) -
      Number(c.keys.has("a") || c.keys.has("ArrowLeft"));
    const speed =
      (Math.min(delta, 0.05) * 3) / Math.max(1, Math.hypot(forward, side));
    camera.position.x = THREE.MathUtils.clamp(
      camera.position.x +
        (side * Math.cos(c.yaw) - forward * Math.sin(c.yaw)) * speed,
      -2.7,
      2.7,
    );
    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z +
        (-forward * Math.cos(c.yaw) - side * Math.sin(c.yaw)) * speed,
      0.5,
      8.5,
    );
  });
  return null;
}

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="scene-fallback">
        The 3D room couldn’t load on this device.
        <a href="#menu">Explore all projects below ↓</a>
      </div>
    ) : (
      this.props.children
    );
  }
}

export default function Restaurant({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const controls = useRef<Controls>({
    keys: new Set(),
    yaw: 0,
    pitch: -0.04,
    reset: true,
  });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const invalidate = useRef<(() => void) | null>(null);
  const room = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (!entry.isIntersecting) controls.current.keys.clear();
    });
    if (room.current) observer.observe(room.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (!active || !room.current?.contains(document.activeElement)) return;
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(e.key)
      ) {
        e.preventDefault();
        controls.current.keys.add(e.key);
      }
      if (e.key === "Escape") {
        setActive(false);
        controls.current.keys.clear();
      }
    }
    function up(e: KeyboardEvent) {
      controls.current.keys.delete(e.key);
    }
    function clear() {
      controls.current.keys.clear();
      drag.current = null;
    }
    window.addEventListener("keydown", key);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      document.body.style.cursor = "";
    };
  }, [active]);
  return (
    <div
      className="room"
      ref={room}
      tabIndex={0}
      aria-label="Interactive restaurant. Enter to explore, use WASD or arrow keys to walk, drag to look. Escape stops walking."
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          controls.current.keys.clear();
          drag.current = null;
        }
      }}
      onPointerDown={(e) => {
        if (!active || (e.target as HTMLElement).tagName !== "CANVAS") return;
        room.current?.focus({ preventScroll: true });
        drag.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMove={(e) => {
        if (!drag.current || !active) return;
        controls.current.yaw -= (e.clientX - drag.current.x) * 0.004;
        controls.current.pitch = THREE.MathUtils.clamp(
          controls.current.pitch - (e.clientY - drag.current.y) * 0.003,
          -0.55,
          0.5,
        );
        drag.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerLeave={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
        controls.current.keys.clear();
      }}
    >
      <SceneBoundary>
        <Canvas
          shadows
          frameloop={active && visible ? "always" : "demand"}
          dpr={[1, 1.5]}
          camera={{ position: [0, 2.6, 8], fov: 58 }}
          onCreated={(state) => {
            invalidate.current = state.invalidate;
            setReady(true);
          }}
          fallback={
            <div className="scene-fallback">
              Explore the project menu below.
            </div>
          }
        >
          <Room onSelect={onSelect} />
          <Walk controls={controls} active={active} />
        </Canvas>
      </SceneBoundary>
      {!active && (
        <div className="room-caption">
          <span className="tiny-label">A portfolio you can step inside</span>
          <strong>
            Welcome to
            <br />
            Stack House.
          </strong>
          <p>Fresh ideas. Thoughtfully built.</p>
        </div>
      )}
      <div className="room-stamp">
        FULL
        <br />
        <b>STACK</b>
        <br />
        GOODNESS
      </div>
      <div className="room-toolbar">
        <span className="room-status">
          <i />
          {active
            ? "YOU’RE IN. MAKE YOURSELF AT HOME."
            : ready
              ? "THE DOORS ARE OPEN"
              : "SETTING THE TABLE…"}
        </span>
        <div>
          <button
            onClick={() => {
              setActive(!active);
              controls.current.keys.clear();
              room.current?.focus({ preventScroll: true });
            }}
          >
            {active ? "Pause exploring" : "Enter the restaurant"}{" "}
            <span aria-hidden="true">↗</span>
          </button>
          <button
            className="reset-view"
            onClick={() => {
              controls.current.reset = true;
              controls.current.keys.clear();
              invalidate.current?.();
            }}
          >
            Reset view
          </button>
        </div>
      </div>
      {active && (
        <>
          <div className="walk-help">
            WASD / arrows to walk · Drag to look · Click a menu board · Esc to
            pause
          </div>
          <div className="touch-controls" aria-label="Walking controls">
            {[
              { key: "w", label: "Walk forward", icon: "↑" },
              { key: "a", label: "Walk left", icon: "←" },
              { key: "s", label: "Walk backward", icon: "↓" },
              { key: "d", label: "Walk right", icon: "→" },
            ].map((item) => (
              <button
                key={item.key}
                aria-label={item.label}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  controls.current.keys.add(item.key);
                }}
                onPointerUp={() => controls.current.keys.delete(item.key)}
                onPointerCancel={() => controls.current.keys.delete(item.key)}
                onLostPointerCapture={() =>
                  controls.current.keys.delete(item.key)
                }
              >
                {item.icon}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
