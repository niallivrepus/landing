import type { ProductId } from "./products";

export type ProductDetailMedia =
  | {
      kind: "gradient";
      gradient: string;
      accent?: string;
      variant?: "fan" | "screen" | "slab" | "pillars" | "stack";
      label?: string;
    }
  | {
      kind: "image";
      src: string;
      alt: string;
      objectPosition?: string;
    }
  | {
      kind: "video";
      src: string;
      poster?: string;
      alt?: string;
    };

export type ProductHighlightSlide = {
  id: string;
  eyebrow?: string;
  title: string;
  body: string;
  media: ProductDetailMedia;
};

export type ProductCloserLookItem = {
  id: string;
  label: string;
  title: string;
  body: string;
  media: ProductDetailMedia;
};

export type ProductCenterpieceItem = {
  id: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  rotation: number;
  media: ProductDetailMedia;
};

export type ProductDetailBlueprint = {
  highlights: {
    title: string;
    slides: ProductHighlightSlide[];
  };
  closerLook: {
    title: string;
    items: ProductCloserLookItem[];
  };
  centerpiece: {
    eyebrow?: string;
    title: string;
    body?: string;
    ctaLabel?: string;
    ctaTo?: string;
    items: ProductCenterpieceItem[];
  };
  reveal: {
    eyebrow?: string;
    title: string;
    body: string;
    media: ProductDetailMedia;
  };
};

