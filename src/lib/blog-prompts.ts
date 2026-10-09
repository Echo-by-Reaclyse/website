export interface Prompt {
  id: string;
  number: number;
  text: string;
}

export interface PromptGroup {
  id: string;
  anchor: string;
  name: string;
  intro: string;
  prompts: Prompt[];
}

export const PROMPT_GROUPS: PromptGroup[] = [
  {
    id: "evening",
    anchor: "evening",
    name: "Evening",
    intro: "A few minutes before you wind down. No performance required.",
    prompts: [
      { id: "p1", number: 1, text: "What moment from today am I still thinking about?" },
      { id: "p2", number: 2, text: "What did I feel today that I didn't say out loud?" },
      { id: "p3", number: 3, text: "What surprised me today?" },
      { id: "p4", number: 4, text: "What do I want tomorrow to contain that today didn't?" },
      { id: "p5", number: 5, text: "What small thing went well?" },
    ],
  },
  {
    id: "anxious-days",
    anchor: "anxious-days",
    name: "Anxious days",
    intro: "When the loop won't stop. Speak it out; it changes what it does to you.",
    prompts: [
      { id: "p6", number: 6, text: "What exactly am I worried about — not the story around it, the core thing?" },
      { id: "p7", number: 7, text: "What do I actually know versus what am I imagining?" },
      { id: "p8", number: 8, text: "What is the worst realistic outcome, and could I survive it?" },
      { id: "p9", number: 9, text: "What would I tell a friend who was feeling what I'm feeling right now?" },
      { id: "p10", number: 10, text: "What small action is inside my control today?" },
    ],
  },
  {
    id: "gratitude",
    anchor: "gratitude",
    name: "Gratitude",
    intro: "Not a list. An honest look at what made today easier.",
    prompts: [
      { id: "p11", number: 11, text: "Who made today easier?" },
      { id: "p12", number: 12, text: "What did I take for granted today that I'm glad existed?" },
      { id: "p13", number: 13, text: "What moment today would I want to remember in a year?" },
      { id: "p14", number: 14, text: "What is working in my life right now that I haven't acknowledged?" },
      { id: "p15", number: 15, text: "What do I have today that I once hoped for?" },
    ],
  },
  {
    id: "big-decisions",
    anchor: "big-decisions",
    name: "Big decisions",
    intro: "For when something important is unresolved. Say what you know before deciding.",
    prompts: [
      { id: "p16", number: 16, text: "What am I actually afraid of with this decision?" },
      { id: "p17", number: 17, text: "What would I choose if I knew no one would judge me for it?" },
      { id: "p18", number: 18, text: "What am I avoiding thinking about with this?" },
      { id: "p19", number: 19, text: "What does the version of me I want to be do here?" },
      { id: "p20", number: 20, text: "What will I wish I had done, five years from now?" },
    ],
  },
  {
    id: "self-discovery",
    anchor: "self-discovery",
    name: "Self-discovery",
    intro: "Longer-view questions. You don't need an answer — just start speaking.",
    prompts: [
      { id: "p21", number: 21, text: "What do I want that I've been afraid to admit?" },
      { id: "p22", number: 22, text: "What am I pretending doesn't bother me?" },
      { id: "p23", number: 23, text: "Where am I living by someone else's rules without questioning them?" },
      { id: "p24", number: 24, text: "What pattern keeps repeating in my life, and what might it be telling me?" },
      { id: "p25", number: 25, text: "What would I do differently if I weren't afraid of being seen?" },
    ],
  },
  {
    id: "relationships",
    anchor: "relationships",
    name: "Relationships",
    intro: "For after a difficult conversation, or before one. The things you haven't said yet.",
    prompts: [
      { id: "p26", number: 26, text: "What did I want to say to someone today that I held back?" },
      { id: "p27", number: 27, text: "Who in my life am I taking for granted right now?" },
      { id: "p28", number: 28, text: "Is there a relationship where I'm expecting something I've never asked for?" },
      { id: "p29", number: 29, text: "What would I want someone close to me to understand about me right now?" },
      { id: "p30", number: 30, text: "Where am I showing up less than I want to in a relationship?" },
    ],
  },
  {
    id: "future-self",
    anchor: "future-self",
    name: "Future self",
    intro: "Speaking to — or from — the person you're becoming.",
    prompts: [
      { id: "p31", number: 31, text: "What do I want to have figured out by the end of this year?" },
      { id: "p32", number: 32, text: "What is something I keep postponing that actually matters to me?" },
      { id: "p33", number: 33, text: "What story am I telling about myself that may no longer be true?" },
      { id: "p34", number: 34, text: "What am I slowly becoming, and is that who I want to be?" },
      { id: "p35", number: 35, text: "If I could send one message to myself a year from now, what would it say?" },
    ],
  },
];
