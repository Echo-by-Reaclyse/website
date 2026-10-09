export interface ComparisonFeature {
  name: string;
  echo: boolean | string;
  competitor: boolean | string;
}

export interface CompetitorData {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  metaDescription: string;
  heroSubtitle: string;
  intro: string;
  echoPrice: string;
  competitorPrice: string;
  echoPlatform: string;
  competitorPlatform: string;
  strengths: Array<{ title: string; body: string }>;
  echoFor: string;
  competitorFor: string;
  features: ComparisonFeature[];
  verdict: string;
}

const SHARED_FEATURES_ECHO = {
  onDevice: true,
  aiInsight: true,
  patterns: true,
  prompt: true,
  export: true,
  iphone: true,
  voice: true,
};

export const COMPETITORS: CompetitorData[] = [
  {
    slug: "day-one",
    name: "Day One",
    category: "Written Journaling App",
    tagline: "The award-winning journaling app.",
    metaDescription:
      "ÉCHO is voice-first with on-device AI; Day One is the gold standard for written journaling. Here is how they compare.",
    heroSubtitle: "voice reflection versus the written diary.",
    intro:
      "Day One is the most established journaling app on the App Store — polished, reliable, and built for people who write. It supports photos, location tags, multiple journals, and strong end-to-end encryption across iOS, macOS, Android, and the web. If you want a permanent, media-rich diary, it is hard to beat.",
    echoPrice: "Free · Pro from $39.99/yr",
    competitorPrice: "$34.99/yr",
    echoPlatform: "iPhone (iOS 18+)",
    competitorPlatform: "iOS · macOS · Android · Web",
    strengths: [
      {
        title: "Voice is the native mode",
        body: "In ÉCHO, speaking is the whole experience — not a feature bolted onto a text editor. Your answer is transcribed on-device, so the audio never leaves your phone.",
      },
      {
        title: "AI that sees the whole picture",
        body: "ÉCHO builds a longitudinal map of your thoughts across entries, surfacing patterns and connections Day One has no equivalent of.",
      },
      {
        title: "One question, once a day",
        body: "The constraint is the point. A single daily prompt makes the habit achievable and the insights comparable across time.",
      },
    ],
    echoFor:
      "People who want to understand themselves better through daily spoken reflection, and who care that their audio stays on-device.",
    competitorFor:
      "People who want a beautiful, long-form written diary with photos, rich formatting, and cross-platform sync.",
    features: [
      { name: "Voice recording + transcription", echo: true, competitor: "Basic — no transcription" },
      { name: "On-device AI (audio stays private)", echo: true, competitor: false },
      { name: "Post-session AI insight", echo: true, competitor: false },
      { name: "Longitudinal thought patterns", echo: true, competitor: false },
      { name: "Daily reflection prompt", echo: true, competitor: false },
      { name: "Data export", echo: true, competitor: true },
      { name: "iPhone native", echo: true, competitor: true },
      { name: "Free tier", echo: true, competitor: false },
    ],
    verdict:
      "Day One and ÉCHO serve genuinely different needs. If you want to write, annotate, and keep a rich personal archive across all your devices, Day One is the better fit. If you want to speak your thoughts daily, have them transcribed privately, and surface patterns over time, ÉCHO is built for that. They are not really competing.",
  },
  {
    slug: "reflectly",
    name: "Reflectly",
    category: "Mood & Wellness Journal",
    tagline: "Your personal AI journal for mindfulness.",
    metaDescription:
      "ÉCHO goes deeper than mood tracking. Here is how ÉCHO compares with Reflectly for daily reflection.",
    heroSubtitle: "depth of reflection versus daily mood check-ins.",
    intro:
      "Reflectly is built around mood tracking and guided gratitude prompts. Its interface is warm and encouraging — ideal for beginners who find the blank page daunting. The AI chat feature adds a sense of dialogue. Where it falls short is depth: the structured prompts keep entries predictable, and mood scores can reduce complex emotional days to a single number.",
    echoPrice: "Free · Pro from $39.99/yr",
    competitorPrice: "~$47.99/yr",
    echoPlatform: "iPhone (iOS 18+)",
    competitorPlatform: "iOS · Android",
    strengths: [
      {
        title: "Voice goes deeper than mood scores",
        body: "Speaking for sixty seconds about your day surfaces more nuance than tapping a mood emoji. ÉCHO captures what you actually said — not a simplified rating.",
      },
      {
        title: "No gamification",
        body: "ÉCHO does not reward you with streaks, coins, or badges for journaling. Reflection is its own reward, not a game.",
      },
      {
        title: "Private by design",
        body: "Reflectly's AI chat processes your entries in the cloud. ÉCHO's transcription and AI reasoning happen on your device.",
      },
    ],
    echoFor:
      "People who want honest, unfiltered self-reflection rather than positivity prompts, and who care about keeping their inner life off third-party servers.",
    competitorFor:
      "Beginners who want gentle structure, positive reinforcement, and a mood-tracking habit alongside journaling.",
    features: [
      { name: "Voice recording + transcription", echo: true, competitor: false },
      { name: "On-device AI (audio stays private)", echo: true, competitor: false },
      { name: "Post-session AI insight", echo: true, competitor: "Cloud AI" },
      { name: "Longitudinal thought patterns", echo: true, competitor: "Mood trends only" },
      { name: "Daily reflection prompt", echo: true, competitor: true },
      { name: "Data export", echo: true, competitor: false },
      { name: "iPhone native", echo: true, competitor: true },
      { name: "Free tier", echo: true, competitor: "Limited" },
    ],
    verdict:
      "Reflectly is a solid entry point for people who have never journaled before and want a gentle nudge. ÉCHO is for people who want to go further — actual spoken words, private transcription, and AI that notices recurring themes across months of entries, not just yesterday's mood.",
  },
  {
    slug: "rosebud",
    name: "Rosebud",
    category: "AI Journaling App",
    tagline: "Your AI life coach in a journal.",
    metaDescription:
      "Rosebud uses GPT-4 to coach you through journaling. ÉCHO keeps everything on your device. Here is the comparison.",
    heroSubtitle: "on-device privacy versus cloud AI coaching.",
    intro:
      "Rosebud is the most AI-forward journaling app currently available. It uses GPT-4 to engage with your entries conversationally, asking follow-up questions and offering coaching-style reflections. It is genuinely useful for people who want to be challenged and guided. The trade-off is privacy: your entries are processed by OpenAI's servers to power those responses.",
    echoPrice: "Free · Pro from $39.99/yr",
    competitorPrice: "$79.99/yr",
    echoPlatform: "iPhone (iOS 18+)",
    competitorPlatform: "iOS · Android · Web",
    strengths: [
      {
        title: "Your audio never leaves your phone",
        body: "ÉCHO transcribes with WhisperKit on-device. No audio is uploaded. Rosebud's AI features require sending your entries to OpenAI's infrastructure.",
      },
      {
        title: "Voice-first by design",
        body: "ÉCHO is built around speaking. Rosebud supports voice input but is primarily a text-chat experience layered over journaling.",
      },
      {
        title: "Long-term thought graph",
        body: "ÉCHO links ideas across months of entries, surfacing recurring themes and thought patterns. Rosebud focuses on the current session.",
      },
    ],
    echoFor:
      "People who want AI-powered reflection with complete audio privacy — transcription, insight generation, and pattern recognition all happening on-device.",
    competitorFor:
      "People who want an active conversational partner that challenges and coaches them through their entries, and are comfortable with cloud processing.",
    features: [
      { name: "Voice recording + transcription", echo: true, competitor: "Cloud (OpenAI Whisper)" },
      { name: "On-device AI (audio stays private)", echo: true, competitor: false },
      { name: "Post-session AI insight", echo: true, competitor: true },
      { name: "Longitudinal thought patterns", echo: true, competitor: "Limited" },
      { name: "Daily reflection prompt", echo: true, competitor: true },
      { name: "Data export", echo: true, competitor: false },
      { name: "iPhone native", echo: true, competitor: true },
      { name: "Free tier", echo: true, competitor: "7-day trial" },
    ],
    verdict:
      "If you want real-time coaching and are comfortable with your entries being processed in the cloud, Rosebud delivers that well. If privacy matters — if there are things you would say into a voice memo that you would not send to an AI company's server — ÉCHO is the better fit. It is also meaningfully cheaper.",
  },
  {
    slug: "journey",
    name: "Journey",
    category: "Cross-Platform Journal",
    tagline: "Journal. Breathe. Find gratitude.",
    metaDescription:
      "Journey is a cross-platform diary with good media support. ÉCHO adds voice transcription and AI. Here is the comparison.",
    heroSubtitle: "voice and AI versus cross-platform flexibility.",
    intro:
      "Journey is a capable cross-platform diary that works well on iOS, Android, Windows, and the web. It supports photos, videos, location, and basic mood tracking. Its strength is breadth — it is a reliable place to write that follows you everywhere. It does not offer voice transcription or AI-generated insights, positioning it closer to a digital notebook than an intelligent reflection tool.",
    echoPrice: "Free · Pro from $39.99/yr",
    competitorPrice: "Free · Premium from $29.99/yr",
    echoPlatform: "iPhone (iOS 18+)",
    competitorPlatform: "iOS · Android · Windows · Web",
    strengths: [
      {
        title: "From voice to insight in 90 seconds",
        body: "ÉCHO captures your spoken reflection, transcribes it on-device, and delivers an AI-generated insight immediately. Journey has no equivalent pipeline.",
      },
      {
        title: "The pattern layer",
        body: "ÉCHO identifies recurring themes across your entries using semantic linking. Journey's analysis is limited to mood trends and word clouds.",
      },
      {
        title: "Built for one daily habit",
        body: "ÉCHO's constraint — one question, answered once a day — makes the data comparable across time. Journey's open-ended format produces harder-to-analyse archives.",
      },
    ],
    echoFor:
      "iPhone users who want voice-first daily reflection with AI insights and don't need Android or Windows sync.",
    competitorFor:
      "People who switch between iOS and Android (or want a web app), want a free tier, and prefer media-rich written entries over AI analysis.",
    features: [
      { name: "Voice recording + transcription", echo: true, competitor: "Basic audio — no transcription" },
      { name: "On-device AI (audio stays private)", echo: true, competitor: false },
      { name: "Post-session AI insight", echo: true, competitor: false },
      { name: "Longitudinal thought patterns", echo: true, competitor: false },
      { name: "Daily reflection prompt", echo: true, competitor: "Optional" },
      { name: "Data export", echo: true, competitor: true },
      { name: "iPhone native", echo: true, competitor: true },
      { name: "Free tier", echo: true, competitor: true },
    ],
    verdict:
      "Journey is the right choice if you need Android or Windows support and want a free cross-platform diary. ÉCHO is the right choice if you are iPhone-first and want your journaling to surface something useful — a post-session insight, a connection between today's worry and something you said three months ago.",
  },
  {
    slug: "chatgpt",
    name: "ChatGPT",
    category: "General-Purpose AI",
    tagline: "Get answers. Find inspiration. Be more productive.",
    metaDescription:
      "ChatGPT is a powerful AI assistant. ÉCHO is a purpose-built voice journal. Here is why the difference matters.",
    heroSubtitle: "a journal built for reflection versus a chat built for everything.",
    intro:
      "ChatGPT is the most capable general-purpose AI available, and many people already use it to process their thoughts. You can speak to it, get responses, and have genuine conversations. What it is not is a journal: it has no longitudinal memory by default, it does not preserve your entries, and audio you speak is transcribed and processed by OpenAI's servers. It is a powerful tool used for something it was not designed for.",
    echoPrice: "Free · Pro from $39.99/yr",
    competitorPrice: "Free · Plus $20/mo",
    echoPlatform: "iPhone (iOS 18+)",
    competitorPlatform: "iOS · Android · Web",
    strengths: [
      {
        title: "Built for journaling, not everything",
        body: "ÉCHO's daily question, its structured format, and its calendar of past entries create the conditions for genuine self-reflection. ChatGPT is optimised for answering, not listening.",
      },
      {
        title: "Your history is yours",
        body: "Every reflection you speak into ÉCHO is stored privately on your device and in iCloud. ChatGPT does not maintain a journal archive — conversations are chat history, not a searchable personal record.",
      },
      {
        title: "Patterns across months",
        body: "ÉCHO builds a semantic graph of your entries over time, surfacing recurring themes and thought connections. ChatGPT has no cross-session memory of your reflections by default.",
      },
    ],
    echoFor:
      "People who want a dedicated daily reflection practice with private audio, a searchable archive, and AI that has read every entry they have ever made.",
    competitorFor:
      "People who want on-demand AI conversation, real-time help with problems, and general-purpose assistance that occasionally includes talking through feelings.",
    features: [
      { name: "Voice recording + transcription", echo: true, competitor: "Cloud (OpenAI Whisper)" },
      { name: "On-device AI (audio stays private)", echo: true, competitor: false },
      { name: "Post-session AI insight", echo: true, competitor: "Manual — you must ask" },
      { name: "Longitudinal thought patterns", echo: true, competitor: false },
      { name: "Daily reflection prompt", echo: true, competitor: false },
      { name: "Data export", echo: true, competitor: "Chat history only" },
      { name: "iPhone native", echo: true, competitor: true },
      { name: "Free tier", echo: true, competitor: true },
    ],
    verdict:
      "ChatGPT is not a journal. It is an extraordinarily useful AI that some people repurpose for reflection. If you want a structured daily practice with a private archive and longitudinal insight, ÉCHO is purpose-built for that. The two tools are not really competing — most people who use ÉCHO also use ChatGPT for other things.",
  },
  {
    slug: "apple-journal",
    name: "Apple Journal",
    category: "Built-in iOS App",
    tagline: "Apple's built-in journaling app.",
    metaDescription:
      "Apple Journal is free and private. ÉCHO adds voice transcription, AI insights, and thought patterns. Here is the comparison.",
    heroSubtitle: "AI-powered reflection versus the simplest possible start.",
    intro:
      "Apple Journal is built into iOS 17 and later, requires no download, and is completely free. It uses on-device intelligence to suggest things to journal about — photos you took, places you visited, workouts you completed. Entries are end-to-end encrypted. It is an excellent zero-effort starting point. What it does not offer is voice transcription, AI-generated insights, or analysis that connects entries over time.",
    echoPrice: "Free · Pro from $39.99/yr",
    competitorPrice: "Free (built into iOS)",
    echoPlatform: "iPhone (iOS 18+)",
    competitorPlatform: "iPhone only",
    strengths: [
      {
        title: "Voice + transcription in one tap",
        body: "ÉCHO turns your spoken reflection into searchable text immediately, on-device. Apple Journal accepts voice memos but does not transcribe them.",
      },
      {
        title: "An insight after every session",
        body: "ÉCHO generates a short AI reflection after each entry. Apple Journal does not analyse what you write or offer any post-entry feedback.",
      },
      {
        title: "Connections across time",
        body: "ÉCHO surfaces recurring themes and links between past and present entries. Apple Journal's entries are isolated — there is no analysis layer connecting them.",
      },
    ],
    echoFor:
      "People who want voice-first daily reflection with AI insights and a semantic map of how their thinking evolves over time.",
    competitorFor:
      "People who want the lowest possible barrier to starting a journaling habit, are happy with text entries, and want something completely free.",
    features: [
      { name: "Voice recording + transcription", echo: true, competitor: false },
      { name: "On-device AI (audio stays private)", echo: true, competitor: "Suggestions only" },
      { name: "Post-session AI insight", echo: true, competitor: false },
      { name: "Longitudinal thought patterns", echo: true, competitor: false },
      { name: "Daily reflection prompt", echo: true, competitor: "Suggestion-based" },
      { name: "Data export", echo: true, competitor: false },
      { name: "iPhone native", echo: true, competitor: true },
      { name: "Free tier", echo: true, competitor: true },
    ],
    verdict:
      "Apple Journal wins on friction: it costs nothing and is already on your phone. ÉCHO wins on depth: voice transcription, post-session AI insight, and pattern recognition across months of entries. If you have tried Apple Journal and found it useful but want more, ÉCHO is the natural next step.",
  },
];
