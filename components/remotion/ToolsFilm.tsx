import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const FILM = { width: 1280, height: 720, fps: 30, durationInFrames: 360 };

const INK = "#07070a";
const PAPER = "#f4f1ea";
const VOLT = "#c8ff2e";
const EMBER = "#ff5b1f";
const MUTE = "#8d8a84";
const SANS = "var(--font-geist), system-ui, sans-serif";
const SERIF = "var(--font-instrument), Georgia, serif";
const MONO = "var(--font-geist-mono), monospace";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function useEnterExit(len: number) {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: ease });
  const exit = interpolate(frame, [len - 12, len], [1, 0], clamp);
  return Math.min(enter, exit);
}

function SceneLabel({ kit, tool }: { kit: string; tool: string }) {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 48, left: 56, fontFamily: MONO, fontSize: 18, letterSpacing: 3, textTransform: "uppercase", opacity: o }}>
      <span style={{ color: VOLT }}>{kit}</span>
      <span style={{ color: MUTE }}> / {tool}</span>
    </div>
  );
}

function CompressScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vis = useEnterExit(90);
  const pop = spring({ frame, fps, config: { damping: 14 } });
  const p = interpolate(frame, [18, 66], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const kb = Math.round(interpolate(p, [0, 1], [2457, 48]));
  const size = kb > 1000 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
  const done = frame > 68;

  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <SceneLabel kit="MediaKit" tool="Compress Image" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 560,
            padding: 28,
            borderRadius: 28,
            background: "#121218",
            border: "1px solid rgba(244,241,234,0.1)",
            transform: `scale(${0.8 + pop * 0.2}) translateY(${(1 - pop) * 40}px)`,
            display: "flex",
            gap: 24,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 120,
              height: 150,
              borderRadius: 16,
              background: `linear-gradient(160deg, ${EMBER}, #7a2bff)`,
              filter: `saturate(${1 - p * 0.2})`,
              transform: `scale(${1 - p * 0.12})`,
            }}
          />
          <div style={{ flex: 1, fontFamily: SANS }}>
            <div style={{ color: PAPER, fontSize: 26, fontWeight: 500 }}>exam_photo.jpg</div>
            <div style={{ color: done ? VOLT : MUTE, fontFamily: MONO, fontSize: 40, marginTop: 6 }}>{size}</div>
            <div style={{ height: 6, borderRadius: 6, background: "rgba(244,241,234,0.1)", marginTop: 18, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${p * 100}%`, background: VOLT }} />
            </div>
            <div style={{ color: MUTE, fontFamily: MONO, fontSize: 15, marginTop: 14, opacity: done ? 1 : 0.4 }}>
              {done ? "✓ Ready for SSC CGL · 20–50 KB" : "Compressing on your device…"}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function MergeScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vis = useEnterExit(90);
  const pages = [
    { from: -360, rot: -12, color: "#1f1f28" },
    { from: 0, rot: 0, color: "#26262f" },
    { from: 360, rot: 12, color: "#2d2d37" },
  ];
  const merge = spring({ frame: frame - 30, fps, config: { damping: 16, mass: 0.8 } });
  const label = interpolate(frame, [52, 64], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <SceneLabel kit="PDFKit" tool="Merge PDF" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {pages.map((pg, i) => {
          const enter = spring({ frame: frame - i * 5, fps, config: { damping: 14 } });
          const x = pg.from * (1 - merge) + (i - 1) * 14 * merge;
          const y = (1 - enter) * 120 + (i - 1) * -10 * merge;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 220,
                height: 290,
                borderRadius: 18,
                background: pg.color,
                border: "1px solid rgba(244,241,234,0.12)",
                transform: `translate(${x}px, ${y}px) rotate(${pg.rot * (1 - merge)}deg)`,
                opacity: enter,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 14, color: MUTE }}>PAGE {i + 1}</div>
              {[0.9, 0.75, 0.85, 0.6, 0.8].map((w, j) => (
                <div key={j} style={{ height: 8, width: `${w * 100}%`, borderRadius: 4, background: "rgba(244,241,234,0.14)" }} />
              ))}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            bottom: 120,
            fontFamily: MONO,
            fontSize: 22,
            color: VOLT,
            opacity: label,
            transform: `translateY(${(1 - label) * 16}px)`,
          }}
        >
          merged.pdf · 3 pages · 0.4 s
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function PrivacyScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vis = useEnterExit(90);
  const line = interpolate(frame, [10, 40], [0, 1], { ...clamp, easing: ease });
  const cross = spring({ frame: frame - 42, fps, config: { damping: 10 } });
  const text = interpolate(frame, [50, 64], [0, 1], clamp);
  const node = (label: string, color: string, dim = false) => (
    <div
      style={{
        width: 170,
        height: 170,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: MONO,
        fontSize: 18,
        color,
        opacity: dim ? 0.45 : 1,
        background: dim ? "transparent" : "rgba(200,255,46,0.06)",
      }}
    >
      {label}
    </div>
  );

  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <SceneLabel kit="Privacy" tool="Zero uploads" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 0 }}>
        {node("YOUR DEVICE", VOLT)}
        <div style={{ position: "relative", width: 380, height: 2 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `repeating-linear-gradient(90deg, ${MUTE} 0 12px, transparent 12px 22px)`,
              clipPath: `inset(0 ${(1 - line) * 100}% 0 0)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              fontSize: 96,
              lineHeight: 1,
              color: EMBER,
              fontFamily: SANS,
              transform: `translate(-50%, -54%) scale(${cross})`,
            }}
          >
            ×
          </div>
        </div>
        {node("SERVER", MUTE, true)}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: 100,
          width: "100%",
          textAlign: "center",
          fontFamily: SERIF,
          fontSize: 54,
          color: PAPER,
          opacity: text,
          transform: `translateY(${(1 - text) * 20}px)`,
        }}
      >
        <span style={{ fontStyle: "italic", color: VOLT }}>0 bytes</span> uploaded. Ever.
      </div>
    </AbsoluteFill>
  );
}

function FinaleScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vis = interpolate(frame, [0, 10, 80, 90], [0, 1, 1, 0], clamp);
  const words = ["57+ tools.", "Free.", "Forever."];
  const tiles = 57;

  return (
    <AbsoluteFill style={{ opacity: vis, alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(19, 1fr)", gap: 10, padding: 40, opacity: 0.35 }}>
        {Array.from({ length: tiles }).map((_, i) => {
          const s = spring({ frame: frame - i * 0.6, fps, config: { damping: 20 } });
          return <div key={i} style={{ borderRadius: 10, border: "1px solid rgba(244,241,234,0.18)", transform: `scale(${s})`, aspectRatio: "1" }} />;
        })}
      </div>
      <div style={{ display: "flex", gap: 28, fontFamily: SERIF, fontSize: 110, color: PAPER, zIndex: 1 }}>
        {words.map((w, i) => {
          const s = spring({ frame: frame - 8 - i * 9, fps, config: { damping: 13 } });
          return (
            <span
              key={w}
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - s) * 80}px)`,
                opacity: s,
                fontStyle: i > 0 ? "italic" : "normal",
                color: i === 2 ? VOLT : PAPER,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

export default function ToolsFilm() {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, 360], [0, 360]);

  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(600px circle at ${50 + Math.sin((glow * Math.PI) / 180) * 25}% ${50 + Math.cos((glow * Math.PI) / 180) * 20}%, rgba(200,255,46,0.10), transparent 60%)`,
        }}
      />
      <Sequence durationInFrames={90}>
        <CompressScene />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <MergeScene />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <PrivacyScene />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <FinaleScene />
      </Sequence>
      <div style={{ position: "absolute", bottom: 40, right: 56, fontFamily: MONO, fontSize: 16, color: MUTE, letterSpacing: 2 }}>
        TOOLS.GENRISETECH.IN
      </div>
    </AbsoluteFill>
  );
}
