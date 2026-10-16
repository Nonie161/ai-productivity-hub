// Client-side demo engine. Replace `analyze` with a real AI/fetch call later.
export type ResearchResult = {
  kind: "text" | "topic" | "url";
  title: string;
  notice?: string;
  summary: string[];
  insights: string[];
  recommendations: string[];
};

const STOP = new Set("the a an and or but of to in on for with is are was were be been it this that as at by from we you they their our its can will not have has had more most also which into than about".split(" "));

export const isUrl = (s: string) => /^https?:\/\/\S+$/i.test(s.trim());

export function validateResearch(input: string): string | null {
  const s = input.trim();
  if (!s) return "Enter a topic, paste an article, or add a URL.";
  if (!isUrl(s) && s.length < 3) return "Topic is too short.";
  if (s.length > 20000) return "Text is too long (max 20,000 characters).";
  return null;
}

function keywords(text: string, n = 6) {
  const freq = new Map<string, number>();
  for (const w of text.toLowerCase().match(/[a-z][a-z-]{3,}/g) ?? []) if (!STOP.has(w)) freq.set(w, (freq.get(w) ?? 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([w]) => w);
}

function analyzeText(text: string): ResearchResult {
  const sentences = text.replace(/\s+/g, " ").match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [text];
  const kws = keywords(text, 8);
  const scored = sentences.map((s, idx) => ({ s, idx, score: kws.reduce((a, k) => a + (s.toLowerCase().includes(k) ? 1 : 0), 0) / Math.sqrt(s.length / 40 + 1) }));
  const top = [...scored].sort((a, b) => b.score - a.score).slice(0, 3).sort((a, b) => a.idx - b.idx).map((x) => x.s);
  const numeric = sentences.filter((s) => /\d/.test(s)).slice(0, 2);
  return {
    kind: "text",
    title: `Analysis of pasted text (${sentences.length} sentences)`,
    summary: top,
    insights: [
      `Most recurring themes: ${kws.slice(0, 5).join(", ")}.`,
      ...numeric.map((s) => `Quantitative point: “${s}”`),
      sentences.length > 12 ? "The text is long; the extracted sentences are the most theme-dense ones." : "The text is short; verify the summary captures the full intent.",
    ],
    recommendations: [
      `Verify claims about “${kws[0] ?? "the main topic"}” against a primary source.`,
      `Share a 3-line brief built from the summary above with your team.`,
      `Identify one decision or action this text should change for you, and assign an owner.`,
    ],
  };
}

function analyzeTopic(topic: string): ResearchResult {
  const t = topic.trim();
  return {
    kind: "topic",
    title: `Research framework: ${t}`,
    notice: "No sources were consulted. This is a structured starting framework, not factual findings.",
    summary: [
      `Define the scope of “${t}”: which teams, time frame, and outcome matter to you.`,
      `Separate what is established about ${t} from what is emerging or debated.`,
      `Gather 3–5 credible sources (industry reports, peer-reviewed work, internal data).`,
    ],
    insights: [
      `Key questions: What problem does ${t} solve? Who benefits? What does it cost?`,
      `Look for measurable signals (adoption, productivity, cost, risk) rather than opinions.`,
      `Note stakeholders whose buy-in is needed before acting on ${t}.`,
    ],
    recommendations: [
      `Paste a relevant article here for a text-based summary.`,
      `Draft a one-page brief: context, evidence, options, recommendation.`,
      `Run a small, time-boxed pilot before committing resources to ${t}.`,
    ],
  };
}

export async function analyze(input: string): Promise<ResearchResult> {
  const s = input.trim();
  if (isUrl(s)) {
    let host = s;
    try { host = new URL(s).hostname; } catch {}
    return {
      kind: "url",
      title: `URL: ${host}`,
      notice: "This URL's content could not be accessed. The app runs entirely in your browser and cannot fetch external pages. Paste the article text instead for a summary.",
      summary: [], insights: [], recommendations: ["Open the page, copy its main text, and paste it into the input box."],
    };
  }
  return s.split(/\s+/).length > 40 ? analyzeText(s) : analyzeTopic(s);
}
