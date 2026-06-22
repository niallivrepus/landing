import { type CSSProperties, type ReactNode } from "react";

type AvatarDecorSceneVariant =
  | "owl-moon"
  | "penguin-snow"
  | "fox-tree"
  | "hamster-wheel"
  | "turtle-lotus"
  | "frog-pond";

type PixelBlock = {
  x: number;
  y: number;
  fill: string;
  w?: number;
  h?: number;
  opacity?: number;
};

interface AvatarDecorSceneProps {
  variant: AvatarDecorSceneVariant;
  layer: "back" | "front";
  className?: string;
}

type SceneFrame = {
  back: ReactNode;
  front: ReactNode;
};

const FRAME_STYLE = `
@keyframes avatarDecorFrameA {
  0%, 33.333% { opacity: 1; }
  33.334%, 100% { opacity: 0; }
}

@keyframes avatarDecorFrameB {
  0%, 33.333% { opacity: 0; }
  33.334%, 66.666% { opacity: 1; }
  66.667%, 100% { opacity: 0; }
}

@keyframes avatarDecorFrameC {
  0%, 66.666% { opacity: 0; }
  66.667%, 100% { opacity: 1; }
}
`;

function paint(blocks: PixelBlock[], prefix: string) {
  return blocks.map((block, index) => (
    <rect
      key={`${prefix}-${index}`}
      x={block.x * 2}
      y={block.y * 2}
      width={(block.w ?? 1) * 2}
      height={(block.h ?? 1) * 2}
      fill={block.fill}
      fillOpacity={block.opacity}
    />
  ));
}

function anim(name: string, duration: number, delay = 0): CSSProperties {
  return {
    opacity: 0,
    animationName: name,
    animationDuration: `${duration}ms`,
    animationTimingFunction: "step-end",
    animationIterationCount: "infinite",
    animationDelay: `${delay}ms`,
  };
}

function moonSceneFrame(frame: 0 | 1 | 2) {
  const moon = [
    { x: 22, y: 7, w: 7, h: 1, fill: "#FFF3B0" },
    { x: 20, y: 8, w: 10, h: 1, fill: "#FFE16A" },
    { x: 19, y: 9, w: 11, h: 1, fill: "#FFF7CC" },
    { x: 18, y: 10, w: 11, h: 1, fill: "#FFF7CC" },
    { x: 18, y: 11, w: 10, h: 1, fill: "#E5D0FF" },
    { x: 19, y: 12, w: 8, h: 1, fill: "#FFEFA6" },
    { x: 20, y: 13, w: 6, h: 1, fill: "#FFE16A" },
    { x: 27, y: 9, w: 3, h: 1, fill: "#0A0A0A" },
    { x: 26, y: 10, w: 4, h: 1, fill: "#0A0A0A" },
    { x: 25, y: 11, w: 4, h: 1, fill: "#0A0A0A" },
    { x: 24, y: 12, w: 4, h: 1, fill: "#0A0A0A" },
    { x: 24, y: 13, w: 3, h: 1, fill: "#0A0A0A" },
  ];

  const stars =
    frame === 0
      ? [
          { x: 27, y: 8, fill: "#7BE0FF" },
          { x: 39, y: 7, fill: "#FF7CF2" },
          { x: 41, y: 12, fill: "#8BC8FF" },
        ]
      : frame === 1
        ? [
            { x: 28, y: 7, fill: "#B7E2FF" },
            { x: 39, y: 6, fill: "#FFC9F9" },
            { x: 40, y: 11, fill: "#7BE0FF" },
          ]
        : [
            { x: 26, y: 9, fill: "#8BC8FF" },
            { x: 38, y: 8, fill: "#FFC9F9" },
            { x: 42, y: 10, fill: "#7BE0FF" },
          ];

  const branch = [
    { x: 9, y: 34, w: 13, h: 1, fill: "#6A3E1F" },
    { x: 13, y: 33, w: 5, h: 1, fill: "#4A2514" },
    { x: 18, y: 32, w: 2, h: 1, fill: "#6A3E1F" },
    { x: 19, y: 31, w: 1, h: 1, fill: "#6A3E1F" },
    { x: 12, y: 35, w: 4, h: 1, fill: "#4A2514" },
  ];

  const owlBody =
    frame === 0
      ? [
          { x: 12, y: 25, w: 2, h: 1, fill: "#7C3AED" },
          { x: 17, y: 25, w: 2, h: 1, fill: "#7C3AED" },
          { x: 13, y: 26, w: 5, h: 1, fill: "#5B3A29" },
          { x: 12, y: 27, w: 7, h: 1, fill: "#8A5B3D" },
          { x: 11, y: 28, w: 9, h: 1, fill: "#A56A43" },
          { x: 11, y: 29, w: 3, h: 1, fill: "#5B3A29" },
          { x: 14, y: 29, w: 3, h: 1, fill: "#FFD166" },
          { x: 17, y: 29, w: 3, h: 1, fill: "#5B3A29" },
          { x: 12, y: 30, w: 2, h: 1, fill: "#5B3A29" },
          { x: 14, y: 30, w: 3, h: 1, fill: "#FFD166" },
          { x: 17, y: 30, w: 2, h: 1, fill: "#5B3A29" },
          { x: 13, y: 31, w: 5, h: 1, fill: "#5B3A29" },
          { x: 14, y: 32, w: 3, h: 1, fill: "#5B3A29" },
          { x: 14, y: 27, fill: "#00E5FF" },
          { x: 17, y: 27, fill: "#00E5FF" },
          { x: 15, y: 28, fill: "#FF9E44" },
        ]
      : frame === 1
        ? [
          { x: 12, y: 25, w: 2, h: 1, fill: "#7C3AED" },
          { x: 17, y: 25, w: 2, h: 1, fill: "#7C3AED" },
          { x: 13, y: 26, w: 5, h: 1, fill: "#5B3A29" },
          { x: 12, y: 27, w: 7, h: 1, fill: "#8A5B3D" },
          { x: 11, y: 28, w: 9, h: 1, fill: "#A56A43" },
          { x: 11, y: 29, w: 3, h: 1, fill: "#5B3A29" },
          { x: 14, y: 29, w: 3, h: 1, fill: "#FFD166" },
          { x: 17, y: 29, w: 3, h: 1, fill: "#5B3A29" },
          { x: 12, y: 30, w: 2, h: 1, fill: "#5B3A29" },
          { x: 14, y: 30, w: 3, h: 1, fill: "#FFD166" },
          { x: 17, y: 30, w: 2, h: 1, fill: "#5B3A29" },
          { x: 13, y: 31, w: 5, h: 1, fill: "#5B3A29" },
          { x: 14, y: 32, w: 3, h: 1, fill: "#5B3A29" },
          { x: 14, y: 27, fill: "#2A2118" },
          { x: 17, y: 27, fill: "#2A2118" },
          { x: 15, y: 28, fill: "#FF9E44" },
          ]
        : [
            { x: 12, y: 24, w: 2, h: 1, fill: "#7C3AED" },
            { x: 17, y: 24, w: 2, h: 1, fill: "#7C3AED" },
            { x: 13, y: 25, w: 5, h: 1, fill: "#5B3A29" },
            { x: 12, y: 26, w: 7, h: 1, fill: "#8A5B3D" },
            { x: 11, y: 27, w: 9, h: 1, fill: "#A56A43" },
            { x: 10, y: 28, w: 3, h: 1, fill: "#5B3A29" },
            { x: 13, y: 28, w: 4, h: 1, fill: "#FFD166" },
            { x: 17, y: 28, w: 3, h: 1, fill: "#5B3A29" },
            { x: 11, y: 29, w: 2, h: 1, fill: "#5B3A29" },
            { x: 13, y: 29, w: 4, h: 1, fill: "#FFD166" },
            { x: 17, y: 29, w: 2, h: 1, fill: "#5B3A29" },
            { x: 12, y: 30, w: 6, h: 1, fill: "#5B3A29" },
            { x: 13, y: 31, w: 4, h: 1, fill: "#5B3A29" },
            { x: 14, y: 26, fill: "#00E5FF" },
            { x: 17, y: 26, fill: "#00E5FF" },
            { x: 15, y: 27, fill: "#FF9E44" },
          ];

  return {
    back: <>{paint(moon, "owl-moon")}</>,
    front: (
      <>
        {paint(stars, `owl-stars-${frame}`)}
        {paint(branch, "owl-branch")}
        {paint(owlBody, `owl-body-${frame}`)}
      </>
    ),
  };
}

