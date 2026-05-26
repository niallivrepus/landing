type PetVariant =
  | "dog-maxi"
  | "dog-tommy"
  | "wild-dog-light"
  | "wild-dog-dark"
  | "cat-dark"
  | "cat-blue"
  | "cat-brown"
  | "cat-orange"
  | "cat-green-eyes"
  | "cat-pink-eyes"
  | "cat-orange-eyes"
  | "bunny-original"
  | "bunny-neon"
  | "bunny-red"
  | "bunny-green"
  | "bunny-orange"
  | "apple-orange"
  | "apple-red"
  | "apple-cyan"
  | "apple-green"
  | "ghost-bunny"
  | "ghost-cat"
  | "penguin-snow"
  | "frog-lily"
  | "owl-night"
  | "fox-ember"
  | "hamster-cream"
  | "turtle-shell";

interface PetProps {
  /**
   * Pet category and variant
   */
  variant?: PetVariant;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Pet - Pixel art illustrations of various pets and creatures
 * Used as optional decoration in PassPhoto component
 */
function Pet({ variant = "dog-maxi", className }: PetProps) {
  const pets = {
    // Dogs
    "dog-maxi": <DogMaxi />,
    "dog-tommy": <DogTommy />,

    // Wild Dogs
    "wild-dog-light": <WildDogLight />,
    "wild-dog-dark": <WildDogDark />,

    // Cats
    "cat-dark": <CatDark />,
    "cat-blue": <CatBlue />,
    "cat-brown": <CatBrown />,
    "cat-orange": <CatOrange />,
    "cat-green-eyes": <CatGreenEyes />,
    "cat-pink-eyes": <CatPinkEyes />,
    "cat-orange-eyes": <CatOrangeEyes />,

    // Bunnies
    "bunny-original": <BunnyOriginal />,
    "bunny-neon": <BunnyNeon />,
    "bunny-red": <BunnyRed />,
    "bunny-green": <BunnyGreen />,
    "bunny-orange": <BunnyOrange />,

    // Apples
    "apple-orange": <AppleOrange />,
    "apple-red": <AppleRed />,
    "apple-cyan": <AppleCyan />,
    "apple-green": <AppleGreen />,

    // Ghost variants
    "ghost-bunny": <GhostBunny />,
    "ghost-cat": <GhostCat />,

    // Woodland & pond animals
    "penguin-snow": <PenguinSnow />,
    "frog-lily": <FrogLily />,
    "owl-night": <OwlNight />,
    "fox-ember": <FoxEmber />,
    "hamster-cream": <HamsterCream />,
    "turtle-shell": <TurtleShell />,
  };

  return <div className={className}>{pets[variant]}</div>;
}

type PixelRect = {
  x: number;
  y: number;
  fill: string;
  opacity?: number;
};

function PixelSprite({
  width,
  height,
  pixels,
}: {
  width: number;
  height: number;
  pixels: PixelRect[];
}) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {pixels.map((pixel, index) => (
        <rect
          key={`${pixel.x}-${pixel.y}-${index}`}
          x={pixel.x}
          y={pixel.y}
          width="1"
          height="1"
          fill={pixel.fill}
          fillOpacity={pixel.opacity}
        />
      ))}
    </svg>
  );
}

// ============================================================================
// DOGS
// ============================================================================

/**
 * Dog Maxi - Classic pixel dog (rotated 45° in PassPhoto)
 */
function DogMaxi() {
  return (
    <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="1" height="1" fill="#DEDEDE" />
      <rect x="2" y="5" width="1" height="1" fill="#DEDEDE" />
      <rect x="2" y="4" width="1" height="1" fill="#DEDEDE" />
      <rect x="2" y="3" width="1" height="1" fill="#E1D2BE" />
      <rect x="2" y="2" width="1" height="1" fill="#DEDEDE" />
      <rect x="2" y="1" width="1" height="1" fill="#826649" />
      <rect x="2" width="1" height="1" fill="#BA9773" />
      <rect x="3" y="1" width="1" height="1" fill="#DEDEDE" />
      <rect x="4" y="2" width="1" height="1" fill="#DEDEDE" />
      <rect x="4" y="3" width="1" height="1" fill="#BA9773" />
      <rect x="4" y="4" width="1" height="1" fill="#473321" />
      <rect x="4" y="5" width="1" height="1" fill="#FDFBF0" />
      <rect x="4" y="6" width="1" height="1" fill="#E1D2BE" />
      <rect x="3" y="6" width="1" height="1" fill="#DEDEDE" />
      <rect x="3" y="5" width="1" height="1" fill="#EFECDA" />
      <rect x="3" y="4" width="1" height="1" fill="#FDFBF0" />
      <rect x="3" y="3" width="1" height="1" fill="black" />
      <rect x="3" y="2" width="1" height="1" fill="#E1D2BE" />
      <rect x="6" y="2" width="1" height="1" fill="#E1D2BE" />
      <rect x="6" y="3" width="1" height="1" fill="black" />
      <rect x="6" y="4" width="1" height="1" fill="#FDFBF0" />
      <rect x="6" y="5" width="1" height="1" fill="#EFECDA" />
      <rect x="6" y="6" width="1" height="1" fill="#DEDEDE" />
      <rect x="7" y="6" width="1" height="1" fill="#DEDEDE" />
      <rect x="7" y="5" width="1" height="1" fill="#DEDEDE" />
      <rect x="7" y="4" width="1" height="1" fill="#DEDEDE" />
      <rect x="7" y="3" width="1" height="1" fill="#E1D2BE" />
      <rect x="7" y="2" width="1" height="1" fill="#DEDEDE" />
      <rect x="7" y="1" width="1" height="1" fill="#826649" />
      <rect x="4" y="1" width="1" height="1" fill="#DEDEDE" />
      <rect x="5" y="1" width="1" height="1" fill="#DEDEDE" />
      <rect x="5" y="2" width="1" height="1" fill="#DEDEDE" />
      <rect x="5" y="3" width="1" height="1" fill="#BA9773" />
      <rect x="5" y="4" width="1" height="1" fill="#473321" />
      <rect x="5" y="5" width="1" height="1" fill="#FDFBF0" />
      <rect x="5" y="6" width="1" height="1" fill="#E1D2BE" />
      <rect x="6" y="1" width="1" height="1" fill="#DEDEDE" />
      <rect x="7" width="1" height="1" fill="#BA9773" />
      <rect x="8" width="1" height="1" fill="#BA9773" />
      <rect x="9" y="1" width="1" height="1" fill="#BA9773" />
      <rect x="9" y="2" width="1" height="1" fill="#BA9773" />
      <rect x="8" y="3" width="1" height="1" fill="#BA9773" />
      <rect x="1" y="3" width="1" height="1" fill="#BA9773" />
      <rect x="8" y="2" width="1" height="1" fill="#BA9773" />
      <rect x="8" y="1" width="1" height="1" fill="#BA9773" />
      <rect x="1" width="1" height="1" fill="#BA9773" />
      <rect y="1" width="1" height="1" fill="#BA9773" />
      <rect y="2" width="1" height="1" fill="#BA9773" />
      <rect x="1" y="1" width="1" height="1" fill="#BA9773" />
      <rect x="1" y="2" width="1" height="1" fill="#BA9773" />
    </svg>
  );
}

/**
 * Dog Tommy - Dark colored dog variant
 */
function DogTommy() {
  return (
    <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="1" height="1" fill="#1A1A1A" />
      <rect x="2" y="5" width="1" height="1" fill="#1A1A1A" />
      <rect x="2" y="4" width="1" height="1" fill="#1A1A1A" />
      <rect x="2" y="3" width="1" height="1" fill="#3F3D34" fillOpacity="0.866667" />
      <rect x="2" y="2" width="1" height="1" fill="#100E0D" />
      <rect x="2" y="1" width="1" height="1" fill="#100E0D" />
      <rect x="2" width="1" height="1" fill="#2B2926" />
      <rect x="3" y="1" width="1" height="1" fill="#1A1A1A" />
      <rect x="4" y="2" width="1" height="1" fill="#1A1A1A" />
      <rect x="4" y="3" width="1" height="1" fill="#2B2926" />
      <rect x="4" y="4" width="1" height="1" fill="#1A1817" />
      <rect x="4" y="5" width="1" height="1" fill="#3F3D34" />
      <rect x="4" y="6" width="1" height="1" fill="#3F3D34" fillOpacity="0.866667" />
      <rect x="3" y="6" width="1" height="1" fill="#1A1A1A" />
      <rect x="3" y="5" width="1" height="1" fill="#35342E" />
      <rect x="3" y="4" width="1" height="1" fill="#3F3D34" />
      <rect x="3" y="3" width="1" height="1" fill="#F6F6F6" />
      <rect x="3" y="2" width="1" height="1" fill="#3F3D34" fillOpacity="0.866667" />
      <rect x="6" y="2" width="1" height="1" fill="#3F3D34" fillOpacity="0.866667" />
      <rect x="6" y="3" width="1" height="1" fill="#F6F6F6" />
      <rect x="6" y="4" width="1" height="1" fill="#3F3D34" />
      <rect x="6" y="5" width="1" height="1" fill="#35342E" />
      <rect x="6" y="6" width="1" height="1" fill="#1A1A1A" />
      <rect x="7" y="6" width="1" height="1" fill="#1A1A1A" />
      <rect x="7" y="5" width="1" height="1" fill="#1A1A1A" />
      <rect x="7" y="4" width="1" height="1" fill="#1A1A1A" />
      <rect x="7" y="3" width="1" height="1" fill="#3F3D34" fillOpacity="0.866667" />
      <rect x="7" y="2" width="1" height="1" fill="#100E0D" />
      <rect x="7" y="1" width="1" height="1" fill="#100E0D" />
      <rect x="4" y="1" width="1" height="1" fill="#1A1A1A" />
      <rect x="5" y="1" width="1" height="1" fill="#1A1A1A" />
      <rect x="5" y="2" width="1" height="1" fill="#1A1A1A" />
      <rect x="5" y="3" width="1" height="1" fill="#2B2926" />
      <rect x="5" y="4" width="1" height="1" fill="#1A1817" />
      <rect x="5" y="5" width="1" height="1" fill="#3F3D34" />
      <rect x="5" y="6" width="1" height="1" fill="#3F3D34" fillOpacity="0.866667" />
      <rect x="6" y="1" width="1" height="1" fill="#1A1A1A" />
      <rect x="7" width="1" height="1" fill="#2B2926" />
      <rect x="8" width="1" height="1" fill="#2B2926" />
      <rect x="9" y="1" width="1" height="1" fill="#2B2926" />
      <rect x="9" y="2" width="1" height="1" fill="#2B2926" />
      <rect x="8" y="3" width="1" height="1" fill="#2B2926" />
      <rect x="1" y="3" width="1" height="1" fill="#2B2926" />
      <rect x="8" y="2" width="1" height="1" fill="#2B2926" />
      <rect x="8" y="1" width="1" height="1" fill="#2B2926" />
      <rect x="1" width="1" height="1" fill="#2B2926" />
      <rect y="1" width="1" height="1" fill="#2B2926" />
      <rect y="2" width="1" height="1" fill="#2B2926" />
      <rect x="1" y="1" width="1" height="1" fill="#2B2926" />
      <rect x="1" y="2" width="1" height="1" fill="#2B2926" />
    </svg>
  );
}

// ============================================================================
// WILD DOGS
// ============================================================================

/**
 * Wild Dog Light - Light colored wild dog
 */
