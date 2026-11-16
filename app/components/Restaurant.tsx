"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
  type PointerEvent as ReactPointerEvent,
} from "react";
import * as THREE from "three";
import { projects, featuredProjectId } from "../projects";
import { palette } from "../theme";
import { webGLContextOptions } from "../webgl";

type Vec = [number, number, number];
type Controls = {
  keys: Set<string>;
  yaw: number;
  pitch: number;
  yawVelocity: number;
  pitchVelocity: number;
  reducedMotion: boolean;
  reset: boolean;
};

type OrbitSample = { x: number; y: number; time: number };
type OrbitDrag = {
  pointerId: number;
  start: OrbitSample;
  last: OrbitSample;
  samples: OrbitSample[];
  tracking: boolean;
};

const DINER_RED = palette.red;
const DINER_WHITE = palette.paper;
const CHROME = palette.steel;
const YAW_PER_PIXEL = 0.004;
const PITCH_PER_PIXEL = 0.003;
const ORBIT_FRICTION = 12;
const ORBIT_THRESHOLD = 8;
const SIGN_TEXTURE_SCALE = 2;
/** Highest pixel ratio the scene renders at; sharp on retina screens. */
const MAX_DPR = 2;
/** Lowest pixel ratio adaptive quality will step down to. */
const MIN_DPR = 1;
/** Step quality down when the average frame takes longer than this (~45 fps). */
const SLOW_FRAME_SECONDS = 1 / 45;
const PRESS_KEYS = new Set([
  "w",
  "a",
  "s",
  "d",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
]);

function moveKey(key: string) {
  return key.length === 1 ? key.toLowerCase() : key;
}

function pitchWithinRoom(pitch: number) {
  return THREE.MathUtils.clamp(pitch, -0.55, 0.5);
}