export const PRODUCT_DETAIL_BLUEPRINTS: Record<ProductId, ProductDetailBlueprint> = {
  pods: {
    highlights: {
      title: "Get the highlights.",
      slides: [
        {
          id: "pods-surfaces",
          title: "Show more than a bio.",
          body: "Pods turn music, files, badges, and context into one calm, usable identity surface.",
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(180deg, #f5f1ff 0%, #ece8ff 100%)",
            accent: "#8b5cf6",
            label: "Pods",
          },
        },
        {
          id: "pods-alignment",
          title: "Keep every surface aligned.",
          body: "The same visual language holds across phone, desktop, and the shareable web surface.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #f4f2ff 0%, #eef5ff 100%)",
            accent: "#6366f1",
            label: "Profile surface",
          },
        },
        {
          id: "pods-editing",
          title: "Edit live and keep it yours.",
          body: "Swap modules, reorder the stack, and adjust what shows up without rebuilding the whole page.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #faf5ff 0%, #eff6ff 100%)",
            accent: "#a855f7",
            label: "Live editing",
          },
        },
      ],
    },
    closerLook: {
      title: "Take a closer look.",
      items: [
        {
          id: "pods-modules",
          label: "Modules",
          title: "Build your profile in pieces.",
          body: "Each pod is a purposeful surface. Audio, links, files, and credentials all keep the same visual rhythm.",
          media: {
            kind: "image",
            src: "/story-art/story-office-focus.png",
            alt: "Person focused at a desk.",
            objectPosition: "center center",
          },
        },
        {
          id: "pods-badges",
          label: "Badges",
          title: "Proof can live beside personality.",
          body: "Claims, on-chain credentials, and references can sit inside the same story instead of in a second tab.",
          media: {
            kind: "image",
            src: "/story-art/story-office-collab.png",
            alt: "Two people collaborating in an office.",
            objectPosition: "center center",
          },
        },
        {
          id: "pods-privacy",
          label: "Privacy",
          title: "Private by default, flexible by design.",
          body: "Choose what is public, shared with a group, or held back until the moment is right.",
          media: {
            kind: "image",
            src: "/story-art/story-office-smile.png",
            alt: "Person smiling in an office.",
            objectPosition: "center center",
          },
        },
        {
          id: "pods-sharing",
          label: "Sharing",
          title: "Send one link that still feels personal.",
          body: "A pod page can behave like a profile, portfolio, or temporary room without becoming generic.",
          media: {
            kind: "image",
            src: "/story-art/story-office-collab.png",
            alt: "Team members gathered together in a workspace.",
            objectPosition: "center center",
          },
        },
      ],
    },
    centerpiece: {
      title: "Identity, arranged your way.",
      ctaLabel: "Join Beta",
      ctaTo: "/#start",
      items: [
        {
          id: "pods-corner-1",
          position: "top-left",
          rotation: -10,
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #f6eefe 0%, #f3f4f6 100%)",
            accent: "#a855f7",
          },
        },
        {
          id: "pods-corner-2",
          position: "top-right",
          rotation: 8,
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #eef6ff 0%, #f8fafc 100%)",
            accent: "#6366f1",
          },
        },
        {
          id: "pods-corner-3",
          position: "bottom-left",
          rotation: -8,
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(180deg, #eef2ff 0%, #ede9fe 100%)",
            accent: "#7c3aed",
          },
        },
        {
          id: "pods-corner-4",
          position: "bottom-right",
          rotation: 10,
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #f5f3ff 0%, #f8fafc 100%)",
            accent: "#8b5cf6",
          },
        },
      ],
    },
    reveal: {
      title: "A profile that opens up with you.",
      body: "Start with a contained moment, then let the surface grow as the story asks for more room.",
      media: {
        kind: "gradient",
        variant: "screen",
        gradient: "linear-gradient(180deg, #f5f3ff 0%, #eef5ff 100%)",
        accent: "#7c3aed",
        label: "Pods expand cleanly",
      },
    },
  },
  blurbs: {
    highlights: {
      title: "Get the highlights.",
      slides: [
        {
          id: "blurbs-source",
          eyebrow: "Source",
          title: "Start with what was said.",
          body: "Blurbs begin from real meetings, chats, and voice notes instead of a blank page.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #ecfeff 0%, #eff6ff 100%)",
            accent: "#10b981",
            label: "Conversation in",
          },
        },
        {
          id: "blurbs-rewrite",
          eyebrow: "Rewrite",
          title: "Rewrite without losing your voice.",
          body: "Shift tone and structure while keeping the original signal intact.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #ecfdf5 0%, #f0fdfa 100%)",
            accent: "#14b8a6",
            label: "Draft shaping",
          },
        },
        {
          id: "blurbs-publish",
          eyebrow: "Shipping",
          title: "Ship clean copy faster.",
          body: "Move from transcript to usable draft to final publish flow without losing context.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #f0fdf4 0%, #eff6ff 100%)",
            accent: "#059669",
            label: "Ready to post",
          },
        },
      ],
    },
    closerLook: {
      title: "Take a closer look.",
      items: [
        {
          id: "blurbs-transcript",
          label: "Transcript",
          title: "The raw conversation stays close.",
          body: "You can trace every line of copy back to what was actually said, not to a disconnected prompt.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)",
            accent: "#0f766e",
            label: "Source-aware drafting",
          },
        },
        {
          id: "blurbs-audience",
          label: "Audience",
          title: "Shape the same idea for different people.",
          body: "Keep the message intact while adjusting framing for investors, builders, customers, or friends.",
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(180deg, #ecfeff 0%, #f0fdf4 100%)",
            accent: "#0ea5e9",
            label: "Audience-aware versions",
          },
        },
        {
          id: "blurbs-approval",
          label: "Approval",
          title: "A calmer review loop.",
          body: "Tighten the text, compare variants, and only publish once it sounds like something you would actually say.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #f0fdfa 0%, #eef2ff 100%)",
            accent: "#14b8a6",
            label: "Side-by-side revisions",
          },
        },
        {
          id: "blurbs-publishing",
          label: "Publishing",
          title: "Conversation to publish, without tab soup.",
          body: "The final move from spoken context into a clean outward-facing update can stay in one place.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #ecfdf5 0%, #eff6ff 100%)",
            accent: "#22c55e",
            label: "One flow",
          },
        },
      ],
    },
    centerpiece: {
      eyebrow: "Blurbs",
      title: "Conversation becomes clean copy.",
      body: "Blurbs gives speech a second life. The interesting part is not just drafting faster, but keeping the soul of what was said while the copy gets sharper.",
      ctaLabel: "Join Beta",
      ctaTo: "/#start",
      items: [
        {
          id: "blurbs-corner-1",
          position: "top-left",
          rotation: -8,
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #ecfeff 0%, #f0fdfa 100%)",
            accent: "#14b8a6",
          },
        },
        {
          id: "blurbs-corner-2",
          position: "top-right",
          rotation: 8,
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
            accent: "#0ea5e9",
          },
        },
        {
          id: "blurbs-corner-3",
          position: "bottom-left",
          rotation: -10,
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(180deg, #ecfdf5 0%, #f0fdf4 100%)",
            accent: "#10b981",
          },
        },
        {
          id: "blurbs-corner-4",
          position: "bottom-right",
          rotation: 10,
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #f0fdfa 0%, #eff6ff 100%)",
            accent: "#14b8a6",
          },
        },
      ],
    },
    reveal: {
      eyebrow: "Draft flow",
      title: "From contained draft to full publish surface.",
      body: "This is the kind of section where a narrow, focused editor can open up into a full stage when the story needs room.",
      media: {
        kind: "gradient",
        variant: "stack",
        gradient: "linear-gradient(180deg, #ecfeff 0%, #eff6ff 100%)",
        accent: "#14b8a6",
        label: "Drafts expanding outward",
      },
    },
  },
  spine: {
    highlights: {
      title: "Get the highlights.",
      slides: [
        {
          id: "spine-jump",
          eyebrow: "Time",
          title: "Jump to what mattered.",
          body: "Move through days, weeks, and months without losing the shape of the story.",
          media: {
            kind: "gradient",
            variant: "pillars",
            gradient: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
            accent: "#f59e0b",
            label: "Time in layers",
          },
        },
        {
          id: "spine-context",
          eyebrow: "Context",
          title: "Keep the long arc in view.",
          body: "Important moments stay attached to their timeline, instead of dissolving into another infinite feed.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #fff7ed 0%, #eff6ff 100%)",
            accent: "#3b82f6",
            label: "Timeline context",
          },
        },
        {
          id: "spine-return",
          eyebrow: "Return",
          title: "Pick up where you left off.",
          body: "The spine is a continuity layer, not just a visual timeline.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #fffbeb 0%, #eef2ff 100%)",
            accent: "#f59e0b",
            label: "Continuity",
          },
        },
      ],
    },
    closerLook: {
      title: "Take a closer look.",
      items: [
        {
          id: "spine-day",
          label: "Day view",
          title: "See the day without noise.",
          body: "A day can be readable at a glance, with just enough detail to help you jump back in.",
          media: {
            kind: "gradient",
            variant: "pillars",
            gradient: "linear-gradient(180deg, #fff7ed 0%, #f8fafc 100%)",
            accent: "#f59e0b",
            label: "Today",
          },
        },
        {
          id: "spine-week",
          label: "Week view",
          title: "Collapse a week into a useful rhythm.",
          body: "Bigger spans can compress without feeling like you lost the important beats.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
            accent: "#3b82f6",
            label: "This week",
          },
        },
        {
          id: "spine-pins",
          label: "Pins",
          title: "Let important moments hold their weight.",
          body: "Decisions, commitments, and highlights can stay surfaced even as more time passes underneath them.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #fff7ed 0%, #eef2ff 100%)",
            accent: "#f97316",
            label: "Pinned moments",
          },
        },
        {
          id: "spine-archive",
          label: "Archive",
          title: "Archive without losing access.",
          body: "Older context should become quieter, not disappear.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #fffbeb 0%, #eff6ff 100%)",
            accent: "#f59e0b",
            label: "Archive",
          },
        },
      ],
    },
    centerpiece: {
      eyebrow: "Spine",
      title: "Memory with shape.",
      body: "Spine keeps time readable. It is the difference between a feed that erases context and a history you can actually work with.",
      ctaLabel: "Join Beta",
      ctaTo: "/#start",
      items: [
        {
          id: "spine-corner-1",
          position: "top-left",
          rotation: -8,
          media: {
            kind: "gradient",
            variant: "pillars",
            gradient: "linear-gradient(180deg, #fffbeb 0%, #f8fafc 100%)",
            accent: "#f59e0b",
          },
        },
        {
          id: "spine-corner-2",
          position: "top-right",
          rotation: 8,
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #eff6ff 0%, #eef2ff 100%)",
            accent: "#3b82f6",
          },
        },
        {
          id: "spine-corner-3",
          position: "bottom-left",
          rotation: -10,
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #fff7ed 0%, #eef2ff 100%)",
            accent: "#fb923c",
          },
        },
        {
          id: "spine-corner-4",
          position: "bottom-right",
          rotation: 10,
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #fffbeb 0%, #eff6ff 100%)",
            accent: "#f59e0b",
          },
        },
      ],
    },
    reveal: {
      eyebrow: "Timeline reveal",
      title: "Let the timeline widen as the story gets bigger.",
      body: "This is a natural place for a narrow, intentional surface to become a broader scene as the reader scrolls deeper.",
      media: {
        kind: "gradient",
        variant: "pillars",
        gradient: "linear-gradient(180deg, #fff7ed 0%, #eff6ff 100%)",
        accent: "#f59e0b",
        label: "Spine expands",
      },
    },
  },
  vortex: {
    highlights: {
      title: "Get the highlights.",
      slides: [
        {
          id: "vortex-search",
          eyebrow: "Search",
          title: "Search across the mess.",
          body: "Vortex gives scattered tools a single front door without pretending the complexity is not there.",
          media: {
            kind: "gradient",
            variant: "pillars",
            gradient: "linear-gradient(180deg, #ede9fe 0%, #dbeafe 100%)",
            accent: "#7c3aed",
            label: "Cross-stack query",
          },
        },
        {
          id: "vortex-routing",
          eyebrow: "Routing",
          title: "Route intent to the right tool.",
          body: "One question can move through agents, connectors, and sources without you juggling all of them manually.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #eef2ff 0%, #ecfeff 100%)",
            accent: "#2563eb",
            label: "Routing layer",
          },
        },
        {
          id: "vortex-answers",
          eyebrow: "Answers",
          title: "Get back to a usable answer faster.",
          body: "The result should feel like one coherent response, not a stitched set of tabs.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #ede9fe 0%, #ecfeff 100%)",
            accent: "#06b6d4",
            label: "Answer surface",
          },
        },
      ],
    },
    closerLook: {
      title: "Take a closer look.",
      items: [
        {
          id: "vortex-sources",
          label: "Sources",
          title: "Bring calendars, chats, docs, and agents into one question.",
          body: "The point is not to flatten every source. It is to make them legible together.",
          media: {
            kind: "gradient",
            variant: "pillars",
            gradient: "linear-gradient(180deg, #ede9fe 0%, #ecfeff 100%)",
            accent: "#7c3aed",
            label: "Connected sources",
          },
        },
        {
          id: "vortex-permissions",
          label: "Permissions",
          title: "Access stays scoped to you.",
          body: "Answers can be useful without turning every integration into a trust problem.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #eef2ff 0%, #f0fdfa 100%)",
            accent: "#2563eb",
            label: "Scoped access",
          },
        },
        {
          id: "vortex-evidence",
          label: "Evidence",
          title: "Answers come with receipts.",
          body: "The system should point back to the thread, event, file, or note that made the answer credible.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #ecfeff 0%, #eef2ff 100%)",
            accent: "#06b6d4",
            label: "Traceable results",
          },
        },
        {
          id: "vortex-followup",
          label: "Follow-up",
          title: "Stay inside one conversation.",
          body: "Follow-up questions should feel like the same thread getting smarter, not like starting over.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #ede9fe 0%, #f8fafc 100%)",
            accent: "#7c3aed",
            label: "One front door",
          },
        },
      ],
    },
    centerpiece: {
      title: "One question. Fewer tabs.",
      ctaLabel: "Join Beta",
      ctaTo: "/#start",
      items: [
        {
          id: "vortex-corner-1",
          position: "top-left",
          rotation: -8,
          media: {
            kind: "gradient",
            variant: "pillars",
            gradient: "linear-gradient(180deg, #ede9fe 0%, #dbeafe 100%)",
            accent: "#7c3aed",
          },
        },
        {
          id: "vortex-corner-2",
          position: "top-right",
          rotation: 8,
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #eef2ff 0%, #ecfeff 100%)",
            accent: "#2563eb",
          },
        },
        {
          id: "vortex-corner-3",
          position: "bottom-left",
          rotation: -10,
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #dbeafe 0%, #eef2ff 100%)",
            accent: "#06b6d4",
          },
        },
        {
          id: "vortex-corner-4",
          position: "bottom-right",
          rotation: 10,
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #ede9fe 0%, #ecfeff 100%)",
            accent: "#8b5cf6",
          },
        },
      ],
    },
    reveal: {
      eyebrow: "System feel",
      title: "Smooth operator.",
      body: "A wider reveal makes sense here: start with a contained signal, then open up into the ambient system surface as the reader scrolls.",
      media: {
        kind: "gradient",
        variant: "pillars",
        gradient: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
        accent: "#8b5cf6",
        label: "macOS",
      },
    },
  },
};