function WildDogLight() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="1" height="1" fill="#E1D2BE" />
      <rect x="2" y="6" width="1" height="1" fill="#E1D2BE" />
      <rect x="2" y="5" width="1" height="1" fill="#E1D2BE" />
      <rect x="2" y="4" width="1" height="1" fill="#88848E" />
      <rect x="2" y="3" width="1" height="1" fill="#E1D2BE" />
      <rect x="2" y="2" width="1" height="1" fill="#F6F6F6" />
      <rect x="2" y="1" width="1" height="1" fill="#312B33" />
      <rect x="3" y="2" width="1" height="1" fill="#BA9773" />
      <rect x="4" y="3" width="1" height="1" fill="#E1D2BE" />
      <rect x="4" y="4" width="1" height="1" fill="#BA9773" />
      <rect x="4" y="5" width="1" height="1" fill="#040704" />
      <rect x="4" y="6" width="1" height="1" fill="#FDFBF0" />
      <rect x="4" y="7" width="1" height="1" fill="#BA9773" />
      <rect x="3" y="7" width="1" height="1" fill="#E1D2BE" />
      <rect x="3" y="6" width="1" height="1" fill="#EFECDA" />
      <rect x="3" y="5" width="1" height="1" fill="#FDFBF0" />
      <rect x="3" y="4" width="1" height="1" fill="#FF3D00" />
      <rect x="3" y="3" width="1" height="1" fill="#88848E" />
      <rect x="6" y="3" width="1" height="1" fill="#88848E" />
      <rect x="6" y="4" width="1" height="1" fill="#FF3D00" />
      <rect x="6" y="5" width="1" height="1" fill="#FDFBF0" />
      <rect x="6" y="6" width="1" height="1" fill="#EFECDA" />
      <rect x="6" y="7" width="1" height="1" fill="#E1D2BE" />
      <rect x="7" y="7" width="1" height="1" fill="#E1D2BE" />
      <rect x="7" y="6" width="1" height="1" fill="#E1D2BE" />
      <rect x="7" y="5" width="1" height="1" fill="#E1D2BE" />
      <rect x="7" y="4" width="1" height="1" fill="#88848E" />
      <rect x="7" y="3" width="1" height="1" fill="#E1D2BE" />
      <rect x="7" y="2" width="1" height="1" fill="#F6F6F6" />
      <rect x="4" y="2" width="1" height="1" fill="#E1D2BE" />
      <rect x="4" y="1" width="1" height="1" fill="#EFECDA" />
      <rect x="5" y="1" width="1" height="1" fill="#EFECDA" />
      <rect x="5" y="2" width="1" height="1" fill="#E1D2BE" />
      <rect x="5" y="3" width="1" height="1" fill="#E1D2BE" />
      <rect x="5" y="4" width="1" height="1" fill="#BA9773" />
      <rect x="5" y="5" width="1" height="1" fill="#040704" />
      <rect x="5" y="6" width="1" height="1" fill="#FDFBF0" />
      <rect x="5" y="7" width="1" height="1" fill="#BA9773" />
      <rect x="6" y="2" width="1" height="1" fill="#BA9773" />
      <rect x="7" y="1" width="1" height="1" fill="#312B33" />
      <rect x="7" width="1" height="1" fill="#312B33" />
      <rect x="8" y="1" width="1" height="1" fill="#312B33" />
      <rect x="9" y="2" width="1" height="1" fill="#312B33" />
      <rect x="8" y="3" width="1" height="1" fill="#E1D2BE" />
      <rect x="8" y="2" width="1" height="1" fill="#BA9773" />
      <rect x="2" width="1" height="1" fill="#312B33" />
      <rect x="1" y="1" width="1" height="1" fill="#312B33" />
      <rect y="2" width="1" height="1" fill="#312B33" />
      <rect x="1" y="2" width="1" height="1" fill="#BA9773" />
      <rect x="1" y="3" width="1" height="1" fill="#E1D2BE" />
    </svg>
  );
}

/**
 * Wild Dog Dark - Dark colored wild dog
 */
function WildDogDark() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="1" height="1" fill="#CDA978" />
      <rect x="2" y="6" width="1" height="1" fill="#CDA978" />
      <rect x="2" y="5" width="1" height="1" fill="#CDA978" />
      <rect x="2" y="4" width="1" height="1" fill="#88848E" />
      <rect x="2" y="3" width="1" height="1" fill="#CDA978" />
      <rect x="2" y="2" width="1" height="1" fill="#F6F6F6" />
      <rect x="2" y="1" width="1" height="1" fill="#312B33" />
      <rect x="3" y="2" width="1" height="1" fill="#C78949" />
      <rect x="4" y="3" width="1" height="1" fill="#CDA978" />
      <rect x="4" y="4" width="1" height="1" fill="#C78949" />
      <rect x="4" y="5" width="1" height="1" fill="#040704" />
      <rect x="4" y="6" width="1" height="1" fill="#D2BE52" />
      <rect x="4" y="7" width="1" height="1" fill="#C78949" />
      <rect x="3" y="7" width="1" height="1" fill="#CDA978" />
      <rect x="3" y="6" width="1" height="1" fill="#C8B861" />
      <rect x="3" y="5" width="1" height="1" fill="#D2BE52" />
      <rect x="3" y="4" width="1" height="1" fill="#FF3D00" />
      <rect x="3" y="3" width="1" height="1" fill="#88848E" />
      <rect x="6" y="3" width="1" height="1" fill="#88848E" />
      <rect x="6" y="4" width="1" height="1" fill="#FF3D00" />
      <rect x="6" y="5" width="1" height="1" fill="#D2BE52" />
      <rect x="6" y="6" width="1" height="1" fill="#C8B861" />
      <rect x="6" y="7" width="1" height="1" fill="#CDA978" />
      <rect x="7" y="7" width="1" height="1" fill="#CDA978" />
      <rect x="7" y="6" width="1" height="1" fill="#CDA978" />
      <rect x="7" y="5" width="1" height="1" fill="#CDA978" />
      <rect x="7" y="4" width="1" height="1" fill="#88848E" />
      <rect x="7" y="3" width="1" height="1" fill="#CDA978" />
      <rect x="7" y="2" width="1" height="1" fill="#F6F6F6" />
      <rect x="4" y="2" width="1" height="1" fill="#CDA978" />
      <rect x="4" y="1" width="1" height="1" fill="#C8B861" />
      <rect x="5" y="1" width="1" height="1" fill="#C8B861" />
      <rect x="5" y="2" width="1" height="1" fill="#CDA978" />
      <rect x="5" y="3" width="1" height="1" fill="#CDA978" />
      <rect x="5" y="4" width="1" height="1" fill="#C78949" />
      <rect x="5" y="5" width="1" height="1" fill="#040704" />
      <rect x="5" y="6" width="1" height="1" fill="#D2BE52" />
      <rect x="5" y="7" width="1" height="1" fill="#C78949" />
      <rect x="6" y="2" width="1" height="1" fill="#C78949" />
      <rect x="7" y="1" width="1" height="1" fill="#312B33" />
      <rect x="7" width="1" height="1" fill="#312B33" />
      <rect x="8" y="1" width="1" height="1" fill="#312B33" />
      <rect x="9" y="2" width="1" height="1" fill="#312B33" />
      <rect x="8" y="3" width="1" height="1" fill="#CDA978" />
      <rect x="8" y="2" width="1" height="1" fill="#C78949" />
      <rect x="2" width="1" height="1" fill="#312B33" />
      <rect x="1" y="1" width="1" height="1" fill="#312B33" />
      <rect y="2" width="1" height="1" fill="#312B33" />
      <rect x="1" y="2" width="1" height="1" fill="#C78949" />
      <rect x="1" y="3" width="1" height="1" fill="#CDA978" />
    </svg>
  );
}

// ============================================================================
// CATS
// ============================================================================

/**
 * Cat Dark - Black cat
 */
function CatDark() {
  return (
    <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="7" width="1" height="1" fill="#212121" />
      <rect y="6" width="1" height="1" fill="#212121" />
      <rect y="5" width="1" height="1" fill="#212121" />
      <rect y="4" width="1" height="1" fill="#212121" />
      <rect y="3" width="1" height="1" fill="#212121" />
      <rect y="2" width="1" height="1" fill="#2A2A2A" />
      <rect y="1" width="1" height="1" fill="#2A2A2A" />
      <rect x="1" y="2" width="1" height="1" fill="#212121" />
      <rect x="2" y="3" width="1" height="1" fill="#212121" />
      <rect x="2" y="4" width="1" height="1" fill="#212121" />
      <rect x="2" y="5" width="1" height="1" fill="#2A2A2A" />
      <rect x="2" y="6" width="1" height="1" fill="#212121" />
      <rect x="2" y="7" width="1" height="1" fill="#212121" />
      <rect x="1" y="7" width="1" height="1" fill="#212121" />
      <rect x="1" y="6" width="1" height="1" fill="#2A2A2A" />
      <rect x="1" y="5" width="1" height="1" fill="#212121" />
      <rect x="1" y="4" width="1" height="1" fill="#E9E9E9" />
      <rect x="1" y="3" width="1" height="1" fill="#212121" />
      <rect x="4" y="3" width="1" height="1" fill="#212121" />
      <rect x="4" y="4" width="1" height="1" fill="#E9E9E9" />
      <rect x="4" y="5" width="1" height="1" fill="#212121" />
      <rect x="4" y="6" width="1" height="1" fill="#2A2A2A" />
      <rect x="4" y="7" width="1" height="1" fill="#212121" />
      <rect x="5" y="7" width="1" height="1" fill="#212121" />
      <rect x="5" y="6" width="1" height="1" fill="#212121" />
      <rect x="5" y="5" width="1" height="1" fill="#212121" />
      <rect x="5" y="4" width="1" height="1" fill="#212121" />
      <rect x="5" y="3" width="1" height="1" fill="#212121" />
      <rect x="5" y="2" width="1" height="1" fill="#2A2A2A" />
      <rect x="2" y="2" width="1" height="1" fill="#212121" />
      <rect x="2" y="1" width="1" height="1" fill="#212121" />
      <rect x="3" y="1" width="1" height="1" fill="#212121" />
      <rect x="3" y="2" width="1" height="1" fill="#212121" />
      <rect x="3" y="3" width="1" height="1" fill="#212121" />
      <rect x="3" y="4" width="1" height="1" fill="#212121" />
      <rect x="3" y="5" width="1" height="1" fill="#2A2A2A" />
      <rect x="3" y="6" width="1" height="1" fill="#212121" />
      <rect x="3" y="7" width="1" height="1" fill="#212121" />
      <rect x="4" y="2" width="1" height="1" fill="#212121" />
      <rect x="5" y="1" width="1" height="1" fill="#2A2A2A" />
      <rect x="5" width="1" height="1" fill="#212121" />
      <rect width="1" height="1" fill="#212121" />
    </svg>
  );
}

/**
 * Cat Blue - Blue-gray cat
 */
