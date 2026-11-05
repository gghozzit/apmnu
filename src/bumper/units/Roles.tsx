import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../../theme";
import type { ProfileItem } from "../../elegant/units/ProfileUnits";

type Props = {
  readonly items: readonly ProfileItem[];
  readonly left: number;
  readonly top: number;
  readonly textWidth: number;
  readonly fontSize: number;
  readonly gap: number;
  /** Frames between rows appearing. */
  readonly stagger: number;
  readonly columns: number;
  readonly columnGap: number;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
const backOut = Easing.bezier(0.34, 1.5, 0.64, 1);

const numberField = (description: string, def: number) =>
  ({
    type: "number",
    default: def,
    step: 1,
    description,
    keyframable: false,
    hiddenFromList: false,
  }) as const;

const RolesInner: React.FC<Props> = ({
  items,
  left,
  top,
  textWidth,
  fontSize,
  gap,
  stagger,
  columns,
  columnGap,
}) => {
  const frame = useCurrentFrame();
  const badge = Math.round(fontSize * 1.45);
  const perColumn = Math.ceil(items.length / columns);
  // Each column stacks independently, so a long row never pushes rows in the other column.
  const stacks = Array.from({ length: columns }, (_, c) =>
    items
      .slice(c * perColumn, (c + 1) * perColumn)
      .map((item, k) => ({ item, i: c * perColumn + k })),
  );

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: textWidth,
        display: "flex",
        gap: columnGap,
      }}
    >
      {stacks.map((stack, c) => (
        <div
          key={c}
          style={{
            flex: "1 1 0",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap,
          }}
        >
          {stack.map(({ item, i }) => {
            const start = i * stagger;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: Math.round(fontSize * 0.7),
                  fontFamily: FONTS.body,
                  fontSize,
                  lineHeight: 1.38,
                  opacity: interpolate(
                    frame,
                    [start, start + 8],
                    [0, 1],
                    clamp,
                  ),
                }}
              >
                <div
                  style={{
                    flex: "0 0 auto",
                    width: badge,
                    height: badge,
                    marginTop: (fontSize * 1.38 - badge) / 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    scale: interpolate(frame, [start, start + 10], [0.3, 1], {
                      ...clamp,
                      easing: backOut,
                    }),
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: "14%",
                      rotate: "45deg",
                      border: `1.4px solid ${COLORS.gold}`,
                      background: "rgba(3,69,47,0.6)",
                    }}
                  />
                  <span
                    style={{
                      position: "relative",
                      fontFamily: FONTS.title,
                      fontWeight: 700,
                      fontSize: Math.round(fontSize * 0.62),
                      color: COLORS.champagne,
                      lineHeight: 1,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
                <div
                  style={{
                    clipPath: `inset(-10% ${interpolate(frame, [start + 2, start + 16], [100, 0], { ...clamp, easing: easeOut })}% -10% 0)`,
                    translate: interpolate(
                      frame,
                      [start + 2, start + 16],
                      ["12px 0px", "0px 0px"],
                      { ...clamp, easing: easeOut },
                    ),
                  }}
                >
                  <span style={{ fontWeight: 600, color: COLORS.ivory }}>
                    {item.role}
                  </span>
                  {item.detail ? (
                    <>
                      <span style={{ color: COLORS.champagne }}>
                        {item.separator ?? " — "}
                      </span>
                      <span
                        style={{
                          color: COLORS.champagne,
                          whiteSpace:
                            item.detail.length <= 24 ? "nowrap" : "normal",
                        }}
                      >
                        {item.detail}
                      </span>
                    </>
                  ) : null}
                  {item.emphasis ? (
                    <span style={{ fontWeight: 700, color: COLORS.champagne }}>
                      {" "}
                      {item.emphasis}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Numbered roles that wipe in one after another; fills column by column. */
export const Roles = Interactive.create({
  Component: RolesInner,
  layout: "absolute-fill",
  componentName: "BumperRoles",
  schema: {
    left: numberField("Left", 860),
    top: numberField("Top", 370),
    textWidth: numberField("Width", 860),
    fontSize: numberField("Font size", 22),
    gap: numberField("Row gap", 10),
    stagger: numberField("Frames between rows", 7),
    columns: numberField("Columns", 1),
    columnGap: numberField("Column gap", 40),
  },
});
