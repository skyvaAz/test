"use client";

import { useEffect, useMemo, useState } from "react";

type InsightCard = {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  metrics?: Record<string, number | string>;
  chart?: { series: { x: string; y: number }[]; unit?: string };
  tags?: string[];
};

type MatchStats = {
  puuid: string;
  summonerName: string;
  teamId: number;
  championName: string;
  role?: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  goldEarned: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  visionScore: number;
  cs: number;
  gameCreation: number;
  gameDuration: number;
  queueId?: number;
  season?: string;
};

type PlayerSeasonDataset = {
  puuid: string;
  season: string;
  matches: Array<{ matchId: string; stats: MatchStats }>;
};

export default function Home() {
  const [dataset, setDataset] = useState<PlayerSeasonDataset | null>(null);
  const [cards, setCards] = useState<InsightCard[] | null>(null);
  const [recap, setRecap] = useState<string>("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const useMock = process.env.NEXT_PUBLIC_MOCK === "1" || process.env.MOCK === "1";

  useEffect(() => {
    if (!useMock) return;
    fetch("/sample-season.json")
      .then(r => r.json())
      .then(setDataset)
      .catch(() => {});
  }, [useMock]);

  const shareText = useMemo(() => {
    if (!cards) return "";
    const top = cards.slice(0, 2).map(c => `${c.title}: ${c.summary}`).join(" | ");
    return `${top} #RiftRewind`;
  }, [cards]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setDataset(JSON.parse(text));
  }

  async function getInsights() {
    if (!dataset) return;
    const res = await fetch(`${apiUrl}/insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataset),
    });
    const json = await res.json();
    setCards(json.cards);
  }

  async function getRecap() {
    if (!dataset) return;
    const res = await fetch(`${apiUrl}/recap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataset }),
    });
    const json = await res.json();
    setCards(json.cards);
    setRecap(json.recap);
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1>Rift Rewind — Your Season, Your Story</h1>
      <p>Upload your League end-of-game JSON to generate insights and a shareable recap.</p>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 16 }}>
        <input type="file" accept="application/json" onChange={handleFile} />
        <button onClick={getInsights} disabled={!dataset}>Generate Insights</button>
        <button onClick={getRecap} disabled={!dataset}>Generate Recap (AWS)</button>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noreferrer"
        >Share</a>
      </div>

      {!dataset && (
        <p style={{ marginTop: 8 }}>
          Tip: enable mock by setting <code>MOCK=1</code> and use the built-in sample.
        </p>
      )}

      {cards && (
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginTop: 24 }}>
          {cards.map(c => (
            <article key={c.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
              <h3 style={{ margin: 0 }}>{c.title}</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{c.summary}</p>
              {c.metrics && (
                <ul>
                  {Object.entries(c.metrics).map(([k, v]) => (
                    <li key={k}><strong>{k}</strong>: {String(v)}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </section>
      )}

      {recap && (
        <section style={{ marginTop: 24 }}>
          <h2>Your Recap</h2>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f7f7f7", padding: 12, borderRadius: 8 }}>{recap}</pre>
        </section>
      )}
    </main>
  );
}
