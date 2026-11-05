import { loadFont as loadAmiri } from "@remotion/google-fonts/Amiri";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";

/** Sampled from logo-apmnu.jpeg: deep NU green field and cream-gold lettering. */
export const BRAND = {
  primary: "#0A5C34",
  primaryDark: "#04331D",
  deep: "#021C10",
  accent: "#E8D48A",
  gold: "#C9A227",
  ink: "#F5F1E6",
  muted: "rgba(4,16,10,0.66)",
};

export const GOLD_TEXT = "linear-gradient(180deg, #FFF3C8 0%, #E8D48A 55%, #C9A227 100%)";

const jakarta = loadJakarta("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
// True italic for the English caption line.
loadJakarta("italic", { weights: ["500"], subsets: ["latin"] });
loadAmiri("italic", { weights: ["400"], subsets: ["latin"] });
const amiri = loadAmiri("normal", { weights: ["400", "700"], subsets: ["latin"] });

export const FONT = {
  sans: jakarta.fontFamily,
  serif: amiri.fontFamily,
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
