import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Icon, type IconName } from "../components/Icons";
import { IndonesiaMap, PROVINCES } from "../components/GeoMap";
import { Counter, Eyebrow, KenBurns, PhotoFrame, SceneVoice, Sfx, enter, windowOpacity } from "../components/Primitives";
import { BRAND, FONT, GOLD_TEXT, clamp } from "../theme";
import { cue, within, type TimedScene } from "../timeline";

type Display = {
  chapter: string;
  venue: string;
  theme: string;
  attendees: number;
  attendeesLabel: string;
  attendeesLabelEn: string;
  regions: string[];
  topics: string[];
  products: { id: "buku" | "website" | "jurnal"; kind: string; title: string; asset: string }[];
};

const REGION_GROUPS: Record<string, (p: (typeof PROVINCES)[number]) => boolean> = {
  Sumatera: (p) => p.group === "sumatera",
  Kalimantan: (p) => p.group === "kalimantan",
  Sulawesi: (p) => p.group === "sulawesi",
  Jawa: (p) => p.group === "jawa",
  NTB: (p) => p.id === "ntb",
};

const PRODUCT_ICON: Record<string, IconName> = { buku: "buku", website: "web", jurnal: "jurnal" };
const PRODUCT_AT = [0.36, 0.6, 0.78];