function snowSceneFrame(frame: 0 | 1 | 2) {
  const topSnow = [
    { x: 4, y: 4, fill: "#EEF6FF" },
    { x: 9, y: 6, fill: "#C8D8E8" },
    { x: 14, y: 4, fill: "#EEF6FF" },
    { x: 18, y: 7, fill: "#C8D8E8" },
    { x: 39, y: 4, fill: "#EEF6FF" },
    { x: 43, y: 7, fill: "#C8D8E8" },
  ];
  const drift =
    frame === 0
      ? [
          { x: 3, y: 11, w: 3, h: 1, fill: "#9BB0C8" },
          { x: 40, y: 13, w: 2, h: 1, fill: "#C8D8E8" },
          { x: 6, y: 17, fill: "#EEF6FF" },
        ]
      : frame === 1
        ? [
            { x: 4, y: 10, w: 3, h: 1, fill: "#C8D8E8" },
            { x: 41, y: 12, w: 2, h: 1, fill: "#EEF6FF" },
            { x: 8, y: 18, fill: "#EEF6FF" },
          ]
        : [
            { x: 2, y: 12, w: 3, h: 1, fill: "#9BB0C8" },
            { x: 39, y: 14, w: 2, h: 1, fill: "#C8D8E8" },
            { x: 7, y: 16, fill: "#EEF6FF" },
          ];

  const ground = [
    { x: 28, y: 36, w: 7, h: 1, fill: "#EEF6FF" },
    { x: 27, y: 37, w: 10, h: 1, fill: "#C8D8E8" },
    { x: 28, y: 38, w: 7, h: 1, fill: "#9BB0C8" },
    { x: 36, y: 34, w: 5, h: 1, fill: "#EEF6FF" },
    { x: 35, y: 35, w: 7, h: 1, fill: "#C8D8E8" },
    { x: 34, y: 39, w: 3, h: 1, fill: "#7BE0FF" },
    { x: 42, y: 38, w: 2, h: 1, fill: "#D7C1FF" },
  ];

  const penguin =
    frame === 0
      ? [
          { x: 31, y: 26, w: 2, h: 1, fill: "#2E245E" },
          { x: 34, y: 26, w: 2, h: 1, fill: "#2E245E" },
          { x: 30, y: 27, w: 7, h: 1, fill: "#1A1E24" },
          { x: 30, y: 28, w: 2, h: 1, fill: "#1A1E24" },
          { x: 32, y: 28, w: 3, h: 1, fill: "#F4F7FA" },
          { x: 35, y: 28, w: 2, h: 1, fill: "#1A1E24" },
          { x: 29, y: 29, w: 2, h: 1, fill: "#1A1E24" },
          { x: 31, y: 29, w: 5, h: 1, fill: "#F4F7FA" },
          { x: 36, y: 29, w: 2, h: 1, fill: "#1A1E24" },
          { x: 30, y: 30, w: 7, h: 1, fill: "#1A1E24" },
          { x: 31, y: 31, w: 5, h: 1, fill: "#1A1E24" },
          { x: 32, y: 32, w: 1, h: 2, fill: "#FF7B29" },
          { x: 35, y: 32, w: 1, h: 2, fill: "#FF7B29" },
          { x: 32, y: 27, fill: "#7BE0FF" },
          { x: 34, y: 27, fill: "#7BE0FF" },
          { x: 33, y: 28, fill: "#FF7B29" },
        ]
      : frame === 1
        ? [
            { x: 31, y: 26, w: 2, h: 1, fill: "#2E245E" },
            { x: 34, y: 26, w: 2, h: 1, fill: "#2E245E" },
            { x: 30, y: 27, w: 7, h: 1, fill: "#1A1E24" },
            { x: 30, y: 28, w: 2, h: 1, fill: "#1A1E24" },
            { x: 32, y: 28, w: 3, h: 1, fill: "#F4F7FA" },
            { x: 35, y: 28, w: 2, h: 1, fill: "#1A1E24" },
            { x: 29, y: 29, w: 2, h: 1, fill: "#1A1E24" },
            { x: 31, y: 29, w: 5, h: 1, fill: "#F4F7FA" },
            { x: 36, y: 29, w: 2, h: 1, fill: "#1A1E24" },
            { x: 30, y: 30, w: 7, h: 1, fill: "#1A1E24" },
            { x: 31, y: 31, w: 5, h: 1, fill: "#1A1E24" },
            { x: 33, y: 32, w: 1, h: 2, fill: "#FF7B29" },
            { x: 36, y: 32, w: 1, h: 2, fill: "#FF7B29" },
            { x: 32, y: 27, fill: "#1A1E24" },
            { x: 34, y: 27, fill: "#1A1E24" },
            { x: 33, y: 28, fill: "#C25520" },
          ]
        : [
            { x: 32, y: 25, w: 2, h: 1, fill: "#2E245E" },
            { x: 35, y: 25, w: 2, h: 1, fill: "#2E245E" },
            { x: 31, y: 26, w: 7, h: 1, fill: "#1A1E24" },
            { x: 31, y: 27, w: 2, h: 1, fill: "#1A1E24" },
            { x: 33, y: 27, w: 3, h: 1, fill: "#F4F7FA" },
            { x: 36, y: 27, w: 2, h: 1, fill: "#1A1E24" },
            { x: 30, y: 28, w: 2, h: 1, fill: "#1A1E24" },
            { x: 32, y: 28, w: 5, h: 1, fill: "#F4F7FA" },
            { x: 37, y: 28, w: 2, h: 1, fill: "#1A1E24" },
            { x: 31, y: 29, w: 7, h: 1, fill: "#1A1E24" },
            { x: 32, y: 30, w: 5, h: 1, fill: "#1A1E24" },
            { x: 33, y: 31, w: 1, h: 2, fill: "#FF7B29" },
            { x: 36, y: 31, w: 1, h: 2, fill: "#FF7B29" },
            { x: 33, y: 26, fill: "#7BE0FF" },
            { x: 35, y: 26, fill: "#7BE0FF" },
            { x: 34, y: 27, fill: "#FF7B29" },
          ];

  const trickle =
    frame === 0
      ? [
          { x: 18, y: 8, fill: "#F7FBFF" },
          { x: 19, y: 12, fill: "#DDF1FF" },
          { x: 20, y: 16, fill: "#BFE6FF" },
        ]
      : frame === 1
        ? [
            { x: 19, y: 15, fill: "#F7FBFF" },
            { x: 20, y: 20, fill: "#DDF1FF" },
            { x: 21, y: 24, fill: "#BFE6FF" },
          ]
        : [{ x: 21, y: 28, fill: "#DDF1FF", opacity: 0.55 }];

  return {
    back: (
      <>
        {paint(topSnow, "snow-top")}
        {paint(drift, `snow-drift-${frame}`)}
        {paint(trickle, `snow-trickle-${frame}`)}
      </>
    ),
    front: (
      <>
        {paint(ground, "snow-ground")}
        {paint(penguin, `penguin-${frame}`)}
      </>
    ),
  };
}