function CatBlue() {
  return (
    <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="7" width="1" height="1" fill="#36385A" />
      <rect y="6" width="1" height="1" fill="#36385A" />
      <rect y="5" width="1" height="1" fill="#36385A" />
      <rect y="4" width="1" height="1" fill="#36385A" />
      <rect y="3" width="1" height="1" fill="#36385A" />
      <rect y="2" width="1" height="1" fill="#4E4A7C" />
      <rect y="1" width="1" height="1" fill="#4E4A7C" />
      <rect x="1" y="2" width="1" height="1" fill="#36385A" />
      <rect x="2" y="3" width="1" height="1" fill="#36385A" />
      <rect x="2" y="4" width="1" height="1" fill="#36385A" />
      <rect x="2" y="5" width="1" height="1" fill="#4E4A7C" />
      <rect x="2" y="6" width="1" height="1" fill="#36385A" />
      <rect x="2" y="7" width="1" height="1" fill="#36385A" />
      <rect x="1" y="7" width="1" height="1" fill="#36385A" />
      <rect x="1" y="6" width="1" height="1" fill="#4E4A7C" />
      <rect x="1" y="5" width="1" height="1" fill="#36385A" />
      <rect x="1" y="4" width="1" height="1" fill="#E9E9E9" />
      <rect x="1" y="3" width="1" height="1" fill="#36385A" />
      <rect x="4" y="3" width="1" height="1" fill="#36385A" />
      <rect x="4" y="4" width="1" height="1" fill="#E9E9E9" />
      <rect x="4" y="5" width="1" height="1" fill="#36385A" />
      <rect x="4" y="6" width="1" height="1" fill="#4E4A7C" />
      <rect x="4" y="7" width="1" height="1" fill="#36385A" />
      <rect x="5" y="7" width="1" height="1" fill="#36385A" />
      <rect x="5" y="6" width="1" height="1" fill="#36385A" />
      <rect x="5" y="5" width="1" height="1" fill="#36385A" />
      <rect x="5" y="4" width="1" height="1" fill="#36385A" />
      <rect x="5" y="3" width="1" height="1" fill="#36385A" />
      <rect x="5" y="2" width="1" height="1" fill="#4E4A7C" />
      <rect x="2" y="2" width="1" height="1" fill="#36385A" />
      <rect x="2" y="1" width="1" height="1" fill="#36385A" />
      <rect x="3" y="1" width="1" height="1" fill="#36385A" />
      <rect x="3" y="2" width="1" height="1" fill="#36385A" />
      <rect x="3" y="3" width="1" height="1" fill="#36385A" />
      <rect x="3" y="4" width="1" height="1" fill="#36385A" />
      <rect x="3" y="5" width="1" height="1" fill="#4E4A7C" />
      <rect x="3" y="6" width="1" height="1" fill="#36385A" />
      <rect x="3" y="7" width="1" height="1" fill="#36385A" />
      <rect x="4" y="2" width="1" height="1" fill="#36385A" />
      <rect x="5" y="1" width="1" height="1" fill="#4E4A7C" />
      <rect x="5" width="1" height="1" fill="#36385A" />
      <rect width="1" height="1" fill="#36385A" />
    </svg>
  );
}

/**
 * Cat Brown - Brown cat
 */
function CatBrown() {
  return (
    <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="7" width="1" height="1" fill="#3F251B" />
      <rect y="6" width="1" height="1" fill="#3F251B" />
      <rect y="5" width="1" height="1" fill="#3F251B" />
      <rect y="4" width="1" height="1" fill="#3F251B" />
      <rect y="3" width="1" height="1" fill="#3F251B" />
      <rect y="2" width="1" height="1" fill="#623928" />
      <rect y="1" width="1" height="1" fill="#623928" />
      <rect x="1" y="2" width="1" height="1" fill="#3F251B" />
      <rect x="2" y="3" width="1" height="1" fill="#3F251B" />
      <rect x="2" y="4" width="1" height="1" fill="#3F251B" />
      <rect x="2" y="5" width="1" height="1" fill="#623928" />
      <rect x="2" y="6" width="1" height="1" fill="#3F251B" />
      <rect x="2" y="7" width="1" height="1" fill="#3F251B" />
      <rect x="1" y="7" width="1" height="1" fill="#3F251B" />
      <rect x="1" y="6" width="1" height="1" fill="#623928" />
      <rect x="1" y="5" width="1" height="1" fill="#3F251B" />
      <rect x="1" y="4" width="1" height="1" fill="#E9E9E9" />
      <rect x="1" y="3" width="1" height="1" fill="#3F251B" />
      <rect x="4" y="3" width="1" height="1" fill="#3F251B" />
      <rect x="4" y="4" width="1" height="1" fill="#E9E9E9" />
      <rect x="4" y="5" width="1" height="1" fill="#3F251B" />
      <rect x="4" y="6" width="1" height="1" fill="#623928" />
      <rect x="4" y="7" width="1" height="1" fill="#3F251B" />
      <rect x="5" y="7" width="1" height="1" fill="#3F251B" />
      <rect x="5" y="6" width="1" height="1" fill="#3F251B" />
      <rect x="5" y="5" width="1" height="1" fill="#3F251B" />
      <rect x="5" y="4" width="1" height="1" fill="#3F251B" />
      <rect x="5" y="3" width="1" height="1" fill="#3F251B" />
      <rect x="5" y="2" width="1" height="1" fill="#623928" />
      <rect x="2" y="2" width="1" height="1" fill="#3F251B" />
      <rect x="2" y="1" width="1" height="1" fill="#3F251B" />
      <rect x="3" y="1" width="1" height="1" fill="#3F251B" />
      <rect x="3" y="2" width="1" height="1" fill="#3F251B" />
      <rect x="3" y="3" width="1" height="1" fill="#3F251B" />
      <rect x="3" y="4" width="1" height="1" fill="#3F251B" />
      <rect x="3" y="5" width="1" height="1" fill="#623928" />
      <rect x="3" y="6" width="1" height="1" fill="#3F251B" />
      <rect x="3" y="7" width="1" height="1" fill="#3F251B" />
      <rect x="4" y="2" width="1" height="1" fill="#3F251B" />
      <rect x="5" y="1" width="1" height="1" fill="#623928" />
      <rect x="5" width="1" height="1" fill="#3F251B" />
      <rect width="1" height="1" fill="#3F251B" />
    </svg>
  );
}

/**
 * Cat Orange - Orange tabby cat
 */
function CatOrange() {
  return (
    <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="7" width="1" height="1" fill="#D53E00" />
      <rect y="6" width="1" height="1" fill="#D53E00" />
      <rect y="5" width="1" height="1" fill="#D53E00" />
      <rect y="4" width="1" height="1" fill="#D53E00" />
      <rect y="3" width="1" height="1" fill="#FF8718" />
      <rect y="2" width="1" height="1" fill="#FE4A00" />
      <rect y="1" width="1" height="1" fill="#FE4A00" />
      <rect x="1" y="2" width="1" height="1" fill="#FF8718" />
      <rect x="2" y="3" width="1" height="1" fill="#D53E00" />
      <rect x="2" y="4" width="1" height="1" fill="#D53E00" />
      <rect x="2" y="5" width="1" height="1" fill="#FE4A00" />
      <rect x="2" y="6" width="1" height="1" fill="#D53E00" />
      <rect x="2" y="7" width="1" height="1" fill="#D53E00" />
      <rect x="1" y="7" width="1" height="1" fill="#D53E00" />
      <rect x="1" y="6" width="1" height="1" fill="#FE4A00" />
      <rect x="1" y="5" width="1" height="1" fill="#D53E00" />
      <rect x="1" y="4" width="1" height="1" fill="#E9E9E9" />
      <rect x="1" y="3" width="1" height="1" fill="#D53E00" />
      <rect x="4" y="3" width="1" height="1" fill="#D53E00" />
      <rect x="4" y="4" width="1" height="1" fill="#E9E9E9" />
      <rect x="4" y="5" width="1" height="1" fill="#D53E00" />
      <rect x="4" y="6" width="1" height="1" fill="#FE4A00" />
      <rect x="4" y="7" width="1" height="1" fill="#D53E00" />
      <rect x="5" y="7" width="1" height="1" fill="#D53E00" />
      <rect x="5" y="6" width="1" height="1" fill="#D53E00" />
      <rect x="5" y="5" width="1" height="1" fill="#D53E00" />
      <rect x="5" y="4" width="1" height="1" fill="#D53E00" />
      <rect x="5" y="3" width="1" height="1" fill="#FF8718" />
      <rect x="5" y="2" width="1" height="1" fill="#FE4A00" />
      <rect x="2" y="2" width="1" height="1" fill="#FF8718" />
      <rect x="2" y="1" width="1" height="1" fill="#FF8718" />
      <rect x="3" y="1" width="1" height="1" fill="#FF8718" />
      <rect x="3" y="2" width="1" height="1" fill="#FF8718" />
      <rect x="3" y="3" width="1" height="1" fill="#D53E00" />
      <rect x="3" y="4" width="1" height="1" fill="#D53E00" />
      <rect x="3" y="5" width="1" height="1" fill="#FE4A00" />
      <rect x="3" y="6" width="1" height="1" fill="#D53E00" />
      <rect x="3" y="7" width="1" height="1" fill="#D53E00" />
      <rect x="4" y="2" width="1" height="1" fill="#FF8718" />
      <rect x="5" y="1" width="1" height="1" fill="#FE4A00" />
      <rect x="5" width="1" height="1" fill="#D53E00" />
      <rect width="1" height="1" fill="#D53E00" />
    </svg>
  );
}

/**
 * Cat with Green Eyes - Black cat with green eyes
 */
function CatGreenEyes() {
  return (
    <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="7" width="1" height="1" fill="#212121" />
      <rect y="6" width="1" height="1" fill="#212121" />
      <rect y="5" width="1" height="1" fill="#212121" />
      <rect y="4" width="1" height="1" fill="#212121" />
      <rect y="3" width="1" height="1" fill="#212121" />
      <rect y="2" width="1" height="1" fill="#2A2A2A" />
      <rect y="1" width="1" height="1" fill="#2A2A2A" />
      <rect x="1" y="2" width="1" height="1" fill="#212121" />
      <rect x="2" y="3" width="1" height="1" fill="#212121" />
      <rect x="2" y="4" width="1" height="1" fill="#212121" />
      <rect x="2" y="5" width="1" height="1" fill="#2A2A2A" />
      <rect x="2" y="6" width="1" height="1" fill="#212121" />
      <rect x="2" y="7" width="1" height="1" fill="#212121" />
      <rect x="1" y="7" width="1" height="1" fill="#212121" />
      <rect x="1" y="6" width="1" height="1" fill="#2A2A2A" />
      <rect x="1" y="5" width="1" height="1" fill="#212121" />
      <rect x="1" y="4" width="1" height="1" fill="#EBFF00" />
      <rect x="1" y="3" width="1" height="1" fill="#212121" />
      <rect x="4" y="3" width="1" height="1" fill="#212121" />
      <rect x="4" y="4" width="1" height="1" fill="#EBFF00" />
      <rect x="4" y="5" width="1" height="1" fill="#212121" />
      <rect x="4" y="6" width="1" height="1" fill="#2A2A2A" />
      <rect x="4" y="7" width="1" height="1" fill="#212121" />
      <rect x="5" y="7" width="1" height="1" fill="#212121" />
      <rect x="5" y="6" width="1" height="1" fill="#212121" />
      <rect x="5" y="5" width="1" height="1" fill="#212121" />
      <rect x="5" y="4" width="1" height="1" fill="#212121" />
      <rect x="5" y="3" width="1" height="1" fill="#212121" />
      <rect x="5" y="2" width="1" height="1" fill="#2A2A2A" />
      <rect x="2" y="2" width="1" height="1" fill="#212121" />
      <rect x="2" y="1" width="1" height="1" fill="#212121" />
      <rect x="3" y="1" width="1" height="1" fill="#212121" />
      <rect x="3" y="2" width="1" height="1" fill="#212121" />
      <rect x="3" y="3" width="1" height="1" fill="#212121" />
      <rect x="3" y="4" width="1" height="1" fill="#212121" />
      <rect x="3" y="5" width="1" height="1" fill="#2A2A2A" />
      <rect x="3" y="6" width="1" height="1" fill="#212121" />
      <rect x="3" y="7" width="1" height="1" fill="#212121" />
      <rect x="4" y="2" width="1" height="1" fill="#212121" />
      <rect x="5" y="1" width="1" height="1" fill="#2A2A2A" />
      <rect x="5" width="1" height="1" fill="#212121" />
      <rect width="1" height="1" fill="#212121" />
    </svg>
  );
}

