export interface BlogSection {
  heading?: string;
  body: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  author: string;
  sections: BlogSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "what-is-voice-journaling",
    title: "What Is Voice Journaling? A Beginner's Complete Guide",
    description:
      "Discover what voice journaling is, how it differs from traditional journaling, and why speaking your thoughts reveals more than writing them ever could.",
    date: "2026-06-03",
    readingTime: "7 min read",
    author: "The ÉCHO Team",
    sections: [
      {
        body: "Voice journaling is the practice of speaking your thoughts aloud into a recording instead of writing them down. That's the one-sentence version. The longer version is that it feels fundamentally different from anything you've tried before — closer to thinking out loud to a trusted friend than filling in a diary. You press record, you answer a question, you stop. There's no formatting, no backspacing, no rereading what you wrote and deciding it sounds wrong.\n\nMost people who try it for the first time notice something unexpected: they say things they didn't know they thought. The act of speaking — with no delete key and no audience — creates a kind of honesty that a notebook and pen rarely produces. That's not magic. It's just what happens when you remove the editing layer between a thought and its expression.",
      },
      {
        heading: "How voice journaling works",
        body: "The mechanics are simple. You open an app, receive a question — one prompt, not ten — speak your answer for anywhere from thirty seconds to a few minutes, and the app transcribes your voice into text on your device. No audio is sent to a server. No human transcriptionist is involved. The text sits in your journal alongside the original recording, searchable and private.\n\nWhat happens after that depends on the app. Some just store entries. More sophisticated tools surface patterns across time: words you return to repeatedly, emotional tones that shift across weeks, questions you keep answering the same way. The raw entry is valuable. The accumulated record across months is where voice journaling starts to become genuinely useful for self-understanding, rather than just self-expression.",
      },
      {
        heading: "Why speaking is more revealing than writing",
        body: "When you write, you have an inner editor running alongside the process. It monitors grammar, checks whether your sentence sounds intelligent, softens things that feel too raw, and reorganises thoughts before they reach the page. This is a feature of written language — it's what makes it precise and communicable. But in the context of private self-reflection, it's a bug.\n\nSpeaking bypasses most of that filtering. When you're answering a question out loud with no time to pause and revise, the first thing that comes out is usually the most honest version of what you actually think. Voice recordings preserve hesitations, changes in pace, moments where your voice tightens up on a particular word. Those signals carry information that prose cannot. Six months later, you can hear the emotional state of that entry in a way that reading it never would have conveyed.",
      },
      {
        heading: "Who voice journaling is for",
        body: "Voice journaling is particularly well-suited to people who've tried written journaling and stopped. If you've bought three beautiful notebooks and filled a combined twelve pages across all of them, the problem probably wasn't your discipline — it was the format. Writing requires time, a comfortable surface, and a decision about what to say. Voice journaling requires none of those things. You can do it in the car, on a walk, in two minutes between meetings.\n\nIt also works well for overthinkers. If you get stuck in loops — the same thoughts circling without resolution — speaking them out loud creates a kind of externalization that interrupts the loop. And for people who process experiences verbally rather than visually or textually (a meaningful portion of the population), the spoken format simply fits better with how their minds work. You don't have to be a writer to have valuable thoughts. You just have to be willing to say them.",
      },
      {
        heading: "How to start",
        body: "The only thing required to start is a single question and one minute of willingness to answer it. Pick an app that gives you a prompt — if you have to choose your own topic every day, you'll run out of motivation fast. Commit to answering one question per day for two weeks. Not two questions. Not a long reflection. One question, answered honestly, out loud.\n\nThe most important rule in the first week is: don't edit. Whatever comes out, let it come. You will ramble. You will repeat yourself. You will pause awkwardly. All of that is fine — it's actually the point. The habit forms before the skill does. After the two weeks, listen back to your first three recordings. The contrast between who you were that first day and who you are now is usually more interesting than anything you said in either recording.",
      },
      {
        heading: "What to expect in the first month",
        body: "The first two or three days feel slightly absurd. Talking to your phone in a quiet room is not a natural act, and your brain will remind you of this. Push through it. By day five or six, the awkwardness fades and you start treating it like any other brief daily task — like making coffee or checking your calendar.\n\nAround week two, something shifts. You start hearing yourself repeat certain words or phrases across multiple recordings. You notice that your energy sounds different on Mondays than on Thursdays. You catch yourself saying something you'd been avoiding saying, even privately. By week four, the habit is largely automatic, and the question you're looking forward to answering is whether the person speaking in that first recording is meaningfully different from the person speaking now. They usually are — more than you expected.",
      },
      {
        heading: "Common questions",
        body: "Does it feel weird talking to your phone? Yes, at first. Then no. The self-consciousness is entirely normal and almost universally fades within the first week. If it helps, close your eyes while you answer. You'll forget about the device faster than you expect.\n\nWhat if I ramble? That's the point. Rambling is what happens when your thoughts are moving faster than your editorial filter. The most interesting things people say in voice journals come after the first coherent sentence, in the part where they've stopped trying to sound composed. Do I need to listen back every day? You don't. Most people don't. But listening back periodically — once a week or once a month — is where the real value lives. Capturing entries without ever reviewing them is like taking photographs and never looking at them. The capture matters, but so does the reflection.",
      },
    ],
  },
  {
    slug: "voice-journaling-vs-writing",
    title: "Voice Journaling vs. Writing: Why Your Voice Reveals More Than Your Pen",
    description:
      "We write to look good. We speak to think. Here's why voice journaling consistently surfaces deeper truths than written journaling — and what the research says.",
    date: "2026-06-03",
    readingTime: "6 min read",
    author: "The ÉCHO Team",
    sections: [
      {
        body: "There's a widespread assumption that written journals are the more serious, more literary, more worthwhile form of self-reflection. Centuries of tradition back this up. Marcus Aurelius wrote. Anaïs Nin wrote. Virginia Woolf wrote. The diary, as a form, has cultural prestige that voice memos do not.\n\nBut prestige and usefulness are different things. When you sit down to write about a hard conversation you had today, the version that reaches the page is already a revision — cleaned up, given a narrative arc, made more coherent than the actual experience was. That's not always bad. But it's worth asking: is the polished version the one you most need to examine? Or is it the raw, contradictory, mid-thought version that came before you knew what you actually felt?",
      },
      {
        heading: "The inner editor problem",
        body: "Every person who writes has an inner editor running in parallel. It monitors sentence structure, checks tone, softens language that feels too exposed, and organises thoughts into something that resembles a coherent argument before they've fully formed. This is a feature of writing — it's what makes written language precise and communicative. But in the context of private self-reflection, it's a bug.\n\nWhen you're journaling about something genuinely difficult — a relationship that's not working, an ambition you're afraid to admit, a resentment you think you shouldn't have — the inner editor is most active precisely when you need it least. It tidies up the mess you're trying to examine. Voice journaling doesn't solve this completely, but it reduces it significantly. Speaking quickly, with no backspace key, means your first thought reaches the record before your second thought can revise it.",
      },
      {
        heading: "What research says about verbal vs. written expression",
        body: "Verbal externalization — talking through a problem out loud — has a substantial evidence base in clinical psychology. Talk therapy in its many forms is fundamentally built on the principle that verbalising internal experience changes how we process it. Speaking activates different neural pathways than silent rumination. It creates a form of distance between the thinker and the thought that internal processing alone doesn't produce.\n\nThe comparison with writing is more nuanced. Written expressive therapy (the kind studied by James Pennebaker and others since the 1980s) also has real benefits — it reduces stress markers and improves emotional clarity. But the mechanism is the act of finding words for an experience, not the written medium itself, that matters. Voice journaling captures that same mechanism while removing the friction of the blank page and the revision process that written expression invites.",
      },
      {
        heading: "Writing's hidden strength",
        body: "This isn't an argument that writing is inferior. Written journals have real advantages that voice recordings cannot easily replicate. The slower pace of writing forces you to find the right words, and that search can itself generate insight. Re-reading written entries is faster than listening to recordings. Prose can be beautiful in a way that transcribed speech rarely is — fragmented, full of false starts, grammatically informal.\n\nFor synthesis, goal-setting, and capturing decisions, writing is often more useful than speaking. Many people find that writing forces a kind of commitment that speaking doesn't — it's harder to write \"I'm going to leave this job\" and dismiss it than it is to say it. These are genuine strengths, not to be dismissed.",
      },
      {
        heading: "Where voice journaling wins",
        body: "Voice journaling's advantages concentrate in specific areas. Speed is the most obvious: answering a question out loud takes thirty seconds to two minutes. The time cost of written journaling is a real barrier for most people — and barriers, however small, compound into habits that don't form. Voice removes that barrier almost entirely.\n\nEmotional fidelity is the less obvious but more significant advantage. Your voice carries information that transcribed words cannot: pace, hesitation, warmth, strain. A recording from a difficult period in your life sounds different from one made during a good period, even if the words themselves don't explicitly say so. When you listen to a voice entry from six months ago, you're not just reading about who you were — you're hearing them. That's a different and more visceral kind of self-knowledge.",
      },
      {
        heading: "Why not both?",
        body: "Some people combine the two formats effectively. Voice journaling for raw daily capture — the honest, unpolished, emotional record — and written journaling for weekly synthesis, goal review, and deliberately composed reflection. This is a reasonable approach if you have the time and the appetite for both practices.\n\nThe reason voice-first apps like ÉCHO focus on voice rather than offering it as one option among many is that the raw record is the most valuable longitudinal artifact. The synthesised, written version is something you can always produce later, from memory or from transcripts. The unguarded, in-the-moment spoken version is something you can only capture once. Starting with the most honest version and working toward structure is more useful than starting with structure and losing the honesty.",
      },
      {
        heading: "The proof is in the playback",
        body: "Here's a thought experiment: find something you wrote in a private journal three years ago, then find a voice memo you recorded around the same time — even just a rambling thought on a walk. Listen to the voice memo first. Then read the writing.\n\nAlmost universally, people find the voice recording more surprising. Not necessarily more profound — but more revealing of who they actually were at that moment. The writing is recognisably them. The voice is undeniably them. The distinction matters more than it sounds. Journaling is a practice of building self-knowledge over time, and the raw material for that knowledge is more accurately captured by voice than by a pen.",
      },
    ],
  },
  {
    slug: "daily-reflection-questions",
    title: "5 Daily Reflection Questions That Actually Change How You Think",
    description:
      "Most journaling prompts are vague. These 5 questions are designed to surface hidden assumptions, break avoidance patterns, and build self-clarity over time.",
    date: "2026-06-03",
    readingTime: "8 min read",
    author: "The ÉCHO Team",
    sections: [
      {
        body: "Most journaling prompts are well-intentioned and essentially useless. \"What are you grateful for?\" produces a list: coffee, my dog, my health. You write it, feel briefly virtuous, and learn nothing you didn't already know. \"How are you feeling?\" gets the same three-word answer every time. The problem isn't that these questions are bad — it's that they're so familiar your brain can answer them without actually thinking.\n\nA genuinely useful reflection question has to do something a familiar one doesn't: it has to introduce a moment of friction. A small gap between the question and the answer, during which your brain has to actually search rather than retrieve. That friction is where the insight lives. The five questions below are designed to create that gap — to ask something slightly uncomfortable, slightly specific, slightly unfamiliar, so that the answer surprises you.",
      },
      {
        heading: "What makes a question worth answering?",
        body: "Good reflection questions share a few structural properties. They're specific enough to resist a generic answer — \"What did you avoid today?\" is harder to deflect than \"How was your day?\" They're open-ended rather than yes/no, because binary questions close off the thinking process rather than open it. And they're slightly uncomfortable, because comfort produces rote answers and discomfort produces honesty.\n\nThe best questions are also time-anchored. Asking about today, or this week, or right now forces your attention onto concrete experience rather than abstract self-concept. It's much easier to answer \"What did you need today that you didn't ask for?\" honestly than to answer \"Do you struggle to ask for what you need?\" — even though they're probing the same thing. The concrete version bypasses defensiveness in a way the abstract version can't.",
      },
      {
        heading: "Question 1: What are you avoiding telling yourself?",
        body: "This question is uncomfortable because the honest answer is almost always already known. You're not uncovering new information — you're acknowledging something you've been managing not to look at directly. The avoidance is usually conscious enough that asking the question creates an immediate sense of recognition.\n\nWhat it surfaces varies: a relationship that's past its end, a decision that's been pending too long, a fear that's been dressed up as a practical consideration. People are often surprised by how quickly they can answer this question, and how long they've been carrying the answer without saying it. Answering it out loud — rather than just thinking it — changes its status. Once you've said it, you've acknowledged it. That changes what you do next.",
      },
      {
        heading: "Question 2: Where did you feel most like yourself today?",
        body: "This question works by surfacing identity through behaviour rather than through self-description. Asking someone \"Who are you?\" produces a rehearsed answer. Asking \"When did you feel most like yourself today?\" produces a specific moment, and the pattern of those moments across weeks tells you something more honest about your actual values than any direct question about values could.\n\nOver time, answers to this question reveal which environments, relationships, and activities align with who you actually are versus who you're performing as. Someone who lists their morning solo walk every single day, and never lists their team meetings, is learning something important — not because the meetings are bad, but because the contrast is worth examining. The question builds an empirical record of your authentic self, one day at a time.",
      },
      {
        heading: "Question 3: What decision are you delaying, and what does the delay cost you?",
        body: "Avoidance is usually invisible to us. We don't think of ourselves as avoiding a decision — we think of ourselves as \"waiting for more information\" or \"not ready yet\" or \"still figuring it out.\" These are sometimes true and sometimes a story. This question forces you to name both the delay and its cost, which makes the delay harder to sustain unconsciously.\n\nThe cost is the most important part. Once you can articulate what the delay is actually costing — energy spent in low-grade anxiety, opportunities foregone, relationships affected by the uncertainty — the balance changes. Decisions that felt impossible to make often become less impossible once their cost of non-decision is visible. This question doesn't tell you what to decide. It just makes the default of doing nothing as visible as the alternatives.",
      },
      {
        heading: "Question 4: What did you need today that you didn't ask for?",
        body: "This question probes emotional needs and the patterns around how they get — or don't get — met. Most people have a reasonably clear sense of what they needed on any given day in retrospect, but almost no habit of naming it. This question builds that naming habit.\n\nAnswered daily across a month, it surfaces structural patterns: whether you consistently need reassurance but don't ask for it, whether you need quiet and never protect it, whether certain relationships consistently fail to meet needs you bring to them. The goal isn't to become someone who demands more from others — it's to become someone who can recognise a need clearly enough to either ask for it or meet it yourself. You can't address what you haven't named.",
      },
      {
        heading: "Question 5: What would you do differently if no one was watching?",
        body: "This is the identity-gap question. The distance between your answer and your actual behaviour is a map of where social conditioning, fear of judgment, and performance have shaped your choices. That distance is neither good nor bad — some of it reflects genuine values, some of it reflects genuine fear. The question's job is simply to make the gap visible.\n\nAnswers are often smaller than people expect. Not \"I'd quit my job and move to the coast\" but \"I'd speak up in that meeting instead of letting it go\" or \"I'd call my sister instead of waiting for her to call\" or \"I'd go to that event even though I don't know anyone there.\" The smaller the answer, the more specific the information. Big answers are often fantasies. Small answers are usually about real decisions in the near future.",
      },
      {
        heading: "How to use these questions",
        body: "Don't try to answer all five in one sitting. Use one per day, rotating across the week so each question gets two or three turns per month. The repetition is part of the design — answering the same question in January and April produces a comparison that a single answer never could.\n\nThe most important rule: answer the question out loud or in writing, not just in your head. The act of articulating is what generates insight, not the thinking that precedes it. You can think about \"What are you avoiding telling yourself?\" for ten minutes and loop. You can say the answer aloud in thirty seconds and know exactly what it is. Externalisation — putting the thought outside your head in any form — is what converts a familiar question into a useful one.",
      },
    ],
  },
  {
    slug: "build-journaling-habit",
    title: "How to Build a Journaling Habit That Actually Sticks",
    description:
      "The reason most journaling habits fail has nothing to do with motivation. Here's how to build a daily reflection practice in under 2 minutes — and keep it.",
    date: "2026-06-03",
    readingTime: "6 min read",
    author: "The ÉCHO Team",
    sections: [
      {
        body: "Almost everyone has tried journaling. Most people have tried it more than once. A beautiful notebook purchased with good intentions, used for ten days, then left on a shelf. A meditation app that sent notifications for three weeks before being silenced. A \"morning pages\" phase that lasted a full month before quietly ending when a busy week made it impossible and it never resumed.\n\nThe failure of journaling habits is so common that people treat it as evidence of a personal flaw — a lack of discipline, or an insufficient inner life, or just not being \"a journaling person.\" None of that is true. The habits fail because they're designed badly. They create the wrong expectations, require too much friction to maintain, and produce no visible feedback until you've already given up.",
      },
      {
        heading: "Why journaling habits fail",
        body: "The blank page is the first problem. Opening a journal with no prompt and no structure requires a decision before you've even started — what do I write about? — and decisions cost energy. At 6am or after a long day, that small decision is enough friction to make \"I'll do it tomorrow\" feel reasonable. Tomorrow becomes never, reliably.\n\nThe second problem is mismatched expectations. Most people start journaling expecting meaningful insight within the first week. When they read back what they wrote on day three — mundane, slightly forced, not particularly illuminating — they conclude that journaling doesn't work for them, when actually they're experiencing what day three always feels like. The insight doesn't come from any single entry. It comes from the accumulation of entries over months, and almost no one tells you that at the start.",
      },
      {
        heading: "The 2-minute rule",
        body: "The goal of the first month is not meaningful entries. The goal is showing up. This is a different target, and it requires a different approach. A two-minute voice journal entry — one question answered honestly, out loud, without editing — is infinitely more valuable than an elaborate thirty-minute writing session you do twice and then abandon.\n\nConsistency beats depth in the early months, because the habit has to form before the skill can develop. The skill of reflection — the ability to answer a difficult question honestly and quickly — improves with practice, exactly like any other skill. You don't get the practice if you don't show up. Two minutes every day for thirty days is more useful than thirty minutes once a week, both for habit formation and for the longitudinal record you're building.",
      },
      {
        heading: "Anchor it to an existing habit",
        body: "The most reliable way to build any new habit is to attach it to one that's already automatic. This is called habit stacking, and it works because you're borrowing the cue of an established behaviour instead of building a new one from scratch. After your morning coffee. After you sit down in your car but before you start the engine. After brushing your teeth at night. The specific trigger matters less than the consistency — it should be something you do every day without deciding to.\n\nThe time of day matters much less than people think. Morning journalers and evening journalers both build effective habits. The question is which slot fits reliably into your existing routine with the least disruption. A two-minute voice entry that you can do while the coffee brews is more sustainable than a twenty-minute writing session that requires getting up earlier.",
      },
      {
        heading: "Make friction impossible",
        body: "Every point of friction in a habit is a potential exit. The \"what do I write about?\" problem is solved by a daily question — one prompt, provided for you, no decision required. The typing problem is solved by speaking instead of writing. The \"I forgot\" problem is solved by a daily notification set to trigger at your anchor time. The \"this feels like homework\" problem is solved by keeping entries short — two minutes maximum, no pressure to be profound.\n\nThe system should require zero willpower to initiate. When journaling is the path of least resistance at a specific moment in your day, it happens. When it requires effort to remember, effort to decide what to say, and effort to type it out, it competes with everything else that also requires effort — and it usually loses. Remove the competition by removing the effort.",
      },
      {
        heading: "What to do when you miss a day",
        body: "Missing one day is normal and inconsequential. Missing two days in a row is the danger zone — research on habit formation consistently shows that it's the second consecutive miss that predicts whether a habit breaks rather than bends. The solution is not guilt, which is counterproductive, but a reduction in barrier: make the next entry as easy as humanly possible.\n\nA twenty-second recording that says \"I missed yesterday and I'm getting back to it today\" is a legitimate entry. It counts. The habit loop is maintained. The goal is not a perfect record — it's a long one. Someone who journals 320 days out of 365 has built something genuinely useful. The 45 missed days are irrelevant in the face of 320 entries that document a year of their inner life.",
      },
      {
        heading: "The feedback loop that keeps habits going",
        body: "Habits persist when they produce visible results. The feedback loop for journaling is delayed — you don't see the benefit on day three or week two — which is why so many habits fail before they produce anything. The key is engineering an earlier feedback loop: listening back to recordings from a month ago, or three months ago, and hearing your own voice from that period.\n\nThe experience of listening to yourself from three months in the past — hearing the concern in your voice about something that resolved, the certainty about something that changed, the version of you that didn't yet know what you now know — is unlike reading old writing. It's more visceral, more surprising, and more motivating. That experience is the strongest retention mechanism for a journaling habit: not discipline, not motivation, but the felt sense that you're building a record of yourself that will matter to you later.",
      },
    ],
  },
  {
    slug: "best-journaling-apps-iphone-2026",
    title: "Best Journaling Apps for iPhone in 2026",
    description:
      "A practical comparison of the top iPhone journaling apps in 2026 — from voice-first tools to classic text journals — with honest trade-offs for each.",
    date: "2026-06-03",
    readingTime: "9 min read",
    author: "The ÉCHO Team",
    sections: [
      {
        body: "The iPhone journaling app market has matured considerably. A few years ago, the choice was essentially Day One or a notes app. Now there are genuinely distinct philosophies competing for your attention: structured versus free-form, voice versus text, private versus AI-analysed, longitudinal versus single-entry. The best app for you depends less on star ratings than on which of those trade-offs matches how you actually think and live.\n\nThis comparison is honest about limitations. Every app here has genuine strengths — the question is whether those strengths match what you're looking for. There's no ranking because ranking implies that one journaling philosophy is objectively better than another, and that's not true. There's only better and worse fits for different people.",
      },
      {
        heading: "What to look for in a journaling app",
        body: "Before comparing apps, it's worth deciding which questions matter most to you. Privacy is the first: where does your data live, who can access it, and is your content used to train AI models? For some people this is paramount; for others it's secondary to features. It's worth knowing before you start.\n\nFriction is equally important and often underweighted. How long does it take to make an entry? How many taps between opening the app and recording something? A beautiful app with a three-step entry flow will lose to a simpler app with a one-tap record button if you're trying to build a daily habit. Finally, consider whether insight features matter to you — some apps are purely archival (they store your entries beautifully) while others analyse patterns across time. Both are valid, but they serve different purposes.",
      },
      {
        heading: "Day One — the classic",
        body: "Day One is the gold standard of text journaling on Apple platforms. It's been refined over more than a decade, and it shows: the design is genuinely beautiful, the Mac and iPhone apps are in sync, it supports photos, audio, location, and rich text attachments, and it offers end-to-end encryption. If you want a comprehensive, multimedia diary that feels native to Apple's ecosystem, Day One is the obvious choice.\n\nIts limitation is structural, not technical. Day One is a blank page with features. It gives you a gorgeous, well-organised empty space to fill — but what you fill it with, and whether you fill it consistently, is entirely up to you. There's no guided prompt, no daily question, no system to reduce the friction of deciding what to write. For people who know what they want to say and want a premium place to say it, Day One excels. For people who need a prompt to get started, it's a beautiful tool they use twice a month.",
      },
      {
        heading: "Reflect — structured prompts",
        body: "Reflect takes a different approach: it provides daily prompts and mood tracking, which removes the blank-page problem that defeats many Day One users. The interface is clean and uncluttered, the daily check-in flow is genuinely fast, and the mood tracking over time gives you a lightweight emotional record without requiring any effort to maintain.\n\nThe limitation is in the depth of the prompt layer. The questions are generic — designed to be accessible to anyone, which means they're not particularly probing for anyone. They don't adapt to your answers over time or build on previous entries. After a few months, returning users often find themselves giving the same answers to the same questions on autopilot, which defeats the purpose of reflective practice. It's a good starting point; it's less good as a long-term companion.",
      },
      {
        heading: "Journey — multi-platform",
        body: "Journey's primary strength is cross-platform coverage. If you journal on an Android phone, a Windows PC, and an iPhone, Journey gives you one coherent experience across all of them — which no Apple-ecosystem app can match. The sync is reliable, the interface is functional, and it supports most of the media types you'd expect.\n\nThe trade-off is that cross-platform parity comes at a cost to platform depth. Journey has never felt as native on iPhone as Day One does, and its features are broader than they are deep — adequate at many things, excellent at none. For people whose journaling life genuinely spans multiple operating systems, it's the pragmatic choice. For iPhone-only users, the cross-platform infrastructure is overhead they're paying for without benefit.",
      },
      {
        heading: "ÉCHO — voice-first with longitudinal insight",
        body: "ÉCHO's design philosophy is different from every other app on this list: one question per day, answered by voice, in under a minute. There's no text field to stare at, no decision about what to write. You open the app, see the question, press record, and speak. WhisperKit transcribes your voice entirely on-device — the audio never leaves your iPhone, it's not sent to a server, and it's not used to train any model. For privacy-conscious users in Europe, this is a meaningful distinction from cloud-transcription alternatives.\n\nThe insight layer — called the Mirror — builds a persona profile from your words over weeks. It identifies patterns in how you talk about energy, relationships, work, and growth, and surfaces them as a longitudinal portrait of your inner life. The Letters feature lets you seal an entry and unlock it in the future, creating a structured comparison between who you were and who you are now. ÉCHO is designed for people who take the long view of self-understanding seriously — people who want to look back at a year of their voice and actually see how they've changed. The limitation is equally honest: if you prefer typing, or want a multimedia diary, or need an Android version, ÉCHO isn't the right fit yet. It's iPhone-only at launch, and it's built around voice as a first-class medium rather than as an alternative input.",
      },
      {
        heading: "Which app is right for you?",
        body: "The match between person and app matters more than any feature list. If you want a rich, multimedia diary with beautiful design and no friction around format, Day One is the answer. If you're new to journaling and want gentle, guided prompts to build a basic habit, Reflect is a good starting point. If you journal across multiple devices and operating systems, Journey solves a real problem that the others don't.\n\nIf you've tried text journaling and stopped — repeatedly — ÉCHO is worth trying. The voice-first format removes the blank page and the writing friction simultaneously. And if you're interested in what a year of daily voice entries reveals about who you actually are, rather than just who you said you were, the longitudinal insight layer does something the other apps don't attempt. None of these are wrong answers. The best journaling app is the one you actually open tomorrow morning.",
      },
      {
        heading: "The bottom line",
        body: "No journaling app produces insight on its own. The insight comes from consistent use over months, which means the single most important feature is the one that makes you show up again tomorrow. For some people that's beautiful design. For others it's a guided question. For others it's the two-minute time investment of a voice entry instead of a thirty-minute writing session.\n\nTry more than one. Most of these apps have free tiers or trial periods long enough to tell whether the format suits you. The test isn't whether the app is technically good — it's whether you're still using it three weeks after you downloaded it. That's a harder test than any feature comparison, and it's the only one that matters.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
