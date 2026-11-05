import {
  AbsoluteFill,
  Img,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Icon } from "../components/Icons";
import {
  Counter,
  Eyebrow,
  KenBurns,
  PhotoFrame,
  SceneVoice,
  Sfx,
  enter,
  windowOpacity,
} from "../components/Primitives";
import { BRAND, FONT } from "../theme";
import { cue, within, type TimedScene } from "../timeline";

type Display = {
  stats: { value: number; label: string; en: string }[];
  recordsNote: string;
  muri: {
    heading: string;
    /** Photo of the certificates being presented, shown while the records are announced. */
    photo: string;
    /** One certificate per record, in the order they are narrated. */
    certs: { asset: string; title: string; number: string }[];
  };
};

const MOSAIC = [
  "pengukuhan.jpg",
  "kbri-kairo.jpg",
  "launch-buku.jpg",
  "rakornas-mnu.jpg",
  "pci-mesir.jpg",
  "launch-website.jpg",
  "suez.jpg",
  "launch-jurnal.jpg",
];

/* Achievements: counters first, then the MURI documentation: the presentation photo, then each certificate with its record. */
export const S08Achievements: React.FC<{ readonly scene: TimedScene }> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = scene.display as Display;
  const D = scene.durationInFrames;
  const statAt = [
    within(scene, "s08_l02", 0.05),
    within(scene, "s08_l02", 0.62),
    cue(scene, "s08_l03", 8),
  ];
  // The counters give way to the MURI documentation shortly after "dua rekor MURI" is announced.
  const muriAt = cue(scene, "s08_l03", 60);
  // First record at the start of the last sentence, second at its "dan forum nasional…" clause.
  const certAt = [
    within(scene, "s08_l04", 0.02),
    within(scene, "s08_l04", 0.45),
  ];
  const photos = [
    { src: d.muri.photo, from: muriAt },
    { src: d.muri.certs[0].asset, from: certAt[0] },
    { src: d.muri.certs[1].asset, from: certAt[1] },
  ];
  const active = frame >= certAt[1] ? 1 : frame >= certAt[0] ? 0 : -1;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          overflow: "hidden",
          WebkitMaskImage:
            "radial-gradient(ellipse 72% 72% at 50% 50%, #000 45%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 72% 72% at 50% 50%, #000 45%, transparent 100%)",
        }}
      >
        <AbsoluteFill
          style={{ opacity: 0.28, translate: `${-frame * 0.25}px 0px` }}
        >
          <div
            style={{
              position: "absolute",
              left: -40,
              top: -20,
              display: "grid",
              gridTemplateColumns: "repeat(4, 520px)",
              gridAutoRows: "560px",
              gap: 10,
            }}
          >
            {MOSAIC.map((src) => (
              <Img
                key={src}
                src={staticFile(`apmnu/assets/${src}`)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "grayscale(0.4)",
                }}
              />
            ))}
          </div>
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 50% 45%, rgba(4,51,29,0.82), rgba(2,28,16,0.96))",
          }}
        />
      </AbsoluteFill>

      {/* Counters */}
      <AbsoluteFill
        style={{ opacity: windowOpacity(frame, 0, muriAt + 10, 14) }}
      >
        <Eyebrow
          start={cue(scene, "s08_l01")}
          align="center"
          style={{ position: "absolute", top: 110, left: 0, right: 0 }}
        >
          Capaian
        </Eyebrow>
        <div
          style={{
            position: "absolute",
            top: 160,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: FONT.sans,
            fontWeight: 800,
            fontSize: 64,
            color: BRAND.ink,
            opacity: enter(frame, cue(scene, "s08_l01", 4), 20),
          }}
        >
          Jejaring yang terus tumbuh
        </div>

        <div
          style={{
            position: "absolute",
            top: 380,
            left: 220,
            width: 1480,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 40,
          }}
        >
          {d.stats.map((s, i) => {
            const sp = spring({
              frame: frame - statAt[i],
              fps,
              config: { damping: 16 },
            });
            return (
              <div
                key={s.label}
                style={{
                  height: 300,
                  borderRadius: 26,
                  background: "rgba(4,51,29,0.78)",
                  border: "1px solid rgba(232,212,138,0.45)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: sp,
                  scale: `${0.85 + 0.15 * sp}`,
                }}
              >
                {i === 2 ? (
                  <div style={{ position: "absolute", top: 22, right: 26 }}>
                    <Icon name="sertifikat" size={46} start={statAt[i] + 6} />
                  </div>
                ) : null}
                <Counter
                  value={s.value}
                  start={statAt[i] + 4}
                  length={i === 2 ? 20 : 45}
                  style={{ fontSize: 150 }}
                />
                <div
                  style={{
                    fontFamily: FONT.sans,
                    fontWeight: 800,
                    fontSize: 38,
                    color: BRAND.ink,
                    marginTop: 6,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: FONT.sans,
                    fontWeight: 500,
                    fontSize: 22,
                    color: BRAND.accent,
                    marginTop: 4,
                    letterSpacing: "0.06em",
                  }}
                >
                  {s.en}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* MURI documentation */}
      <AbsoluteFill style={{ opacity: enter(frame, muriAt, 18) }}>
        <PhotoFrame
          left={200}
          top={120}
          width={540}
          height={720}
          radius={22}
          style={{ translate: `${(1 - enter(frame, muriAt, 24)) * -40}px 0px` }}
        >
          {photos.map((p, i) => (
            <AbsoluteFill
              key={p.src}
              style={{ opacity: i === 0 ? 1 : enter(frame, p.from, 14) }}
            >
              <Sequence from={p.from} durationInFrames={D - p.from + 20} layout="none">
                <KenBurns src={`apmnu/assets/${p.src}.jpg`} from={1} to={1.06} />
              </Sequence>
            </AbsoluteFill>
          ))}
        </PhotoFrame>

        <div style={{ position: "absolute", left: 840, top: 150, width: 900 }}>
          <Eyebrow start={muriAt + 4}>Rekor MURI</Eyebrow>
          <div
            style={{
              marginTop: 18,
              fontFamily: FONT.sans,
              fontWeight: 800,
              fontSize: 64,
              color: BRAND.ink,
              opacity: enter(frame, muriAt + 8, 20),
            }}
          >
            {d.muri.heading}
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: FONT.sans,
              fontWeight: 500,
              fontSize: 24,
              letterSpacing: "0.08em",
              color: "rgba(232,212,138,0.9)",
              opacity: enter(frame, muriAt + 14, 20),
            }}
          >
            {d.recordsNote}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 840,
            top: 420,
            width: 900,
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          {d.muri.certs.map((c, i) => {
            const p = enter(frame, certAt[i], 20);
            const lit = active === i;
            return (
              <div
                key={c.asset}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  padding: "26px 32px",
                  borderRadius: 20,
                  background: lit
                    ? "rgba(232,212,138,0.16)"
                    : "rgba(232,212,138,0.07)",
                  borderLeft: `4px solid ${lit ? BRAND.accent : "rgba(232,212,138,0.4)"}`,
                  opacity: p * (lit ? 1 : 0.6),
                  translate: `0px ${(1 - p) * 30}px`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT.sans,
                    fontWeight: 800,
                    fontSize: 54,
                    color: BRAND.accent,
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: FONT.sans,
                      fontWeight: 700,
                      fontSize: 30,
                      lineHeight: 1.25,
                      color: BRAND.ink,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontFamily: FONT.sans,
                      fontWeight: 500,
                      fontSize: 21,
                      letterSpacing: "0.06em",
                      color: BRAND.accent,
                    }}
                  >
                    {c.number}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Sound: a pop per stat card, counters, a bell for the last stat, a bell as the documentation opens, a soft hit for each certificate */}
      {statAt.map((at, i) => (
        <Sfx key={i} name="pop" at={at} volume={0.35} rate={0.9 + i * 0.1} />
      ))}
      <Sfx name="count" at={statAt[0] + 4} volume={0.3} />
      <Sfx name="count" at={statAt[1] + 4} volume={0.3} rate={1.1} />
      <Sfx name="chime" at={statAt[2] + 4} volume={0.3} />
      <Sfx name="chime" at={muriAt + 6} volume={0.22} rate={0.9} />
      {certAt.map((at) => (
        <Sfx key={at} name="hit" at={at} volume={0.3} />
      ))}
      <SceneVoice scene={scene} />
    </AbsoluteFill>
  );
};