/**
 * Cat with Pink Eyes - Black cat with pink eyes
 */
function CatPinkEyes() {
  return (
    <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="7" width="1" height="1" fill="#212121" />
      <rect y="6" width="1" height="1" fill="#212121" />
      <rect y="5" width="1" height="1" fill="#212121" />
      <rect y="4" width="1" height="1" fill="#212121" />
      <rect y="3" width="1" height="1" fill="#212121" />
      <rect y="2" width="1" height="1" fill="#2A2A2A" />
      <rect y="1" width="1" height="1" fill="#2A2A2A" />
      <rect x="1" y="2" width="1" height="1" fill="#212121" />
      <rect x="2" y="3" width="1" height="1" fill="#212121" />
      <rect x="2" y="4" width="1" height="1" fill="#212121" />
      <rect x="2" y="5" width="1" height="1" fill="#2A2A2A" />
      <rect x="2" y="6" width="1" height="1" fill="#212121" />
      <rect x="2" y="7" width="1" height="1" fill="#212121" />
      <rect x="1" y="7" width="1" height="1" fill="#212121" />
      <rect x="1" y="6" width="1" height="1" fill="#2A2A2A" />
      <rect x="1" y="5" width="1" height="1" fill="#212121" />
      <rect x="1" y="4" width="1" height="1" fill="#FF00F5" />
      <rect x="1" y="3" width="1" height="1" fill="#212121" />
      <rect x="4" y="3" width="1" height="1" fill="#212121" />
      <rect x="4" y="4" width="1" height="1" fill="#FF00F5" />
      <rect x="4" y="5" width="1" height="1" fill="#212121" />
      <rect x="4" y="6" width="1" height="1" fill="#2A2A2A" />
      <rect x="4" y="7" width="1" height="1" fill="#212121" />
      <rect x="5" y="7" width="1" height="1" fill="#212121" />
      <rect x="5" y="6" width="1" height="1" fill="#212121" />
      <rect x="5" y="5" width="1" height="1" fill="#212121" />
      <rect x="5" y="4" width="1" height="1" fill="#212121" />
      <rect x="5" y="3" width="1" height="1" fill="#212121" />
      <rect x="5" y="2" width="1" height="1" fill="#2A2A2A" />
      <rect x="2" y="2" width="1" height="1" fill="#212121" />
      <rect x="2" y="1" width="1" height="1" fill="#212121" />
      <rect x="3" y="1" width="1" height="1" fill="#212121" />
      <rect x="3" y="2" width="1" height="1" fill="#212121" />
      <rect x="3" y="3" width="1" height="1" fill="#212121" />
      <rect x="3" y="4" width="1" height="1" fill="#212121" />
      <rect x="3" y="5" width="1" height="1" fill="#2A2A2A" />
      <rect x="3" y="6" width="1" height="1" fill="#212121" />
      <rect x="3" y="7" width="1" height="1" fill="#212121" />
      <rect x="4" y="2" width="1" height="1" fill="#212121" />
      <rect x="5" y="1" width="1" height="1" fill="#2A2A2A" />
      <rect x="5" width="1" height="1" fill="#212121" />
      <rect width="1" height="1" fill="#212121" />
    </svg>
  );
}

/**
 * Cat with Orange Eyes - Black cat with orange eyes
 */
function CatOrangeEyes() {
  return (
    <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="7" width="1" height="1" fill="#212121" />
      <rect y="6" width="1" height="1" fill="#212121" />
      <rect y="5" width="1" height="1" fill="#212121" />
      <rect y="4" width="1" height="1" fill="#212121" />
      <rect y="3" width="1" height="1" fill="#212121" />
      <rect y="2" width="1" height="1" fill="#2A2A2A" />
      <rect y="1" width="1" height="1" fill="#2A2A2A" />
      <rect x="1" y="2" width="1" height="1" fill="#212121" />
      <rect x="2" y="3" width="1" height="1" fill="#212121" />
      <rect x="2" y="4" width="1" height="1" fill="#212121" />
      <rect x="2" y="5" width="1" height="1" fill="#2A2A2A" />
      <rect x="2" y="6" width="1" height="1" fill="#212121" />
      <rect x="2" y="7" width="1" height="1" fill="#212121" />
      <rect x="1" y="7" width="1" height="1" fill="#212121" />
      <rect x="1" y="6" width="1" height="1" fill="#2A2A2A" />
      <rect x="1" y="5" width="1" height="1" fill="#212121" />
      <rect x="1" y="4" width="1" height="1" fill="#FF3D00" />
      <rect x="1" y="3" width="1" height="1" fill="#212121" />
      <rect x="4" y="3" width="1" height="1" fill="#212121" />
      <rect x="4" y="4" width="1" height="1" fill="#FF3D00" />
      <rect x="4" y="5" width="1" height="1" fill="#212121" />
      <rect x="4" y="6" width="1" height="1" fill="#2A2A2A" />
      <rect x="4" y="7" width="1" height="1" fill="#212121" />
      <rect x="5" y="7" width="1" height="1" fill="#212121" />
      <rect x="5" y="6" width="1" height="1" fill="#212121" />
      <rect x="5" y="5" width="1" height="1" fill="#212121" />
      <rect x="5" y="4" width="1" height="1" fill="#212121" />
      <rect x="5" y="3" width="1" height="1" fill="#212121" />
      <rect x="5" y="2" width="1" height="1" fill="#2A2A2A" />
      <rect x="2" y="2" width="1" height="1" fill="#212121" />
      <rect x="2" y="1" width="1" height="1" fill="#212121" />
      <rect x="3" y="1" width="1" height="1" fill="#212121" />
      <rect x="3" y="2" width="1" height="1" fill="#212121" />
      <rect x="3" y="3" width="1" height="1" fill="#212121" />
      <rect x="3" y="4" width="1" height="1" fill="#212121" />
      <rect x="3" y="5" width="1" height="1" fill="#2A2A2A" />
      <rect x="3" y="6" width="1" height="1" fill="#212121" />
      <rect x="3" y="7" width="1" height="1" fill="#212121" />
      <rect x="4" y="2" width="1" height="1" fill="#212121" />
      <rect x="5" y="1" width="1" height="1" fill="#2A2A2A" />
      <rect x="5" width="1" height="1" fill="#212121" />
      <rect width="1" height="1" fill="#212121" />
    </svg>
  );
}

// ============================================================================
// BUNNIES
// ============================================================================

/**
 * Bunny Original - Pink and cyan bunny
 */
function BunnyOriginal() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="8" width="1" height="1" fill="#D66371" />
      <rect x="1" y="7" width="1" height="1" fill="#D66371" />
      <rect x="1" y="6" width="1" height="1" fill="#FF7991" />
      <rect x="1" y="5" width="1" height="1" fill="#00AEAE" />
      <rect x="1" y="4" width="1" height="1" fill="#00AEAE" />
      <rect x="2" y="3" width="1" height="1" fill="#00AEAE" />
      <rect x="3" y="4" width="1" height="1" fill="#00E0FF" />
      <rect x="3" y="5" width="1" height="1" fill="#00E0FF" />
      <rect x="3" y="6" width="1" height="1" fill="#D66371" />
      <rect x="3" y="7" width="1" height="1" fill="#D66371" />
      <rect x="3" y="8" width="1" height="1" fill="#D66371" />
      <rect x="2" y="8" width="1" height="1" fill="#D66371" />
      <rect x="2" y="7" width="1" height="1" fill="#FF7991" />
      <rect x="2" y="6" width="1" height="1" fill="white" />
      <rect x="2" y="5" width="1" height="1" fill="#00E0FF" />
      <rect x="2" y="4" width="1" height="1" fill="#00E0FF" />
      <rect x="5" y="4" width="1" height="1" fill="#00AEAE" />
      <rect x="5" y="5" width="1" height="1" fill="#00E0FF" />
      <rect x="5" y="6" width="1" height="1" fill="white" />
      <rect x="5" y="7" width="1" height="1" fill="#FF7991" />
      <rect x="5" y="8" width="1" height="1" fill="#D66371" />
      <rect x="6" y="8" width="1" height="1" fill="#D66371" />
      <rect x="6" y="7" width="1" height="1" fill="#D66371" />
      <rect x="6" y="6" width="1" height="1" fill="#FF7991" />
      <rect x="6" y="5" width="1" height="1" fill="#00E0FF" />
      <rect x="7" y="5" width="1" height="1" fill="#00E0FF" />
      <rect x="8" y="5" width="1" height="1" fill="#00E0FF" />
      <rect x="6" y="4" width="1" height="1" fill="#00E0FF" />
      <rect x="3" y="3" width="1" height="1" fill="#00E0FF" />
      <rect x="4" y="3" width="1" height="1" fill="#00E0FF" />
      <rect x="4" y="4" width="1" height="1" fill="#00E0FF" />
      <rect x="4" y="5" width="1" height="1" fill="#00E0FF" />
      <rect x="4" y="6" width="1" height="1" fill="#D66371" />
      <rect x="4" y="7" width="1" height="1" fill="#D66371" />
      <rect x="4" y="8" width="1" height="1" fill="#D66371" />
      <rect x="5" y="3" width="1" height="1" fill="#00E0FF" />
      <rect x="5" y="2" width="1" height="1" fill="#D66371" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 3 2)" fill="#D66371" />
      <rect x="6" y="2" width="1" height="1" fill="#9E2D41" />
      <rect x="6" y="3" width="1" height="1" fill="#9E2D41" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 2)" fill="#9E2D41" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 3)" fill="#9E2D41" />
      <rect x="6" y="1" width="1" height="1" fill="#9E2D41" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 1)" fill="#9E2D41" />
      <rect x="7" y="2" width="1" height="1" fill="#D66371" />
      <rect x="7" y="3" width="1" height="1" fill="#D66371" />
      <rect x="7" y="4" width="1" height="1" fill="#D66371" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 2)" fill="#D66371" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 3)" fill="#D66371" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 4)" fill="#D66371" />
      <rect x="7" y="1" width="1" height="1" fill="#F97E8D" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 1)" fill="#F97E8D" />
      <rect x="6" width="1" height="1" fill="#F97E8D" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 0)" fill="#F97E8D" />
      <rect x="5" y="1" width="1" height="1" fill="#F97E8D" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 3 1)" fill="#F97E8D" />
    </svg>
  );
}

/**
 * Bunny Neon - Neon green and pink bunny
 */