function foxSceneFrame(frame: 0 | 1 | 2) {
  const tree = [
    { x: 28, y: 8, w: 6, h: 1, fill: "#314F2F" },
    { x: 26, y: 9, w: 10, h: 1, fill: "#486C40" },
    { x: 25, y: 10, w: 12, h: 1, fill: "#5C844D" },
    { x: 24, y: 11, w: 13, h: 1, fill: "#486C40" },
    { x: 25, y: 12, w: 12, h: 1, fill: "#314F2F" },
    { x: 28, y: 13, w: 3, h: 9, fill: "#6A4726" },
    { x: 29, y: 22, w: 2, h: 5, fill: "#5B391D" },
    { x: 27, y: 18, w: 1, h: 3, fill: "#6A4726" },
    { x: 31, y: 17, w: 1, h: 4, fill: "#6A4726" },
    { x: 27, y: 27, w: 2, h: 1, fill: "#5B391D" },
    { x: 31, y: 27, w: 2, h: 1, fill: "#5B391D" },
    { x: 26, y: 28, w: 2, h: 1, fill: "#5B391D" },
    { x: 32, y: 28, w: 2, h: 1, fill: "#5B391D" },
  ];
  const leaves = [
    { x: 27, y: 10, fill: "#8CFF71" },
    { x: 34, y: 11, fill: "#63D857" },
    { x: 30, y: 9, fill: "#A3F07C" },
  ];

  const fox =
    frame === 0
      ? [
          { x: 25, y: 30, w: 2, h: 1, fill: "#FF5A1F" },
          { x: 31, y: 30, w: 2, h: 1, fill: "#FF5A1F" },
          { x: 24, y: 31, w: 10, h: 1, fill: "#FF9F1C" },
          { x: 23, y: 32, w: 11, h: 1, fill: "#FF6B00" },
          { x: 23, y: 33, w: 3, h: 1, fill: "#FF6B00" },
          { x: 26, y: 33, w: 4, h: 1, fill: "#FFE0B5" },
          { x: 30, y: 33, w: 4, h: 1, fill: "#FF6B00" },
          { x: 24, y: 34, w: 8, h: 1, fill: "#FF9F1C" },
          { x: 32, y: 34, w: 3, h: 1, fill: "#FF6B00" },
          { x: 25, y: 35, w: 6, h: 1, fill: "#FF6B00" },
          { x: 31, y: 35, w: 5, h: 1, fill: "#6B2A14" },
          { x: 36, y: 36, w: 3, h: 1, fill: "#FF6B00" },
          { x: 37, y: 37, w: 2, h: 1, fill: "#FF9F1C" },
          { x: 27, y: 32, fill: "#2A1810" },
          { x: 30, y: 32, fill: "#2A1810" },
          { x: 33, y: 32, fill: "#FFE0B5" },
        ]
      : frame === 1
        ? [
            { x: 25, y: 30, w: 2, h: 1, fill: "#FF5A1F" },
            { x: 31, y: 30, w: 2, h: 1, fill: "#FF5A1F" },
            { x: 24, y: 31, w: 10, h: 1, fill: "#FF9F1C" },
            { x: 23, y: 32, w: 11, h: 1, fill: "#FF6B00" },
            { x: 23, y: 33, w: 3, h: 1, fill: "#FF6B00" },
            { x: 26, y: 33, w: 4, h: 1, fill: "#FFE0B5" },
            { x: 30, y: 33, w: 4, h: 1, fill: "#FF6B00" },
            { x: 24, y: 34, w: 8, h: 1, fill: "#FF9F1C" },
            { x: 32, y: 34, w: 3, h: 1, fill: "#FF6B00" },
            { x: 25, y: 35, w: 6, h: 1, fill: "#FF6B00" },
            { x: 30, y: 35, w: 6, h: 1, fill: "#6B2A14" },
            { x: 35, y: 36, w: 3, h: 1, fill: "#FF6B00" },
            { x: 36, y: 37, w: 2, h: 1, fill: "#FF9F1C" },
            { x: 27, y: 32, fill: "#2A1810" },
            { x: 30, y: 32, fill: "#FF6B00" },
            { x: 33, y: 32, fill: "#FFE0B5" },
          ]
        : [
            { x: 25, y: 29, w: 2, h: 1, fill: "#FF5A1F" },
            { x: 31, y: 29, w: 2, h: 1, fill: "#FF5A1F" },
            { x: 24, y: 31, w: 10, h: 1, fill: "#FF9F1C" },
            { x: 23, y: 32, w: 11, h: 1, fill: "#FF6B00" },
            { x: 23, y: 33, w: 3, h: 1, fill: "#FF6B00" },
            { x: 26, y: 33, w: 4, h: 1, fill: "#FFE0B5" },
            { x: 30, y: 33, w: 4, h: 1, fill: "#FF6B00" },
            { x: 24, y: 34, w: 8, h: 1, fill: "#FF9F1C" },
            { x: 32, y: 34, w: 4, h: 1, fill: "#FF6B00" },
            { x: 25, y: 35, w: 6, h: 1, fill: "#FF6B00" },
            { x: 31, y: 35, w: 4, h: 1, fill: "#6B2A14" },
            { x: 35, y: 36, w: 2, h: 1, fill: "#FF6B00" },
            { x: 36, y: 37, w: 3, h: 1, fill: "#FF9F1C" },
            { x: 27, y: 32, fill: "#2A1810" },
            { x: 30, y: 32, fill: "#2A1810" },
            { x: 33, y: 32, fill: "#FFE0B5" },
          ];

  return {
    back: (
      <>
        {paint(tree, "fox-tree")}
        {paint(leaves, "fox-leaves")}
      </>
    ),
    front: <>{paint(fox, `fox-${frame}`)}</>,
  };
}

