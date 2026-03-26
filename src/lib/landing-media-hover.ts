const ease = "motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Soft zoom for media inside a parent with `group` + `overflow-hidden`. */
export const LANDING_MEDIA_HOVER_ZOOM = `origin-center motion-safe:transition-transform ${ease} motion-safe:group-hover:scale-[1.012]`;

/** Same zoom + shared easing when the image also animates `filter`. */
export const LANDING_MEDIA_HOVER_ZOOM_FILTER = `origin-center motion-safe:transition-[transform,filter] ${ease} motion-safe:group-hover:scale-[1.012]`;