/* Jombang: chapter card, seminar poster, 82 professors on the map, then three products flip in. */
export const S06Jombang: React.FC<{ readonly scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const d = scene.display as Display;
  const l01 = cue(scene, "s06_l01");
  const l02 = cue(scene, "s06_l02");
  const l03 = cue(scene, "s06_l03");
  const l05 = cue(scene, "s06_l05");
  const [congress, city, month] = d.chapter.split(" · ");

  const lit: Record<string, number> = {};
  d.regions.forEach((r, i) => {
    const at = within(scene, "s06_l03", 0.12 + i * 0.13);
    PROVINCES.filter(REGION_GROUPS[r]).forEach((p, k) => {
      lit[p.id] = at + k * 2;
    });
  });

  return (
    <AbsoluteFill>
      {/* Chapter card */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: windowOpacity(frame, 0, l02 + 8, 16) }}>
        <Eyebrow start={l01} align="center">
          {congress}
        </Eyebrow>
        <div
          style={{
            fontFamily: FONT.sans,
            fontWeight: 800,
            fontSize: 190,
            // Gradient text is only painted inside its own box, so leave room below the baseline for the "g".
            lineHeight: 1.3,
            marginTop: -4,
            color: "transparent",
            backgroundImage: GOLD_TEXT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            letterSpacing: `${interpolate(frame, [l01, l01 + 60], [0.12, 0.02], clamp)}em`,
            opacity: enter(frame, l01 + 6, 24),
          }}
        >
          {city}
        </div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 46, color: BRAND.ink, marginTop: 8, opacity: enter(frame, l01 + 20, 20) }}>{month}</div>
      </AbsoluteFill>

      {/* Seminar */}
      <AbsoluteFill style={{ opacity: windowOpacity(frame, l02 - 6, l03 + 8, 14) }}>
        <PhotoFrame left={150} top={150} width={680} height={690}>
          <Sequence from={l02 - 6} durationInFrames={l03 - l02 + 20} layout="none">
            <KenBurns src="apmnu/assets/poster-seminar.png" from={1} to={1.25} position="50% 0%" fit="contain" style={{ transformOrigin: "50% 15%" }} />
          </Sequence>
        </PhotoFrame>
        <div style={{ position: "absolute", left: 920, top: 230, width: 860 }}>
          <Eyebrow start={l02}>{d.venue}</Eyebrow>
          <div style={{ marginTop: 26, fontFamily: FONT.sans, fontWeight: 800, fontSize: 58, lineHeight: 1.12, color: BRAND.ink, opacity: enter(frame, l02 + 8, 20) }}>
            Seminar Nasional &amp; Bahtsul Masail
          </div>
          <div
            style={{
              marginTop: 32,
              paddingLeft: 26,
              borderLeft: `3px solid ${BRAND.gold}`,
              fontFamily: FONT.serif,
              fontStyle: "italic",
              fontSize: 46,
              lineHeight: 1.3,
              color: BRAND.accent,
              opacity: enter(frame, within(scene, "s06_l02", 0.5), 24),
            }}
          >
            “{d.theme}”
          </div>
        </div>
      </AbsoluteFill>

      {/* Attendance */}
      <AbsoluteFill style={{ opacity: windowOpacity(frame, l03 - 6, l05 + 8, 14) }}>
        <div style={{ position: "absolute", left: 150, top: 230, width: 600 }}>
          <Counter value={d.attendees} start={l03 + 4} length={50} style={{ fontSize: 230 }} />
          <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 46, color: BRAND.ink, marginTop: 8 }}>{d.attendeesLabel}</div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 24, color: BRAND.accent, marginTop: 6, letterSpacing: "0.06em" }}>{d.attendeesLabelEn}</div>
          <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 14 }}>
            {d.topics.map((t, i) => {
              const at = within(scene, "s06_l04", 0.1 + i * 0.28);
              const p = enter(frame, at, 18);
              return (
                <div
                  key={t}
                  style={{
                    alignSelf: "flex-start",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "10px 22px",
                    borderRadius: 999,
                    background: "rgba(232,212,138,0.12)",
                    border: "1px solid rgba(232,212,138,0.5)",
                    fontFamily: FONT.sans,
                    fontWeight: 600,
                    fontSize: 26,
                    color: BRAND.ink,
                    opacity: p,
                    translate: `${(1 - p) * -30}px 0px`,
                  }}
                >
                  <div style={{ width: 9, height: 9, rotate: "45deg", background: BRAND.accent }} />
                  {t}
                </div>
              );
            })}
          </div>
        </div>
        <IndonesiaMap left={800} top={300} width={1000} start={l03 - 6} lit={lit} labels />
      </AbsoluteFill>

      {/* Three products */}
      <AbsoluteFill style={{ opacity: enter(frame, l05, 16) }}>
        <Eyebrow start={l05 + 4} align="center" style={{ position: "absolute", top: 110, left: 0, right: 0 }}>
          Tiga Karya
        </Eyebrow>
        {d.products.map((prod, i) => {
          const at = within(scene, "s06_l05", PRODUCT_AT[i]);
          const flip = interpolate(frame, [at, at + 22], [-92, 0], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });
          const left = 210 + i * 520;
          return (
            <div key={prod.id} style={{ position: "absolute", left, top: 180, width: 460, height: 660, perspective: 1400 }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 24,
                  overflow: "hidden",
                  background: "linear-gradient(180deg, rgba(10,92,52,0.95), rgba(4,51,29,0.98))",
                  border: `1px solid rgba(232,212,138,0.45)`,
                  boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
                  transform: `rotateY(${flip}deg)`,
                  transformOrigin: "left center",
                  opacity: frame >= at ? 1 : 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 22px" }}>
                  <Icon name={PRODUCT_ICON[prod.id]} size={34} start={at + 10} />
                  <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 22, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.accent }}>{prod.kind}</div>
                </div>
                <div style={{ position: "relative", flex: 1, margin: "0 18px", borderRadius: 14, overflow: "hidden", background: BRAND.deep }}>
                  {prod.id === "website" ? (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
                      <div style={{ height: 40, background: "#0d1f16", display: "flex", alignItems: "center", gap: 8, padding: "0 14px" }}>
                        {["#e0655f", "#e6b450", "#5fb46a"].map((c) => (
                          <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
                        ))}
                        <div style={{ marginLeft: 10, flex: 1, height: 24, borderRadius: 12, background: "rgba(255,255,255,0.08)", fontFamily: FONT.sans, fontSize: 15, color: BRAND.ink, display: "flex", alignItems: "center", paddingLeft: 12 }}>
                          https://{prod.title}
                        </div>
                      </div>
                      <Img src={staticFile(`apmnu/assets/${prod.asset}.jpg`)} style={{ flex: 1, width: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
                    </div>
                  ) : prod.id === "jurnal" ? (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: "#F4F0E6" }}>
                      <Img src={staticFile("apmnu/assets/jurnal-cover.jpg")} style={{ height: 330, borderRadius: 6, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }} />
                      <Img src={staticFile("apmnu/assets/jurnal-logo.png")} style={{ width: 360 }} />
                    </div>
                  ) : (
                    <Img src={staticFile(`apmnu/assets/${prod.asset}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
                  )}
                </div>
                <div style={{ padding: "18px 22px 22px", fontFamily: FONT.sans, fontWeight: 800, fontSize: 28, lineHeight: 1.2, color: BRAND.ink, minHeight: 100 }}>{prod.title}</div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      <Sfx name="flip" at={within(scene, "s06_l05", PRODUCT_AT[0])} volume={0.5} />
      <Sfx name="click" at={within(scene, "s06_l05", PRODUCT_AT[1]) + 4} volume={0.45} />
      <Sfx name="flip" at={within(scene, "s06_l05", PRODUCT_AT[2])} volume={0.5} />
      {/* Sound: a riser into the city name, counter ticks, a pop per topic, a sparkle after the products */}
      <Sfx name="riser" at={0} volume={0.35} />
      <Sfx name="hit" at={l01 + 14} volume={0.45} />
      <Sfx name="count" at={l03 + 4} volume={0.3} />
      {d.topics.map((t, i) => (
        <Sfx key={t} name="pop" at={within(scene, "s06_l04", 0.1 + i * 0.28)} volume={0.3} rate={0.9 + i * 0.1} />
      ))}
      <Sfx name="shimmer" at={within(scene, "s06_l05", 0.82) + 14} volume={0.25} />
      <SceneVoice scene={scene} />
    </AbsoluteFill>
  );
};
