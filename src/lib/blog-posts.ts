export interface BlogSection {
  heading?: string;
  body: string;
}

export type BlogTopic = "voice" | "prompts" | "reflect" | "privacy";

export interface CardVisual {
  type: "prompt" | "steps" | "compare" | "week" | "night" | "checklist" | "three-words" | "image";
  text?: string;
  kicker?: string;
  variant?: string;
  labels?: string[];
  items?: string[];
  needs?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  searchTitle: string;
  description: string;
  excerpt: string;
  date: string;
  readingTime: string;
  author: string;
  topic: BlogTopic;
  cardVisual: CardVisual;
  inShort?: string;
  sections: BlogSection[];
  relatedSlugs?: string[];
}

export const TOPIC_LABELS: Record<BlogTopic, string> = {
  voice: "Voice journaling",
  prompts: "Prompts & routines",
  reflect: "Self-reflection",
  privacy: "Privacy & choosing an app",
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "voice-journaling-prompts",
    title: "35 voice journaling prompts to answer out loud",
    searchTitle: "35 Voice Journaling Prompts to Answer Out Loud | ÉCHO Journal",
    description:
      "35 short voice journaling prompts in seven groups: evening, anxious days, gratitude, big decisions, self-discovery, relationships and your future self. Copy one and start.",
    excerpt: "Seven groups of short questions for evenings, anxious days, decisions and more. Copy one and begin.",
    date: "2026-10-08",
    readingTime: "5 min read",
    author: "The ÉCHO Team",
    topic: "prompts",
    cardVisual: { type: "image" },
    sections: [],
  },
  {
    slug: "what-is-voice-journaling",
    title: "What is voice journaling? A simple way to start",
    searchTitle: "What Is Voice Journaling? A Simple Way to Start | ÉCHO Journal",
    description:
      "What voice journaling is, how to make your first recording, what to say, what to do when words don't come, and what to check before choosing an app.",
    excerpt: "What it is, how to make your first recording, what to say, and what to do when the words don't come.",
    date: "2026-05-12",
    readingTime: "6 min read",
    author: "The ÉCHO Team",
    topic: "voice",
    cardVisual: { type: "image" },
    inShort:
      "Voice journaling is speaking your thoughts into a recording, usually for a few minutes, often in answer to one question. You can start with your phone's built-in recorder: pick a quiet moment, ask yourself one question, talk until you have said what you need to, and listen back another day.",
    relatedSlugs: ["voice-journaling-vs-writing", "build-journaling-habit", "how-to-reflect-on-your-day"],
    sections: [
      {
        body: "Voice journaling is the practice of speaking your thoughts aloud into a recording instead of writing them down. That is the one-sentence version. The longer version is that it feels fundamentally different from anything you have tried before, closer to thinking out loud to a trusted friend than filling in a diary. You press record, you answer a question, you stop. There is no formatting, no backspacing, no rereading what you wrote and deciding it sounds wrong.\n\nMost people who try it for the first time notice something unexpected: they say things they did not know they thought. The act of speaking, with no delete key and no audience, creates a kind of honesty that a notebook and pen rarely produces. That is not magic. It is just what happens when you remove the editing layer between a thought and its expression.",
      },
      {
        heading: "How voice journaling works",
        body: "The mechanics are simple. You open an app, receive a question, speak your answer for anywhere from thirty seconds to a few minutes, and the app transcribes your voice into text on your device. No audio is sent to a server. No human transcriptionist is involved. The text sits in your journal alongside the original recording, searchable and private.\n\nWhat happens after that depends on the app. Some just store entries. More sophisticated tools surface patterns across time: words you return to repeatedly, emotional tones that shift across weeks, questions you keep answering the same way. The raw entry is valuable. The accumulated record across months is where voice journaling starts to become genuinely useful for self-understanding, rather than just self-expression.",
      },
      {
        heading: "Why speaking is more revealing than writing",
        body: "When you write, you have an inner editor running alongside the process. It monitors grammar, checks whether your sentence sounds intelligent, softens things that feel too raw, and reorganises thoughts before they reach the page. This is a feature of written language. In the context of private self-reflection, it is a bug.\n\nSpeaking bypasses most of that filtering. When you are answering a question out loud with no time to pause and revise, the first thing that comes out is usually the most honest version of what you actually think. Voice recordings preserve hesitations, changes in pace, moments where your voice tightens up on a particular word. Those signals carry information that prose cannot. Six months later, you can hear the emotional state of that entry in a way that reading it never would have conveyed.",
      },
      {
        heading: "Who voice journaling is for",
        body: "Voice journaling is particularly well suited to people who have tried written journaling and stopped. If you have bought three beautiful notebooks and filled a combined twelve pages across all of them, the problem probably was not your discipline. It was the format. Writing requires time, a comfortable surface, and a decision about what to say. Voice journaling requires none of those things. You can do it in the car, on a walk, in two minutes between meetings.\n\nIt also works well for overthinkers. If you get stuck in loops, the same thoughts circling without resolution, speaking them out loud creates a kind of externalisation that interrupts the loop. And for people who process experiences verbally rather than visually or textually, the spoken format simply fits better with how their minds work. You do not have to be a writer to have valuable thoughts. You just have to be willing to say them.",
      },
      {
        heading: "How to start",
        body: "The only thing required to start is a single question and one minute of willingness to answer it. Pick an app that gives you a prompt. If you have to choose your own topic every day, you will run out of motivation fast. Commit to answering one question per day for two weeks. Not two questions. Not a long reflection. One question, answered honestly, out loud.\n\nThe most important rule in the first week is: do not edit. Whatever comes out, let it come. You will ramble. You will repeat yourself. You will pause awkwardly. All of that is fine, it is actually the point. The habit forms before the skill does. After the two weeks, listen back to your first three recordings. The contrast between who you were that first day and who you are now is usually more interesting than anything you said in either recording.",
      },
      {
        heading: "What to expect in the first month",
        body: "The first two or three days feel slightly absurd. Talking to your phone in a quiet room is not a natural act, and your brain will remind you of this. Push through it. By day five or six, the awkwardness fades and you start treating it like any other brief daily task.\n\nAround week two, something shifts. You start hearing yourself repeat certain words or phrases across multiple recordings. You notice that your energy sounds different on Mondays than on Thursdays. You catch yourself saying something you had been avoiding saying, even privately. By week four, the habit is largely automatic, and the question you are looking forward to answering is whether the person speaking in that first recording is meaningfully different from the person speaking now. They usually are, more than you expected.",
      },
      {
        heading: "Common questions",
        body: "Does it feel weird talking to your phone? Yes, at first. Then no. The self-consciousness is entirely normal and almost universally fades within the first week. If it helps, close your eyes while you answer. You will forget about the device faster than you expect.\n\nWhat if I ramble? That is the point. Rambling is what happens when your thoughts are moving faster than your editorial filter. The most interesting things people say in voice journals come after the first coherent sentence, in the part where they have stopped trying to sound composed.\n\nDo I need to listen back every day? You do not. Most people do not. But listening back periodically, once a week or once a month, is where the real value lives. Capturing entries without ever reviewing them is like taking photographs and never looking at them. The capture matters, but so does the reflection.",
      },
    ],
  },
  {
    slug: "voice-journaling-vs-writing",
    title: "Voice journaling or writing? How to choose what suits you",
    searchTitle: "Voice journaling or writing? How to choose what suits you | ÉCHO Journal",
    description:
      "Speaking and writing each have strengths. A practical look at when each one helps, with no single right answer.",
    excerpt: "Speaking and writing each have strengths. A practical look at when each one helps, with no single right answer.",
    date: "2026-05-19",
    readingTime: "6 min read",
    author: "The ÉCHO Team",
    topic: "voice",
    cardVisual: { type: "image" },
    inShort:
      "Voice journaling and writing both have real benefits. Voice is faster and produces more honest first responses; writing allows more careful thinking. Most people find both useful for different things. The format that you actually maintain consistently matters more than which one is theoretically superior.",
    relatedSlugs: ["what-is-voice-journaling", "how-to-process-emotions", "how-to-reflect-on-your-day"],
    sections: [
      {
        body: "There is a widespread assumption that written journals are the more serious, more literary, more worthwhile form of self-reflection. Centuries of tradition back this up. Marcus Aurelius wrote. Anais Nin wrote. Virginia Woolf wrote. The diary, as a form, has cultural prestige that voice memos do not.\n\nBut prestige and usefulness are different things. When you sit down to write about a hard conversation you had today, the version that reaches the page is already a revision. It has been cleaned up, given a narrative arc, made more coherent than the actual experience was. That is not always bad. But it is worth asking: is the polished version the one you most need to examine? Or is it the raw, contradictory, mid-thought version that came before you knew what you actually felt?",
      },
      {
        heading: "The inner editor problem",
        body: "Every person who writes has an inner editor running in parallel. It monitors sentence structure, checks tone, softens language that feels too exposed, and organises thoughts into something that resembles a coherent argument before they have fully formed. This is a feature of writing. In the context of private self-reflection, it is a bug.\n\nWhen you are journaling about something genuinely difficult, a relationship that is not working, an ambition you are afraid to admit, a resentment you think you should not have, the inner editor is most active precisely when you need it least. It tidies up the mess you are trying to examine. Voice journaling does not solve this completely, but it reduces it significantly. Speaking quickly, with no backspace key, means your first thought reaches the record before your second thought can revise it.",
      },
      {
        heading: "What research says about verbal expression",
        body: "Verbal externalisation, talking through a problem out loud, has a substantial evidence base in clinical psychology. Talk therapy in its many forms is fundamentally built on the principle that verbalising internal experience changes how we process it. Speaking activates different neural pathways than silent rumination. It creates a form of distance between the thinker and the thought that internal processing alone does not produce.\n\nThe comparison with writing is more nuanced. Written expressive therapy, the kind studied by James Pennebaker and others since the 1980s, also has real benefits. It reduces stress markers and improves emotional clarity. But the mechanism is the act of finding words for an experience, not the written medium itself, that matters. Voice journaling captures that same mechanism while removing the friction of the blank page and the revision process that written expression invites.",
      },
      {
        heading: "Writing's genuine strengths",
        body: "This is not an argument that writing is inferior. Written journals have real advantages that voice recordings cannot easily replicate. The slower pace of writing forces you to find the right words, and that search can itself generate insight. Rereading written entries is faster than listening to recordings. Prose can be beautiful in a way that transcribed speech rarely is.\n\nFor synthesis, goal-setting, and capturing decisions, writing is often more useful than speaking. Many people find that writing forces a kind of commitment that speaking does not. It is harder to write \"I am going to leave this job\" and dismiss it than it is to say it. These are genuine strengths, not to be dismissed.",
      },
      {
        heading: "Where voice journaling wins",
        body: "Voice journaling has a specific advantage in three situations. The first is emotional immediacy. When you are still inside an experience, speaking captures it in a way that writing rarely does. The voice records the feeling, not just the description of it.\n\nThe second is speed. A two-minute voice entry takes two minutes. A two-minute written entry takes ten. For people whose reflection practice keeps failing because it requires too much setup, the gap in activation energy is the whole story.\n\nThe third is honesty about difficult things. Most people write worse versions of their difficult truths than they speak. The inner editor is particularly aggressive around shame, desire, and fear. Speaking those things out loud, to a private recording, tends to produce the version the writer was trying to write but could not quite get to.",
      },
      {
        heading: "Which format is right for you",
        body: "The honest answer is probably both, for different things. Writing is better for decisions you want to think through carefully, for capturing something you want to return to in polished form, for tasks that benefit from slowness. Voice journaling is better for emotional processing, for daily reflection, for capturing how something felt before you have decided what it means.\n\nThe choice does not have to be permanent. A useful experiment: pick one recurring emotional pattern in your life and try addressing it in writing for a week, then in voice for a week. Listen to what each format produces. The difference, in most cases, is audible.",
      },
    ],
  },
  {
    slug: "daily-reflection-questions",
    title: "5 daily reflection questions worth asking",
    searchTitle: "5 daily reflection questions worth asking | ÉCHO Journal",
    description:
      "Five questions that go past \"how was your day\", and how to use them without turning reflection into homework.",
    excerpt: "Five questions that go past \"how was your day\", and how to use them without turning reflection into homework.",
    date: "2026-05-26",
    readingTime: "8 min read",
    author: "The ÉCHO Team",
    topic: "prompts",
    cardVisual: { type: "image" },
    inShort:
      "Five questions that angle toward what you did not notice at the time: what you were wrong about, what you wanted to say but didn't, what you are avoiding, who you thought about, and what you know now that you did not this morning.",
    relatedSlugs: ["how-to-reflect-on-your-day", "journaling-for-anxiety", "build-journaling-habit"],
    sections: [
      {
        body: "Most reflection questions are too safe. They invite you to revisit what you already know, confirm what you already believe, and describe your day in terms you have already decided are accurate. \"What went well today?\" What did you learn?\" \"What are you grateful for?\" These are not bad questions. But they tend to produce predictable answers, and predictable answers do not change how you think.\n\nThe questions below are chosen for a specific quality: they approach experience from an angle you are not expecting. Each one is designed to surface something you were not planning to say. That is, in the end, the only meaningful test of a reflection question.",
      },
      {
        heading: "1. What was I wrong about today?",
        body: "This question is useful precisely because almost nobody asks it. The standard review of a day focuses on what happened and how it felt. This question looks for where your model of the world did not match reality.\n\nYou were wrong about how a meeting would go. Wrong about how someone would respond. Wrong about how long something would take or how hard it would be. Most of these small wrongnesses get smoothed over by the end of the day and forgotten. Naming them explicitly, before sleep edits the memory, is where the learning actually lives.\n\nThe practice is not about self-criticism. It is about calibration. If you never notice where your predictions were off, you cannot update them.",
      },
      {
        heading: "2. What did I want to say that I didn't?",
        body: "The gap between felt and expressed is one of the most consistently underexplored areas of daily experience. You wanted to disagree with someone but did not. You wanted to express appreciation but it felt awkward. You wanted to ask for something but held back.\n\nThese unexpressed thoughts and feelings do not disappear. They tend to accumulate and occasionally surface in ways that are disproportionate to the original situation. A conversation that feels like it is about one thing is often carrying freight from a dozen situations where something went unsaid.\n\nThis question names them before that happens. It is also frequently surprising. When you actually sit down to answer it, the thing that comes up is usually not the thing you predicted.",
      },
      {
        heading: "3. What am I avoiding thinking about?",
        body: "This is the hardest question on the list, and the most productive. The mind is skilled at keeping certain topics out of active consideration. There is usually a reason: the topic is unresolved, uncomfortable, or requires a decision you are not ready to make. The avoidance is often unconscious. You do not notice you are not thinking about something.\n\nAsking the question directly does not always produce an answer. Sometimes you genuinely cannot access what you are avoiding. But the question itself tends to create a small gap in the avoidance, a moment where the topic becomes just visible enough to name. That is usually enough to start.",
      },
      {
        heading: "4. Who did I think about today and why?",
        body: "People appear in your thinking for reasons. A colleague you found yourself thinking about at an odd moment. A friend you have not spoken to in months. Someone from years ago who surfaced unexpectedly. These appearances are not random, even when they seem that way.\n\nThis question traces those appearances back to their causes. Often the person you thought about is connected to something unresolved, something you want, or something you are working through. The specific person and the specific moment of thinking about them are usually more connected than they appear.\n\nIt is also, incidentally, a useful reminder that relationships are always more present in the mind than in the diary. Most journals record events and feelings but not the invisible social texture of the day.",
      },
      {
        heading: "5. What do I know now that I did not know this morning?",
        body: "Every day produces new information. Most of it gets filed under general experience and is not examined closely. This question asks you to name what actually changed, specifically and concretely.\n\nSometimes the answer is factual: you learned something about a project, a person, or a situation. More often the answer is more subtle: you understood something about yourself that you had suspected but not confirmed. You saw a pattern that had been invisible. You noticed a reaction you did not expect to have.\n\nThe question works best when you resist the temptation to answer with something general. \"I learned that communication is important\" is not an answer. \"I learned that I respond very badly when someone contradicts me in public\" is an answer.",
      },
      {
        heading: "How to use these questions",
        body: "You do not need to answer all five every day. Pick one. Rotate them through the week if you like, or return to the same one until you have exhausted what it has to show you. The most useful practice is the one you actually maintain, and five questions a day is too many to sustain alongside a full life.\n\nThe medium matters less than the honesty. You can write these answers, speak them, or think them through. But speaking tends to produce the most honest version of the answer, before the editing process has a chance to intervene. A two-minute voice entry answering one of these questions, done daily for a month, will teach you more about yourself than most people learn from a year of occasional written journaling.",
      },
    ],
  },
  {
    slug: "build-journaling-habit",
    title: "How to build a journaling habit you can keep",
    searchTitle: "How to build a journaling habit you can keep | ÉCHO Journal",
    description: "Small anchors, short sessions, and what to do after you miss a day.",
    excerpt: "Small anchors, short sessions, and what to do after you miss a day.",
    date: "2026-06-03",
    readingTime: "6 min read",
    author: "The ÉCHO Team",
    topic: "prompts",
    cardVisual: { type: "image" },
    inShort:
      "Most journaling habits fail because they require too many decisions to start. The fix is an anchor: attach reflection to something you already do reliably. Keep sessions to two minutes. If you miss a day, do not miss the next one.",
    relatedSlugs: ["what-is-voice-journaling", "how-to-reflect-on-your-day", "evening-journaling"],
    sections: [
      {
        body: "Most journaling habits die in the first two weeks. The pattern is consistent: you start with genuine motivation, maintain it for three to five days, miss one day because something came up, feel a vague guilt about the missed day, and then quietly stop without making a formal decision to do so. The journal, physical or digital, sits unopened. The guilt fades. Two months later you try again.\n\nThis is not a discipline problem. The research on habit formation is fairly clear: habits fail when they are too costly to initiate, too variable in their timing, or not rewarding in any immediate sense. Traditional journaling fails on all three counts for most people. Voice journaling fails on fewer of them, but only if you set it up correctly.",
      },
      {
        heading: "Why the blank page breaks habits",
        body: "Written journaling fails as a daily habit for a specific reason: the blank page requires too many decisions before you can start. What should I write about? Is this the right time? Do I have enough to say today? These micro-decisions are not difficult individually, but they create enough friction that the habit never becomes automatic.\n\nHabit science distinguishes between habits that require active decision-making and those that do not. A true habit runs below the level of deliberate choice. You brush your teeth without deciding to brush your teeth. The decision was made once, long ago, and the behaviour is now just part of the sequence. Journaling rarely reaches this point because the starting conditions are too variable.",
      },
      {
        heading: "The anchor principle",
        body: "The single most effective technique for building any daily habit is anchoring it to an existing behaviour. You do not add a new action to your day; you attach it to something you already do reliably. The existing behaviour becomes the trigger.\n\nFor a journaling habit, useful anchors include: the two minutes after you set your alarm for the next morning, the moment after you turn off a laptop at the end of the working day, the end of a commute before you get out of the car, the thirty seconds before you get out of bed in the morning.\n\nThe anchor does not need to be at the ideal time of day. It needs to be reliable. A slightly imperfect reflection done consistently is worth considerably more than a well-timed one done occasionally.",
      },
      {
        heading: "The two-minute rule",
        body: "There is a useful heuristic from habit formation research: if a habit takes more than two minutes to initiate, it will not survive contact with a low-motivation day. Most days are low-motivation days.\n\nVoice journaling is naturally suited to this constraint. You open an app, you press record, you speak for sixty to ninety seconds, you stop. The practice is finished before your brain has registered that it has started. Written journaling rarely achieves this because finding the notebook, opening it to a blank page, and deciding what to say each adds friction that accumulates.\n\nIf your voice journaling practice feels like it requires effort to start, the setup is wrong, not your motivation. The practice should require less activation energy than checking your email.",
      },
      {
        heading: "What to do when you miss a day",
        body: "Missing a day is inevitable. The question is what you do when it happens.\n\nThe most common response is to treat the missed day as a kind of failure that must be compensated for, either by doing twice as much the next day or by feeling guilty enough that the guilt eventually breaks the habit entirely. Neither of these is useful.\n\nA better framing: missing one day is fine. Missing two days in a row is the danger zone. Research on habit formation suggests that a single break does not disrupt a habit, but two consecutive breaks begin to create a new pattern. If you miss a day, the only rule is: do not miss the next one. That is the whole recovery protocol.",
      },
      {
        heading: "The long view",
        body: "The benefits of a daily reflection practice are not immediate. This is worth knowing in advance, because the early weeks produce very little that feels useful. The entries are tentative. The observations are fairly obvious. The habit feels like effort without obvious return.\n\nThe return comes later, and it comes from accumulation rather than from individual insights. After a month of daily entries, you start to notice patterns that no single entry could have revealed. The recurring concern that surfaces every Sunday evening. The three or four topics that account for most of your thinking. The emotion you keep having in a particular context, that you had not consciously identified as a pattern.\n\nThis kind of self-knowledge is only available in the retrospective view across time. You cannot get it from a week of journaling. You can get it from three months. The habit is the only path to the information.",
      },
    ],
  },
  {
    slug: "best-journaling-apps-iphone-2026",
    title: "Journaling apps for iPhone compared (2026)",
    searchTitle: "Journaling apps for iPhone compared (2026) | ÉCHO Journal",
    description:
      "Day One, Reflectly, Rosebud, Journey and ÉCHO: what each one does, who it suits, and how we compared them.",
    excerpt: "Day One, Reflectly, Rosebud, Journey and ÉCHO: what each one does, who it suits, and how we compared them.",
    date: "2026-06-10",
    readingTime: "9 min read",
    author: "The ÉCHO Team",
    topic: "privacy",
    cardVisual: { type: "image" },
    inShort:
      "Five iPhone journaling apps compared: Day One (best for written journaling), Reflectly (best for guided check-ins), Rosebud (best for AI-assisted reflection), Journey (best for cross-platform), and ÉCHO (built specifically for daily spoken reflection with on-device privacy). ÉCHO is our product; take the comparison with that in mind.",
    relatedSlugs: ["what-is-voice-journaling", "private-journaling-app", "build-journaling-habit"],
    sections: [
      {
        body: "The journaling app market has changed significantly in the last two years. AI features are now standard rather than novel, and the meaningful differences between apps are harder to identify from App Store screenshots alone. This is a comparison of the apps that are actually worth considering in 2026, based on what they do well and who they are suited for.\n\nA brief note on bias: ÉCHO is one of the apps listed here, and this article is written by the ÉCHO team. We have tried to be accurate about the competition, but you should weigh that context appropriately.",
      },
      {
        heading: "Day One",
        body: "Day One is the longest-established journaling app on the list and remains the most capable for traditional written journaling. It is polished, reliable, and full-featured. You can attach photos, track locations, set up multiple journals, and sync across devices with strong encryption.\n\nThe AI features added in recent versions are useful without being the main reason to use it. The app is primarily built around written entries, and it shows. If you are a committed writer who wants a private, permanent digital journal with a long track record and excellent import/export, Day One is probably the right choice.\n\nWhere it falls short: the voice journaling features are add-ons rather than the native mode. Transcription quality has improved but still lags behind apps built around audio from the start. The app can feel heavy if all you want is a daily reflection practice.",
      },
      {
        heading: "Reflectly",
        body: "Reflectly is designed as a guided wellness journal. It structures entries around mood check-ins, daily questions, and gratitude prompts. The interface is warm and encouraging, and the app works well for people who respond to the kind of positive reinforcement that traditional journaling does not provide.\n\nThe tradeoff is depth. Reflectly is very good at making reflection feel manageable, but the question prompts are predictable and the entries tend toward the surface-level. It does not handle difficult emotional material particularly well because the whole product is calibrated toward optimism. If you find yourself wanting to work through something genuinely complex, the interface can feel constraining.\n\nIt is a good starting point for journaling beginners, less suited to people who already have a reflective practice and want something more substantial.",
      },
      {
        heading: "Rosebud",
        body: "Rosebud is the most AI-forward app in this comparison. It functions partly as a journal and partly as a conversational self-coaching tool. You write or speak an entry, and the app responds with questions designed to deepen the reflection, similar to a therapeutic dialogue.\n\nFor people who find the blank page difficult and benefit from being prompted to go further, this approach works well. The coaching responses are thoughtful and not sycophantic, which is harder to get right than it sounds.\n\nThe privacy model is less clear than it should be. The conversational AI feature requires sending entries to a server for processing. For people with genuinely private things to work through, that is a meaningful consideration. The app is also relatively expensive compared to the others on this list.",
      },
      {
        heading: "Journey",
        body: "Journey sits somewhere between Day One and a wellness app. It supports written entries, photos, and voice memos, with a more streamlined interface than Day One and slightly more AI assistance than traditional journaling apps. The cross-platform support is strong: it works well on Android as well as iOS, which matters if you switch devices.\n\nThe AI features are functional without being exceptional. The daily prompts are decent. The entry organisation is clean. Journey does many things adequately without doing any single thing as well as the most specialised apps on this list. It is a reasonable choice if cross-platform sync is a priority.",
      },
      {
        heading: "ÉCHO",
        body: "ÉCHO is built around voice journaling specifically. The core idea is one question per day, answered by speaking rather than writing, with transcription done on your device so no audio leaves your phone.\n\nWhat it does differently: the focus on a single daily question, rather than an open-ended prompt, removes the decision-fatigue that kills most journaling habits. The on-device transcription means the audio never touches a server. And the Thought Mirror feature, which surfaces patterns and connections across your entries over time, is the thing that makes the long-term practice feel like it is building toward something rather than just accumulating entries.\n\nWhere it falls short: if you want a rich written journaling experience with photo attachments, location tracking, and multiple journals, ÉCHO is not the right tool. It is built specifically for the person who wants to understand themselves better through daily spoken reflection, not for traditional diarists.\n\nFree to download, with optional Pro features for users who want AI-generated insights and longer reflection history.",
      },
      {
        heading: "How to choose",
        body: "The right app depends almost entirely on what you are trying to do.\n\nFor traditional written journaling with photos and a long track record: Day One.\n\nFor gentle guided reflection with mood tracking: Reflectly.\n\nFor AI-assisted conversational self-coaching: Rosebud.\n\nFor cross-platform support across iOS and Android: Journey.\n\nFor daily spoken reflection with on-device privacy and long-term pattern recognition: ÉCHO.\n\nAll of them have free trials or free tiers. The most reliable way to find out which fits is to use one for a week rather than comparing screenshots.",
      },
    ],
  },
  {
    slug: "journaling-for-anxiety",
    title: "Journaling on anxious days: what to try, and its limits",
    searchTitle: "Journaling on anxious days: what to try, and its limits | ÉCHO Journal",
    description: "Gentle ways to put a worry into words, and when to reach out for support instead.",
    excerpt: "Gentle ways to put a worry into words, and when to reach out for support instead.",
    date: "2026-07-01",
    readingTime: "8 min read",
    author: "The ÉCHO Team",
    topic: "reflect",
    cardVisual: { type: "image" },
    inShort:
      "Speaking a worry out loud can help interrupt the loop of anxious thinking. Voice journaling works for everyday anxiety; it is not a substitute for professional support. If anxiety is frequent or significantly affecting your life, speak to a GP or mental health professional first.",
    relatedSlugs: ["how-to-process-emotions", "evening-journaling", "how-to-reflect-on-your-day"],
    sections: [
      {
        body: "Anxiety produces a specific kind of thought: the loop. The same concern circulates, gaining no new information, arriving at no resolution, returning slightly worse than it left. Most advice about anxiety suggests journaling as a remedy. Write it out. Get it on the page. The recommendation is well-intentioned but incomplete.\n\nFor many people with anxious minds, writing can extend the loop rather than break it. Give an anxious thought a blank page and it sometimes finds more material to work with. The editing process that writing involves, the rereading, the crossing out, the search for the right word, can in some cases resemble rumination. Speaking the thought out loud, by contrast, externalises it in a different way.",
      },
      {
        heading: "What verbal externalisation actually does",
        body: "Speaking a thought out loud does something structurally different from writing it. It creates distance between the thinker and the thought in real time, without allowing revision. The spoken version of a worry is always slightly less polished than the written version. It is interrupted by pauses, by course corrections, by the simple awkwardness of saying something you have only previously thought. That friction is a feature. It signals to the brain that this thought is now outside. It has been said.\n\nResearch on verbal self-disclosure consistently shows that it reduces emotional arousal faster than written expression in acutely anxious states. The mechanism appears to involve the prefrontal cortex re-engaging with material that the amygdala has been processing in circles. Naming and externalising a feeling out loud activates the thinking brain in a way that staying inside the feeling does not.",
      },
      {
        heading: "What to say when you are anxious",
        body: "This is where most advice gets vague. \"Talk about your feelings\" is not a usable instruction for an anxious mind. Specific is better.\n\nStart with the physical. Before engaging with the content of the anxiety, describe what it feels like in the body. My chest is tight. My jaw is clenched. My thoughts are moving faster than normal. This grounds the observation in something concrete and moves you from abstract worry to physical description, which is a different kind of attention.\n\nThen move to the content in one sentence. Not the implications, not the what-ifs, just the core of what you are worried about. One sentence. If you find yourself generating multiple sentences of worry content, stop. That is the loop starting again.\n\nThen move to what you actually know. Not what you fear, what you know. This is often shorter than the worry sentence, which is informative in itself.",
      },
      {
        heading: "The one-day-later effect",
        body: "One underappreciated benefit of voice journaling for anxiety is not the act of speaking, but the ability to listen back later. When you listen to a recording you made at the height of an anxious state, you hear it from the outside. You hear the voice of someone who survived that state. You hear how it ended.\n\nWriting does not provide this in the same way. The written entry is static. The recording has duration, and the fact that it ended tells you something.\n\nMany people report that listening back to anxious recordings, even from a week earlier, produces a kind of compassion for themselves that reading a written journal entry does not. There is something about hearing your own voice struggle and then stop that makes the temporary nature of the state real in a way that words on a page cannot.",
      },
      {
        heading: "What voice journaling cannot do",
        body: "Voice journaling is not therapy. It does not address the structural causes of anxiety, the sleep debt, the unresolved conflict, the work situation that needs to change. It does not provide the challenge and response of talking with a skilled therapist who can gently question your catastrophising. It does not prescribe medication or teach systematic relaxation techniques.\n\nIf your anxiety is severe, frequent, or significantly affecting your daily life, the right first step is a conversation with a GP or mental health professional, not an app. ÉCHO is a reflection tool for people who want to understand themselves better. It is not a clinical intervention. For crisis support, please see our resources page.",
      },
      {
        heading: "Building the practice",
        body: "The worst time to decide to start a voice journaling practice is in the middle of an anxious episode. The best time is on a calm day, when you can establish the habit as a preventive routine rather than a crisis tool.\n\nPick a time that is not the peak of the anxiety. Many people choose early morning, before the day's pressures have accumulated, or late evening, after the events of the day have had a few hours to settle. Keep it short. Three minutes is enough. One question, one answer, one record.\n\nThe goal is not to fix the anxiety in any single session. The goal is to build a record of your own mind that you can actually use, to notice what triggers the loop, what shortens it, and what the loop has and has not predicted accurately. That record, built over months, is more useful than any single journal entry.",
      },
    ],
  },
  {
    slug: "how-to-process-emotions",
    title: "How to process emotions: what it means to work through a feeling",
    searchTitle: "How to process emotions: what it means to work through a feeling | ÉCHO Journal",
    description: "The difference between feeling something and working through it, with a simple three-step approach.",
    excerpt: "The difference between feeling something and working through it, with a simple three-step approach.",
    date: "2026-07-15",
    readingTime: "7 min read",
    author: "The ÉCHO Team",
    topic: "reflect",
    cardVisual: { type: "image" },
    inShort:
      "Processing an emotion means externalising it in some form — through words, voice, or movement — until it loses its charge. Three steps that help: name the feeling precisely, trace it to its source (not its narrative extension), then say what you actually want.",
    relatedSlugs: ["journaling-for-anxiety", "voice-journaling-vs-writing", "daily-reflection-questions"],
    sections: [
      {
        body: "\"Process your emotions\" is one of those phrases that sounds meaningful until you try to do it. What does processing actually mean? In therapy, it means something specific: revisiting a difficult experience with a skilled guide until it loses its charge, until it can be recalled without triggering the same visceral response. But outside a therapist's office, the phrase mostly means: do not ignore it. Do something with it before you go to bed.\n\nThat is vaguer advice than it sounds. For most people, it produces either excessive rumination, going over the same ground without insight, or surface-level acknowledgment that quickly slides back to avoidance.",
      },
      {
        heading: "The difference between feeling and processing",
        body: "Feeling an emotion and processing it are not the same thing. You can feel anxious for years without understanding what you are anxious about. You can feel resentful toward someone without ever tracing that resentment to its source. Feeling is automatic. Processing requires something deliberate: a moment of attention, a frame, and some form of externalisation.\n\nExternalisation is the act of moving a feeling from inside to outside, into words, into sound, into motion. Therapy externalises through conversation. Exercise externalises through the body. Journaling externalises through language. The specific method matters less than the act of getting it out of the loop of internal processing and into a form you can observe.",
      },
      {
        heading: "Why talking works differently from thinking",
        body: "When you think about an emotion, you experience it from the inside. The thought and the feeling share the same space. This is why rumination, sustained internal attention on a difficult feeling, tends to amplify rather than resolve it.\n\nWhen you speak about an emotion out loud, even to yourself, something shifts. Speaking forces you to find words for what you are experiencing, and the act of labelling an emotion appears to reduce its intensity. This is sometimes called affect labelling, and its effects are measurable, not just self-reported. The more precisely you can name what you are feeling, the less charge it carries.",
      },
      {
        heading: "A three-step process that works",
        body: "Not every emotional experience needs the same amount of processing. A mildly frustrating commute does not require the same attention as a significant loss. But for anything that is still present after the immediate circumstances have resolved, a simple approach tends to help.\n\nFirst, name it precisely. Not \"I feel bad\" but \"I feel specifically disappointed because I expected something that did not happen.\" The more precise the label, the more useful the processing. Emotions that share a family, frustration, resentment, anger, feel similar but have different sources and call for different responses.\n\nSecond, say where it is from. This feeling came from a specific event or pattern, not from the story I am constructing around it. Many emotions get attached to narratives that expand them. Tracing the emotion to its specific source, rather than its narrative extension, is what limits its radius.\n\nThird, say what you actually want. Not what you wish had happened, but what, given that it happened, you actually want now. This step converts processing into direction.",
      },
      {
        heading: "Why voice journaling suits this particularly well",
        body: "James Pennebaker's decades of research established that expressive writing reduces stress markers and improves long-term wellbeing. But writing has a limitation for emotional processing specifically: the inner editor. When you write about an emotion you find difficult, the written version tends to be slightly more composed than the felt version. The rough edges, the contradiction, the illogic, the embarrassing simplicity of what you actually want, get smoothed in translation from thought to text.\n\nSpeaking out loud, with no backspace key, produces a less polished but more accurate record. The contradictions stay. The hesitations stay. The moment where you say something and immediately say, no, actually, that is not quite right, that stays too. Those moments of self-correction are often where the real processing happens. They represent the mind updating its model in real time.",
      },
      {
        heading: "Building it into the day",
        body: "Processing works best when it happens close to the event, before the emotion has been stored under a narrative. A five-minute voice note at the end of the working day, before you have told anyone else about it, before you have collapsed the experience into a story, captures a more useful version of what happened.\n\nOver weeks, patterns emerge that single sessions do not reveal. The recurring emotional responses, the thing that still bothers you a week later, the situation that reliably produces the same feeling, are only visible across time. Processing is more useful as a long-term practice than as an occasional intervention.",
      },
      {
        heading: "When this is not enough",
        body: "Emotional processing through journaling has real benefits and real limits. It works well for the everyday texture of experience: work stress, relationship friction, recurring self-doubt, decisions that are difficult to think about alone. It does not work well for acute trauma, grief in its acute phases, or mental health conditions that require clinical support.\n\nIf you notice that the same emotional experiences are returning at the same intensity despite regular reflection, that is information. The loop does not close because you have been watching it closely. It closes because something structural changes. That change sometimes comes from insight. Often it comes from action. Sometimes it requires a professional to help identify what is actually maintaining it.",
      },
    ],
  },
  {
    slug: "evening-journaling",
    title: "Evening journaling: what it's good for",
    searchTitle: "Evening journaling: what it's good for | ÉCHO Journal",
    description: "What an end-of-day reflection can capture, how it compares with mornings, and how to fit it in.",
    excerpt: "What an end-of-day reflection can capture, how it compares with mornings, and how to fit it in.",
    date: "2026-08-05",
    readingTime: "6 min read",
    author: "The ÉCHO Team",
    topic: "prompts",
    cardVisual: { type: "image" },
    inShort:
      "Evening journaling captures the felt experience of the day before sleep processes and edits it. Morning journaling captures the rested, more considered version. Both have genuine uses. If you can only do one, evenings capture something that is unavailable by morning.",
    relatedSlugs: ["how-to-reflect-on-your-day", "build-journaling-habit", "journaling-for-anxiety"],
    sections: [
      {
        body: "Morning journaling has good marketing. It is associated with famous people and productive routines, the 5am practice, the pages written before the day intrudes. The appeal is real: your mind is quiet, the day has not happened yet, you are writing from potential rather than experience.\n\nEvening journaling has a different advantage: it produces something morning journaling structurally cannot: a record of what actually happened, captured before sleep processes and reorganises it.",
      },
      {
        heading: "What sleep actually does to your memories",
        body: "Overnight memory consolidation is one of the most well-established findings in neuroscience. During sleep, particularly during REM phases, the brain replays the day's experiences, integrating them into existing memory structures and discarding what it judges as low priority. This process is largely outside conscious control. The brain decides what to keep, how to frame it, and how to connect it to existing beliefs.\n\nThis is useful. It is also why you often feel differently about events the morning after than you did the evening before. Sleep does not just rest the brain. It edits. The version of today's difficult conversation that you will remember in a week is not the raw version. It is the version your brain processed overnight, smoothed into a narrative consistent with your existing models of yourself and others.",
      },
      {
        heading: "What morning journaling captures",
        body: "Morning journaling captures this processed version. You write about yesterday, but yesterday has already been revised. The feelings are calmer. The narrative is more coherent. The detail has been pruned. For some purposes this is useful. The morning version of an experience often has more perspective and less reactivity.\n\nBut it lacks something important: what you actually felt at the time. Not the processed version. The raw one. The discomfort of the moment before you knew how it would end. The feeling in the room that did not make it into the story you told yourself about it later.",
      },
      {
        heading: "What evening journaling captures instead",
        body: "Evening journaling captures what morning journaling loses. When you record a voice note about the day's events before sleeping, you get the felt experience, not the memory of it. The conversation still has its original emotional texture. You have not yet decided what it means.\n\nYou also capture the detail you will lose overnight. Memory consolidation is lossy. The specific word someone used, the pause before they said it, your immediate physical response, these are exactly the details that get discarded in overnight processing. They are often the most revealing ones.\n\nAnd you capture the unresolved feeling. Sleep tends to resolve ambivalence by picking a side. An evening record captures the genuine uncertainty that was present in the moment, before your brain filed it under a simpler emotion.",
      },
      {
        heading: "The one-question approach",
        body: "The mistake of evening journaling is turning it into a debrief. Recounting every event of the day produces a log, not a reflection. The log may be accurate but it is rarely useful.\n\nMore useful: one question that angles toward what was significant, not just what happened. Some that work well:\n\nWhat was the moment today that I am still thinking about? Not the biggest event, the one that is still present. That persistence is usually pointing to something.\n\nWhat did I say yes to that I wanted to say no to, or the opposite? The gap between stated and felt preferences is often where the most useful self-knowledge lives.\n\nWhat surprised me? Surprise reveals where your model of the world did not match reality. That is almost always worth a few minutes of attention.",
      },
      {
        heading: "Why speaking beats writing at night",
        body: "Practical factors reinforce the theoretical ones here. Writing at night requires light, a surface, and a level of wakefulness that a long day often does not leave. Speaking requires none of these. A thirty-second voice note in bed, before you reach for your phone, takes less activation energy than any written practice.\n\nThere is also the emotional component. Tiredness strips the editorial layer more effectively than almost anything else. The version of yourself that speaks at 10pm after a full day is less managed than the version that writes at 7am after coffee. The honesty that emerges from exhaustion is not always pretty, but it is often accurate.",
      },
      {
        heading: "Combining both",
        body: "Morning and evening journaling address different things and are not mutually exclusive. Morning journaling is better for intention-setting, creative thinking, and working through decisions from a rested mind. Evening journaling is better for capturing experience, noticing emotional patterns, and building an honest record of what your days actually contain.\n\nIf you are going to choose one, evenings capture something that is uniquely available at that moment and gone by morning. You can always reflect on yesterday. You cannot recover how it actually felt.",
      },
    ],
  },
  {
    slug: "private-journaling-app",
    title: "What \"private\" means in a journaling app, and what to check",
    searchTitle: "What “private” means in a journaling app, and what to check | ÉCHO Journal",
    description:
      "Questions to ask about recording, transcription, storage, AI processing and deletion before you trust an app with your thoughts.",
    excerpt:
      "Questions to ask about recording, transcription, storage, AI processing and deletion before you trust an app with your thoughts.",
    date: "2026-08-19",
    readingTime: "7 min read",
    author: "The ÉCHO Team",
    topic: "privacy",
    cardVisual: { type: "image" },
    inShort:
      "Genuine privacy in a journaling app requires: on-device transcription (no audio leaves the device), encryption at rest you control, no use of your data to train AI models, and a real right to deletion. Most apps that use the word \"private\" do not meet all four criteria.",
    relatedSlugs: ["what-is-voice-journaling", "best-journaling-apps-iphone-2026", "build-journaling-habit"],
    sections: [
      {
        body: "Every journaling app calls itself private. It is the expected thing to say. Nobody would choose an app that admitted to reading your diary. The word private appears in marketing copy, App Store descriptions, and privacy policies, often without any technical substance behind it.\n\nGenuine privacy in a journaling app is rare. Most apps that claim it offer a version that is better described as \"we do not actively share your data\", which is meaningfully different from \"your data is inaccessible to us.\" Understanding the difference matters before you put your honest thoughts somewhere.",
      },
      {
        heading: "The three questions that actually matter",
        body: "When evaluating whether a journaling app is genuinely private, three questions cut through the marketing.\n\nWhere is your transcription processed? Voice journals require transcription. This can happen on your device, using a local AI model, or on a server, meaning your audio is sent over the internet to a company's infrastructure. Server-side transcription means your voice recording has left your device before you have read a single word of the transcript.\n\nWho can access your entries if asked? Most cloud storage, including many apps that describe themselves as encrypted, uses encryption in transit but stores the data in a form the company can decrypt. This means a court order, a data breach, or a rogue employee could access your entries.\n\nIs your data used to train AI models? Many apps include a clause in their terms of service that permits using your data to improve their AI systems. Your private reflection, used to train a language model that serves other users, is a form of data use that most people would consider a privacy violation if they understood it was happening.",
      },
      {
        heading: "On-device transcription: what it means and why it matters",
        body: "On-device transcription processes your voice using a model that runs entirely on your phone. No audio leaves your device. The transcript is generated locally and stored locally. From a privacy standpoint, this is categorically different from cloud transcription, not marginally better but structurally different.\n\nThe limitation of on-device transcription has historically been quality. Cloud transcription, with access to vastly more computing power, produces more accurate results for accented speech, background noise, and complex vocabulary. This gap is narrowing rapidly. Models like Whisper, now deployable on-device, achieve accuracy comparable to cloud services for the vast majority of everyday speech in a quiet room.\n\nIf an app does not specify that transcription is on-device, assume it is not.",
      },
      {
        heading: "Encryption: what it protects and what it does not",
        body: "Encryption is one of the most misused words in tech marketing. It is worth being specific about what different types actually mean.\n\nEncryption in transit means your data is encrypted while moving between your device and a company's servers. This protects against someone intercepting the transmission.\n\nEncryption at rest means your data is encrypted while stored on a company's servers. This protects against certain types of data breach. It does not protect against the company itself accessing your data, because the company holds the encryption keys.\n\nEnd-to-end encryption means your data is encrypted with keys that only you control. The company cannot decrypt it even if compelled by law. This is the strongest form of protection and the rarest in consumer apps.\n\nWhen an app says it uses bank-level encryption, it is almost always describing encryption in transit or at rest, not end-to-end. This is not nothing, but it is less than the phrase implies.",
      },
      {
        heading: "The AI training question",
        body: "This is the privacy issue that receives the least attention and arguably matters most for journaling specifically. Language models improve through training on human-generated text. Personal journals are, from a training data perspective, extremely valuable: they are authentic, emotionally varied, and linguistically rich. They are also deeply private.\n\nMany consumer apps include a clause permitting use of user data for AI development. The language is usually buried and euphemistic: to improve our services, to develop new features, to train our models. In practice, this can mean your private entries are processed by humans or systems for quality review, or contribute to training datasets.\n\nBefore trusting a journaling app with your honest thoughts, read the actual privacy policy, not the marketing page. Search specifically for words like train, improve, AI, and anonymise. If you find any of these in connection with user content, that is a significant qualification on the word private.",
      },
      {
        heading: "What genuine privacy looks like",
        body: "A genuinely private journaling app in 2026 should offer on-device transcription so no audio leaves the device, on-device storage as the default with encrypted backup as an option, a clear statement that user data is never used to train AI models, GDPR compliance for European users including a genuine right to deletion, and a business model that does not depend on data monetisation.\n\nThese are not aspirational features. They are achievable with current technology, and apps that claim the private label should be evaluated against them specifically rather than against the marketing copy that surrounds the claim.",
      },
    ],
  },
  {
    slug: "how-to-reflect-on-your-day",
    title: "How to reflect on your day: a 3-minute practice",
    searchTitle: "How to reflect on your day: a 3-minute practice | ÉCHO Journal",
    description: "A short end-of-day routine with three questions, and how reflections add up over time.",
    excerpt: "A short end-of-day routine with three questions, and how reflections add up over time.",
    date: "2026-09-09",
    readingTime: "6 min read",
    author: "The ÉCHO Team",
    topic: "reflect",
    cardVisual: { type: "image" },
    inShort:
      "Three minutes, three questions: what moment am I still thinking about, what did I feel that I did not express, and what do I want tomorrow to contain that today did not. The value accumulates across months, not from individual sessions.",
    relatedSlugs: ["daily-reflection-questions", "build-journaling-habit", "evening-journaling"],
    sections: [
      {
        body: "Most advice about daily reflection assumes you have twenty minutes, a quiet space, and a journaling practice that is already well established. For everyone else, people with full days, short evenings, and a history of started-and-abandoned journals, the standard advice produces guilt more reliably than insight.\n\nThere is a shorter version that works. It is built around one observation from research on daily review practices: the quality of a reflection does not correlate with its length. The five-word answer to a well-chosen question produces more useful self-knowledge than a page of free association. What matters is the question, the honesty, and the regularity.",
      },
      {
        heading: "What reflection actually is",
        body: "Most people, when they try to reflect on their day, produce one of two things: a summary or a complaint. The summary recounts what happened, in the order it happened, without much editorial input. The complaint focuses on what went wrong, occasionally with a note about what should have gone differently.\n\nNeither of these is reflection in any meaningful sense. A summary is a log. A complaint is a loop. Reflection, properly understood, is the act of noticing what you did not notice at the time: the thing that happened that you did not think was significant but is, the emotion you were having that you did not identify while you were having it, the pattern that is showing up again that you told yourself was not a pattern.\n\nThat kind of noticing does not require length. It requires honesty and the right angle of approach.",
      },
      {
        heading: "Three questions worth asking",
        body: "Three questions cover the essential ground of a useful daily reflection. They can be answered in sixty seconds each, and none of them asks you to summarise your day.\n\nFirst: what was the moment I am still thinking about? Not the biggest event or the most objectively important meeting, the thing that has persisted. Persistence is a reliable signal of significance. If something from eight hours ago is still present in your mind, your brain is telling you it is unresolved.\n\nSecond: what did I feel that I did not express? The gap between felt and expressed emotion is one of the most consistently underexplored areas of daily experience. The thing you wanted to say in the meeting but did not. The appreciation you felt but did not mention. These unexpressed feelings accumulate.\n\nThird: what do I want tomorrow to contain that today did not? This is more useful than \"what would I do differently\" because it is generative rather than corrective. It asks what you want, not what you regret.",
      },
      {
        heading: "Why speaking is faster and more honest",
        body: "Writing answers to these questions takes longer than speaking them and, for most people, produces a more polished version of what they actually think. The inner editor activates. The answer gets cleaned up. The rough truth gets replaced by a slightly tidier approximation.\n\nSpeaking produces the rough truth faster. A sixty-second voice answer captures what you actually think, including the contradictions and hesitations, before you have decided what you are supposed to think.\n\nThere is also the practical element. Speaking requires no light, no surface, no typing. You can do it lying in bed, in a parked car, on a walk. The three-minute practice becomes possible in places where a three-minute writing practice would require setup.",
      },
      {
        heading: "What changes over time",
        body: "The immediate value of a three-minute daily reflection is modest. The answer to what am I still thinking about today is useful today but not much more. What changes is what becomes visible over time.\n\nAfter a month of consistent answers, patterns emerge that no single entry reveals. The thing you are still thinking about turns out to be one of two or three topics rotating. The unexpressed emotion almost always involves the same person or situation. The forward-facing question produces the same answer, phrased slightly differently each time.\n\nThese patterns are the actual output of a daily reflection practice. Not individual insights but accumulated evidence about your own recurring concerns, desires, and unresolved tensions. This kind of self-knowledge is only available in the retrospective view, you cannot see it in any single entry.",
      },
      {
        heading: "Building the anchor",
        body: "A practice that depends on remembering to do it fails within a week. The solution is an anchor, a behaviour that already happens reliably, to which the reflection attaches.\n\nCommon anchors: the moment after setting an alarm for the next morning, the two minutes between brushing teeth and getting into bed, the end of a commute before getting out of the car, the minute after turning off a laptop at the end of the work day.\n\nThe anchor does not need to be ideal timing. It needs to be reliable. A slightly imperfect reflection done consistently is worth more than an ideal one done three times a month. Once the anchor holds, the three minutes become automatic. And the accumulation begins.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
