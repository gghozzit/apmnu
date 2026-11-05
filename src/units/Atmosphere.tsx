import { Interactive } from "remotion";
import { Background } from "../Background";

export const Atmosphere = Interactive.create({
  Component: Background,
  layout: "absolute-fill",
  componentName: "Atmosphere",
});
