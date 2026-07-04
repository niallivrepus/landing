# Lava Lamp Glue Logic

This document is standalone.

It is written so another developer can recreate the effect without access to this repo.

## What the effect actually is

The effect is a liquid metaball field built from:

1. several oversized radial-gradient blobs
2. slow independent motion on each blob
3. an SVG goo filter that fuses overlapping blur into one shape
4. a soft vignette on the container so the edges do not feel flat

It is not a shader.
It is not canvas.
It is just HTML/CSS plus SVG filter plus animation.

## The core visual rule

The “glue” comes from this exact sequence:

1. draw colorful blurred circles
2. blur them hard
3. remap alpha so overlaps become solid again
4. slightly smooth the merged edge
5. boost saturation back up

If you skip step 3, you do not get liquid glue.
You just get colored fog.

## Minimum viable implementation

### 1. Container

Use a clipping container with hidden overflow.

```html
<div class="lava-lamp">
  <svg class="lava-defs" aria-hidden="true">
    <!-- filter defs here -->
  </svg>
  <div class="lava-field">
    <div class="blob blob-a"></div>
    <div class="blob blob-b"></div>
    <div class="blob blob-c"></div>
    <div class="blob blob-d"></div>
  </div>
</div>
```

### 2. Base CSS

```css
.lava-lamp {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}

.lava-defs {
  position: absolute;
  width: 0;
  height: 0;
}

.lava-field {
  position: absolute;
  inset: -30%;
  filter: url(#lava-goo);
  opacity: 0.95;
}

.blob {
  position: absolute;
  border-radius: 999px;
  will-change: transform;
}
```

## The exact goo filter

This is the important part.
Use this as the baseline.

```html
<filter
  id="lava-goo"
  x="-50%"
  y="-50%"
  width="200%"
  height="200%"
  color-interpolation-filters="sRGB"
>
  <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur1" />

  <feColorMatrix
    in="blur1"
    mode="matrix"
    values="
      1 0 0 0 0
      0 1 0 0 0
      0 0 1 0 0
      0 0 0 18 -7
    "
    result="gooey"
  />

  <feComposite in="SourceGraphic" in2="gooey" operator="atop" result="merged" />

  <feGaussianBlur in="merged" stdDeviation="2" result="smooth" />

  <feColorMatrix
    in="smooth"
    mode="matrix"
    values="
      1 0 0 0 0
      0 1 0 0 0
      0 0 1 0 0
      0 0 0 4 -0.8
    "
    result="crisp"
  />

  <feColorMatrix in="crisp" type="saturate" values="1.5" />
</filter>
```

## What each filter stage does

### Wide blur

```html
<feGaussianBlur stdDeviation="30" />
```

Purpose:

- removes circle edges
- creates overlap zones
- gives the alpha-threshold stage something to fuse

### Goo threshold

```html
<feColorMatrix values="... 0 0 0 18 -7" />
```

This is the glue.

Meaning:

- `18` = alpha multiplier
- `-7` = alpha offset

Effect:

- blurred overlaps become one solid mass
- edges keep a soft falloff

If the result is too foggy:

- raise the multiplier
- or reduce the blur a bit

If the result is too crunchy:

- lower the multiplier
- or add a little more blur

### Edge smoothing

```html
<feGaussianBlur stdDeviation="2" />
```

Purpose:

- removes harsh threshold artifacts
- gives the merged mass a softer contour

### Saturation boost

```html
<feColorMatrix type="saturate" values="1.5" />
```

Purpose:

- blur and compositing dull color
- this puts energy back into the gradients

## Blob recipe

Each blob should have:

- a large size
- a radial gradient
- a transparent edge
- a different motion path
- a different duration

Use 3 to 5 blobs for most cards.

Too few:

- feels empty

Too many:

- gets noisy

### Good blob shape

```css
.blob-a {
  left: -12%;
  top: -18%;
  width: 82%;
  height: 82%;
  background: radial-gradient(circle, #9500ff 0%, #d000ff 35%, transparent 65%);
}

.blob-b {
  right: -18%;
  top: -8%;
  width: 78%;
  height: 78%;
  background: radial-gradient(circle, #0040ff 0%, #4d8fff 35%, transparent 65%);
}

.blob-c {
  left: 8%;
  bottom: -22%;
  width: 72%;
  height: 72%;
  background: radial-gradient(circle, #ff00e5 0%, #ff6bd6 30%, transparent 60%);
}

.blob-d {
  right: -8%;
  bottom: -12%;
  width: 68%;
  height: 68%;
  background: radial-gradient(circle, #ff5500 0%, #ffc200 30%, transparent 60%);
}
```