function hamsterSceneFrame(frame: 0 | 1 | 2) {
  const wheel = [
    { x: 16, y: 10, w: 16, h: 1, fill: "#FF8AFA" },
    { x: 13, y: 13, w: 2, h: 2, fill: "#70E8FF" },
    { x: 33, y: 13, w: 2, h: 2, fill: "#70E8FF" },
    { x: 11, y: 17, w: 1, h: 16, fill: "#70E8FF" },
    { x: 36, y: 17, w: 1, h: 16, fill: "#70E8FF" },
    { x: 13, y: 34, w: 2, h: 2, fill: "#FF8AFA" },
    { x: 33, y: 34, w: 2, h: 2, fill: "#FF8AFA" },
    { x: 16, y: 37, w: 16, h: 1, fill: "#FFD166" },
    { x: 23, y: 14, w: 1, h: 20, fill: "#6D7580" },
    { x: 17, y: 20, w: 14, h: 1, fill: "#6D7580" },
    { x: 18, y: 16, w: 1, h: 1, fill: "#FF8AFA" },
    { x: 29, y: 16, w: 1, h: 1, fill: "#70E8FF" },
    { x: 18, y: 31, w: 1, h: 1, fill: "#FFD166" },
    { x: 29, y: 31, w: 1, h: 1, fill: "#FF8AFA" },
    { x: 20, y: 38, w: 8, h: 1, fill: "#7E4B2A" },
    { x: 23, y: 39, w: 2, h: 4, fill: "#7E4B2A" },
    { x: 18, y: 43, w: 12, h: 1, fill: "#7E4B2A" },
  ];

  const hamster =
    frame === 0
      ? [
          { x: 21, y: 30, w: 2, h: 1, fill: "#8B6F52" },
          { x: 26, y: 30, w: 2, h: 1, fill: "#8B6F52" },
          { x: 20, y: 31, w: 9, h: 1, fill: "#C9A882" },
          { x: 19, y: 32, w: 11, h: 1, fill: "#8B6F52" },
          { x: 19, y: 33, w: 3, h: 1, fill: "#8B6F52" },
          { x: 22, y: 33, w: 5, h: 1, fill: "#C9A882" },
          { x: 27, y: 33, w: 3, h: 1, fill: "#8B6F52" },
          { x: 20, y: 34, w: 9, h: 1, fill: "#8B6F52" },
          { x: 21, y: 35, w: 7, h: 1, fill: "#8B6F52" },
          { x: 22, y: 36, w: 1, h: 1, fill: "#E8B4B4" },
          { x: 27, y: 36, w: 1, h: 1, fill: "#E8B4B4" },
          { x: 22, y: 31, fill: "#1A1512" },
          { x: 26, y: 31, fill: "#1A1512" },
          { x: 24, y: 32, fill: "#E8B4B4" },
        ]
      : frame === 1
        ? [
            { x: 20, y: 29, w: 2, h: 1, fill: "#8B6F52" },
            { x: 27, y: 29, w: 2, h: 1, fill: "#8B6F52" },
            { x: 20, y: 30, w: 9, h: 1, fill: "#C9A882" },
            { x: 19, y: 31, w: 11, h: 1, fill: "#8B6F52" },
            { x: 19, y: 32, w: 3, h: 1, fill: "#8B6F52" },
            { x: 22, y: 32, w: 5, h: 1, fill: "#C9A882" },
            { x: 27, y: 32, w: 3, h: 1, fill: "#8B6F52" },
            { x: 20, y: 33, w: 9, h: 1, fill: "#8B6F52" },
            { x: 21, y: 34, w: 7, h: 1, fill: "#8B6F52" },
            { x: 21, y: 35, w: 1, h: 1, fill: "#E8B4B4" },
            { x: 28, y: 35, w: 1, h: 1, fill: "#E8B4B4" },
            { x: 22, y: 30, fill: "#1A1512" },
            { x: 26, y: 30, fill: "#1A1512" },
            { x: 24, y: 31, fill: "#F6F6F6" },
          ]
        : [
            { x: 21, y: 30, w: 2, h: 1, fill: "#8B6F52" },
            { x: 26, y: 30, w: 2, h: 1, fill: "#8B6F52" },
            { x: 20, y: 31, w: 9, h: 1, fill: "#C9A882" },
            { x: 19, y: 32, w: 11, h: 1, fill: "#8B6F52" },
            { x: 19, y: 33, w: 3, h: 1, fill: "#8B6F52" },
            { x: 22, y: 33, w: 5, h: 1, fill: "#C9A882" },
            { x: 27, y: 33, w: 3, h: 1, fill: "#8B6F52" },
            { x: 20, y: 34, w: 9, h: 1, fill: "#8B6F52" },
            { x: 21, y: 35, w: 7, h: 1, fill: "#8B6F52" },
            { x: 22, y: 36, w: 1, h: 1, fill: "#E8B4B4" },
            { x: 27, y: 36, w: 1, h: 1, fill: "#E8B4B4" },
            { x: 22, y: 31, fill: "#1A1512" },
            { x: 26, y: 31, fill: "#1A1512" },
            { x: 24, y: 32, fill: "#1A1512" },
          ];

  return {
    back: <>{paint(wheel, "hamster-wheel")}</>,
    front: <>{paint(hamster, `hamster-${frame}`)}</>,
  };
}