function BunnyNeon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="8" width="1" height="1" fill="#D363D6" />
      <rect x="1" y="7" width="1" height="1" fill="#D363D6" />
      <rect x="1" y="6" width="1" height="1" fill="#FF79C2" />
      <rect x="1" y="5" width="1" height="1" fill="#0EAE00" />
      <rect x="1" y="4" width="1" height="1" fill="#0EAE00" />
      <rect x="2" y="3" width="1" height="1" fill="#0EAE00" />
      <rect x="3" y="4" width="1" height="1" fill="#CCFF00" />
      <rect x="3" y="5" width="1" height="1" fill="#CCFF00" />
      <rect x="3" y="6" width="1" height="1" fill="#D363D6" />
      <rect x="3" y="7" width="1" height="1" fill="#D363D6" />
      <rect x="3" y="8" width="1" height="1" fill="#D363D6" />
      <rect x="2" y="8" width="1" height="1" fill="#D363D6" />
      <rect x="2" y="7" width="1" height="1" fill="#FF79C2" />
      <rect x="2" y="6" width="1" height="1" fill="white" />
      <rect x="2" y="5" width="1" height="1" fill="#CCFF00" />
      <rect x="2" y="4" width="1" height="1" fill="#CCFF00" />
      <rect x="5" y="4" width="1" height="1" fill="white" />
      <rect x="5" y="5" width="1" height="1" fill="#CCFF00" />
      <rect x="5" y="6" width="1" height="1" fill="white" />
      <rect x="5" y="7" width="1" height="1" fill="#FF79C2" />
      <rect x="5" y="8" width="1" height="1" fill="#D363D6" />
      <rect x="6" y="8" width="1" height="1" fill="#D363D6" />
      <rect x="6" y="7" width="1" height="1" fill="#D363D6" />
      <rect x="6" y="6" width="1" height="1" fill="#FF79C2" />
      <rect x="6" y="5" width="1" height="1" fill="#CCFF00" />
      <rect x="7" y="5" width="1" height="1" fill="#CCFF00" />
      <rect x="8" y="5" width="1" height="1" fill="#CCFF00" />
      <rect x="6" y="4" width="1" height="1" fill="#CCFF00" />
      <rect x="3" y="3" width="1" height="1" fill="#CCFF00" />
      <rect x="4" y="3" width="1" height="1" fill="#CCFF00" />
      <rect x="4" y="4" width="1" height="1" fill="#CCFF00" />
      <rect x="4" y="5" width="1" height="1" fill="#CCFF00" />
      <rect x="4" y="6" width="1" height="1" fill="#D363D6" />
      <rect x="4" y="7" width="1" height="1" fill="#D363D6" />
      <rect x="4" y="8" width="1" height="1" fill="#D363D6" />
      <rect x="5" y="3" width="1" height="1" fill="#CCFF00" />
      <rect x="5" y="2" width="1" height="1" fill="#D363D6" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 3 2)" fill="#D363D6" />
      <rect x="6" y="2" width="1" height="1" fill="#9E2D99" />
      <rect x="6" y="3" width="1" height="1" fill="#9E2D99" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 2)" fill="#9E2D99" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 3)" fill="#9E2D99" />
      <rect x="6" y="1" width="1" height="1" fill="#9E2D99" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 1)" fill="#9E2D99" />
      <rect x="7" y="2" width="1" height="1" fill="#D363D6" />
      <rect x="7" y="3" width="1" height="1" fill="#D363D6" />
      <rect x="7" y="4" width="1" height="1" fill="#D363D6" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 2)" fill="#D363D6" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 3)" fill="#D363D6" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 4)" fill="#D363D6" />
      <rect x="7" y="1" width="1" height="1" fill="#F67EF9" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 1)" fill="#F67EF9" />
      <rect x="6" width="1" height="1" fill="#F67EF9" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 0)" fill="#F67EF9" />
      <rect x="5" y="1" width="1" height="1" fill="#F67EF9" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 3 1)" fill="#F67EF9" />
    </svg>
  );
}

/**
 * Bunny Red - Red bunny (same as original for now)
 */
function BunnyRed() {
  return <BunnyOriginal />;
}

/**
 * Bunny Green - Green bunny (same as original for now)
 */
function BunnyGreen() {
  return <BunnyOriginal />;
}

/**
 * Bunny Orange - Orange bunny
 */
function BunnyOrange() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="8" width="1" height="1" fill="#E9A800" />
      <rect x="1" y="7" width="1" height="1" fill="#E9A800" />
      <rect x="1" y="6" width="1" height="1" fill="#FFC279" />
      <rect x="1" y="5" width="1" height="1" fill="#1F1F1F" />
      <rect x="1" y="4" width="1" height="1" fill="#1F1F1F" />
      <rect x="2" y="3" width="1" height="1" fill="#1F1F1F" />
      <rect x="3" y="4" width="1" height="1" fill="#292929" />
      <rect x="3" y="5" width="1" height="1" fill="#292929" />
      <rect x="3" y="6" width="1" height="1" fill="#E9A800" />
      <rect x="3" y="7" width="1" height="1" fill="#E9A800" />
      <rect x="3" y="8" width="1" height="1" fill="#E9A800" />
      <rect x="2" y="8" width="1" height="1" fill="#E9A800" />
      <rect x="2" y="7" width="1" height="1" fill="#FFC279" />
      <rect x="2" y="6" width="1" height="1" fill="black" />
      <rect x="2" y="5" width="1" height="1" fill="#292929" />
      <rect x="2" y="4" width="1" height="1" fill="#292929" />
      <rect x="5" y="4" width="1" height="1" fill="#FB0707" />
      <rect x="5" y="5" width="1" height="1" fill="#292929" />
      <rect x="5" y="6" width="1" height="1" fill="black" />
      <rect x="5" y="7" width="1" height="1" fill="#FFC279" />
      <rect x="5" y="8" width="1" height="1" fill="#E9A800" />
      <rect x="6" y="8" width="1" height="1" fill="#E9A800" />
      <rect x="6" y="7" width="1" height="1" fill="#E9A800" />
      <rect x="6" y="6" width="1" height="1" fill="#FFC279" />
      <rect x="6" y="5" width="1" height="1" fill="#292929" />
      <rect x="7" y="5" width="1" height="1" fill="#292929" />
      <rect x="8" y="5" width="1" height="1" fill="#292929" />
      <rect x="6" y="4" width="1" height="1" fill="#292929" />
      <rect x="3" y="3" width="1" height="1" fill="#292929" />
      <rect x="4" y="3" width="1" height="1" fill="#292929" />
      <rect x="4" y="4" width="1" height="1" fill="#292929" />
      <rect x="4" y="5" width="1" height="1" fill="#292929" />
      <rect x="4" y="6" width="1" height="1" fill="#E9A800" />
      <rect x="4" y="7" width="1" height="1" fill="#E9A800" />
      <rect x="4" y="8" width="1" height="1" fill="#E9A800" />
      <rect x="5" y="3" width="1" height="1" fill="#292929" />
      <rect x="5" y="2" width="1" height="1" fill="#E9A800" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 3 2)" fill="#E9A800" />
      <rect x="6" y="2" width="1" height="1" fill="#D78100" />
      <rect x="6" y="3" width="1" height="1" fill="#D78100" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 2)" fill="#D78100" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 3)" fill="#D78100" />
      <rect x="6" y="1" width="1" height="1" fill="#D78100" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 1)" fill="#D78100" />
      <rect x="7" y="2" width="1" height="1" fill="#E9A800" />
      <rect x="7" y="3" width="1" height="1" fill="#E9A800" />
      <rect x="7" y="4" width="1" height="1" fill="#E9A800" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 2)" fill="#E9A800" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 3)" fill="#E9A800" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 4)" fill="#E9A800" />
      <rect x="7" y="1" width="1" height="1" fill="#F9C87E" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 1)" fill="#F9C87E" />
      <rect x="6" width="1" height="1" fill="#F9C87E" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 0)" fill="#F9C87E" />
      <rect x="5" y="1" width="1" height="1" fill="#F9C87E" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 3 1)" fill="#F9C87E" />
    </svg>
  );
}

// ============================================================================
// APPLES
// ============================================================================

/**
 * Apple Orange - Orange apple
 */
function AppleOrange() {
  return (
    <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="8" width="1" height="1" fill="#111111" />
      <rect x="2" y="7" width="1" height="1" fill="#111111" />
      <rect x="2" y="6" width="1" height="1" fill="#111111" />
      <rect x="2" y="5" width="1" height="1" fill="#040704" />
      <rect x="2" y="4" width="1" height="1" fill="#64401B" />
      <rect x="2" y="3" width="1" height="1" fill="black" />
      <rect x="2" y="2" width="1" height="1" fill="#111111" />
      <rect x="3" y="3" width="1" height="1" fill="#111111" />
      <rect x="4" y="4" width="1" height="1" fill="#111111" />
      <rect x="4" y="5" width="1" height="1" fill="#111111" />
      <rect x="4" y="6" width="1" height="1" fill="#040704" />
      <rect x="4" y="7" width="1" height="1" fill="#262626" />
      <rect x="4" y="8" width="1" height="1" fill="#64401B" />
      <rect x="3" y="8" width="1" height="1" fill="#111111" />
      <rect x="3" y="7" width="1" height="1" fill="#262626" />
      <rect x="3" y="6" width="1" height="1" fill="#262626" />
      <rect x="3" y="5" width="1" height="1" fill="#FF3D00" />
      <rect x="3" y="4" width="1" height="1" fill="#040704" />
      <rect x="6" y="4" width="1" height="1" fill="#040704" />
      <rect x="6" y="5" width="1" height="1" fill="#FF3D00" />
      <rect x="6" y="6" width="1" height="1" fill="#262626" />
      <rect x="6" y="7" width="1" height="1" fill="#262626" />
      <rect x="6" y="8" width="1" height="1" fill="#111111" />
      <rect x="7" y="8" width="1" height="1" fill="#111111" />
      <rect x="7" y="7" width="1" height="1" fill="#111111" />
      <rect x="7" y="6" width="1" height="1" fill="#111111" />
      <rect x="7" y="5" width="1" height="1" fill="#040704" />
      <rect x="7" y="4" width="1" height="1" fill="#64401B" />
      <rect x="7" y="3" width="1" height="1" fill="black" />
      <rect x="4" y="3" width="1" height="1" fill="#111111" />
      <rect x="4" y="2" width="1" height="1" fill="#181818" />
      <rect x="5" y="2" width="1" height="1" fill="#181818" />
      <rect x="5" y="3" width="1" height="1" fill="#111111" />
      <rect x="5" y="4" width="1" height="1" fill="#111111" />
      <rect x="5" y="5" width="1" height="1" fill="#111111" />
      <rect x="5" y="6" width="1" height="1" fill="#040704" />
      <rect x="5" y="7" width="1" height="1" fill="#262626" />
      <rect x="5" y="8" width="1" height="1" fill="#64401B" />
      <rect x="6" y="3" width="1" height="1" fill="#111111" />
      <rect x="7" y="2" width="1" height="1" fill="#111111" />
      <rect x="7" y="1" width="1" height="1" fill="#181818" />
      <rect x="7" width="1" height="1" fill="#181818" />
      <rect x="8" y="2" width="1" height="1" fill="#111111" />
      <rect x="8" y="4" width="1" height="1" fill="#111111" />
      <rect x="8" y="3" width="1" height="1" fill="#111111" />
      <rect x="2" y="1" width="1" height="1" fill="#181818" />
      <rect x="2" width="1" height="1" fill="#181818" />
      <rect x="1" y="2" width="1" height="1" fill="#111111" />
      <rect x="1" y="3" width="1" height="1" fill="#111111" />
      <rect x="1" y="4" width="1" height="1" fill="#111111" />
    </svg>
  );
}

/**
 * Apple Red - Red apple
 */
