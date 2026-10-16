import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, BookOpen, MessagesSquare, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { readActivity, type Activity } from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · AI Workplace Productivity Assistant" },
      { name: "description", content: "Draft emails, summarize research, and get workplace guidance in one calm workspace." },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Draft emails, summarize research, and get workplace guidance." },
    ],
  }),
  component: Dashboard,
});

const ACTIONS = [
  { to: "/email", title: "Write an email", text: "Formal, friendly, or persuasive drafts.", icon: Mail },
  { to: "/research", title: "Research a topic", text: "Summaries, insights, recommendations.", icon: BookOpen },
  { to: "/chat", title: "Ask for advice", text: "Prioritizing, meetings, feedback and more.", icon: MessagesSquare },
] as const;

const ICON = { email: Mail, research: BookOpen, chat: MessagesSquare };

function Dashboard() {
  const [acts, setActs] = useState<Activity[]>([]);
  useEffect(() => setActs(readActivity()), []);
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="bg-hero rounded-2xl p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-foreground">{greet}</p>
        <h1 className="mt-2 max-w-xl text-4xl font-semibold md:text-5xl">Your calm space for focused work.</h1>
        <p className="mt-3 max-w-lg text-muted-foreground">Draft emails, distill reading material, and talk through workplace challenges.</p>
        <Link to="/email" className="btn btn-primary mt-6">Start with an email <ArrowRight className="h-4 w-4" /></Link>
      </section>

      <section aria-labelledby="qa">
        <h2 id="qa" className="mb-4 text-xl font-semibold">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {ACTIONS.map(({ to, title, text, icon: Icon }) => (
            <Link key={to} to={to} className="card-soft group p-5 transition-transform hover:-translate-y-0.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-blush text-primary"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="ra" className="card-soft p-6">
        <h2 id="ra" className="mb-4 text-xl font-semibold">Recent activity</h2>
        {acts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing yet — your generated emails, research, and chats will appear here.</p>
        ) : (
          <ul className="divide-y">
            {acts.slice(0, 8).map((a) => {
              const Icon = ICON[a.type];
              return (
                <li key={a.id} className="flex items-center gap-3 py-3 text-sm">
                  <Icon className="h-4 w-4 text-gold" />
                  <span className="truncate">{a.title}</span>
                  <time className="ml-auto shrink-0 text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</time>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
