import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Loader2, Search, Trash2 } from "lucide-react";
import { PageIntro } from "@/components/AppShell";
import { analyze, validateResearch, type ResearchResult } from "@/lib/assistant/research";
import { delay, logActivity, useLocalStorage } from "@/lib/storage";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant · Workplace Assistant" },
      { name: "description", content: "Summaries, key insights, and recommendations from topics or pasted articles." },
      { property: "og:title", content: "Research Assistant" },
      { property: "og:description", content: "Structured summaries and actionable recommendations." },
    ],
  }),
  component: ResearchPage,
});

type Saved = ResearchResult & { id: string };

function ResearchPage() {
  const [input, setInput] = useLocalStorage("wpa.research.draft", "");
  const [history, setHistory] = useLocalStorage<Saved[]>("wpa.research.history", []);
  const [current, setCurrent] = useState<Saved | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const shown = current ?? history[0] ?? null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateResearch(input);
    setError(err);
    if (err) return;
    setLoading(true);
    await delay(900);
    const r: Saved = { ...(await analyze(input)), id: crypto.randomUUID() };
    setHistory([r, ...history].slice(0, 10)); setCurrent(r); setLoading(false);
    logActivity({ type: "research", title: r.title });
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title="AI Research Assistant" text="Enter a topic, paste an article, or add a URL." />
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <form onSubmit={submit} className="card-soft space-y-3 p-6" noValidate>
            <label htmlFor="rin" className="block text-sm font-semibold">Topic, article text, or URL</label>
            <textarea id="rin" rows={6} className="field" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Hybrid work policies — or paste a full article here" aria-invalid={!!error} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Pasted text over ~40 words is summarized; shorter input is treated as a topic.</span>
              <span>{input.length.toLocaleString()} chars</span>
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <button className="btn btn-primary" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Analyze
            </button>
          </form>

          <div aria-live="polite">
            {loading ? (
              <div className="card-soft space-y-3 p-6">{[1, 2, 3].map((i) => <div key={i} className="h-4 animate-pulse rounded bg-muted" />)}</div>
            ) : shown && <ResultView r={shown} />}
          </div>
        </div>

        <aside className="card-soft h-fit p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">History</h2>
            {history.length > 0 && <button aria-label="Clear history" onClick={() => { setHistory([]); setCurrent(null); }}><Trash2 className="h-4 w-4 text-muted-foreground" /></button>}
          </div>
          {history.length === 0 ? <p className="text-sm text-muted-foreground">No research yet.</p> : (
            <ul className="space-y-1">
              {history.map((h) => (
                <li key={h.id}><button onClick={() => setCurrent(h)} className={`w-full truncate rounded-lg px-2 py-1.5 text-left text-sm hover:bg-secondary ${shown?.id === h.id ? "bg-secondary" : ""}`}>{h.title}</button></li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}

function ResultView({ r }: { r: ResearchResult }) {
  return (
    <article className="card-soft space-y-5 p-6">
      <h2 className="text-2xl font-semibold">{r.title}</h2>
      {r.notice && (
        <p role="note" className={`flex gap-2 rounded-xl p-3 text-sm ${r.kind === "url" ? "bg-blush text-primary" : "bg-gold-soft text-accent-foreground"}`}>
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {r.notice}
        </p>
      )}
      <Block title="Summary" items={r.summary} />
      <Block title="Key insights" items={r.insights} />
      <Block title="Recommendations" items={r.recommendations} />
    </article>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gold">{title}</h3>
      <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">{items.map((i, k) => <li key={k}>{i}</li>)}</ul>
    </section>
  );
}