function AppleRed() {
  return (
    <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="8" width="1" height="1" fill="#111111" />
      <rect x="2" y="7" width="1" height="1" fill="#111111" />
      <rect x="2" y="6" width="1" height="1" fill="#111111" />
      <rect x="2" y="5" width="1" height="1" fill="#040704" />
      <rect x="2" y="4" width="1" height="1" fill="#64401B" />
      <rect x="2" y="3" width="1" height="1" fill="black" />
      <rect x="2" y="2" width="1" height="1" fill="#111111" />
      <rect x="3" y="3" width="1" height="1" fill="#111111" />
      <rect x="4" y="4" width="1" height="1" fill="#111111" />
      <rect x="4" y="5" width="1" height="1" fill="#111111" />
      <rect x="4" y="6" width="1" height="1" fill="#040704" />
      <rect x="4" y="7" width="1" height="1" fill="#262626" />
      <rect x="4" y="8" width="1" height="1" fill="#64401B" />
      <rect x="3" y="8" width="1" height="1" fill="#111111" />
      <rect x="3" y="7" width="1" height="1" fill="#262626" />
      <rect x="3" y="6" width="1" height="1" fill="#262626" />
      <rect x="3" y="5" width="1" height="1" fill="#FF0000" />
      <rect x="3" y="4" width="1" height="1" fill="#040704" />
      <rect x="6" y="4" width="1" height="1" fill="#040704" />
      <rect x="6" y="5" width="1" height="1" fill="#FF0000" />
      <rect x="6" y="6" width="1" height="1" fill="#262626" />
      <rect x="6" y="7" width="1" height="1" fill="#262626" />
      <rect x="6" y="8" width="1" height="1" fill="#111111" />
      <rect x="7" y="8" width="1" height="1" fill="#111111" />
      <rect x="7" y="7" width="1" height="1" fill="#111111" />
      <rect x="7" y="6" width="1" height="1" fill="#111111" />
      <rect x="7" y="5" width="1" height="1" fill="#040704" />
      <rect x="7" y="4" width="1" height="1" fill="#64401B" />
      <rect x="7" y="3" width="1" height="1" fill="black" />
      <rect x="4" y="3" width="1" height="1" fill="#111111" />
      <rect x="4" y="2" width="1" height="1" fill="#181818" />
      <rect x="5" y="2" width="1" height="1" fill="#181818" />
      <rect x="5" y="3" width="1" height="1" fill="#111111" />
      <rect x="5" y="4" width="1" height="1" fill="#111111" />
      <rect x="5" y="5" width="1" height="1" fill="#111111" />
      <rect x="5" y="6" width="1" height="1" fill="#040704" />
      <rect x="5" y="7" width="1" height="1" fill="#262626" />
      <rect x="5" y="8" width="1" height="1" fill="#64401B" />
      <rect x="6" y="3" width="1" height="1" fill="#111111" />
      <rect x="7" y="2" width="1" height="1" fill="#111111" />
      <rect x="7" y="1" width="1" height="1" fill="#181818" />
      <rect x="7" width="1" height="1" fill="#181818" />
      <rect x="8" y="2" width="1" height="1" fill="#111111" />
      <rect x="8" y="4" width="1" height="1" fill="#111111" />
      <rect x="8" y="3" width="1" height="1" fill="#111111" />
      <rect x="2" y="1" width="1" height="1" fill="#181818" />
      <rect x="2" width="1" height="1" fill="#181818" />
      <rect x="1" y="2" width="1" height="1" fill="#111111" />
      <rect x="1" y="3" width="1" height="1" fill="#111111" />
      <rect x="1" y="4" width="1" height="1" fill="#111111" />
    </svg>
  );
}

/**
 * Apple Cyan - Cyan apple
 */
function AppleCyan() {
  return (
    <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="8" width="1" height="1" fill="#111111" />
      <rect x="2" y="7" width="1" height="1" fill="#111111" />
      <rect x="2" y="6" width="1" height="1" fill="#111111" />
      <rect x="2" y="5" width="1" height="1" fill="#040704" />
      <rect x="2" y="4" width="1" height="1" fill="#64401B" />
      <rect x="2" y="3" width="1" height="1" fill="black" />
      <rect x="2" y="2" width="1" height="1" fill="#111111" />
      <rect x="3" y="3" width="1" height="1" fill="#111111" />
      <rect x="4" y="4" width="1" height="1" fill="#111111" />
      <rect x="4" y="5" width="1" height="1" fill="#111111" />
      <rect x="4" y="6" width="1" height="1" fill="#040704" />
      <rect x="4" y="7" width="1" height="1" fill="#262626" />
      <rect x="4" y="8" width="1" height="1" fill="#64401B" />
      <rect x="3" y="8" width="1" height="1" fill="#111111" />
      <rect x="3" y="7" width="1" height="1" fill="#262626" />
      <rect x="3" y="6" width="1" height="1" fill="#262626" />
      <rect x="3" y="5" width="1" height="1" fill="#00D1FF" />
      <rect x="3" y="4" width="1" height="1" fill="#040704" />
      <rect x="6" y="4" width="1" height="1" fill="#040704" />
      <rect x="6" y="5" width="1" height="1" fill="#00D1FF" />
      <rect x="6" y="6" width="1" height="1" fill="#262626" />
      <rect x="6" y="7" width="1" height="1" fill="#262626" />
      <rect x="6" y="8" width="1" height="1" fill="#111111" />
      <rect x="7" y="8" width="1" height="1" fill="#111111" />
      <rect x="7" y="7" width="1" height="1" fill="#111111" />
      <rect x="7" y="6" width="1" height="1" fill="#111111" />
      <rect x="7" y="5" width="1" height="1" fill="#040704" />
      <rect x="7" y="4" width="1" height="1" fill="#64401B" />
      <rect x="7" y="3" width="1" height="1" fill="black" />
      <rect x="4" y="3" width="1" height="1" fill="#111111" />
      <rect x="4" y="2" width="1" height="1" fill="#181818" />
      <rect x="5" y="2" width="1" height="1" fill="#181818" />
      <rect x="5" y="3" width="1" height="1" fill="#111111" />
      <rect x="5" y="4" width="1" height="1" fill="#111111" />
      <rect x="5" y="5" width="1" height="1" fill="#111111" />
      <rect x="5" y="6" width="1" height="1" fill="#040704" />
      <rect x="5" y="7" width="1" height="1" fill="#262626" />
      <rect x="5" y="8" width="1" height="1" fill="#64401B" />
      <rect x="6" y="3" width="1" height="1" fill="#111111" />
      <rect x="7" y="2" width="1" height="1" fill="#111111" />
      <rect x="7" y="1" width="1" height="1" fill="#181818" />
      <rect x="7" width="1" height="1" fill="#181818" />
      <rect x="8" y="2" width="1" height="1" fill="#111111" />
      <rect x="8" y="4" width="1" height="1" fill="#111111" />
      <rect x="8" y="3" width="1" height="1" fill="#111111" />
      <rect x="2" y="1" width="1" height="1" fill="#181818" />
      <rect x="2" width="1" height="1" fill="#181818" />
      <rect x="1" y="2" width="1" height="1" fill="#111111" />
      <rect x="1" y="3" width="1" height="1" fill="#111111" />
      <rect x="1" y="4" width="1" height="1" fill="#111111" />
    </svg>
  );
}

/**
 * Apple Green - Green apple
 */
function AppleGreen() {
  return (
    <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="8" width="1" height="1" fill="#111111" />
      <rect x="2" y="7" width="1" height="1" fill="#111111" />
      <rect x="2" y="6" width="1" height="1" fill="#111111" />
      <rect x="2" y="5" width="1" height="1" fill="#040704" />
      <rect x="2" y="4" width="1" height="1" fill="#64401B" />
      <rect x="2" y="3" width="1" height="1" fill="black" />
      <rect x="2" y="2" width="1" height="1" fill="#111111" />
      <rect x="3" y="3" width="1" height="1" fill="#111111" />
      <rect x="4" y="4" width="1" height="1" fill="#111111" />
      <rect x="4" y="5" width="1" height="1" fill="#111111" />
      <rect x="4" y="6" width="1" height="1" fill="#040704" />
      <rect x="4" y="7" width="1" height="1" fill="#262626" />
      <rect x="4" y="8" width="1" height="1" fill="#64401B" />
      <rect x="3" y="8" width="1" height="1" fill="#111111" />
      <rect x="3" y="7" width="1" height="1" fill="#262626" />
      <rect x="3" y="6" width="1" height="1" fill="#262626" />
      <rect x="3" y="5" width="1" height="1" fill="#00FF1A" />
      <rect x="3" y="4" width="1" height="1" fill="#040704" />
      <rect x="6" y="4" width="1" height="1" fill="#040704" />
      <rect x="6" y="5" width="1" height="1" fill="#00FF1A" />
      <rect x="6" y="6" width="1" height="1" fill="#262626" />
      <rect x="6" y="7" width="1" height="1" fill="#262626" />
      <rect x="6" y="8" width="1" height="1" fill="#111111" />
      <rect x="7" y="8" width="1" height="1" fill="#111111" />
      <rect x="7" y="7" width="1" height="1" fill="#111111" />
      <rect x="7" y="6" width="1" height="1" fill="#111111" />
      <rect x="7" y="5" width="1" height="1" fill="#040704" />
      <rect x="7" y="4" width="1" height="1" fill="#64401B" />
      <rect x="7" y="3" width="1" height="1" fill="black" />
      <rect x="4" y="3" width="1" height="1" fill="#111111" />
      <rect x="4" y="2" width="1" height="1" fill="#181818" />
      <rect x="5" y="2" width="1" height="1" fill="#181818" />
      <rect x="5" y="3" width="1" height="1" fill="#111111" />
      <rect x="5" y="4" width="1" height="1" fill="#111111" />
      <rect x="5" y="5" width="1" height="1" fill="#111111" />
      <rect x="5" y="6" width="1" height="1" fill="#040704" />
      <rect x="5" y="7" width="1" height="1" fill="#262626" />
      <rect x="5" y="8" width="1" height="1" fill="#64401B" />
      <rect x="6" y="3" width="1" height="1" fill="#111111" />
      <rect x="7" y="2" width="1" height="1" fill="#111111" />
      <rect x="7" y="1" width="1" height="1" fill="#181818" />
      <rect x="7" width="1" height="1" fill="#181818" />
      <rect x="8" y="2" width="1" height="1" fill="#111111" />
      <rect x="8" y="4" width="1" height="1" fill="#111111" />
      <rect x="8" y="3" width="1" height="1" fill="#111111" />
      <rect x="2" y="1" width="1" height="1" fill="#181818" />
      <rect x="2" width="1" height="1" fill="#181818" />
      <rect x="1" y="2" width="1" height="1" fill="#111111" />
      <rect x="1" y="3" width="1" height="1" fill="#111111" />
      <rect x="1" y="4" width="1" height="1" fill="#111111" />
    </svg>
  );
}

// ============================================================================
// GHOST VARIANTS
// ============================================================================

/**
 * Ghost Bunny - Ghostly white and cyan bunny
 */