function turtleSceneFrame(frame: 0 | 1 | 2) {
  const water =
    frame === 0
      ? [
          { x: 5, y: 29, w: 22, h: 1, fill: "#7CF8FF" },
          { x: 3, y: 30, w: 27, h: 1, fill: "#66DFFF" },
          { x: 2, y: 31, w: 30, h: 1, fill: "#3FAEFF" },
          { x: 1, y: 32, w: 31, h: 1, fill: "#277FE2" },
          { x: 1, y: 33, w: 31, h: 1, fill: "#1E63C4" },
          { x: 2, y: 34, w: 29, h: 1, fill: "#174C9A" },
          { x: 4, y: 35, w: 26, h: 1, fill: "#103B74" },
          { x: 7, y: 36, w: 21, h: 1, fill: "#0B2950" },
          { x: 11, y: 37, w: 13, h: 1, fill: "#8AFCFF" },
          { x: 10, y: 31, w: 9, h: 1, fill: "#C4FFFF", opacity: 0.75 },
          { x: 21, y: 33, w: 6, h: 1, fill: "#6FF2FF", opacity: 0.8 },
        ]
      : frame === 1
        ? [
            { x: 6, y: 28, w: 22, h: 1, fill: "#7CF8FF" },
            { x: 4, y: 29, w: 27, h: 1, fill: "#66DFFF" },
            { x: 3, y: 30, w: 30, h: 1, fill: "#3FAEFF" },
            { x: 2, y: 31, w: 31, h: 1, fill: "#277FE2" },
            { x: 2, y: 32, w: 31, h: 1, fill: "#1E63C4" },
            { x: 3, y: 33, w: 29, h: 1, fill: "#174C9A" },
            { x: 5, y: 34, w: 26, h: 1, fill: "#103B74" },
            { x: 8, y: 35, w: 21, h: 1, fill: "#0B2950" },
            { x: 12, y: 36, w: 13, h: 1, fill: "#8AFCFF" },
            { x: 11, y: 30, w: 9, h: 1, fill: "#C4FFFF", opacity: 0.75 },
            { x: 22, y: 32, w: 6, h: 1, fill: "#6FF2FF", opacity: 0.8 },
          ]
        : [
            { x: 5, y: 30, w: 22, h: 1, fill: "#7CF8FF" },
            { x: 3, y: 31, w: 27, h: 1, fill: "#66DFFF" },
            { x: 2, y: 32, w: 30, h: 1, fill: "#3FAEFF" },
            { x: 1, y: 33, w: 31, h: 1, fill: "#277FE2" },
            { x: 1, y: 34, w: 31, h: 1, fill: "#1E63C4" },
            { x: 2, y: 35, w: 29, h: 1, fill: "#174C9A" },
            { x: 4, y: 36, w: 26, h: 1, fill: "#103B74" },
            { x: 7, y: 37, w: 21, h: 1, fill: "#0B2950" },
            { x: 11, y: 38, w: 13, h: 1, fill: "#8AFCFF" },
            { x: 12, y: 32, w: 9, h: 1, fill: "#C4FFFF", opacity: 0.75 },
            { x: 20, y: 34, w: 6, h: 1, fill: "#6FF2FF", opacity: 0.8 },
          ];

  const island = [
    { x: 24, y: 27, w: 12, h: 1, fill: "#F4D38A" },
    { x: 22, y: 28, w: 15, h: 1, fill: "#E8C06A" },
    { x: 21, y: 29, w: 16, h: 1, fill: "#D6AA55" },
    { x: 21, y: 30, w: 15, h: 1, fill: "#C99643" },
    { x: 22, y: 31, w: 13, h: 1, fill: "#B88136" },
    { x: 24, y: 32, w: 9, h: 1, fill: "#A96E2B" },
  ];

  const pad = [
    { x: 8, y: 27, w: 9, h: 1, fill: "#6FFF8A" },
    { x: 7, y: 28, w: 11, h: 1, fill: "#48D86E" },
    { x: 7, y: 29, w: 10, h: 1, fill: "#35B96A" },
    { x: 8, y: 30, w: 7, h: 1, fill: "#2D5238" },
  ];

  const lotus =
    frame === 0
      ? [
          { x: 29, y: 20, w: 1, h: 9, fill: "#2F6B4A" },
          { x: 28, y: 19, w: 3, h: 1, fill: "#FFB3DE" },
          { x: 29, y: 18, w: 1, h: 1, fill: "#FF6EC7" },
        ]
      : frame === 1
        ? [
            { x: 29, y: 20, w: 1, h: 9, fill: "#2F6B4A" },
            { x: 28, y: 18, w: 3, h: 1, fill: "#FFB3DE" },
            { x: 29, y: 17, w: 1, h: 1, fill: "#FF6EC7" },
          ]
        : [
            { x: 29, y: 20, w: 1, h: 9, fill: "#2F6B4A" },
            { x: 28, y: 19, w: 3, h: 1, fill: "#FFB3DE" },
            { x: 28, y: 18, fill: "#FFD4EE" },
            { x: 30, y: 18, fill: "#FFD4EE" },
            { x: 29, y: 17, fill: "#FF6EC7" },
          ];

  const turtle =
    frame === 0
      ? [
          { x: 11, y: 24, w: 4, h: 1, fill: "#5A7A3C" },
          { x: 10, y: 25, w: 6, h: 1, fill: "#8BC34A" },
          { x: 9, y: 26, w: 7, h: 1, fill: "#5A7A3C" },
          { x: 10, y: 27, w: 5, h: 1, fill: "#8BC34A" },
          { x: 8, y: 26, fill: "#8BC34A" },
          { x: 7, y: 26, fill: "#8BC34A" },
          { x: 7, y: 25, fill: "#3E5C2E" },
          { x: 12, y: 25, fill: "#FFD166" },
          { x: 14, y: 25, fill: "#FFD166" },
        ]
      : frame === 1
        ? [
            { x: 11, y: 24, w: 4, h: 1, fill: "#5A7A3C" },
            { x: 10, y: 25, w: 6, h: 1, fill: "#8BC34A" },
            { x: 9, y: 26, w: 7, h: 1, fill: "#5A7A3C" },
            { x: 10, y: 27, w: 5, h: 1, fill: "#8BC34A" },
            { x: 8, y: 26, fill: "#8BC34A" },
            { x: 7, y: 26, fill: "#8BC34A" },
            { x: 7, y: 25, fill: "#8BC34A" },
            { x: 12, y: 25, fill: "#FFD166" },
            { x: 14, y: 25, fill: "#FFD166" },
          ]
        : [
            { x: 11, y: 24, w: 4, h: 1, fill: "#5A7A3C" },
            { x: 10, y: 25, w: 6, h: 1, fill: "#8BC34A" },
            { x: 9, y: 26, w: 7, h: 1, fill: "#5A7A3C" },
            { x: 10, y: 27, w: 5, h: 1, fill: "#8BC34A" },
            { x: 8, y: 26, fill: "#8BC34A" },
            { x: 7, y: 26, fill: "#8BC34A" },
            { x: 8, y: 25, fill: "#3E5C2E" },
            { x: 12, y: 25, fill: "#FFD166" },
            { x: 14, y: 25, fill: "#FFD166" },
          ];

  return {
    back: <>{paint(water, `turtle-water-${frame}`)}</>,
    front: (
      <>
        {paint(island, "turtle-island")}
        {paint(pad, "turtle-pad")}
        {paint(lotus, `turtle-lotus-${frame}`)}
        {paint(turtle, `turtle-${frame}`)}
      </>
    ),
  };
}

