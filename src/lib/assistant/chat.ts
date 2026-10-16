// Client-side demo engine. Replace `reply` with a real AI call later; keep the message shape.
export type ChatMessage = { id: string; role: "user" | "assistant"; content: string; followUps?: string[] };

type Intent = { key: string; match: RegExp; answer: (q: string) => string; followUps: string[] };

const INTENTS: Intent[] = [
  { key: "prioritize", match: /priorit|overwhelm|too many tasks|to-?do|focus/i,
    answer: () => "Try sorting your tasks with an urgent/important split:\n\n1. **Urgent + important** — do today.\n2. **Important, not urgent** — schedule a block this week.\n3. **Urgent, not important** — delegate or batch.\n4. **Neither** — drop it.\n\nThen pick at most 3 must-do items for today.",
    followUps: ["How do I say no to extra work?", "Help me plan a focus block", "How do I delegate effectively?"] },
  { key: "meeting", match: /meeting|agenda|stand-?up|1:1|one-on-one/i,
    answer: () => "A tight meeting structure:\n\n• **Goal** (1 sentence) shared beforehand\n• **Agenda** with time boxes\n• **Decisions** captured live\n• **Actions** with owner + date\n\nIf there's no decision to make, consider an async update instead.",
    followUps: ["Write a meeting agenda template", "How do I run a better 1:1?", "How do I end meetings on time?"] },
  { key: "feedback", match: /feedback|review|critique|perform/i,
    answer: () => "Use **SBI**: describe the *Situation*, the specific *Behavior*, and its *Impact*. Then ask an open question (\"What's your view?\") and agree on one next step. Keep it timely and private for constructive points.",
    followUps: ["Give me an SBI example", "How do I receive feedback well?", "How do I prepare for my performance review?"] },
  { key: "deadline", match: /deadline|late|behind|delay|extension/i,
    answer: () => "Flag risk early. Tell the stakeholder: what's done, what's left, the realistic new date, and one option to recover scope or time. Early, specific updates protect trust far better than last-minute surprises.",
    followUps: ["Draft a deadline extension message", "How do I estimate tasks better?", "What if my manager pushes back?"] },
  { key: "conflict", match: /conflict|disagree|colleague|difficult|tension/i,
    answer: () => "Move it to a private conversation, focus on the shared goal, and describe the issue, not the person. Listen first, restate their view, then propose a concrete way forward. Escalate only if a fair attempt fails.",
    followUps: ["How do I open that conversation?", "When should I involve my manager?", "How do I handle conflict over email?"] },
  { key: "presentation", match: /present|slides|pitch|deck|speak/i,
    answer: () => "Structure it as: **the point** → **why it matters** → **evidence (3 points max)** → **the ask**. One idea per slide, and rehearse the opening 30 seconds out loud.",
    followUps: ["How do I handle tough questions?", "How long should my deck be?", "Tips for presentation nerves"] },
  { key: "email", match: /email|inbox|reply|message/i,
    answer: () => "For inbox control: process email in 2–3 set blocks per day, reply instantly if it takes under 2 minutes, and turn the rest into tasks. For drafting a specific email, the Email Generator page can structure it for you.",
    followUps: ["How do I write a clear subject line?", "How do I follow up politely?", "How do I reduce email volume?"] },
];

export const SUGGESTED_PROMPTS = [
  "Help me prioritize my tasks for today",
  "How do I give constructive feedback?",
  "I'm going to miss a deadline — what should I do?",
  "How can I run a more effective meeting?",
];

export function lastTopic(history: ChatMessage[]) {
  for (let i = history.length - 1; i >= 0; i--) {
    const m = history[i];
    if (!m || m.role !== "user") continue;
    const hit = INTENTS.find((x) => x.match.test(m.content));
    if (hit) return hit;
  }
  return undefined;
}

export async function reply(text: string, history: ChatMessage[]): Promise<Omit<ChatMessage, "id">> {
  const direct = INTENTS.find((x) => x.match.test(text));
  if (direct) return { role: "assistant", content: direct.answer(text), followUps: direct.followUps };
  const prev = lastTopic(history);
  if (prev && /example|more|how|why|what if|template|explain/i.test(text)) {
    return { role: "assistant", content: `Continuing on ${prev.key}: a practical way to apply this is to choose one upcoming situation this week, write down the exact steps above, and review afterwards what worked. Share more specifics (who, when, what's at stake) and I can tailor the guidance.`, followUps: prev.followUps };
  }
  return {
    role: "assistant",
    content: "I can help with prioritizing work, meetings, feedback, deadlines, workplace conflict, presentations, and email habits. Could you tell me a bit more about your situation — what you're trying to achieve and what's getting in the way?",
    followUps: SUGGESTED_PROMPTS.slice(0, 3),
  };
}
