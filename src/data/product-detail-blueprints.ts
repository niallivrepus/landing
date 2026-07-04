import type { ProductId } from "./products";

export type ProductDetailMedia =
  | {
      kind: "gradient";
      gradient: string;
      darkGradient?: string;
      accent?: string;
      variant?: "fan" | "screen" | "slab" | "pillars" | "stack";
    }
  | {
      kind: "image";
      src: string;
      alt: string;
      objectPosition?: string;
      flipX?: boolean;
    }
  | {
      kind: "themeImage";
      lightSrc: string;
      darkSrc: string;
      alt: string;
      objectPosition?: string;
    }
  | {
      kind: "video";
      src: string;
      poster?: string;
      alt?: string;
    }
  | {
      kind: "blurbSequence";
      items: {
        lightSrc: string;
        darkSrc: string;
        alt: string;
      }[];
    }
  | {
      kind: "blurbTravelFlow";
    }
  | {
      kind: "blurbCallScene";
      panelPlacement?: "center" | "closerLookRight";
      backgroundImage?: string;
      callTitle: string;
      callStatus: string;
      participants: {
        src: string;
        borderColor: string;
        alt: string;
      }[];
      subtitles: {
        speaker: string;
        text: string;
      }[];
    }
  | {
      kind: "blurbImageCarousel";
      items: {
        lightSrc: string;
        darkSrc: string;
        alt: string;
      }[];
    }
  | {
      kind: "blurbPublishButton";
    }
  | {
      kind: "promptBar";
      turns: {
        prompt: string;
        response: string;
      }[];
    }
  | {
      kind: "profileHighlight";
      variant:
        | "identity"
        | "biography"
        | "network"
        | "personality"
        | "customize"
        | "claim";
    }
  | {
      kind: "spineHighlight";
      variant:
        | "todayBrief"
        | "timeline"
        | "memories"
        | "planner"
        | "moodSky"
        | "lifelog"
        | "search"
        | "recap";
    };