function GhostBunny() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="8" width="1" height="1" fill="#DCE4E4" />
      <rect x="1" y="7" width="1" height="1" fill="#DCE4E4" />
      <rect x="1" y="6" width="1" height="1" fill="#F6F6F6" />
      <rect x="1" y="5" width="1" height="1" fill="#C4FDFB" />
      <rect x="1" y="4" width="1" height="1" fill="#C4FDFB" />
      <rect x="2" y="3" width="1" height="1" fill="#C4FDFB" />
      <rect x="3" y="4" width="1" height="1" fill="#E3FFFE" />
      <rect x="3" y="5" width="1" height="1" fill="#E3FFFE" />
      <rect x="3" y="6" width="1" height="1" fill="#DCE4E4" />
      <rect x="3" y="7" width="1" height="1" fill="#DCE4E4" />
      <rect x="3" y="8" width="1" height="1" fill="#DCE4E4" />
      <rect x="2" y="8" width="1" height="1" fill="#DCE4E4" />
      <rect x="2" y="7" width="1" height="1" fill="#F6F6F6" />
      <rect x="2" y="6" width="1" height="1" fill="#00FFFF" />
      <rect x="2" y="5" width="1" height="1" fill="#E3FFFE" />
      <rect x="2" y="4" width="1" height="1" fill="#E3FFFE" />
      <rect x="5" y="4" width="1" height="1" fill="white" />
      <rect x="5" y="5" width="1" height="1" fill="#E3FFFE" />
      <rect x="5" y="6" width="1" height="1" fill="#00FFFF" />
      <rect x="5" y="7" width="1" height="1" fill="#F6F6F6" />
      <rect x="5" y="8" width="1" height="1" fill="#DCE4E4" />
      <rect x="6" y="8" width="1" height="1" fill="#DCE4E4" />
      <rect x="6" y="7" width="1" height="1" fill="#DCE4E4" />
      <rect x="6" y="6" width="1" height="1" fill="#F6F6F6" />
      <rect x="6" y="5" width="1" height="1" fill="#E3FFFE" />
      <rect x="7" y="5" width="1" height="1" fill="#E3FFFE" />
      <rect x="8" y="5" width="1" height="1" fill="#E3FFFE" />
      <rect x="6" y="4" width="1" height="1" fill="#E3FFFE" />
      <rect x="3" y="3" width="1" height="1" fill="#E3FFFE" />
      <rect x="4" y="3" width="1" height="1" fill="#E3FFFE" />
      <rect x="4" y="4" width="1" height="1" fill="#E3FFFE" />
      <rect x="4" y="5" width="1" height="1" fill="#E3FFFE" />
      <rect x="4" y="6" width="1" height="1" fill="#DCE4E4" />
      <rect x="4" y="7" width="1" height="1" fill="#DCE4E4" />
      <rect x="4" y="8" width="1" height="1" fill="#DCE4E4" />
      <rect x="5" y="3" width="1" height="1" fill="#E3FFFE" />
      <rect x="5" y="2" width="1" height="1" fill="#DCE4E4" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 3 2)" fill="#DCE4E4" />
      <rect x="6" y="2" width="1" height="1" fill="#B6DFDF" />
      <rect x="6" y="3" width="1" height="1" fill="#B6DFDF" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 2)" fill="#B6DFDF" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 3)" fill="#B6DFDF" />
      <rect x="6" y="1" width="1" height="1" fill="#DCE4E4" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 1)" fill="#DCE4E4" />
      <rect x="7" y="2" width="1" height="1" fill="#DCE4E4" />
      <rect x="7" y="3" width="1" height="1" fill="#DCE4E4" />
      <rect x="7" y="4" width="1" height="1" fill="#DCE4E4" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 2)" fill="#DCE4E4" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 3)" fill="#DCE4E4" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 4)" fill="#DCE4E4" />
      <rect x="7" y="1" width="1" height="1" fill="white" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 1 1)" fill="white" />
      <rect x="6" width="1" height="1" fill="white" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 2 0)" fill="white" />
      <rect x="5" y="1" width="1" height="1" fill="white" />
      <rect width="1" height="1" transform="matrix(-1 0 0 1 3 1)" fill="white" />
    </svg>
  );
}

/**
 * Ghost Cat - Ghostly white cat with cyan eyes
 */
function GhostCat() {
  return (
    <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="7" width="1" height="1" fill="#DCE4E4" />
      <rect y="6" width="1" height="1" fill="#DCE4E4" />
      <rect y="5" width="1" height="1" fill="#DCE4E4" />
      <rect y="4" width="1" height="1" fill="#DCE4E4" />
      <rect y="3" width="1" height="1" fill="#DCE4E4" />
      <rect y="2" width="1" height="1" fill="#F6F6F6" />
      <rect y="1" width="1" height="1" fill="#F6F6F6" />
      <rect x="1" y="2" width="1" height="1" fill="#DCE4E4" />
      <rect x="2" y="3" width="1" height="1" fill="#DCE4E4" />
      <rect x="2" y="4" width="1" height="1" fill="#DCE4E4" />
      <rect x="2" y="5" width="1" height="1" fill="#F6F6F6" />
      <rect x="2" y="6" width="1" height="1" fill="#DCE4E4" />
      <rect x="2" y="7" width="1" height="1" fill="#DCE4E4" />
      <rect x="1" y="7" width="1" height="1" fill="#DCE4E4" />
      <rect x="1" y="6" width="1" height="1" fill="#F6F6F6" />
      <rect x="1" y="5" width="1" height="1" fill="#DCE4E4" />
      <rect x="1" y="4" width="1" height="1" fill="#00FFFF" />
      <rect x="1" y="3" width="1" height="1" fill="#DCE4E4" />
      <rect x="4" y="3" width="1" height="1" fill="#DCE4E4" />
      <rect x="4" y="4" width="1" height="1" fill="#00FFFF" />
      <rect x="4" y="5" width="1" height="1" fill="#DCE4E4" />
      <rect x="4" y="6" width="1" height="1" fill="#F6F6F6" />
      <rect x="4" y="7" width="1" height="1" fill="#DCE4E4" />
      <rect x="5" y="7" width="1" height="1" fill="#DCE4E4" />
      <rect x="5" y="6" width="1" height="1" fill="#DCE4E4" />
      <rect x="5" y="5" width="1" height="1" fill="#DCE4E4" />
      <rect x="5" y="4" width="1" height="1" fill="#DCE4E4" />
      <rect x="5" y="3" width="1" height="1" fill="#DCE4E4" />
      <rect x="5" y="2" width="1" height="1" fill="#F6F6F6" />
      <rect x="2" y="2" width="1" height="1" fill="#DCE4E4" />
      <rect x="2" y="1" width="1" height="1" fill="#DCE4E4" />
      <rect x="3" y="1" width="1" height="1" fill="#DCE4E4" />
      <rect x="3" y="2" width="1" height="1" fill="#DCE4E4" />
      <rect x="3" y="3" width="1" height="1" fill="#DCE4E4" />
      <rect x="3" y="4" width="1" height="1" fill="#DCE4E4" />
      <rect x="3" y="5" width="1" height="1" fill="#F6F6F6" />
      <rect x="3" y="6" width="1" height="1" fill="#DCE4E4" />
      <rect x="3" y="7" width="1" height="1" fill="#DCE4E4" />
      <rect x="4" y="2" width="1" height="1" fill="#DCE4E4" />
      <rect x="5" y="1" width="1" height="1" fill="#F6F6F6" />
      <rect x="5" width="1" height="1" fill="#DCE4E4" />
      <rect width="1" height="1" fill="#DCE4E4" />
    </svg>
  );
}

// ============================================================================
// WOODLAND & POND ANIMALS
// ============================================================================

function PenguinSnow() {
  return (
    <PixelSprite
      width={8}
      height={9}
      pixels={[
        { x: 2, y: 0, fill: "#2B3548" },
        { x: 5, y: 0, fill: "#2B3548" },
        { x: 1, y: 1, fill: "#2B3548" },
        { x: 2, y: 1, fill: "#5E6C86" },
        { x: 3, y: 1, fill: "#2B3548" },
        { x: 4, y: 1, fill: "#2B3548" },
        { x: 5, y: 1, fill: "#5E6C86" },
        { x: 6, y: 1, fill: "#2B3548" },
        { x: 1, y: 2, fill: "#2B3548" },
        { x: 2, y: 2, fill: "#F6F6F6" },
        { x: 3, y: 2, fill: "#F6F6F6" },
        { x: 4, y: 2, fill: "#F6F6F6" },
        { x: 5, y: 2, fill: "#F6F6F6" },
        { x: 6, y: 2, fill: "#2B3548" },
        { x: 0, y: 3, fill: "#2B3548" },
        { x: 1, y: 3, fill: "#2B3548" },
        { x: 2, y: 3, fill: "#F6F6F6" },
        { x: 3, y: 3, fill: "#1A1A1A" },
        { x: 4, y: 3, fill: "#1A1A1A" },
        { x: 5, y: 3, fill: "#F6F6F6" },
        { x: 6, y: 3, fill: "#2B3548" },
        { x: 7, y: 3, fill: "#2B3548" },
        { x: 0, y: 4, fill: "#2B3548" },
        { x: 1, y: 4, fill: "#F6F6F6" },
        { x: 2, y: 4, fill: "#F6F6F6" },
        { x: 3, y: 4, fill: "#FFB347" },
        { x: 4, y: 4, fill: "#F6F6F6" },
        { x: 5, y: 4, fill: "#F6F6F6" },
        { x: 6, y: 4, fill: "#F6F6F6" },
        { x: 7, y: 4, fill: "#2B3548" },
        { x: 1, y: 5, fill: "#2B3548" },
        { x: 2, y: 5, fill: "#F6F6F6" },
        { x: 3, y: 5, fill: "#F6F6F6" },
        { x: 4, y: 5, fill: "#F6F6F6" },
        { x: 5, y: 5, fill: "#F6F6F6" },
        { x: 6, y: 5, fill: "#2B3548" },
        { x: 2, y: 6, fill: "#2B3548" },
        { x: 3, y: 6, fill: "#F6F6F6" },
        { x: 4, y: 6, fill: "#F6F6F6" },
        { x: 5, y: 6, fill: "#2B3548" },
        { x: 2, y: 7, fill: "#FF8C42" },
        { x: 3, y: 7, fill: "#2B3548" },
        { x: 4, y: 7, fill: "#2B3548" },
        { x: 5, y: 7, fill: "#FF8C42" },
        { x: 2, y: 8, fill: "#FF8C42" },
        { x: 5, y: 8, fill: "#FF8C42" },
      ]}
    />
  );
}

function FrogLily() {
  return (
    <PixelSprite
      width={8}
      height={8}
      pixels={[
        { x: 1, y: 0, fill: "#6AA84F" },
        { x: 2, y: 0, fill: "#EBFF00" },
        { x: 5, y: 0, fill: "#EBFF00" },
        { x: 6, y: 0, fill: "#6AA84F" },
        { x: 0, y: 1, fill: "#6AA84F" },
        { x: 1, y: 1, fill: "#8FD16A" },
        { x: 2, y: 1, fill: "#212121" },
        { x: 3, y: 1, fill: "#6AA84F" },
        { x: 4, y: 1, fill: "#6AA84F" },
        { x: 5, y: 1, fill: "#212121" },
        { x: 6, y: 1, fill: "#8FD16A" },
        { x: 7, y: 1, fill: "#6AA84F" },
        { x: 0, y: 2, fill: "#6AA84F" },
        { x: 1, y: 2, fill: "#8FD16A" },
        { x: 2, y: 2, fill: "#8FD16A" },
        { x: 3, y: 2, fill: "#6AA84F" },
        { x: 4, y: 2, fill: "#6AA84F" },
        { x: 5, y: 2, fill: "#8FD16A" },
        { x: 6, y: 2, fill: "#8FD16A" },
        { x: 7, y: 2, fill: "#6AA84F" },
        { x: 1, y: 3, fill: "#6AA84F" },
        { x: 2, y: 3, fill: "#8FD16A" },
        { x: 3, y: 3, fill: "#C9F3A0" },
        { x: 4, y: 3, fill: "#C9F3A0" },
        { x: 5, y: 3, fill: "#8FD16A" },
        { x: 6, y: 3, fill: "#6AA84F" },
        { x: 1, y: 4, fill: "#6AA84F" },
        { x: 2, y: 4, fill: "#8FD16A" },
        { x: 3, y: 4, fill: "#6AA84F" },
        { x: 4, y: 4, fill: "#6AA84F" },
        { x: 5, y: 4, fill: "#8FD16A" },
        { x: 6, y: 4, fill: "#6AA84F" },
        { x: 2, y: 5, fill: "#6AA84F" },
        { x: 3, y: 5, fill: "#8FD16A" },
        { x: 4, y: 5, fill: "#8FD16A" },
        { x: 5, y: 5, fill: "#6AA84F" },
        { x: 1, y: 6, fill: "#6AA84F" },
        { x: 2, y: 6, fill: "#6AA84F" },
        { x: 5, y: 6, fill: "#6AA84F" },
        { x: 6, y: 6, fill: "#6AA84F" },
        { x: 0, y: 7, fill: "#6AA84F" },
        { x: 2, y: 7, fill: "#6AA84F" },
        { x: 5, y: 7, fill: "#6AA84F" },
        { x: 7, y: 7, fill: "#6AA84F" },
      ]}
    />
  );
}

