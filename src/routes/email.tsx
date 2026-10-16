import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RefreshCw, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { PageIntro } from "@/components/AppShell";
import { generateEmail, validateEmailInput, type EmailInput, type Tone } from "@/lib/assistant/email";
import { delay, logActivity, useLocalStorage } from "@/lib/storage";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator · Workplace Assistant" },
      { name: "description", content: "Turn instructions into formal, friendly, or persuasive professional emails." },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "Formal, friendly, and persuasive email drafts from your instructions." },
    ],
  }),
  component: EmailPage,
});

const TONES: Tone[] = ["formal", "friendly", "persuasive"];
const EMPTY: EmailInput = { recipient: "", purpose: "", details: "", sender: "", tone: "formal" };

function EmailPage() {
  const [form, setForm] = useLocalStorage<EmailInput>("wpa.email.draft", EMPTY);
  const [out, setOut] = useLocalStorage("wpa.email.output", { subject: "", body: "" });
  const [variant, setVariant] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof EmailInput, v: string) => setForm({ ...form, [k]: v });

  async function run(next: number) {
    const err = validateEmailInput(form);
    setError(err);
    if (err) return;
    setLoading(true);
    await delay();
    const r = await generateEmail(form, next);
    setOut(r); setVariant(next); setLoading(false);
    logActivity({ type: "email", title: `Email: ${r.subject}` });
  }

  const copy = async () => {
    await navigator.clipboard.writeText(`Subject: ${out.subject}\n\n${out.body}`);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title="Smart Email Generator" text="Describe what you need; your draft is saved automatically." />
      <div className="grid gap-6 lg:grid-cols-2">
        <form className="card-soft space-y-4 p-6" onSubmit={(e) => { e.preventDefault(); run(0); }} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Recipient name" id="recipient">
              <input id="recipient" className="field" value={form.recipient} onChange={(e) => set("recipient", e.target.value)} placeholder="e.g. Sarah" />
            </Field>
            <Field label="Your name" id="sender">
              <input id="sender" className="field" value={form.sender} onChange={(e) => set("sender", e.target.value)} placeholder="e.g. Philela" />
            </Field>
          </div>
          <Field label="Purpose *" id="purpose">
            <input id="purpose" className="field" value={form.purpose} onChange={(e) => set("purpose", e.target.value)}
              placeholder="e.g. Request approval for the Q4 marketing budget" aria-invalid={!!error} aria-describedby={error ? "email-err" : undefined} />
          </Field>
          <Field label="Key details (one per line)" id="details">
            <textarea id="details" rows={5} className="field" value={form.details} onChange={(e) => set("details", e.target.value)}
              placeholder={"Budget is R250,000\nNeeded by 30 October\nWill increase leads by 20%"} />
          </Field>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Tone</legend>
            <div className="flex flex-wrap gap-2" role="radiogroup">
              {TONES.map((t) => (
                <button type="button" key={t} role="radio" aria-checked={form.tone === t} onClick={() => set("tone", t)}
                  className={`btn capitalize ${form.tone === t ? "btn-gold" : "btn-ghost"}`}>{t}</button>
              ))}
            </div>
          </fieldset>
          {error && <p id="email-err" role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} Generate
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => { setForm(EMPTY); setError(null); }}>Clear</button>
          </div>
        </form>

        <section className="card-soft flex flex-col p-6" aria-live="polite">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Draft</h2>
            <div className="flex gap-2">
              <button className="btn btn-ghost" onClick={() => run(variant + 1)} disabled={loading || !out.body} aria-label="Regenerate">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> <span className="hidden sm:inline">Regenerate</span>
              </button>
              <button className="btn btn-ghost" onClick={copy} disabled={!out.body} aria-label="Copy"><Copy className="h-4 w-4" /> <span className="hidden sm:inline">Copy</span></button>
            </div>
          </div>
          {out.body ? (
            <div className="flex flex-1 flex-col gap-3">
              <label htmlFor="subj" className="sr-only">Subject</label>
              <input id="subj" className="field font-semibold" value={out.subject} onChange={(e) => setOut({ ...out, subject: e.target.value })} />
              <label htmlFor="body" className="sr-only">Body</label>
              <textarea id="body" className="field min-h-80 flex-1 leading-relaxed" value={out.body} onChange={(e) => setOut({ ...out, body: e.target.value })} />
              <p className="text-xs text-muted-foreground">Built from a tone template using your inputs — edit freely.</p>
            </div>
          ) : (
            <p className="grid flex-1 place-items-center rounded-xl bg-muted p-10 text-center text-sm text-muted-foreground">Your editable draft will appear here.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label>
      {children}
    </div>
  );
}