function frogSceneFrame(frame: 0 | 1 | 2) {
  const water =
    frame === 0
      ? [
          { x: 6, y: 30, w: 20, h: 1, fill: "#66F2FF" },
          { x: 4, y: 31, w: 25, h: 1, fill: "#39C8FF" },
          { x: 3, y: 32, w: 28, h: 1, fill: "#2D5F6F" },
          { x: 2, y: 33, w: 29, h: 1, fill: "#1A4A66" },
          { x: 2, y: 34, w: 29, h: 1, fill: "#153E52" },
          { x: 3, y: 35, w: 27, h: 1, fill: "#102E42" },
          { x: 6, y: 36, w: 22, h: 1, fill: "#0C2536" },
          { x: 10, y: 37, w: 13, h: 1, fill: "#66F2FF" },
          { x: 11, y: 32, w: 7, h: 1, fill: "#C4FFFF", opacity: 0.75 },
          { x: 22, y: 34, w: 6, h: 1, fill: "#66F2FF", opacity: 0.8 },
        ]
      : frame === 1
        ? [
            { x: 7, y: 29, w: 20, h: 1, fill: "#66F2FF" },
            { x: 5, y: 30, w: 25, h: 1, fill: "#39C8FF" },
            { x: 4, y: 31, w: 28, h: 1, fill: "#2D5F6F" },
            { x: 3, y: 32, w: 29, h: 1, fill: "#1A4A66" },
            { x: 3, y: 33, w: 29, h: 1, fill: "#153E52" },
            { x: 4, y: 34, w: 27, h: 1, fill: "#102E42" },
            { x: 7, y: 35, w: 22, h: 1, fill: "#0C2536" },
            { x: 11, y: 36, w: 13, h: 1, fill: "#66F2FF" },
            { x: 12, y: 31, w: 7, h: 1, fill: "#C4FFFF", opacity: 0.75 },
            { x: 23, y: 33, w: 6, h: 1, fill: "#66F2FF", opacity: 0.8 },
          ]
        : [
            { x: 6, y: 31, w: 20, h: 1, fill: "#66F2FF" },
            { x: 4, y: 32, w: 25, h: 1, fill: "#39C8FF" },
            { x: 3, y: 33, w: 28, h: 1, fill: "#2D5F6F" },
            { x: 2, y: 34, w: 29, h: 1, fill: "#1A4A66" },
            { x: 2, y: 35, w: 29, h: 1, fill: "#153E52" },
            { x: 3, y: 36, w: 27, h: 1, fill: "#102E42" },
            { x: 6, y: 37, w: 22, h: 1, fill: "#0C2536" },
            { x: 10, y: 38, w: 13, h: 1, fill: "#66F2FF" },
            { x: 12, y: 33, w: 7, h: 1, fill: "#C4FFFF", opacity: 0.75 },
            { x: 21, y: 35, w: 6, h: 1, fill: "#66F2FF", opacity: 0.8 },
          ];

  const pad = [
    { x: 11, y: 28, w: 9, h: 1, fill: "#7BFF6D" },
    { x: 10, y: 29, w: 11, h: 1, fill: "#3D6B3D" },
    { x: 10, y: 30, w: 10, h: 1, fill: "#2D4D2D" },
    { x: 11, y: 31, w: 8, h: 1, fill: "#35CC6B" },
  ];

  const frog =
    frame === 0
      ? [
          { x: 14, y: 24, fill: "#7BFF6D" },
          { x: 17, y: 24, fill: "#7BFF6D" },
          { x: 13, y: 25, w: 6, h: 1, fill: "#5CB85C" },
          { x: 12, y: 26, w: 8, h: 1, fill: "#35CC6B" },
          { x: 13, y: 27, w: 6, h: 1, fill: "#5CB85C" },
          { x: 14, y: 28, w: 4, h: 1, fill: "#C8E6C9" },
          { x: 14, y: 25, fill: "#1E3D1E" },
          { x: 17, y: 25, fill: "#1E3D1E" },
        ]
      : frame === 1
        ? [
            { x: 14, y: 25, fill: "#7BFF6D" },
            { x: 17, y: 25, fill: "#7BFF6D" },
            { x: 13, y: 26, w: 6, h: 1, fill: "#5CB85C" },
            { x: 12, y: 27, w: 8, h: 1, fill: "#35CC6B" },
            { x: 13, y: 28, w: 6, h: 1, fill: "#5CB85C" },
            { x: 14, y: 29, w: 4, h: 1, fill: "#C8E6C9" },
            { x: 14, y: 26, fill: "#1E3D1E" },
            { x: 17, y: 26, fill: "#1E3D1E" },
          ]
        : [
            { x: 14, y: 24, fill: "#7BFF6D" },
            { x: 17, y: 24, fill: "#7BFF6D" },
            { x: 13, y: 25, w: 6, h: 1, fill: "#5CB85C" },
            { x: 12, y: 26, w: 8, h: 1, fill: "#35CC6B" },
            { x: 13, y: 27, w: 6, h: 1, fill: "#5CB85C" },
            { x: 14, y: 28, w: 4, h: 1, fill: "#C8E6C9" },
            { x: 14, y: 25, fill: "#5CB85C" },
            { x: 17, y: 25, fill: "#5CB85C" },
          ];

  const reeds =
    frame === 0
      ? [
          { x: 30, y: 24, w: 1, h: 5, fill: "#3D6B3D" },
          { x: 32, y: 26, w: 1, h: 4, fill: "#7BFF6D" },
        ]
      : frame === 1
        ? [
            { x: 30, y: 23, w: 1, h: 5, fill: "#3D6B3D" },
            { x: 32, y: 27, w: 1, h: 4, fill: "#7BFF6D" },
          ]
        : [
            { x: 30, y: 24, w: 1, h: 5, fill: "#3D6B3D" },
            { x: 32, y: 25, w: 1, h: 4, fill: "#7BFF6D" },
          ];

  return {
    back: <>{paint(water, `frog-water-${frame}`)}</>,
    front: (
      <>
        {paint(pad, "frog-pad")}
        {paint(reeds, `frog-reeds-${frame}`)}
        {paint(frog, `frog-${frame}`)}
      </>
    ),
  };
}

