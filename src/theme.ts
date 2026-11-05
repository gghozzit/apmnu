import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

export const COLORS = {
  emerald: "#087A4B",
  forest: "#075B3C",
  deep: "#03452F",
  gold: "#D8AD36",
  champagne: "#F2D77A",
  ivory: "#FFF6E3",
  warmWhite: "#F8F5EC",
};

export const GOLD_GRADIENT =
  "linear-gradient(180deg, #F8E7A8 0%, #F2D77A 40%, #D8AD36 100%)";

export const FONTS = {
  title: loadCinzel("normal", { weights: ["500", "700"], subsets: ["latin"] })
    .fontFamily,
  name: loadPlayfair("normal", { weights: ["700"], subsets: ["latin"] })
    .fontFamily,
  body: loadMontserrat("normal", {
    weights: ["400", "500", "600", "700"],
    subsets: ["latin"],
  }).fontFamily,
};
