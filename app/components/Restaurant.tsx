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

const DINER_RED = "#c4202e";
const DINER_WHITE = "#f6f4ed";
const CHROME = "#a9b1bc";
const LEFT_BOOTHS = [1.7, 4.8];
const RIGHT_BOOTHS = [0.4, 3.7];

function canWalk(x: number, z: number) {
  if (x < -6.6 || x > 6.6 || z < -1.1 || z > 7.8) return false;
  if (x < -3.4 && LEFT_BOOTHS.some((row) => Math.abs(z - row) < 1.35))
    return false;
  return !(x > 3.5 && RIGHT_BOOTHS.some((row) => Math.abs(z - row) < 1.2));
}

function Box({
  position,
  size,
  color,
  rotation = [0, 0, 0],
  metal = false,
}: {
  position: Vec;
  size: Vec;
  color: string;
  rotation?: Vec;
  metal?: boolean;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={metal ? 0.27 : 0.65}
        metalness={metal ? 0.45 : 0}
      />
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
    ctx.font = `900 ${Math.min(115, h * 0.36)}px Arial`;
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
      <color attach="background" args={["#edf3fa"]} />
      <fog attach="fog" args={["#edf3fa", 20, 35]} />
      <ambientLight intensity={0.8} />
      <hemisphereLight args={["#ffffff", "#a1a7af", 1.35]} />
      <directionalLight
        position={[2, 9, 6]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.001}
      />
      <Box position={[0, -0.12, 0]} size={[16, 0.2, 20]} color={DINER_WHITE} />
      {Array.from({ length: 16 }, (_, x) =>
        Array.from(
          { length: 20 },
          (_, z) =>
            (x + z) % 2 === 0 && (
              <Box
                key={`${x}-${z}`}
                position={[x - 7.5, -0.009, z - 9.5]}
                size={[0.98, 0.02, 0.98]}
                color="#9ba2a9"
              />
            ),
        ),
      )}
      <Box position={[0, 3.5, -5.1]} size={[16, 7, 0.3]} color={DINER_WHITE} />
      <Box
        position={[0, 5.88, 2]}
        size={[14.5, 0.18, 15]}
        color={DINER_WHITE}
      />
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 7.05, 0, 0]}>
          <Box
            position={[0, 0.95, 2]}
            size={[0.22, 1.9, 14]}
            color={DINER_WHITE}
          />
          <Box
            position={[0, 1.78, 2]}
            size={[0.24, 0.22, 14]}
            color={DINER_RED}
          />
          <Box
            position={[0, 5.1, 2]}
            size={[0.22, 1.65, 14]}
            color={DINER_WHITE}
          />
          <mesh position={[0, 3.09, 2]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[14, 2.5]} />
            <meshBasicMaterial color="#a9d7f0" side={THREE.DoubleSide} />
          </mesh>
          <Box
            position={[side * -0.02, 2.04, 2]}
            size={[0.14, 0.23, 14]}
            color="#bacbc8"
          />
          {[-4.9, -1.5, 1.95, 5.4, 8.9].map((z) => (
            <Box
              key={z}
              position={[0, 3.14, z]}
              size={[0.28, 2.65, 0.14]}
              color={CHROME}
              metal
            />
          ))}
        </group>
      ))}
      <Box
        position={[0, 2.5, 8.95]}
        size={[14.2, 5, 0.18]}
        color={DINER_WHITE}
      />
      <Box
        position={[0, 1.95, 8.83]}
        size={[14.2, 0.18, 0.11]}
        color={DINER_RED}
      />
      <Box
        position={[0, 2.83, -4.88]}
        size={[14.4, 0.16, 0.14]}
        color={DINER_RED}
      />
      <Sign
        text="STACK HOUSE"
        sub="GOOD TASTE. FULL STACK."
        position={[0, 5.25, -4.85]}
        width={7.8}
        height={1.3}
        color={DINER_RED}
        ink="#fff8e7"
      />
      <Box position={[0, 1, -2.4]} size={[10.6, 2, 1.5]} color={DINER_WHITE} />
      <Box
        position={[0, 2.05, -2.35]}
        size={[11, 0.16, 1.9]}
        color={CHROME}
        metal
      />
      <Box
        position={[0, 1.69, -1.634]}
        size={[10.61, 0.28, 0.05]}
        color={DINER_RED}
      />
      <Box
        position={[0, 0.18, -1.62]}
        size={[10.61, 0.14, 0.05]}
        color={CHROME}
        metal
      />
      {Array.from({ length: 21 }, (_, i) => (
        <Box
          key={i}
          position={[-5 + i * 0.5, 1, -1.63]}
          size={[0.025, 1.7, 0.025]}
          color="#dadde0"
        />
      ))}
      <Sign
        text="ALAN'S"
        sub="BUILT WITH CARE / SERVED WITH CURIOSITY"
        position={[0, 1.15, -1.61]}
        width={3.2}
        height={0.85}
        color={DINER_WHITE}
        ink={DINER_RED}
      />
      {projects.map((p, i) => (
        <group key={p.id}>
          <Box
            position={[-4.05 + i * 2.7, 3.65, -4.78]}
            size={[2.5, 1.95, 0.15]}
            color={DINER_RED}
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
            color="#fffdf6"
            ink="#a71926"
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
      {LEFT_BOOTHS.map((z) => (
        <group key={z} position={[-5.6, 0, z]}>
          <Box
            position={[0, 0.55, 0]}
            size={[1.7, 1.1, 2.1]}
            color={DINER_RED}
          />
          <Box
            position={[-0.65, 1.3, 0]}
            size={[0.35, 1.6, 2.1]}
            color={DINER_RED}
          />
          <Box
            position={[1.1, 1.25, 0]}
            size={[1.6, 0.12, 1.6]}
            color={DINER_WHITE}
          />
          <Box
            position={[1.1, 0.6, 0]}
            size={[0.15, 1.2, 0.15]}
            color={CHROME}
            metal
          />
          <Burger position={[1.1, 1.32, 0]} scale={0.42} />
        </group>
      ))}
      {RIGHT_BOOTHS.map((z) => (
        <group key={z} position={[5.5, 0, z]}>
          <Box
            position={[0, 0.55, 0]}
            size={[1.5, 1.1, 1.8]}
            color={DINER_RED}
          />
          <Box
            position={[0.6, 1.3, 0]}
            size={[0.35, 1.6, 1.8]}
            color={DINER_RED}
          />
          <Box
            position={[-1, 1.25, 0]}
            size={[1.4, 0.12, 1.4]}
            color={DINER_WHITE}
          />
          <Box
            position={[-1, 0.6, 0]}
            size={[0.15, 1.2, 0.15]}
            color={CHROME}
            metal
          />
        </group>
      ))}
      {[-4.5, 0, 4.5].flatMap((x) =>
        [0, 4.6].map((z) => (
          <group key={`${x}:${z}`} position={[0, 0, z]}>
            <Box
              position={[x, 5.5, -1]}
              size={[0.05, 0.6, 0.05]}
              color={CHROME}
            />
            <mesh position={[x, 5.18, -1]}>
              <cylinderGeometry args={[0.35, 0.41, 0.11, 24]} />
              <meshStandardMaterial
                color={CHROME}
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[x, 4.98, -1]} scale={[1, 0.75, 1]}>
              <sphereGeometry args={[0.36, 18, 12]} />
              <meshBasicMaterial color="#fff9e9" />
            </mesh>
          </group>
        )),
      )}
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
  const player = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const stride = useRef(0);
  useFrame(({ camera }, delta) => {
    const avatar = player.current;
    if (!avatar) return;
    const c = controls.current;
    if (c.reset) {
      avatar.position.set(0, 0, 4.9);
      avatar.rotation.y = 0;
      stride.current = 0;
      Object.assign(c, { yaw: 0, pitch: -0.04, reset: false });
    }
    const forward = !active
      ? 0
      : Number(c.keys.has("w") || c.keys.has("ArrowUp")) -
        Number(c.keys.has("s") || c.keys.has("ArrowDown"));
    const side = !active
      ? 0
      : Number(c.keys.has("d") || c.keys.has("ArrowRight")) -
        Number(c.keys.has("a") || c.keys.has("ArrowLeft"));
    const dt = Math.min(delta, 0.05);
    const speed = (dt * 3.3) / Math.max(1, Math.hypot(forward, side));
    const sin = Math.sin(c.yaw);
    const cos = Math.cos(c.yaw);
    const dx = (side * cos - forward * sin) * speed;
    const dz = (-forward * cos - side * sin) * speed;
    const { x, z } = avatar.position;
    // Resolve each axis separately so the player can slide alongside furniture.
    if (canWalk(x + dx, z)) avatar.position.x += dx;
    if (canWalk(avatar.position.x, z + dz)) avatar.position.z += dz;
    const moved = Math.hypot(avatar.position.x - x, avatar.position.z - z);
    if (moved > 0.0001) {
      const heading = Math.atan2(-dx, -dz);
      const turn = heading - avatar.rotation.y;
      avatar.rotation.y +=
        Math.atan2(Math.sin(turn), Math.cos(turn)) * (1 - Math.exp(-17 * dt));
      stride.current += moved * 4.3;
    }
    const swing = moved > 0.0001 ? Math.sin(stride.current) * 0.48 : 0;
    for (const [limb, direction] of [
      [leftArm, -1],
      [rightArm, 1],
      [leftLeg, 1],
      [rightLeg, -1],
    ] as const) {
      if (limb.current)
        limb.current.rotation.x = THREE.MathUtils.damp(
          limb.current.rotation.x,
          swing * direction,
          18,
          dt,
        );
    }
    // Keep the orbit inside the dining room, lifting it near a wall so the avatar stays visible.
    const px = avatar.position.x;
    const pz = avatar.position.z;
    const ox = sin * 3.9;
    const oz = cos * 3.9;
    const cx = THREE.MathUtils.clamp(px + ox, -6.75, 6.75);
    const cz = THREE.MathUtils.clamp(pz + oz, -1.32, 8.65);
    const tight = 1 - Math.min(1, Math.hypot(cx - px, cz - pz) / 3.9);
    camera.position.set(
      cx,
      Math.max(2.35, 2.85 + tight * 1.45 + c.pitch * 1.8),
      cz,
    );
    camera.lookAt(px - sin * 0.65, 1.52 + c.pitch * 0.45, pz - cos * 0.65);
  });
  const black = "#20242c";
  const fur = "#f7f3e8";
  return (
    <group ref={player} position={[0, 0, 4.9]}>
      <mesh position={[0, 0.91, 0]} scale={[0.37, 0.41, 0.23]} castShadow>
        <sphereGeometry args={[1, 20, 14]} />
        <meshStandardMaterial color={DINER_RED} />
      </mesh>
      <Box
        position={[0, 0.94, 0.225]}
        size={[0.24, 0.18, 0.025]}
        color="#ffcf65"
      />
      <Box
        position={[0, 0.94, 0.242]}
        size={[0.19, 0.026, 0.02]}
        color="#8d281f"
      />
      <mesh position={[0, 1.48, -0.025]} scale={[0.36, 0.31, 0.31]} castShadow>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color={fur} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[side * 0.25, 1.7, -0.045]}
            scale={[0.13, 0.13, 0.095]}
            castShadow
          >
            <sphereGeometry args={[1, 14, 10]} />
            <meshStandardMaterial color={black} />
          </mesh>
          <mesh
            position={[side * 0.135, 1.49, -0.28]}
            rotation={[0, side * -0.25, side * 0.25]}
            scale={[0.084, 0.106, 0.04]}
          >
            <sphereGeometry args={[1, 16, 10]} />
            <meshStandardMaterial color={black} />
          </mesh>
          <mesh position={[side * 0.135, 1.51, -0.319]}>
            <sphereGeometry args={[0.019, 10, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <group
            ref={side < 0 ? leftArm : rightArm}
            position={[side * 0.36, 1.11, 0]}
            rotation={[0, 0, side * 0.09]}
          >
            <mesh position={[0, -0.19, 0]} castShadow>
              <capsuleGeometry args={[0.107, 0.27, 5, 12]} />
              <meshStandardMaterial color={fur} />
            </mesh>
            <mesh position={[0, -0.39, 0]} castShadow>
              <sphereGeometry args={[0.099, 12, 8]} />
              <meshStandardMaterial color={black} />
            </mesh>
          </group>
          <group
            ref={side < 0 ? leftLeg : rightLeg}
            position={[side * 0.17, 0.61, 0]}
          >
            <mesh position={[0, -0.22, 0]} castShadow>
              <capsuleGeometry args={[0.115, 0.32, 5, 12]} />
              <meshStandardMaterial color={black} />
            </mesh>
            <mesh
              position={[0, -0.49, -0.07]}
              scale={[0.13, 0.105, 0.21]}
              castShadow
            >
              <sphereGeometry args={[1, 14, 10]} />
              <meshStandardMaterial color={DINER_RED} />
            </mesh>
          </group>
        </group>
      ))}
      <mesh position={[0, 1.405, -0.318]} scale={[0.065, 0.042, 0.044]}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color={black} />
      </mesh>
    </group>
  );
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
      aria-label="Third-person diner. Enter to explore, use WASD or arrow keys to walk, drag to orbit the camera. Escape pauses."
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
          camera={{ position: [0, 2.8, 8.65], fov: 59 }}
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
            WASD / arrows to walk · Drag to orbit · Click a menu board · Esc to
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