function sceneFrames(variant: AvatarDecorSceneVariant): {
  duration: number;
  delay: number;
  frames: [SceneFrame, SceneFrame, SceneFrame];
} {
  switch (variant) {
    case "owl-moon":
      return {
        duration: 900,
        delay: 0,
        frames: [moonSceneFrame(0), moonSceneFrame(1), moonSceneFrame(2)],
      };
    case "penguin-snow":
      return {
        duration: 840,
        delay: 60,
        frames: [snowSceneFrame(0), snowSceneFrame(1), snowSceneFrame(2)],
      };
    case "fox-tree":
      return {
        duration: 880,
        delay: 120,
        frames: [foxSceneFrame(0), foxSceneFrame(1), foxSceneFrame(2)],
      };
    case "hamster-wheel":
      return {
        duration: 760,
        delay: 40,
        frames: [hamsterSceneFrame(0), hamsterSceneFrame(1), hamsterSceneFrame(2)],
      };
    case "turtle-lotus":
      return {
        duration: 920,
        delay: 90,
        frames: [turtleSceneFrame(0), turtleSceneFrame(1), turtleSceneFrame(2)],
      };
    case "frog-pond":
      return {
        duration: 720,
        delay: 150,
        frames: [frogSceneFrame(0), frogSceneFrame(1), frogSceneFrame(2)],
      };
  }
}

function AvatarDecorScene({ variant, layer, className }: AvatarDecorSceneProps) {
  const { duration, delay, frames } = sceneFrames(variant);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: layer === "back" ? 0 : 3,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", width: "100%", height: "100%", imageRendering: "pixelated" }}
      >
        <style>{FRAME_STYLE}</style>
        <g style={anim("avatarDecorFrameA", duration, delay)}>
          {layer === "back" ? frames[0].back : frames[0].front}
        </g>
        <g style={anim("avatarDecorFrameB", duration, delay)}>
          {layer === "back" ? frames[1].back : frames[1].front}
        </g>
        <g style={anim("avatarDecorFrameC", duration, delay)}>
          {layer === "back" ? frames[2].back : frames[2].front}
        </g>
      </svg>
    </div>
  );
}

export { AvatarDecorScene, type AvatarDecorSceneProps, type AvatarDecorSceneVariant };
