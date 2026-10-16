import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Trash2, Feather } from "lucide-react";
import { PageIntro } from "@/components/AppShell";
import { reply, SUGGESTED_PROMPTS, type ChatMessage } from "@/lib/assistant/chat";
import { delay, logActivity, useLocalStorage } from "@/lib/storage";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Workplace Chat · Workplace Assistant" },
      { name: "description", content: "Get practical guidance on priorities, meetings, feedback and deadlines." },
      { property: "og:title", content: "Workplace Chat" },
      { property: "og:description", content: "Practical workplace guidance with follow-up questions." },
    ],
  }),
  component: ChatPage,
});

function render(text: string) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((p, i) =>
    p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p.startsWith("*") ? <em key={i}>{p.slice(1, -1)}</em> : p);
}

function ChatPage() {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>("wpa.chat.history", []);
  const [draft, setDraft] = useLocalStorage("wpa.chat.draft", "");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || loading || t.length > 1000) return;
    const user: ChatMessage = { id: crypto.randomUUID(), role: "user", content: t };
    const next = [...messages, user];
    setMessages(next); setDraft(""); setLoading(true);
    await delay(650);
    const r = await reply(t, messages);
    setMessages([...next, { ...r, id: crypto.randomUUID() }]); setLoading(false);
    logActivity({ type: "chat", title: `Chat: ${t.slice(0, 60)}` });
  }

  const lastFollowUps = messages.at(-1)?.role === "assistant" ? messages.at(-1)?.followUps : undefined;

  return (
    <div className="mx-auto flex max-w-4xl flex-col">
      <div className="flex items-start justify-between gap-4">
        <PageIntro title="Workplace Chat" text="Guidance on common workplace challenges. Conversation is saved on this device." />
        {messages.length > 0 && <button className="btn btn-ghost shrink-0" onClick={() => setMessages([])}><Trash2 className="h-4 w-4" /> Clear</button>}
      </div>

      <div className="card-soft flex h-[62vh] flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto p-5" role="log" aria-live="polite">
          {messages.length === 0 && (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="mb-4 text-muted-foreground">Try one of these to start:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTED_PROMPTS.map((p) => <button key={p} className="btn btn-ghost" onClick={() => send(p)}>{p}</button>)}
                </div>
              </div>
            </div>
          )}
          {messages.map((m) => m.role === "user" ? (
            <div key={m.id} className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">{m.content}</div>
          ) : (
            <div key={m.id} className="flex max-w-[90%] gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-gradient"><Feather className="h-4 w-4 text-primary" /></span>
              <p className="whitespace-pre-line text-sm leading-relaxed">{render(m.content)}</p>
            </div>
          ))}
          {loading && <p className="pl-11 text-sm text-muted-foreground animate-pulse">Thinking…</p>}
          <div ref={endRef} />
        </div>

        {lastFollowUps && !loading && (
          <div className="flex flex-wrap gap-2 border-t px-5 py-3">
            {lastFollowUps.map((f) => <button key={f} className="rounded-full bg-blush px-3 py-1 text-xs font-medium text-primary hover:bg-blush-deep/50" onClick={() => send(f)}>{f}</button>)}
          </div>
        )}

        <form className="flex gap-2 border-t p-3" onSubmit={(e) => { e.preventDefault(); send(draft); }}>
          <label htmlFor="msg" className="sr-only">Message</label>
          <textarea id="msg" rows={1} maxLength={1000} className="field resize-none" placeholder="Ask about priorities, meetings, feedback…" value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(draft); } }} />
          <button className="btn btn-gold" disabled={!draft.trim() || loading} aria-label="Send"><Send className="h-4 w-4" /></button>
        </form>
      </div>
    </div>
  );
}