## Why the colors work

The lamp only feels rich if every blob gradient follows this rule:

1. high-energy core color
2. softer companion color
3. transparent edge

Example:

```css
background: radial-gradient(circle, #9500ff 0%, #d000ff 35%, transparent 65%);
```

That is better than a flat solid fill because:

- the center stays bright
- the edge disappears naturally
- merges look liquid instead of stacked

## Color strategy

Use color families, not random colors.

### Aurora family

- violet `#9500FF`
- magenta `#D000FF`
- blue `#0040FF`
- sky `#4D8FFF`
- hot pink `#FF00E5`
- soft pink `#FF6BD6`
- orange `#FF5500`
- gold `#FFC200`

### Arctic family

- deep blue `#0052CC`
- bright blue `#0080FF`
- teal `#00AAAA`
- cyan `#00FFFF`

### Ember family

- orange `#FF5500`
- red `#E60000`
- yellow `#FFCC00`

### Jungle family

- green `#00B300`
- lime `#22FF11`
- teal `#00AAAA`
- cyan `#00FFEE`

Rule:

- pick 2 to 4 neighboring color families
- do not mix all spectral colors at equal strength
- one cool anchor plus one warm accent usually reads best

## Motion recipe

The motion should be slow and ambient.
Do not make it reactive to the pointer by default.

Example:

```js
[
  { x: [0, 55, -35, 0], y: [0, -50, 40, 0], dur: 19 },
  { x: [0, -50, 40, 0], y: [0, 45, -50, 0], dur: 15 },
  { x: [0, -38, 48, 0], y: [0, 30, -28, 0], dur: 22 },
  { x: [0, 42, -30, 0], y: [0, -40, 28, 0], dur: 17 }
]
```

Motion rules:

- all blobs need different durations
- all blobs need different paths
- all blobs should loop
- keep the movement large enough to feel alive
- keep the speed slow enough that it reads as atmosphere

Good range:

- duration: `14s` to `26s`
- travel: `25px` to `55px`

## Plain CSS animation version

If you do not want a JS animation library, this is enough:

```css
@keyframes drift-a {
  0%   { transform: translate(0px, 0px); }
  33%  { transform: translate(55px, -50px); }
  66%  { transform: translate(-35px, 40px); }
  100% { transform: translate(0px, 0px); }
}

@keyframes drift-b {
  0%   { transform: translate(0px, 0px); }
  33%  { transform: translate(-50px, 45px); }
  66%  { transform: translate(40px, -50px); }
  100% { transform: translate(0px, 0px); }
}

.blob-a { animation: drift-a 19s ease-in-out infinite; }
.blob-b { animation: drift-b 15s ease-in-out infinite; }
```

## Why the field is oversized

Use:

```css
.lava-field {
  inset: -30%;
}
```

Reason:

- the blur needs room outside the visible frame
- otherwise the liquid mass gets visibly chopped at the edge

This matters a lot.
If you render the field only inside the exact card bounds, the effect looks fake.

## The vignette layer

The effect is better with a subtle inset shadow.

Use something like:

```css
.lava-lamp {
  box-shadow:
    inset 0 2px 40px 8px rgba(0,0,0,0.2),
    inset 0 -20px 50px rgba(0,0,0,0.15),
    inset 18px 0 50px -14px rgba(0,0,0,0.1),
    inset -18px 0 50px -14px rgba(0,0,0,0.1);
}
```

Purpose:

- adds edge density
- makes the center feel brighter
- hides the artificial rectangle boundary

## Good defaults

If someone wants one starting setup, use this:

- blob count: `4`
- blur: `30`
- alpha matrix: `[18, -7]`
- smooth blur: `2`
- saturation: `1.5`
- field opacity: `0.95`
- background: `#000`

That is the safest baseline.

## Tuning guide

### Too foggy

- reduce blur
- raise alpha multiplier

