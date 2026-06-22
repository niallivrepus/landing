/**
 * Maps stable camelCase keys to Lordicon JSON payloads for `@lordicon/react` Player.
 * Used by the marketing site (hero pills, CTAs). Keeps assets co-located under
 * `src/assets/lordicon/**` without importing dozens of paths from consumers.
 */
import arrowLongRight from "../assets/lordicon/filled/arrow-long-right.json";
import chatEmpty from "../assets/lordicon/filled/chat-empty.json";
import domainVerification from "../assets/lordicon/filled/domain-verification.json";
import downloadSave from "../assets/lordicon/filled/download-save.json";
import logSignIn from "../assets/lordicon/filled/log-sign-in.json";
import newspaper from "../assets/lordicon/filled/newspaper.json";
import plus from "../assets/lordicon/filled/plus.json";
import search from "../assets/lordicon/filled/search.json";
import work from "../assets/lordicon/filled/work.json";
import worldGlobeWikis from "../assets/lordicon/filled/world-globe-wikis.json";

export const lordiconAssets = {
  arrowLongRight,
  chatEmpty,
  domainVerification,
  downloadSave,
  logSignIn,
  newspaper,
  plus,
  search,
  work,
  worldGlobeWikis,
} as const;

export type GooeyLordiconAssetName = keyof typeof lordiconAssets;

// ── Action-button icon pairs (outline at rest, filled on hover) ──────────────
import contactsOutline from "../assets/lordicon/outline/contacts.json";
import contactsFilled from "../assets/lordicon/filled/contacts.json";
import forumOutline from "../assets/lordicon/outline/forum.json";
import forumFilled from "../assets/lordicon/filled/forum.json";
import accountOutline from "../assets/lordicon/outline/account.json";
import accountFilled from "../assets/lordicon/filled/account.json";
import articleOutline from "../assets/lordicon/outline/article.json";
import articleFilled from "../assets/lordicon/filled/article.json";

/** Outline/filled Lordicon pairs ready to drop into `ActionButton` via `LordiconIcon`. */
export const actionLordicons = {
  contacts: { outline: contactsOutline, filled: contactsFilled },
  messages: { outline: forumOutline, filled: forumFilled },
  profile: { outline: accountOutline, filled: accountFilled },
  spine: { outline: articleOutline, filled: articleFilled },
} as const;

export type ActionLordiconName = keyof typeof actionLordicons;

// ── Right-hand menu icons (profile rail, context menus) ──────────────────────
// `rest` is shown at rest; when an `outline` rest exists, `hover` swaps to the
// filled variant on hover (like the action buttons). filled-only icons just
// replay their own animation on hover.
import shareOutline from "../assets/lordicon/outline/share.json";
import shareFilled from "../assets/lordicon/filled/share.json";
import editPencilFilled from "../assets/lordicon/filled/edit-pencil-rename.json";
import photoFilled from "../assets/lordicon/filled/photo.json";

/** Lordicon set for `RightHandMenu` items. `hover` is optional (filled-only icons omit it). */
export const menuLordicons = {
  edit: { rest: editPencilFilled },
  share: { rest: shareOutline, hover: shareFilled },
  plus: { rest: plus },
  wallpaper: { rest: photoFilled },
} as const;

export type MenuLordiconName = keyof typeof menuLordicons;