export type ProductHighlightSlide = {
  id: string;
  eyebrow?: string;
  title: string;
  titleAlign?: "left" | "center";
  titlePosition?: "top" | "bottom" | "left-center" | "right-center";
  titleTone?: "default" | "light";
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
    defaultMedia?: ProductDetailMedia;
    items: ProductCloserLookItem[];
  };
  centerpiece: {
    eyebrow?: string;
    title: string;
    body?: string;
    ctaLabel?: string;
    ctaTo?: string;
    items: ProductCenterpieceItem[];
    backgroundImage?: string;
    surfaceTone?: "default" | "neutral";
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
      ctaTo: "/download",
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
          title: "Born from the calls and chats you're already in.",
          body: "Blurbs begin from real meetings, chats, and voice notes instead of a blank page.",
          media: {
            kind: "blurbImageCarousel",
            items: [
              {
                lightSrc: "/blurbs/light-1.png",
                darkSrc: "/blurbs/dark-1.png",
                alt: "Blurb card preview 1",
              },
              {
                lightSrc: "/blurbs/light-2.png",
                darkSrc: "/blurbs/dark-2.png",
                alt: "Blurb card preview 2",
              },
              {
                lightSrc: "/blurbs/light-3.png",
                darkSrc: "/blurbs/dark-3.png",
                alt: "Blurb card preview 3",
              },
              {
                lightSrc: "/blurbs/light-4.png",
                darkSrc: "/blurbs/dark-4.png",
                alt: "Blurb card preview 4",
              },
            ],
          },
        },
        {
          id: "blurbs-rewrite",
          eyebrow: "Rewrite",
          title: "Capture your data as it happens.",
          titleAlign: "left",
          titlePosition: "left-center",
          titleTone: "light",
          body: "Shift tone and structure while keeping the original signal intact.",
          media: {
            kind: "blurbCallScene",
            panelPlacement: "closerLookRight",
            callTitle: "Blurb review",
            callStatus: "Live call",
            participants: [
              {
                src: "/aliens/alien-0001.jpg",
                borderColor: "#77FF00",
                alt: "Call participant one",
              },
              {
                src: "/aliens/alien-0002.jpg",
                borderColor: "#00D4FF",
                alt: "Call participant two",
              },
              {
                src: "/aliens/alien-0003.jpg",
                borderColor: "#FF00E5",
                alt: "Call participant three",
              },
            ],
            subtitles: [
              {
                speaker: "Maya",
                text: "That phrase is the update.",
              },
              {
                speaker: "You",
                text: "Keep the tone casual, but make it usable.",
              },
              {
                speaker: "Maya",
                text: "Save both versions before we hang up.",
              },
            ],
          },
        },
        {
          id: "blurbs-publish",
          eyebrow: "Shipping",
          title: "Yours by the time\nyou hang up.",
          titleTone: "light",
          body: "Move from transcript to usable draft to final publish flow without losing context.",
          media: {
            kind: "video",
            src: "/blurbs/yours-by-the-time-you-hang-up.mp4",
            poster: "/blurbs/hang-up-background.jpg",
            alt: "Young woman in a candid call moment",
          },
        },
      ],
    },
    closerLook: {
      title: "Closer look.",
      defaultMedia: {
        kind: "video",
        src: "/blurbs/closer-look-default.mp4",
        alt: "Blurbs product preview video",
      },
      items: [
        {
          id: "blurbs-transcript",
          label: "Transcript",
          title: "Keep the source close.",
          body: "Real talk with people you already know, captured, not invented.",
          media: {
            kind: "blurbCallScene",
            panelPlacement: "closerLookRight",
            backgroundImage: "/blurbs/transcript-background.png",
            callTitle: "Transcript capture",
            callStatus: "Live call",
            participants: [
              {
                src: "/aliens/alien-0001.jpg",
                borderColor: "#77FF00",
                alt: "Call participant one",
              },
              {
                src: "/aliens/alien-0002.jpg",
                borderColor: "#00D4FF",
                alt: "Call participant two",
              },
              {
                src: "/aliens/alien-0003.jpg",
                borderColor: "#FF00E5",
                alt: "Call participant three",
              },
            ],
            subtitles: [
              {
                speaker: "Maya",
                text: "This is the part we should keep.",
              },
              {
                speaker: "You",
                text: "Capture it with the context around it.",
              },
              {
                speaker: "OO",
                text: "Saved to the transcript. Ready to turn into a blurb.",
              },
            ],
          },
        },
        {
          id: "blurbs-audience",
          label: "Audience",
          title: "Only for the right people.",
          body: "Every blurb lands with the audience allowed to see it, friends, founders, customers, or family.",
          media: {
            kind: "themeImage",
            lightSrc: "/blurbs/audience-responses-light.png",
            darkSrc: "/blurbs/audience-responses-dark.png",
            alt: "Audience-specific blurb responses",
            objectPosition: "center",
          },
        },
        {
          id: "blurbs-approval",
          label: "Approval",
          title: "A calmer review.",
          body: "Pick the version that sounds like you, not the model.",
          media: {
            kind: "themeImage",
            lightSrc: "/blurbs/approval-interests-light.png",
            darkSrc: "/blurbs/approval-interests-dark.png",
            alt: "Interest selection cards for approval",
            objectPosition: "center",
          },
        },
        {
          id: "blurbs-publishing",
          label: "Publishing",
          title: "From talk to publish.",
          body: "Back to the same circle. One tap out, one tap back.",
          media: {
            kind: "blurbPublishButton",
          },
        },
      ],
    },
    centerpiece: {
      eyebrow: "Blurbs",
      title: "Talk becomes your product data.",
      body: "When Jokuh is with you in the conversation, every blurb becomes useful context for you and your community. The right people can prompt against what was said, improve the shared memory, and turn everyday talk into momentum.",
      ctaLabel: "Join Beta",
      ctaTo: "/download",
      items: [],
      surfaceTone: "neutral",
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
          id: "spine-today-brief",
          eyebrow: "Today Brief",
          title: "OO reads your day before you do.",
          body: "A conversational morning layer — greeting, counts, action queue, and what needs you today. Optional push lands you here each morning.",
          media: { kind: "spineHighlight", variant: "todayBrief" },
        },
        {
          id: "spine-timeline",
          eyebrow: "Timeline",
          title: "Every day of your life, on one timeline.",
          body: "Year accordion, expandable days, hour capsules, and drag planner items across the week. Jump to today in one tap.",
          media: { kind: "spineHighlight", variant: "timeline" },
        },
        {
          id: "spine-memories",
          eyebrow: "Lifelog",
          title: "Calls, captures, and moments land automatically.",
          body: "Thirty-plus memory kinds — transcripts, screenshots, wallet moves, Arcade sessions, browser visits, and Profile Live streams write back to Spine.",
          media: { kind: "spineHighlight", variant: "memories" },
        },
        {
          id: "spine-planner",
          eyebrow: "Planner",
          title: "Notes, tasks, reminders, and files — per day.",
          body: "Five planner tabs on every expanded day: sticky notes with OO autocomplete, checklists, timed reminders, and a file library synced to the cloud.",
          media: { kind: "spineHighlight", variant: "planner" },
        },
        {
          id: "spine-mood-sky",
          eyebrow: "Wellbeing",
          title: "Mood, Sky Lens, and ambient signals.",
          body: "Log how you feel on an eight-mood rail. Daily Sky Lens readings, weather, hydration nudges, and rhythm hints stay on your timeline — patterns, not forecasts.",
          media: { kind: "spineHighlight", variant: "moodSky" },
        },
        {
          id: "spine-lifelog",
          eyebrow: "Import",
          title: "Calendar and photos sync — local first.",
          body: "Mirror Apple or Google calendar, backfill PhotoKit moments onto the right days, and capture screenshots with a press-and-hold. Your manifest syncs when you sign in.",
          media: { kind: "spineHighlight", variant: "lifelog" },
        },
      ],
    },
    closerLook: {
      title: "Closer look.",
      defaultMedia: { kind: "spineHighlight", variant: "timeline" },
      items: [
        {
          id: "spine-brief-orientation",
          label: "Today Brief",
          title: "Start on what needs you.",
          body: "Spine opens with today expanded — not a blank calendar. OO surfaces greeting copy, inline counts, quick-action pills, and optional Morning Brief push before you touch the timeline.",
          media: { kind: "spineHighlight", variant: "todayBrief" },
        },
        {
          id: "spine-year-timeline",
          label: "Year timeline",
          title: "Months accordion, days expand.",
          body: "One month open at a time with a live center playhead. Tap a day for hour capsules, drag planner items across rows, and filter memories by connection without losing the arc.",
          media: { kind: "spineHighlight", variant: "timeline" },
        },
        {
          id: "spine-day-planner",
          label: "Day planner",
          title: "Five tabs on every day.",
          body: "Notes with OO autocomplete, tasks, timed reminders, a per-day file library, and a centered Memories tab. Sticky notes accept voice and file attachments — same manifest syncs to every device.",
          media: { kind: "spineHighlight", variant: "planner" },
        },
        {
          id: "spine-memory-lifelog",
          label: "Lifelog",
          title: "Thirty-plus memory kinds.",
          body: "Call transcripts, meetings, screenshots, wallet moves, browser visits, Arcade sessions, and Profile Live streams append to your timeline automatically — each with Pattern Library chips you can search and reopen.",
          media: { kind: "spineHighlight", variant: "memories" },
        },
        {
          id: "spine-mood-sky",
          label: "Mood + Sky",
          title: "Feelings and ephemeris on the rail.",
          body: "Eight vertical emotion pills flank Today Brief. Log mood with an optional because note, then read Daily Sky Lens transits beside weather, hydration, and rhythm hints — patterns from your timeline, not forecasts.",
          media: { kind: "spineHighlight", variant: "moodSky" },
        },
        {
          id: "spine-import",
          label: "Life import",
          title: "Calendar and photos, local first.",
          body: "Mirror Apple or Google calendar thirty days back and fourteen forward. PhotoKit moments land on the correct day keys. Press-and-hold captures screenshots and screen recordings straight into memories.",
          media: { kind: "spineHighlight", variant: "lifelog" },
        },
        {
          id: "spine-search-recall",
          label: "Search",
          title: "Find it. Resurface it.",
          body: "AND-token search across summaries, transcripts, and chip labels. Streaks celebrate consecutive authoring days; on-this-day and month-in-review cards keep older context alive without erasing it.",
          media: { kind: "spineHighlight", variant: "search" },
        },
        {
          id: "spine-retention",
          label: "Retention",
          title: "Archive, not erase.",
          body: "Day 14 streaks, three-years-ago memories, and month-in-review stats — top mood, busiest day, tasks done — so Spine compounds like a second memory instead of another feed.",
          media: { kind: "spineHighlight", variant: "recap" },
        },
      ],
    },
    centerpiece: {
      eyebrow: "Spine",
      title: "Your operating timeline.",
      body: "Spine is the long-term home for structured personal context — data, files, memories, and activity. Not a feed that erases context. A history OO can actually work with.",
      ctaLabel: "Join Beta",
      ctaTo: "/download",
      items: [
        {
          id: "spine-corner-1",
          position: "top-left",
          rotation: -8,
          media: { kind: "spineHighlight", variant: "todayBrief" },
        },
        {
          id: "spine-corner-2",
          position: "top-right",
          rotation: 8,
          media: { kind: "spineHighlight", variant: "memories" },
        },
        {
          id: "spine-corner-3",
          position: "bottom-left",
          rotation: -10,
          media: { kind: "spineHighlight", variant: "planner" },
        },
        {
          id: "spine-corner-4",
          position: "bottom-right",
          rotation: 10,
          media: { kind: "spineHighlight", variant: "moodSky" },
        },
      ],
    },
    reveal: {
      eyebrow: "Timeline reveal",
      title: "Your whole life, one scroll away.",
      body: "Highlights show the surfaces. Closer look walks the workflows — brief, planner, lifelog, mood, import, and recall — with the same UI you get in the app.",
      media: { kind: "spineHighlight", variant: "timeline" },
    },
  },
  calls: {
    highlights: {
      title: "Highlights.",
      slides: [
        {
          id: "calls-room",
          eyebrow: "Room",
          title: "Close while the room is live.",
          titleTone: "light",
          body: "Calls keeps the full deal context intact: who pushed, who paused, and what changed before anyone left the room.",
          media: {
            kind: "blurbCallScene",
            panelPlacement: "center",
            backgroundImage: "/product-hero/calls-room-deal.png",
            callTitle: "Sterling close",
            callStatus: "Deal room",
            participants: [
              {
                src: "/aliens/alien-0001.jpg",
                borderColor: "#77FF00",
                alt: "James on the call",
              },
              {
                src: "/aliens/alien-0002.jpg",
                borderColor: "#00D4FF",
                alt: "Sterling on the call",
              },
              {
                src: "/aliens/alien-0003.jpg",
                borderColor: "#FF00E5",
                alt: "OO listening to the close",
              },
            ],
            subtitles: [
              {
                speaker: "Sterling",
                text: "I can lead it if we close today.",
              },
              {
                speaker: "James",
                text: "Then name the blocker before six.",
              },
              {
                speaker: "Sterling",
                text: "Legal is clear. I need your yes.",
              },
              {
                speaker: "James",
                text: "Send the room the final terms.",
              },
              {
                speaker: "OO",
                text: "Drafting close notes and next steps.",
              },
            ],
          },
        },
        {
          id: "calls-moments",
          eyebrow: "Moments",
          title: "Pull Up What Matters.",
          body: "Ask from the call context and OO returns the decision, blocker, and next move without replaying the room.",
          media: {
            kind: "promptBar",
            turns: [
              {
                prompt: "What did Emma schedule this week?",
                response: "Emma moved your week around the close: office at 6pm today with Sterling, investor follow-up tomorrow morning, and a prep block before Friday's board update.",
              },
              {
                prompt: "What do I owe Sterling?",
                response: "Final terms, a yes on leadership, and the room notes before he arrives.",
              },
              {
                prompt: "What did Sterling say on the closing call?",
                response: "Sterling said he wants to lead, legal is clear, and he can close today if you approve final terms before he reaches your office.",
              },
              {
                prompt: "What should I do next?",
                response: "Stay off the flight, meet Sterling at 6pm, and send the final terms now.",
              },
            ],
          },
        },
        {
          id: "calls-action",
          eyebrow: "Action",
          title: "Move after the call.",
          titleTone: "light",
          body: "Turn a good conversation into the next message, draft, or task while the context is still warm.",
          media: {
            kind: "image",
            src: "/product-hero/calls-move-after-call.png",
            alt: "OO preparing the next action after a call.",
            objectPosition: "center center",
          },
        },
      ],
    },
    closerLook: {
      title: "Closer look.",
      items: [
        {
          id: "calls-live",
          label: "Live",
          title: "Stay present.",
          body: "The system listens for structure in the background so the call can still feel like a call.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
            accent: "#2563eb",
          },
        },
        {
          id: "calls-recap",
          label: "Recap",
          title: "Return to the signal.",
          body: "Recaps keep the strongest moments easy to scan without losing the route back to the source.",
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(180deg, #ecfeff 0%, #eef2ff 100%)",
            accent: "#0ea5e9",
          },
        },
        {
          id: "calls-followups",
          label: "Follow-ups",
          title: "Keep promises visible.",
          body: "Action items stay attached to the conversation that created them.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #f0fdfa 0%, #eff6ff 100%)",
            accent: "#14b8a6",
          },
        },
        {
          id: "calls-sharing",
          label: "Sharing",
          title: "Share the right amount.",
          body: "Send the useful context without exposing the whole call to everyone.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%)",
            accent: "#6366f1",
          },
        },
      ],
    },
    centerpiece: {
      eyebrow: "Calls",
      title: "Conversation with memory.",
      body: "Calls gives live conversation a durable shape so the best parts do not vanish when the room closes.",
      ctaLabel: "Join Beta",
      ctaTo: "/download",
      items: [
        {
          id: "calls-corner-1",
          position: "top-left",
          rotation: -8,
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #eef2ff 0%, #ecfeff 100%)",
            accent: "#2563eb",
          },
        },
        {
          id: "calls-corner-2",
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
          id: "calls-corner-3",
          position: "bottom-left",
          rotation: -10,
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(180deg, #ecfeff 0%, #f0fdfa 100%)",
            accent: "#06b6d4",
          },
        },
        {
          id: "calls-corner-4",
          position: "bottom-right",
          rotation: 10,
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #eef2ff 0%, #f0fdfa 100%)",
            accent: "#14b8a6",
          },
        },
      ],
    },
    reveal: {
      eyebrow: "Call memory",
      title: "Let the conversation open up.",
      body: "A short recap can expand into the full shape of the conversation when the details matter.",
      media: {
        kind: "gradient",
        variant: "screen",
        gradient: "linear-gradient(180deg, #eef2ff 0%, #ecfeff 100%)",
        accent: "#2563eb",
      },
    },
  },
  messages: {
    highlights: {
      title: "Highlights.",
      slides: [
        {
          id: "messages-context",
          eyebrow: "Context",
          title: "Keep the story together.",
          body: "Messages links threads to the people, projects, and moments they actually belong to.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #faf5ff 0%, #eef2ff 100%)",
            accent: "#8b5cf6",
          },
        },
        {
          id: "messages-return",
          eyebrow: "Return",
          title: "Find the thread faster.",
          body: "Return to the right exchange without remembering which app or channel held it.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #f5f3ff 0%, #eff6ff 100%)",
            accent: "#6366f1",
          },
        },
        {
          id: "messages-people",
          eyebrow: "People",
          title: "Keep people at the center.",
          body: "The message stays attached to the relationship, not just the inbox.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #fdf2f8 0%, #eef2ff 100%)",
            accent: "#a855f7",
          },
        },
      ],
    },
    closerLook: {
      title: "Closer look.",
      items: [
        {
          id: "messages-threads",
          label: "Threads",
          title: "Threads stay readable.",
          body: "Long-running conversations can compress into the moments that still need attention.",
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #faf5ff 0%, #f8fafc 100%)",
            accent: "#8b5cf6",
          },
        },
        {
          id: "messages-memory",
          label: "Memory",
          title: "Context comes back.",
          body: "Past details can resurface when they explain the message in front of you.",
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(180deg, #eef2ff 0%, #f5f3ff 100%)",
            accent: "#6366f1",
          },
        },
        {
          id: "messages-next",
          label: "Next",
          title: "Know what comes next.",
          body: "The system can separate passing chatter from the reply, commitment, or update that matters.",
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #f5f3ff 0%, #eff6ff 100%)",
            accent: "#7c3aed",
          },
        },
        {
          id: "messages-private",
          label: "Private",
          title: "Keep boundaries clear.",
          body: "Personal threads and shared context stay scoped to where they belong.",
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #faf5ff 0%, #eef2ff 100%)",
            accent: "#a855f7",
          },
        },
      ],
    },
    centerpiece: {
      eyebrow: "Texts",
      title: "Threads with memory.",
      body: "Messages makes communication feel less scattered by keeping the human context close to every exchange.",
      ctaLabel: "Join Beta",
      ctaTo: "/download",
      items: [
        {
          id: "messages-corner-1",
          position: "top-left",
          rotation: -8,
          media: {
            kind: "gradient",
            variant: "screen",
            gradient: "linear-gradient(180deg, #faf5ff 0%, #eef2ff 100%)",
            accent: "#8b5cf6",
          },
        },
        {
          id: "messages-corner-2",
          position: "top-right",
          rotation: 8,
          media: {
            kind: "gradient",
            variant: "slab",
            gradient: "linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%)",
            accent: "#6366f1",
          },
        },
        {
          id: "messages-corner-3",
          position: "bottom-left",
          rotation: -10,
          media: {
            kind: "gradient",
            variant: "fan",
            gradient: "linear-gradient(180deg, #f5f3ff 0%, #eff6ff 100%)",
            accent: "#7c3aed",
          },
        },
        {
          id: "messages-corner-4",
          position: "bottom-right",
          rotation: 10,
          media: {
            kind: "gradient",
            variant: "stack",
            gradient: "linear-gradient(180deg, #faf5ff 0%, #eef2ff 100%)",
            accent: "#a855f7",
          },
        },
      ],
    },
    reveal: {
      eyebrow: "Thread reveal",
      title: "Let the context widen.",
      body: "A single message can open into the history, people, and decisions that explain why it matters.",
      media: {
        kind: "gradient",
        variant: "screen",
        gradient: "linear-gradient(180deg, #faf5ff 0%, #eef2ff 100%)",
        accent: "#8b5cf6",
      },
    },
  },
  profile: {
    highlights: {
      title: "Highlights.",
      slides: [
        {
          id: "profile-identity",
          eyebrow: "Identity",
          title: "Your anchor.\nOO reads who you are.",
          body: "Photo, display name, and @handle — identity you own, not lease. OO treats this row as your anchor: the first signal of who you are as a person, carried into every chat, call, and connection.",
          media: { kind: "profileHighlight", variant: "identity" },
        },
        {
          id: "profile-biography",
          eyebrow: "Biography",
          title: "Your story,\nnot a character limit.",
          body: "The biography pod holds the long-form you — links, references, tone, and context a 160-character bio could never carry. OO learns your voice from what you write here, so advice and replies sound like you, not a template.",
          media: { kind: "profileHighlight", variant: "biography" },
        },
        {
          id: "profile-network",
          eyebrow: "Network",
          title: "Real connections.\nOO helps you navigate them.",
          body: "The network strip shows people you actually know — mutual connections, not vanity metrics. OO uses your orbit to understand relationships: who to loop in, how to show up, and what context matters when you reach out.",
          media: { kind: "profileHighlight", variant: "network" },
        },
        {
          id: "profile-context",
          eyebrow: "Personality",
          title: "Profile feeds OO.\nSmarter, not generic.",
          body: "Profile ties into Spine so OO remembers your personality, boundaries, interests, and rhythms. You are not reintroducing yourself in every surface — the identity layer compounds, and AI meets you as a person, not a blank prompt.",
          media: { kind: "profileHighlight", variant: "personality" },
        },
        {
          id: "profile-customize",
          eyebrow: "Customize",
          title: "Make it feel\nlike home.",
          body: "Wallpaper, status, interests, and which blurbs appear on your profile. Every choice teaches OO how you want to be seen — public, private, or shared with a smaller circle — without breaking Jokuh's visual language.",
          media: { kind: "profileHighlight", variant: "customize" },
        },
        {
          id: "profile-claim",
          eyebrow: "Claim",
          title: "Claim yours.\nOO starts learning.",
          body: "Replace the placeholder with your name, your photo, and the people in your orbit. Download Jokuh, pick a handle, and your profile goes live — OO begins building context about who you are from day one.",
          media: { kind: "profileHighlight", variant: "claim" },
        },
      ],
    },
    closerLook: {
      title: "Closer look.",
      items: [
        {
          id: "profile-biography-pod",
          label: "Biography",
          title: "The biography pod.",
          body: "Write the long-form story behind your squircle — links, references, tone, and context cards visitors can actually read. Edit inline and reorder sections without rebuilding the page from scratch.",
          media: {
            kind: "image",
            src: "/story-art/story-office-focus.png",
            alt: "Person focused at a desk.",
            objectPosition: "center center",
          },
        },
        {
          id: "profile-network-strip",
          label: "Network",
          title: "Your real orbit.",
          body: "The network strip surfaces mutual connections — people you know, not follower counts. Connect and message from the same identity surface without sending visitors to another app.",
          media: {
            kind: "image",
            src: "/story-art/story-office-collab.png",
            alt: "Two people collaborating in an office.",
            objectPosition: "center center",
          },
        },
        {
          id: "profile-customization",
          label: "Style",
          title: "Wallpaper, status, blurbs.",
          body: "Set wallpaper, interests, and presence status. Choose which blurbs and pods appear on your profile, and what stays private until the right context asks for it.",
          media: {
            kind: "image",
            src: "/story-art/story-office-smile.png",
            alt: "Person smiling in an office.",
            objectPosition: "center center",
          },
        },
        {
          id: "profile-spine-context",
          label: "Context",
          title: "Remembered across the OS.",
          body: "Profile connects to Spine so agents and surfaces carry your identity forward — boundaries, relationships, and rhythms — without you repeating yourself in every conversation.",
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
      body: "Compose biography, network, and pods into one sovereign surface — then share a link that still feels personal.",
      ctaLabel: "Claim yours",
      ctaTo: "/download",
      items: [
        {
          id: "profile-corner-1",
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
          id: "profile-corner-2",
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
          id: "profile-corner-3",
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
          id: "profile-corner-4",
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
      title: "A profile that grows with you.",
      body: "Start with a name and a photo. Add biography, connections, blurbs, and pods as your story asks for more room — without rebuilding from scratch on every platform.",
      media: {
        kind: "gradient",
        variant: "screen",
        gradient: "linear-gradient(180deg, #f5f3ff 0%, #eef5ff 100%)",
        accent: "#7c3aed",
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
      ctaTo: "/download",
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
      ctaTo: "/download",
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
      ctaTo: "/download",
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
      ctaTo: "/download",
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
      ctaTo: "/download",
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