function OwlNight() {
  return (
    <PixelSprite
      width={8}
      height={8}
      pixels={[
        { x: 2, y: 0, fill: "#5B3A29" },
        { x: 5, y: 0, fill: "#5B3A29" },
        { x: 1, y: 1, fill: "#5B3A29" },
        { x: 2, y: 1, fill: "#8A5B3D" },
        { x: 3, y: 1, fill: "#5B3A29" },
        { x: 4, y: 1, fill: "#5B3A29" },
        { x: 5, y: 1, fill: "#8A5B3D" },
        { x: 6, y: 1, fill: "#5B3A29" },
        { x: 0, y: 2, fill: "#5B3A29" },
        { x: 1, y: 2, fill: "#8A5B3D" },
        { x: 2, y: 2, fill: "#F4D35E" },
        { x: 3, y: 2, fill: "#212121" },
        { x: 4, y: 2, fill: "#212121" },
        { x: 5, y: 2, fill: "#F4D35E" },
        { x: 6, y: 2, fill: "#8A5B3D" },
        { x: 7, y: 2, fill: "#5B3A29" },
        { x: 0, y: 3, fill: "#5B3A29" },
        { x: 1, y: 3, fill: "#8A5B3D" },
        { x: 2, y: 3, fill: "#F6F6F6" },
        { x: 3, y: 3, fill: "#FFB347" },
        { x: 4, y: 3, fill: "#FFB347" },
        { x: 5, y: 3, fill: "#F6F6F6" },
        { x: 6, y: 3, fill: "#8A5B3D" },
        { x: 7, y: 3, fill: "#5B3A29" },
        { x: 1, y: 4, fill: "#5B3A29" },
        { x: 2, y: 4, fill: "#F6F6F6" },
        { x: 3, y: 4, fill: "#F6F6F6" },
        { x: 4, y: 4, fill: "#F6F6F6" },
        { x: 5, y: 4, fill: "#F6F6F6" },
        { x: 6, y: 4, fill: "#5B3A29" },
        { x: 1, y: 5, fill: "#5B3A29" },
        { x: 2, y: 5, fill: "#8A5B3D" },
        { x: 3, y: 5, fill: "#F6F6F6" },
        { x: 4, y: 5, fill: "#F6F6F6" },
        { x: 5, y: 5, fill: "#8A5B3D" },
        { x: 6, y: 5, fill: "#5B3A29" },
        { x: 2, y: 6, fill: "#5B3A29" },
        { x: 3, y: 6, fill: "#8A5B3D" },
        { x: 4, y: 6, fill: "#8A5B3D" },
        { x: 5, y: 6, fill: "#5B3A29" },
        { x: 2, y: 7, fill: "#FFB347" },
        { x: 5, y: 7, fill: "#FFB347" },
      ]}
    />
  );
}

function FoxEmber() {
  return (
    <PixelSprite
      width={10}
      height={7}
      pixels={[
        { x: 1, y: 0, fill: "#D53E00" },
        { x: 2, y: 0, fill: "#FF8718" },
        { x: 7, y: 0, fill: "#FF8718" },
        { x: 8, y: 0, fill: "#D53E00" },
        { x: 0, y: 1, fill: "#D53E00" },
        { x: 1, y: 1, fill: "#FF8718" },
        { x: 2, y: 1, fill: "#F6F6F6" },
        { x: 3, y: 1, fill: "#D53E00" },
        { x: 4, y: 1, fill: "#FF8718" },
        { x: 5, y: 1, fill: "#FF8718" },
        { x: 6, y: 1, fill: "#D53E00" },
        { x: 7, y: 1, fill: "#F6F6F6" },
        { x: 8, y: 1, fill: "#FF8718" },
        { x: 9, y: 1, fill: "#D53E00" },
        { x: 1, y: 2, fill: "#D53E00" },
        { x: 2, y: 2, fill: "#FF8718" },
        { x: 3, y: 2, fill: "#F6F6F6" },
        { x: 4, y: 2, fill: "#212121" },
        { x: 5, y: 2, fill: "#212121" },
        { x: 6, y: 2, fill: "#F6F6F6" },
        { x: 7, y: 2, fill: "#FF8718" },
        { x: 8, y: 2, fill: "#D53E00" },
        { x: 2, y: 3, fill: "#D53E00" },
        { x: 3, y: 3, fill: "#FF8718" },
        { x: 4, y: 3, fill: "#F6F6F6" },
        { x: 5, y: 3, fill: "#F6F6F6" },
        { x: 6, y: 3, fill: "#FF8718" },
        { x: 7, y: 3, fill: "#D53E00" },
        { x: 1, y: 4, fill: "#D53E00" },
        { x: 2, y: 4, fill: "#FF8718" },
        { x: 3, y: 4, fill: "#FF8718" },
        { x: 4, y: 4, fill: "#F6F6F6" },
        { x: 5, y: 4, fill: "#F6F6F6" },
        { x: 6, y: 4, fill: "#FF8718" },
        { x: 7, y: 4, fill: "#FF8718" },
        { x: 8, y: 4, fill: "#D53E00" },
        { x: 1, y: 5, fill: "#473321" },
        { x: 2, y: 5, fill: "#D53E00" },
        { x: 3, y: 5, fill: "#FF8718" },
        { x: 4, y: 5, fill: "#FF8718" },
        { x: 5, y: 5, fill: "#FF8718" },
        { x: 6, y: 5, fill: "#FF8718" },
        { x: 7, y: 5, fill: "#D53E00" },
        { x: 8, y: 5, fill: "#473321" },
        { x: 0, y: 6, fill: "#D53E00" },
        { x: 3, y: 6, fill: "#473321" },
        { x: 6, y: 6, fill: "#473321" },
        { x: 9, y: 6, fill: "#D53E00" },
      ]}
    />
  );
}

function HamsterCream() {
  return (
    <PixelSprite
      width={8}
      height={8}
      pixels={[
        { x: 2, y: 0, fill: "#BA9773" },
        { x: 5, y: 0, fill: "#BA9773" },
        { x: 1, y: 1, fill: "#BA9773" },
        { x: 2, y: 1, fill: "#E1D2BE" },
        { x: 3, y: 1, fill: "#E1D2BE" },
        { x: 4, y: 1, fill: "#E1D2BE" },
        { x: 5, y: 1, fill: "#E1D2BE" },
        { x: 6, y: 1, fill: "#BA9773" },
        { x: 0, y: 2, fill: "#BA9773" },
        { x: 1, y: 2, fill: "#E1D2BE" },
        { x: 2, y: 2, fill: "#FDFBF0" },
        { x: 3, y: 2, fill: "#212121" },
        { x: 4, y: 2, fill: "#212121" },
        { x: 5, y: 2, fill: "#FDFBF0" },
        { x: 6, y: 2, fill: "#E1D2BE" },
        { x: 7, y: 2, fill: "#BA9773" },
        { x: 0, y: 3, fill: "#BA9773" },
        { x: 1, y: 3, fill: "#E1D2BE" },
        { x: 2, y: 3, fill: "#FDFBF0" },
        { x: 3, y: 3, fill: "#FF7991" },
        { x: 4, y: 3, fill: "#FDFBF0" },
        { x: 5, y: 3, fill: "#FDFBF0" },
        { x: 6, y: 3, fill: "#E1D2BE" },
        { x: 7, y: 3, fill: "#BA9773" },
        { x: 1, y: 4, fill: "#BA9773" },
        { x: 2, y: 4, fill: "#E1D2BE" },
        { x: 3, y: 4, fill: "#FDFBF0" },
        { x: 4, y: 4, fill: "#FDFBF0" },
        { x: 5, y: 4, fill: "#E1D2BE" },
        { x: 6, y: 4, fill: "#BA9773" },
        { x: 1, y: 5, fill: "#BA9773" },
        { x: 2, y: 5, fill: "#E1D2BE" },
        { x: 3, y: 5, fill: "#E1D2BE" },
        { x: 4, y: 5, fill: "#E1D2BE" },
        { x: 5, y: 5, fill: "#E1D2BE" },
        { x: 6, y: 5, fill: "#BA9773" },
        { x: 2, y: 6, fill: "#BA9773" },
        { x: 3, y: 6, fill: "#E1D2BE" },
        { x: 4, y: 6, fill: "#E1D2BE" },
        { x: 5, y: 6, fill: "#BA9773" },
        { x: 2, y: 7, fill: "#BA9773" },
        { x: 5, y: 7, fill: "#BA9773" },
      ]}
    />
  );
}

function TurtleShell() {
  return (
    <PixelSprite
      width={9}
      height={7}
      pixels={[
        { x: 3, y: 0, fill: "#6AA84F" },
        { x: 4, y: 0, fill: "#8FD16A" },
        { x: 5, y: 0, fill: "#6AA84F" },
        { x: 1, y: 1, fill: "#6AA84F" },
        { x: 2, y: 1, fill: "#556B2F" },
        { x: 3, y: 1, fill: "#8FD16A" },
        { x: 4, y: 1, fill: "#C8B861" },
        { x: 5, y: 1, fill: "#8FD16A" },
        { x: 6, y: 1, fill: "#556B2F" },
        { x: 7, y: 1, fill: "#6AA84F" },
        { x: 0, y: 2, fill: "#6AA84F" },
        { x: 1, y: 2, fill: "#8FD16A" },
        { x: 2, y: 2, fill: "#556B2F" },
        { x: 3, y: 2, fill: "#C8B861" },
        { x: 4, y: 2, fill: "#8FD16A" },
        { x: 5, y: 2, fill: "#C8B861" },
        { x: 6, y: 2, fill: "#556B2F" },
        { x: 7, y: 2, fill: "#8FD16A" },
        { x: 8, y: 2, fill: "#6AA84F" },
        { x: 1, y: 3, fill: "#6AA84F" },
        { x: 2, y: 3, fill: "#8FD16A" },
        { x: 3, y: 3, fill: "#556B2F" },
        { x: 4, y: 3, fill: "#C8B861" },
        { x: 5, y: 3, fill: "#556B2F" },
        { x: 6, y: 3, fill: "#8FD16A" },
        { x: 7, y: 3, fill: "#6AA84F" },
        { x: 0, y: 4, fill: "#6AA84F" },
        { x: 1, y: 4, fill: "#8FD16A" },
        { x: 2, y: 4, fill: "#8FD16A" },
        { x: 3, y: 4, fill: "#556B2F" },
        { x: 4, y: 4, fill: "#C8B861" },
        { x: 5, y: 4, fill: "#556B2F" },
        { x: 6, y: 4, fill: "#8FD16A" },
        { x: 7, y: 4, fill: "#8FD16A" },
        { x: 8, y: 4, fill: "#6AA84F" },
        { x: 1, y: 5, fill: "#6AA84F" },
        { x: 2, y: 5, fill: "#6AA84F" },
        { x: 3, y: 5, fill: "#8FD16A" },
        { x: 4, y: 5, fill: "#8FD16A" },
        { x: 5, y: 5, fill: "#8FD16A" },
        { x: 6, y: 5, fill: "#6AA84F" },
        { x: 7, y: 5, fill: "#6AA84F" },
        { x: 2, y: 6, fill: "#6AA84F" },
        { x: 6, y: 6, fill: "#6AA84F" },
      ]}
    />
  );
}

export { Pet, type PetProps, type PetVariant };
