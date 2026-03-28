import type { ProductId } from "./products";

export type ProductDetailMedia =
  | {
      kind: "gradient";
      gradient: string;
      accent?: string;
      variant?: "fan" | "screen" | "slab" | "pillars" | "stack";
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
      title: "Highlights.",
      slides: [
        {
          id: "pods-surfaces",
          title: "More than a bio.",
          body: "Pods turn music, files, badges, and context into one calm, usable identity surface.",
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(180deg, #f5f1ff 0%, #ece8ff 100%)",
            accent: "#8b5cf6",
          },
        },
        {
          id: "pods-alignment",
          title: "Keep it aligned.",
          body: "The same visual language holds across phone, desktop, and the shareable web surface.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #f4f2ff 0%, #eef5ff 100%)",
            accent: "#6366f1",
          },
        },
        {
          id: "pods-editing",
          title: "Edit live.",
          body: "Swap modules, reorder the stack, and adjust what shows up without rebuilding the whole page.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #faf5ff 0%, #eff6ff 100%)",
            accent: "#a855f7",
          },
        },
      ],
    },
    closerLook: {
      title: "Closer look.",
      items: [
        {
          id: "pods-modules",
          label: "Modules",
          title: "Build it in pieces.",
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
          title: "Proof meets personality.",
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
          title: "Private by default.",
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
          title: "One link. Still personal.",
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
      title: "Identity, your way.",
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
      title: "A profile that grows.",
      body: "Start with a contained moment, then let the surface grow as the story asks for more room.",
      media: {
        kind: "gradient",
        variant: "screen",
        gradient: "linear-gradient(180deg, #f5f3ff 0%, #eef5ff 100%)",
        accent: "#7c3aed",
      },
    },
  },
  blurbs: {
    highlights: {
      title: "Highlights.",
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
          },
        },
        {
          id: "blurbs-rewrite",
          eyebrow: "Rewrite",
          title: "Keep your voice.",
          body: "Shift tone and structure while keeping the original signal intact.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #ecfdf5 0%, #f0fdfa 100%)",
            accent: "#14b8a6",
          },
        },
        {
          id: "blurbs-publish",
          eyebrow: "Shipping",
          title: "Ship faster.",
          body: "Move from transcript to usable draft to final publish flow without losing context.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #f0fdf4 0%, #eff6ff 100%)",
            accent: "#059669",
          },
        },
      ],
    },
    closerLook: {
      title: "Closer look.",
      items: [
        {
          id: "blurbs-transcript",
          label: "Transcript",
          title: "Keep the source close.",
          body: "You can trace every line of copy back to what was actually said, not to a disconnected prompt.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)",
            accent: "#0f766e",
          },
        },
        {
          id: "blurbs-audience",
          label: "Audience",
          title: "Write for each audience.",
          body: "Keep the message intact while adjusting framing for investors, builders, customers, or friends.",
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(180deg, #ecfeff 0%, #f0fdf4 100%)",
            accent: "#0ea5e9",
          },
        },
        {
          id: "blurbs-approval",
          label: "Approval",
          title: "A calmer review.",
          body: "Tighten the text, compare variants, and only publish once it sounds like something you would actually say.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #f0fdfa 0%, #eef2ff 100%)",
            accent: "#14b8a6",
          },
        },
        {
          id: "blurbs-publishing",
          label: "Publishing",
          title: "From talk to publish.",
          body: "The final move from spoken context into a clean outward-facing update can stay in one place.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #ecfdf5 0%, #eff6ff 100%)",
            accent: "#22c55e",
          },
        },
      ],
    },
    centerpiece: {
      eyebrow: "Blurbs",
      title: "Talk becomes copy.",
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
      title: "From draft to publish.",
      body: "This is the kind of section where a narrow, focused editor can open up into a full stage when the story needs room.",
      media: {
        kind: "gradient",
        variant: "stack",
        gradient: "linear-gradient(180deg, #ecfeff 0%, #eff6ff 100%)",
        accent: "#14b8a6",
      },
    },
  },
  spine: {
    highlights: {
      title: "Highlights.",
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
          },
        },
        {
          id: "spine-context",
          eyebrow: "Context",
          title: "Keep the arc in view.",
          body: "Important moments stay attached to their timeline, instead of dissolving into another infinite feed.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #fff7ed 0%, #eff6ff 100%)",
            accent: "#3b82f6",
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
          },
        },
      ],
    },
    closerLook: {
      title: "Closer look.",
      items: [
        {
          id: "spine-day",
          label: "Day view",
          title: "See the day clearly.",
          body: "A day can be readable at a glance, with just enough detail to help you jump back in.",
          media: {
            kind: "gradient",
            variant: "pillars",
            gradient: "linear-gradient(180deg, #fff7ed 0%, #f8fafc 100%)",
            accent: "#f59e0b",
          },
        },
        {
          id: "spine-week",
          label: "Week view",
          title: "Shape the week.",
          body: "Bigger spans can compress without feeling like you lost the important beats.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
            accent: "#3b82f6",
          },
        },
        {
          id: "spine-pins",
          label: "Pins",
          title: "Hold onto what matters.",
          body: "Decisions, commitments, and highlights can stay surfaced even as more time passes underneath them.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #fff7ed 0%, #eef2ff 100%)",
            accent: "#f97316",
          },
        },
        {
          id: "spine-archive",
          label: "Archive",
          title: "Archive, not erase.",
          body: "Older context should become quieter, not disappear.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #fffbeb 0%, #eff6ff 100%)",
            accent: "#f59e0b",
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
      title: "Let the timeline open up.",
      body: "This is a natural place for a narrow, intentional surface to become a broader scene as the reader scrolls deeper.",
      media: {
        kind: "gradient",
        variant: "screen",
        gradient: "linear-gradient(180deg, #fff7ed 0%, #eff6ff 100%)",
        accent: "#f59e0b",
      },
    },
  },
  vortex: {
    highlights: {
      title: "Highlights.",
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
          },
        },
        {
          id: "vortex-routing",
          eyebrow: "Routing",
          title: "Route intent.",
          body: "One question can move through agents, connectors, and sources without you juggling all of them manually.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #eef2ff 0%, #ecfeff 100%)",
            accent: "#2563eb",
          },
        },
        {
          id: "vortex-answers",
          eyebrow: "Answers",
          title: "Get answers faster.",
          body: "The result should feel like one coherent response, not a stitched set of tabs.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #ede9fe 0%, #ecfeff 100%)",
            accent: "#06b6d4",
          },
        },
      ],
    },
    closerLook: {
      title: "Closer look.",
      items: [
        {
          id: "vortex-sources",
          label: "Sources",
          title: "One question across it all.",
          body: "The point is not to flatten every source. It is to make them legible together.",
          media: {
            kind: "gradient",
            variant: "pillars",
            gradient: "linear-gradient(180deg, #ede9fe 0%, #ecfeff 100%)",
            accent: "#7c3aed",
          },
        },
        {
          id: "vortex-permissions",
          label: "Permissions",
          title: "Scoped access.",
          body: "Answers can be useful without turning every integration into a trust problem.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #eef2ff 0%, #f0fdfa 100%)",
            accent: "#2563eb",
          },
        },
        {
          id: "vortex-evidence",
          label: "Evidence",
          title: "Answers with receipts.",
          body: "The system should point back to the thread, event, file, or note that made the answer credible.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #ecfeff 0%, #eef2ff 100%)",
            accent: "#06b6d4",
          },
        },
        {
          id: "vortex-followup",
          label: "Follow-up",
          title: "Stay in one thread.",
          body: "Follow-up questions should feel like the same thread getting smarter, not like starting over.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #ede9fe 0%, #f8fafc 100%)",
            accent: "#7c3aed",
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
      title: "Smooth, end to end.",
      body: "A wider reveal makes sense here: start with a contained signal, then open up into the ambient system surface as the reader scrolls.",
      media: {
        kind: "gradient",
        variant: "pillars",
        gradient: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
        accent: "#8b5cf6",
      },
    },
  },
  passport: {
    highlights: {
      title: "Highlights.",
      slides: [
        {
          id: "passport-portable",
          eyebrow: "Portable",
          title: "Take yourself anywhere.",
          body: "Passport packages your credentials, reputation, and preferences into one portable identity layer.",
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(135deg, #ff6a00 0%, #ee0979 50%, #ff6a00 100%)",
            accent: "#ff2d55",
          },
        },
        {
          id: "passport-verifiable",
          eyebrow: "Verifiable",
          title: "Proof without oversharing.",
          body: "Share only what is needed. Passport supports selective disclosure so you stay in control of every claim.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(135deg, #f857a6 0%, #ff5858 50%, #ffc837 100%)",
            accent: "#ff3366",
          },
        },
        {
          id: "passport-interop",
          eyebrow: "Interop",
          title: "Works across chains.",
          body: "From Ethereum to Solana, from Discord to your portfolio site—Passport bridges the gaps.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)",
            accent: "#7c3aed",
          },
        },
      ],
    },
    closerLook: {
      title: "Closer look.",
      items: [
        {
          id: "passport-credentials",
          label: "Credentials",
          title: "Stack your proof.",
          body: "On-chain badges, work history, and peer attestations sit together as a living credential set.",
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
            accent: "#e11d48",
          },
        },
        {
          id: "passport-privacy",
          label: "Privacy",
          title: "Selective by design.",
          body: "Choose exactly which attributes to reveal per context—job applications, DAOs, or social platforms.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            accent: "#8b5cf6",
          },
        },
        {
          id: "passport-reputation",
          label: "Reputation",
          title: "Reputation that travels.",
          body: "Trust built on one platform does not vanish when you move to the next.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            accent: "#ec4899",
          },
        },
        {
          id: "passport-recovery",
          label: "Recovery",
          title: "Never locked out.",
          body: "Social recovery and backup keys ensure your identity survives device loss and platform changes.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            accent: "#0ea5e9",
          },
        },
      ],
    },
    centerpiece: {
      eyebrow: "Passport",
      title: "Your identity. Everywhere.",
      body: "Passport collapses fragmented identities into one portable layer. The goal is not another login—it is proving who you are without starting over.",
      ctaLabel: "Join Beta",
      ctaTo: "/#start",
      items: [
        {
          id: "passport-corner-1",
          position: "top-left",
          rotation: -8,
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
            accent: "#ff2d55",
          },
        },
        {
          id: "passport-corner-2",
          position: "top-right",
          rotation: 8,
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
            accent: "#d946ef",
          },
        },
        {
          id: "passport-corner-3",
          position: "bottom-left",
          rotation: -10,
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
            accent: "#dc2626",
          },
        },
        {
          id: "passport-corner-4",
          position: "bottom-right",
          rotation: 10,
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
            accent: "#7c3aed",
          },
        },
      ],
    },
    reveal: {
      eyebrow: "Identity layer",
      title: "One identity. Zero friction.",
      body: "Start contained, then expand. Passport opens from a single proof into a full portable presence as the context demands.",
      media: {
        kind: "gradient",
        variant: "fan",
        gradient: "linear-gradient(135deg, #1a0033 0%, #7c3aed 40%, #ec4899 70%, #ff6a00 100%)",
        accent: "#d946ef",
      },
    },
  },
  v1llains: {
    highlights: {
      title: "Highlights.",
      slides: [
        {
          id: "v1llains-stress",
          eyebrow: "Stress test",
          title: "Break it before they do.",
          body: "V1llains attack your strategy, pitch, or plan from every angle so you ship something that holds up.",
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(135deg, #0a0a0a 0%, #dc2626 40%, #f59e0b 100%)",
            accent: "#dc2626",
          },
        },
        {
          id: "v1llains-blindspots",
          eyebrow: "Blind spots",
          title: "See what you missed.",
          body: "Adversarial reasoning surfaces the assumptions you did not know you were making.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(135deg, #1c1917 0%, #b91c1c 50%, #ea580c 100%)",
            accent: "#ef4444",
          },
        },
        {
          id: "v1llains-clarity",
          eyebrow: "Clarity",
          title: "Sharper after every round.",
          body: "Each session distills the argument down to what actually matters—no filler survives.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(135deg, #0c0a09 0%, #f97316 40%, #dc2626 100%)",
            accent: "#f97316",
          },
        },
      ],
    },
    closerLook: {
      title: "Closer look.",
      items: [
        {
          id: "v1llains-adversary",
          label: "Adversary",
          title: "A worthy opponent.",
          body: "Each V1llain is tuned to a domain—finance, product, legal, technical—so the pushback is relevant, not generic.",
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(135deg, #0a0a0a 0%, #dc2626 100%)",
            accent: "#dc2626",
          },
        },
        {
          id: "v1llains-rounds",
          label: "Rounds",
          title: "Iterate through conflict.",
          body: "Arguments happen in rounds—each pass tightens the logic and exposes new edges.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(135deg, #1c1917 0%, #b91c1c 100%)",
            accent: "#ef4444",
          },
        },
        {
          id: "v1llains-artifacts",
          label: "Artifacts",
          title: "Decisions, not debates.",
          body: "Every session produces a clear artifact: what survived, what changed, and why.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(135deg, #0c0a09 0%, #f97316 50%, #dc2626 100%)",
            accent: "#f97316",
          },
        },
        {
          id: "v1llains-privacy",
          label: "Privacy",
          title: "Your sparring ring.",
          body: "Sessions are private by default—what happens in a V1llain session stays there unless you share it.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(135deg, #0a0a0a 0%, #ea580c 50%, #fbbf24 100%)",
            accent: "#ea580c",
          },
        },
      ],
    },
    centerpiece: {
      eyebrow: "V1llains",
      title: "Forged in opposition.",
      body: "V1llains exist because the best ideas are the ones that survive their toughest critic. This is not about negativity—it is about pressure-tested clarity.",
      ctaLabel: "Join Beta",
      ctaTo: "/#start",
      items: [
        {
          id: "v1llains-corner-1",
          position: "top-left",
          rotation: -8,
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(135deg, #0a0a0a 0%, #dc2626 100%)",
            accent: "#dc2626",
          },
        },
        {
          id: "v1llains-corner-2",
          position: "top-right",
          rotation: 8,
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(135deg, #1c1917 0%, #b91c1c 100%)",
            accent: "#ef4444",
          },
        },
        {
          id: "v1llains-corner-3",
          position: "bottom-left",
          rotation: -10,
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(135deg, #0c0a09 0%, #f97316 100%)",
            accent: "#f97316",
          },
        },
        {
          id: "v1llains-corner-4",
          position: "bottom-right",
          rotation: 10,
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(135deg, #0a0a0a 0%, #ea580c 100%)",
            accent: "#ea580c",
          },
        },
      ],
    },
    reveal: {
      eyebrow: "Battle-tested",
      title: "What survives is real.",
      body: "A contained challenge widens into full clarity. V1llains open the way pressure opens—tight at first, then expansive once the weak points break away.",
      media: {
        kind: "gradient",
        variant: "fan",
        gradient: "linear-gradient(180deg, #0a0a0a 0%, #dc2626 40%, #f97316 70%, #0a0a0a 100%)",
        accent: "#dc2626",
      },
    },
  },
  realms: {
    highlights: {
      title: "Highlights.",
      slides: [
        {
          id: "realms-worlds",
          eyebrow: "Worlds",
          title: "Build a world, not a page.",
          body: "Realms are persistent themed environments that adapt layout, tone, and atmosphere to their creator.",
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(135deg, #0f172a 0%, #7c3aed 40%, #06b6d4 100%)",
            accent: "#7c3aed",
          },
        },
        {
          id: "realms-rules",
          eyebrow: "Rules",
          title: "Set the physics.",
          body: "Control who enters, what they see, and how content surfaces—without writing a single line of config.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #22d3ee 100%)",
            accent: "#6366f1",
          },
        },
        {
          id: "realms-community",
          eyebrow: "Community",
          title: "Invite on your terms.",
          body: "Realms can be open, gated, or invitation-only—community size and access grow with trust.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(135deg, #0c0a09 0%, #a855f7 40%, #2dd4bf 100%)",
            accent: "#a855f7",
          },
        },
      ],
    },
    closerLook: {
      title: "Closer look.",
      items: [
        {
          id: "realms-environment",
          label: "Environment",
          title: "A space, not a feed.",
          body: "Each realm holds its own visual gravity—colors, typography, and layout rules shaped by the creator.",
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(135deg, #0f172a 0%, #7c3aed 100%)",
            accent: "#7c3aed",
          },
        },
        {
          id: "realms-access",
          label: "Access",
          title: "Gated by design.",
          body: "Token-gated, invite-only, or open to the public—access rules live at the realm level.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)",
            accent: "#6366f1",
          },
        },
        {
          id: "realms-memory",
          label: "Memory",
          title: "Realms remember.",
          body: "Activity, conversations, and shared artifacts persist inside the realm's own timeline.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(135deg, #0c0a09 0%, #a855f7 50%, #06b6d4 100%)",
            accent: "#a855f7",
          },
        },
        {
          id: "realms-identity",
          label: "Identity",
          title: "Show up differently.",
          body: "Your Passport adapts to each realm—surface the credentials and context that matter in that space.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(135deg, #0f172a 0%, #22d3ee 50%, #7c3aed 100%)",
            accent: "#06b6d4",
          },
        },
      ],
    },
    centerpiece: {
      eyebrow: "Realms",
      title: "Your world. Your rules.",
      body: "Realms collapse the gap between identity and community. The space shapes itself around the people inside it.",
      ctaLabel: "Join Beta",
      ctaTo: "/#start",
      items: [
        {
          id: "realms-corner-1",
          position: "top-left",
          rotation: -8,
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(135deg, #0f172a 0%, #7c3aed 100%)",
            accent: "#7c3aed",
          },
        },
        {
          id: "realms-corner-2",
          position: "top-right",
          rotation: 8,
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)",
            accent: "#6366f1",
          },
        },
        {
          id: "realms-corner-3",
          position: "bottom-left",
          rotation: -10,
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(135deg, #0c0a09 0%, #a855f7 100%)",
            accent: "#a855f7",
          },
        },
        {
          id: "realms-corner-4",
          position: "bottom-right",
          rotation: 10,
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(135deg, #0f172a 0%, #06b6d4 100%)",
            accent: "#06b6d4",
          },
        },
      ],
    },
    reveal: {
      eyebrow: "Sovereign space",
      title: "Enter the realm.",
      body: "A contained portal widens into a full environment. Realms open the way a dimension unfolds—quietly at first, then all at once.",
      media: {
        kind: "gradient",
        variant: "fan",
        gradient: "linear-gradient(180deg, #0f172a 0%, #7c3aed 40%, #06b6d4 70%, #0f172a 100%)",
        accent: "#7c3aed",
      },
    },
  },
  orb: {
    highlights: {
      title: "Highlights.",
      slides: [
        {
          id: "orb-immersive",
          eyebrow: "Immersive",
          title: "Step inside the show.",
          body: "Orb drops you into a generative environment that reacts to the music\u2014light, terrain, and atmosphere shift with every beat.",
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(135deg, #000000 0%, #00FF88 30%, #00FFCC 60%, #0A0A0A 100%)",
            accent: "#00FFB2",
          },
        },
        {
          id: "orb-reactive",
          eyebrow: "Reactive",
          title: "Visuals that breathe.",
          body: "The stage is alive\u2014procedural geometry and particle systems respond to frequency, amplitude, and crowd energy in real time.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(135deg, #0A0014 0%, #6E00FF 40%, #00FFAA 100%)",
            accent: "#7C3AED",
          },
        },
        {
          id: "orb-spatial",
          eyebrow: "Spatial",
          title: "Sound that surrounds.",
          body: "Spatial audio places instruments and voices in three-dimensional space\u2014move through the mix like you are walking the venue.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(135deg, #000D1A 0%, #0066FF 35%, #00FFEE 70%, #001A0D 100%)",
            accent: "#0EA5E9",
          },
        },
      ],
    },
    closerLook: {
      title: "Closer look.",
      items: [
        {
          id: "orb-environment",
          label: "Environment",
          title: "Worlds built for sound.",
          body: "Each show generates a unique landscape\u2014alien terrain, orbiting structures, bioluminescent fog\u2014shaped by the artist's sonic palette.",
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(135deg, #000000 0%, #00FF88 50%, #001A0D 100%)",
            accent: "#00FF88",
          },
        },
        {
          id: "orb-crowd",
          label: "Crowd",
          title: "Presence without proximity.",
          body: "Feel the audience around you\u2014collective energy, movement, and reactions shape the environment in real time.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(135deg, #0A0014 0%, #8B00FF 40%, #FF00AA 100%)",
            accent: "#A855F7",
          },
        },
        {
          id: "orb-artist",
          label: "Artist",
          title: "A stage without limits.",
          body: "Artists control the generative canvas\u2014trigger visual events, morph the terrain, and sculpt the light as part of the performance.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(135deg, #000D1A 0%, #0066FF 30%, #00FFCC 70%, #000000 100%)",
            accent: "#3B82F6",
          },
        },
        {
          id: "orb-archive",
          label: "Archive",
          title: "Shows that live on.",
          body: "Every Orb is recorded as a spatial artifact\u2014reenter past concerts, walk through the crowd, and relive the moment from any angle.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(135deg, #0A000A 0%, #6E00FF 35%, #00FF88 75%, #000000 100%)",
            accent: "#D946EF",
          },
        },
      ],
    },
    centerpiece: {
      eyebrow: "Orb",
      title: "The show lands here.",
      body: "Orb is what happens when a concert and an alien encounter share the same coordinates. The stage is infinite, the crowd is everywhere, and the music shapes the world.",
      ctaLabel: "Join Beta",
      ctaTo: "/#start",
      items: [
        {
          id: "orb-corner-1",
          position: "top-left",
          rotation: -8,
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(135deg, #000000 0%, #00FF88 100%)",
            accent: "#00FFB2",
          },
        },
        {
          id: "orb-corner-2",
          position: "top-right",
          rotation: 8,
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(135deg, #0A0014 0%, #8B00FF 100%)",
            accent: "#7C3AED",
          },
        },
        {
          id: "orb-corner-3",
          position: "bottom-left",
          rotation: -10,
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(135deg, #000D1A 0%, #0066FF 50%, #00FFEE 100%)",
            accent: "#0EA5E9",
          },
        },
        {
          id: "orb-corner-4",
          position: "bottom-right",
          rotation: 10,
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(135deg, #000000 0%, #6E00FF 50%, #FF00AA 100%)",
            accent: "#D946EF",
          },
        },
      ],
    },
    reveal: {
      eyebrow: "Touchdown",
      title: "The ship has landed.",
      body: "A narrow beam of light widens into a full-stage spectacle. Orb opens the way a landing craft opens\u2014slow, deliberate, then overwhelmingly present.",
      media: {
        kind: "gradient",
        variant: "fan",
        gradient: "linear-gradient(180deg, #000000 0%, #001A0D 20%, #00FF88 50%, #6E00FF 80%, #000000 100%)",
        accent: "#00FFB2",
      },
    },
  },
};
