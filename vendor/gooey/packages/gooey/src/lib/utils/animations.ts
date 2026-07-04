export const SPRING_CONFIGS = {
  gentle: {
    stiffness: 350,
    damping: 25,
    mass: 0.4,
  },
  standard: {
    stiffness: 550,
    damping: 30,
    mass: 0.4,
  },
  snappy: {
    stiffness: 650,
    damping: 30,
    mass: 0.3,
  },
  bouncy: {
    stiffness: 500,
    damping: 20,
    mass: 0.5,
  },
  familyDialog: {
    stiffness: 750,
    damping: 38,
    mass: 0.5,
  },
  familySnap: {
    stiffness: 850,
    damping: 42,
    mass: 0.3,
  },
  familyBounce: {
    stiffness: 650,
    damping: 25,
    mass: 0.4,
  },
  microPop: {
    stiffness: 1000,
    damping: 35,
    mass: 0.2,
  },
  smooth: {
    stiffness: 450,
    damping: 35,
    mass: 0.8,
  },
} as const;

export const TRANSITION_DURATIONS = {
  instant: 0.05,
  fast: 0.12,
  standard: 0.18,
  slow: 0.25,
  slower: 0.4,
} as const;

export const EASING = {
  easeInOut: [0.3, 0, 0.1, 1],
  easeOut: [0, 0, 0.1, 1],
  easeIn: [0.3, 0, 1, 1],
  sharp: [0.3, 0, 0.5, 1],
} as const;

export const getSpringTransition = (
  config: keyof typeof SPRING_CONFIGS = "standard"
) => ({
  type: "spring" as const,
  ...SPRING_CONFIGS[config],
});

export const getDurationTransition = (
  duration: keyof typeof TRANSITION_DURATIONS = "standard"
) => ({
  duration: TRANSITION_DURATIONS[duration],
  ease: EASING.easeInOut,
});

export const MICRO_INTERACTIONS = {
  hover: {
    scale: 1.02,
    transition: getSpringTransition("gentle"),
  },
  tap: {
    scale: 0.96,
    transition: getSpringTransition("snappy"),
  },
  focus: {
    scale: 1.01,
    transition: getSpringTransition("gentle"),
  },
} as const;

export const SCALE_TRANSITION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
} as const;

export const BUTTON_TAP = {
  whileTap: { scale: 0.97 },
  transition: getSpringTransition("microPop"),
} as const;