### Too hard-edged

- lower alpha multiplier
- increase smoothing blur slightly

### Too muddy

- increase saturation
- use cleaner gradients with less midtone grey

### Too busy

- reduce blob count
- reduce travel distance
- bring color palette closer together

### Too boring

- add one strong warm accent to a mostly cool palette
- increase blob size variation
- make one blob slower and larger than the others

## A complete copyable version

```html
<div class="lava-lamp">
  <svg class="lava-defs" aria-hidden="true">
    <filter id="lava-goo" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur1" />
      <feColorMatrix
        in="blur1"
        mode="matrix"
        values="
          1 0 0 0 0
          0 1 0 0 0
          0 0 1 0 0
          0 0 0 18 -7
        "
        result="gooey"
      />
      <feComposite in="SourceGraphic" in2="gooey" operator="atop" result="merged" />
      <feGaussianBlur in="merged" stdDeviation="2" result="smooth" />
      <feColorMatrix
        in="smooth"
        mode="matrix"
        values="
          1 0 0 0 0
          0 1 0 0 0
          0 0 1 0 0
          0 0 0 4 -0.8
        "
        result="crisp"
      />
      <feColorMatrix in="crisp" type="saturate" values="1.5" />
    </filter>
  </svg>

  <div class="lava-field">
    <div class="blob blob-a"></div>
    <div class="blob blob-b"></div>
    <div class="blob blob-c"></div>
    <div class="blob blob-d"></div>
  </div>
</div>
```

```css
.lava-lamp {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
  box-shadow:
    inset 0 2px 40px 8px rgba(0,0,0,0.2),
    inset 0 -20px 50px rgba(0,0,0,0.15),
    inset 18px 0 50px -14px rgba(0,0,0,0.1),
    inset -18px 0 50px -14px rgba(0,0,0,0.1);
}

.lava-defs {
  position: absolute;
  width: 0;
  height: 0;
}

.lava-field {
  position: absolute;
  inset: -30%;
  filter: url(#lava-goo);
  opacity: 0.95;
}

.blob {
  position: absolute;
  border-radius: 999px;
  will-change: transform;
}

.blob-a {
  left: -12%;
  top: -18%;
  width: 82%;
  height: 82%;
  background: radial-gradient(circle, #9500ff 0%, #d000ff 35%, transparent 65%);
  animation: drift-a 19s ease-in-out infinite;
}

.blob-b {
  right: -18%;
  top: -8%;
  width: 78%;
  height: 78%;
  background: radial-gradient(circle, #0040ff 0%, #4d8fff 35%, transparent 65%);
  animation: drift-b 15s ease-in-out infinite;
}

.blob-c {
  left: 8%;
  bottom: -22%;
  width: 72%;
  height: 72%;
  background: radial-gradient(circle, #ff00e5 0%, #ff6bd6 30%, transparent 60%);
  animation: drift-c 22s ease-in-out infinite;
}

.blob-d {
  right: -8%;
  bottom: -12%;
  width: 68%;
  height: 68%;
  background: radial-gradient(circle, #ff5500 0%, #ffc200 30%, transparent 60%);
  animation: drift-d 17s ease-in-out infinite;
}

@keyframes drift-a {
  0% { transform: translate(0, 0); }
  33% { transform: translate(55px, -50px); }
  66% { transform: translate(-35px, 40px); }
  100% { transform: translate(0, 0); }
}

@keyframes drift-b {
  0% { transform: translate(0, 0); }
  33% { transform: translate(-50px, 45px); }
  66% { transform: translate(40px, -50px); }
  100% { transform: translate(0, 0); }
}

@keyframes drift-c {
  0% { transform: translate(0, 0); }
  33% { transform: translate(-38px, 30px); }
  66% { transform: translate(48px, -28px); }
  100% { transform: translate(0, 0); }
}

@keyframes drift-d {
  0% { transform: translate(0, 0); }
  33% { transform: translate(42px, -40px); }
  66% { transform: translate(-30px, 28px); }
  100% { transform: translate(0, 0); }
}
```

## Short answer

If a developer only remembers one thing, it is this:

The glue effect is not the gradients.
The glue effect is the blurred gradients plus alpha-threshold remapping in the SVG filter.
