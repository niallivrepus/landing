export type MindNode = {
  id: string;
  label: string;
  category: string;
  desc?: string;
  children?: MindNode[];
};

export const VORTEX_PALETTE: Record<string, { bg: number; border: number; hex: string }> = {
  root: { bg: 0x6c5ce7, border: 0xa29bfe, hex: "#6C5CE7" },
  Design: { bg: 0xe17055, border: 0xfab1a0, hex: "#E17055" },
  Technology: { bg: 0x00b894, border: 0x55efc4, hex: "#00B894" },
  Strategy: { bg: 0x0984e3, border: 0x74b9ff, hex: "#0984E3" },
  Research: { bg: 0xfdcb6e, border: 0xffeaa7, hex: "#FDCB6E" },
  Culture: { bg: 0xe84393, border: 0xfd79a8, hex: "#E84393" },
};

/** Vortex-themed graph; same layout behavior as the Omma 3D mind map remix. */
export const VORTEX_MIND_MAP: MindNode = {
  id: "root",
  label: "Vortex\nLayer",
  category: "root",
  desc: "One converged layer for every inbox.",
  children: [
    {
      id: "search",
      label: "Search",
      category: "Design",
      desc: "Unified retrieval across surfaces.",
      children: [
        { id: "s1", label: "Threads", category: "Design", desc: "Messengers & mail" },
        { id: "s2", label: "Files", category: "Design", desc: "Docs & attachments" },
        {
          id: "s3",
          label: "Chain",
          category: "Design",
          desc: "Wallets & on-chain signals",
          children: [
            { id: "s3a", label: "Balances", category: "Design", desc: "Read-only pulls" },
            { id: "s3b", label: "History", category: "Design", desc: "Scoped activity" },
          ],
        },
      ],
    },
    {
      id: "agents",
      label: "Agents",
      category: "Technology",
      desc: "Route intent to the right tool.",
      children: [
        {
          id: "a1",
          label: "Tools",
          category: "Technology",
          desc: "Connector backends",
          children: [
            { id: "a1a", label: "APIs", category: "Technology", desc: "Structured pulls" },
            { id: "a1b", label: "LLMs", category: "Technology", desc: "Reasoning over context" },
          ],
        },
        { id: "a2", label: "Policies", category: "Technology", desc: "Scoped tokens & least privilege" },
      ],
    },
    {
      id: "clarity",
      label: "Clarity",
      category: "Strategy",
      desc: "Less tab fatigue.",
      children: [
        { id: "c1", label: "Summaries", category: "Strategy", desc: "Citations & receipts" },
        {
          id: "c2",
          label: "Spine",
          category: "Strategy",
          desc: "Writes back to your timeline",
          children: [
            { id: "c2a", label: "Events", category: "Strategy", desc: "Auditable changes" },
            { id: "c2b", label: "Archive", category: "Strategy", desc: "Long-horizon memory" },
          ],
        },
      ],
    },
    {
      id: "connectors",
      label: "Connectors",
      category: "Research",
      desc: "Calendars, chats, wallets, agents.",
      children: [
        { id: "co1", label: "OAuth", category: "Research", desc: "Per-surface consent" },
        { id: "co2", label: "Revoke", category: "Research", desc: "Vortex forgets the bridge" },
      ],
    },
    {
      id: "hybrid",
      label: "Hybrid\nreality",
      category: "Culture",
      desc: "Embrace the sprawl without glorifying it.",
      children: [
        {
          id: "h1",
          label: "Stacks",
          category: "Culture",
          desc: "No forced monoculture",
          children: [
            { id: "h1a", label: "Work", category: "Culture", desc: "Many apps, one bar" },
            { id: "h1b", label: "Life", category: "Culture", desc: "Personal + pro boundaries" },
          ],
        },
      ],
    },
  ],
};