function stopOrbit(controls: Controls) {
  controls.yawVelocity = 0;
  controls.pitchVelocity = 0;
}
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
  color = palette.white,
  ink = palette.ink,
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
    // Draw at 2x and scale the context, so the layout math stays in 1024 units.
    const canvas = document.createElement("canvas");
    canvas.width = 1024 * SIGN_TEXTURE_SCALE;
    canvas.height = Math.round((1024 * height) / width) * SIGN_TEXTURE_SCALE;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(SIGN_TEXTURE_SCALE, SIGN_TEXTURE_SCALE);
    const h = canvas.height / SIGN_TEXTURE_SCALE;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1024, h);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, 992, h - 32);
    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${Math.min(115, h * 0.36)}px system-ui, sans-serif`;
    ctx.fillText(text, 512, sub ? h * 0.43 : h / 2, 930);
    if (sub) {
      ctx.font = `${Math.min(29, h * 0.13)}px monospace`;
      ctx.fillText(sub, 512, h * 0.72, 920);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
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
      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
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
        color={palette.gold}
        rotation={[0, 0.3, 0]}
      />
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.57, 0.58, 0.09, 32]} />
        <meshStandardMaterial color={palette.accent} />
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

const SHAKE_FLAVOURS = {
  strawberry: "#f4a6b8",
  vanilla: "#f6e7c8",
  chocolate: "#8a5a44",
} as const;

/** A diner milkshake: tall glass, whipped cream, cherry and a striped straw. */
function Milkshake({
  position,
  flavour = "strawberry",
  scale = 1,
}: {
  position: Vec;
  flavour?: keyof typeof SHAKE_FLAVOURS;
  scale?: number;
}) {
  const shake = SHAKE_FLAVOURS[flavour];
  return (
    <group position={position} scale={scale}>
      {/* Glass foot and stem */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.04, 24]} />
        <meshStandardMaterial color={palette.white} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.14, 12]} />
        <meshStandardMaterial color={palette.white} roughness={0.15} />
      </mesh>
      {/* Shake in a flared glass */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.12, 0.44, 28]} />
        <meshStandardMaterial color={shake} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.61, 0]}>
        <torusGeometry args={[0.2, 0.018, 8, 28]} />
        <meshStandardMaterial color={palette.white} roughness={0.1} />
      </mesh>
      {/* Whipped cream in three swirls */}
      {[0.66, 0.75, 0.83].map((y, i) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <sphereGeometry args={[0.19 - i * 0.05, 20, 14]} />
          <meshStandardMaterial color="#fffaf0" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0.02, 0.92, 0]} castShadow>
        <sphereGeometry args={[0.055, 16, 12]} />
        <meshStandardMaterial color={palette.red} roughness={0.25} />
      </mesh>
      {/* Striped straw */}
      <group position={[0.08, 0.72, 0.04]} rotation={[0.1, 0, -0.22]}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[0, i * 0.075 - 0.19, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.075, 10]} />
            <meshStandardMaterial
              color={i % 2 ? palette.white : palette.red}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** A chrome spindle mixer with a shake cup, as on a diner counter. */
function ShakeMixer({ position }: { position: Vec }) {
  return (
    <group position={position}>
      <Box
        position={[0, 0.06, 0]}
        size={[0.5, 0.12, 0.42]}
        color={CHROME}
        metal
      />
      <Box
        position={[0, 0.5, -0.15]}
        size={[0.14, 0.8, 0.12]}
        color={DINER_RED}
      />
      <mesh
        position={[0, 0.92, -0.02]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.13, 0.13, 0.42, 20]} />
        <meshStandardMaterial color={DINER_RED} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.66, 0.12]}>
        <cylinderGeometry args={[0.012, 0.012, 0.36, 8]} />
        <meshStandardMaterial color={CHROME} metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.34, 0.12]} castShadow>
        <cylinderGeometry args={[0.13, 0.1, 0.38, 20, 1, true]} />
        <meshStandardMaterial
          color={CHROME}
          metalness={0.65}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/** Glowing neon lettering on a dark backing, drawn once to a canvas. */
function NeonSign({
  text,
  position,
  rotation = [0, 0, 0],
  width,
  height,
  glow,
}: {
  text: string;
  position: Vec;
  rotation?: Vec;
  width: number;
  height: number;
  glow: string;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = Math.round((2048 * height) / width);
    const ctx = canvas.getContext("2d")!;
    const h = canvas.height;
    ctx.fillStyle = "#1b1418";
    ctx.beginPath();
    ctx.roundRect(0, 0, 2048, h, h * 0.18);
    ctx.fill();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `italic 800 ${h * 0.58}px system-ui, sans-serif`;
    // Layer wide soft glows under a crisp white-hot core.
    ctx.strokeStyle = glow;
    ctx.lineJoin = "round";
    for (const [blur, line] of [
      [h * 0.22, h * 0.07],
      [h * 0.1, h * 0.045],
    ]) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = blur;
      ctx.lineWidth = line;
      ctx.strokeText(text, 1024, h * 0.52, 1900);
    }
    ctx.shadowBlur = h * 0.04;
    ctx.lineWidth = h * 0.018;
    ctx.strokeStyle = "#fff4f7";
    ctx.strokeText(text, 1024, h * 0.52, 1900);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, [text, width, height, glow]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
      <pointLight
        position={[0, 0, 0.6]}
        color={glow}
        intensity={2.2}
        distance={4.5}
        decay={2}
      />
    </group>
  );
}

function Room({ onSelect }: { onSelect: (id: string) => void }) {
  const special = projects.find((p) => p.id === featuredProjectId)!;
  return (
    <>
      <color attach="background" args={[palette.sky]} />
      <fog attach="fog" args={[palette.sky, 20, 35]} />
      <ambientLight intensity={0.8} />
      <hemisphereLight args={[palette.white, palette.steel, 1.35]} />
      <directionalLight
        position={[2, 9, 6]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={4}
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
                color={palette.tile}
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
            <meshBasicMaterial color={palette.sky} side={THREE.DoubleSide} />
          </mesh>
          <Box
            position={[side * -0.02, 2.04, 2]}
            size={[0.14, 0.23, 14]}
            color={CHROME}
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
        ink={palette.white}
      />
      <Box position={[0, 1, -2.4]} size={[10.6, 2, 1.5]} color={palette.ink} />
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
          color={palette.muted}
        />
      ))}
      <Sign
        text="ALAN'S"
        sub="BUILT WITH CARE / SERVED WITH CURIOSITY"
        position={[0, 1.15, -1.61]}
        width={3.2}
        height={0.85}
        color={palette.ink}
        ink={palette.white}
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
            color={palette.white}
            ink={palette.accent}
            onClick={() => onSelect(p.id)}
          />
        </group>
      ))}
      <Burger position={[-2.9, 2.14, -2.1]} scale={1.15} />
      <mesh position={[-2.9, 2.15, -2.1]}>
        <cylinderGeometry args={[0.95, 0.95, 0.07, 40]} />
        <meshStandardMaterial color={palette.white} />
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
        color={palette.ink}
      />
      <Sign
        text="HELLO!"
        sub="LET'S BUILD SOMETHING"
        position={[2.9, 2.62, -1.88]}
        width={0.85}
        height={0.48}
        color={palette.ink}
        ink={palette.gold}
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
          <Burger position={[1.1, 1.32, -0.3]} scale={0.42} />
          <Milkshake
            position={[1.3, 1.31, 0.4]}
            flavour={z < 3 ? "strawberry" : "chocolate"}
            scale={0.9}
          />
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
          <Milkshake
            position={[-1.2, 1.31, -0.25]}
            flavour={z < 2 ? "vanilla" : "strawberry"}
            scale={0.9}
          />
          <Milkshake
            position={[-0.8, 1.31, 0.3]}
            flavour="chocolate"
            scale={0.9}
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
              <meshBasicMaterial color={palette.white} />
            </mesh>
          </group>
        )),
      )}
      <ShakeMixer position={[4.35, 2.13, -2.3]} />
      <Milkshake position={[1.55, 2.13, -2.05]} flavour="strawberry" />
      <Milkshake position={[-1.35, 2.13, -2.2]} flavour="vanilla" />
      <NeonSign
        text="SHAKES"
        position={[6.92, 5.08, 2.4]}
        rotation={[0, -Math.PI / 2, 0]}
        width={3.4}
        height={1.05}
        glow="#ff5c8a"
      />
      <NeonSign
        text="MALTS"
        position={[-6.92, 5.08, 2.4]}
        rotation={[0, Math.PI / 2, 0]}
        width={3}
        height={1.05}
        glow="#5cd6ff"
      />
      <Sign
        text="FRESH IDEAS"
        sub="MADE FROM SCRATCH"
        position={[-6.5, 3.5, -4.8]}
        width={1}
        height={1.7}
        color={palette.ink}
        ink={palette.white}
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

/**
 * Renders at up to 2x pixel ratio, then steps down in 0.25 increments if the
 * average frame time stays slow while exploring. It never steps back up, so
 * quality doesn't oscillate.
 */
function AdaptiveQuality({ active }: { active: boolean }) {
  const frames = useRef({ total: 0, count: 0 });
  useFrame(({ viewport, setDpr }, delta) => {
    // Only measure continuous rendering; skip hitches such as tab switches.
    if (!active || delta > 0.25) return;
    const f = frames.current;
    f.total += delta;
    f.count += 1;
    if (f.count < 90) return;
    const average = f.total / f.count;
    f.total = 0;
    f.count = 0;
    if (average > SLOW_FRAME_SECONDS && viewport.dpr > MIN_DPR) {
      setDpr(Math.max(MIN_DPR, viewport.dpr - 0.25));
    }
  });
  return null;
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
      stopOrbit(c);
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
    if (active && !c.reducedMotion && (c.yawVelocity || c.pitchVelocity)) {
      const decay = Math.exp(-ORBIT_FRICTION * dt);
      const travel = (1 - decay) / ORBIT_FRICTION;
      const pitch = c.pitch + c.pitchVelocity * travel;
      const boundedPitch = pitchWithinRoom(pitch);
      Object.assign(c, {
        yaw: c.yaw + c.yawVelocity * travel,
        pitch: boundedPitch,
        yawVelocity: Math.abs(c.yawVelocity) < 0.01 ? 0 : c.yawVelocity * decay,
        pitchVelocity:
          pitch !== boundedPitch || Math.abs(c.pitchVelocity) < 0.01
            ? 0
            : c.pitchVelocity * decay,
      });
    }
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
        Math.atan2(Math.sin(turn), Math.cos(turn)) *
        (c.reducedMotion ? 1 : 1 - Math.exp(-17 * dt));
      stride.current += moved * 4.3;
    }
    const swing =
      moved > 0.0001 && !c.reducedMotion ? Math.sin(stride.current) * 0.48 : 0;
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
  const black = palette.ink;
  const fur = palette.paper;
  return (
    <group ref={player} position={[0, 0, 4.9]}>
      <mesh position={[0, 0.91, 0]} scale={[0.37, 0.41, 0.23]} castShadow>
        <sphereGeometry args={[1, 20, 14]} />
        <meshStandardMaterial color={DINER_RED} />
      </mesh>
      <Box
        position={[0, 0.94, 0.225]}
        size={[0.24, 0.18, 0.025]}
        color={palette.gold}
      />
      <Box
        position={[0, 0.94, 0.242]}
        size={[0.19, 0.026, 0.02]}
        color={palette.accent}
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
            <meshBasicMaterial color={palette.white} />
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
  { children: ReactNode; onUnavailable: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onUnavailable();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type RestaurantProps = {
  onSelect: (id: string) => void;
  onUnavailable: () => void;
};

function RestaurantScene({ onSelect, onUnavailable }: RestaurantProps) {
  const controls = useRef<Controls>({
    keys: new Set(),
    yaw: 0,
    pitch: -0.04,
    yawVelocity: 0,
    pitchVelocity: 0,
    reducedMotion: false,
    reset: true,
  });
  const drag = useRef<OrbitDrag | null>(null);
  const [active, setActive] = useState(false);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const ready = renderer !== null;
  const [visible, setVisible] = useState(true);
  const invalidate = useRef<(() => void) | null>(null);
  const room = useRef<HTMLDivElement>(null);
  const cancelInteraction = useCallback(() => {
    const current = drag.current;
    drag.current = null;
    if (current && room.current?.hasPointerCapture(current.pointerId)) {
      room.current.releasePointerCapture(current.pointerId);
    }
    controls.current.keys.clear();
    stopOrbit(controls.current);
  }, []);

  useEffect(() => {
    if (!renderer) return;
    const canvas = renderer.domElement;
    function handleContextLoss() {
      cancelInteraction();
      onUnavailable();
    }
    canvas.addEventListener("webglcontextlost", handleContextLoss);
    // Catch a loss between onCreated and this effect's listener setup.
    if (renderer.getContext().isContextLost()) handleContextLoss();
    return () =>
      canvas.removeEventListener("webglcontextlost", handleContextLoss);
  }, [renderer, cancelInteraction, onUnavailable]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    function updateMotion() {
      controls.current.reducedMotion = preference.matches;
      if (preference.matches) stopOrbit(controls.current);
    }
    updateMotion();
    preference.addEventListener("change", updateMotion);
    return () => preference.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (!entry.isIntersecting) cancelInteraction();
    });
    if (room.current) observer.observe(room.current);
    return () => observer.disconnect();
  }, [cancelInteraction]);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (!active || !room.current?.contains(document.activeElement)) return;
      const direction = moveKey(e.key);
      if (!e.metaKey && !e.ctrlKey && !e.altKey && PRESS_KEYS.has(direction)) {
        e.preventDefault();
        controls.current.keys.add(direction);
      }
      if (e.key === "Escape") {
        setActive(false);
        cancelInteraction();
      }
    }
    function up(e: KeyboardEvent) {
      controls.current.keys.delete(moveKey(e.key));
    }
    window.addEventListener("keydown", key);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", cancelInteraction);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", cancelInteraction);
      document.body.style.cursor = "";
    };
  }, [active, cancelInteraction]);

  function orbitStart(e: ReactPointerEvent<HTMLDivElement>) {
    if (
      !active ||
      e.button !== 0 ||
      drag.current ||
      !(e.target instanceof HTMLCanvasElement)
    )
      return;
    room.current?.focus({ preventScroll: true });
    stopOrbit(controls.current);
    const sample = { x: e.clientX, y: e.clientY, time: e.timeStamp };
    drag.current = {
      pointerId: e.pointerId,
      start: sample,
      last: sample,
      samples: [sample],
      tracking: false,
    };
  }

  function orbitMove(e: ReactPointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || !active || e.pointerId !== current.pointerId) return;
    const sample = { x: e.clientX, y: e.clientY, time: e.timeStamp };
    if (!current.tracking) {
      if (
        Math.hypot(sample.x - current.start.x, sample.y - current.start.y) <
        ORBIT_THRESHOLD
      )
        return;
      // Leave taps on the canvas for raycasting; capture only once an orbit is clear.
      e.currentTarget.setPointerCapture(e.pointerId);
      current.tracking = true;
    }
    const c = controls.current;
    c.yaw -= (sample.x - current.last.x) * YAW_PER_PIXEL;
    c.pitch = pitchWithinRoom(
      c.pitch - (sample.y - current.last.y) * PITCH_PER_PIXEL,
    );
    current.last = sample;
    current.samples = current.samples
      .filter((point) => sample.time - point.time <= 90)
      .slice(-5);
    current.samples.push(sample);
  }

  function orbitEnd(e: ReactPointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== e.pointerId) return;
    drag.current = null;
    const c = controls.current;
    const first = current.samples[0];
    const elapsed = (current.last.time - first.time) / 1000;
    if (
      current.tracking &&
      !c.reducedMotion &&
      e.timeStamp - current.last.time < 75 &&
      elapsed > 0.008
    ) {
      // Handoff from the recent gesture, capped so a quick flick stays restrained.
      c.yawVelocity = THREE.MathUtils.clamp(
        (-(current.last.x - first.x) * YAW_PER_PIXEL) / elapsed,
        -1.45,
        1.45,
      );
      c.pitchVelocity = THREE.MathUtils.clamp(
        (-(current.last.y - first.y) * PITCH_PER_PIXEL) / elapsed,
        -0.85,
        0.85,
      );
    }
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  }

  return (
    <div
      className="room"
      data-active={active}
      ref={room}
      tabIndex={ready ? 0 : undefined}
      aria-label={
        ready
          ? "Third-person diner. Enter to explore, use WASD or arrow keys to walk, drag to orbit the camera. Escape pauses."
          : undefined
      }
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          cancelInteraction();
        }
      }}
      onPointerDown={orbitStart}
      onPointerMove={orbitMove}
      onPointerUp={orbitEnd}
      onPointerLeave={(e) => {
        if (
          drag.current?.pointerId === e.pointerId &&
          !e.currentTarget.hasPointerCapture(e.pointerId)
        )
          cancelInteraction();
      }}
      onPointerCancel={(e) => {
        if (drag.current?.pointerId === e.pointerId) cancelInteraction();
      }}
      onLostPointerCapture={(e) => {
        if (drag.current?.pointerId === e.pointerId) cancelInteraction();
      }}
    >
      <Canvas
        gl={webGLContextOptions}
        shadows="soft"
        frameloop={active && visible ? "always" : "demand"}
        dpr={[MIN_DPR, MAX_DPR]}
        camera={{ position: [0, 2.8, 8.65], fov: 59 }}
        onCreated={(state) => {
          invalidate.current = state.invalidate;
          setRenderer(state.gl);
        }}
      >
        <Room onSelect={onSelect} />
        <Walk controls={controls} active={active} />
        <AdaptiveQuality active={active && visible} />
      </Canvas>
      {ready && !active && (
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
        <span className="room-status" role="status">
          <i />
          {active
            ? "YOU’RE IN. MAKE YOURSELF AT HOME."
            : ready
              ? "THE DOORS ARE OPEN"
              : "LOADING THE 3D DINER…"}
        </span>
        {ready && (
          <div>
            <button
              onClick={() => {
                setActive(!active);
                cancelInteraction();
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
                cancelInteraction();
                invalidate.current?.();
              }}
            >
              Reset view
            </button>
          </div>
        )}
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

export default function Restaurant(props: RestaurantProps) {
  return (
    <SceneBoundary onUnavailable={props.onUnavailable}>
      <RestaurantScene {...props} />
    </SceneBoundary>
  );
}
