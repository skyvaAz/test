export interface EndOfGameMatchParticipantStats {
  puuid: string;
  summonerName: string;
  teamId: number;
  championName: string;
  role: "TOP" | "JUNGLE" | "MIDDLE" | "BOTTOM" | "UTILITY" | "UNKNOWN";
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  goldEarned: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  visionScore: number;
  cs: number; // minions + jungle monsters
  gameCreation: number; // epoch ms
  gameDuration: number; // seconds
  queueId?: number;
  season?: string; // derived season tag like "2025"
}

export interface PlayerMatchSummary {
  matchId: string;
  stats: EndOfGameMatchParticipantStats;
}

export interface PlayerSeasonDataset {
  puuid: string;
  season: string; // e.g. "2025"
  matches: PlayerMatchSummary[];
}

export interface TrendPoint {
  x: string; // ISO date or integer bucket string
  y: number;
}

export interface InsightCard {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  metrics?: Record<string, number | string>;
  chart?: { series: TrendPoint[]; unit?: string };
  tags?: string[];
  shareText?: string;
}

export interface InsightsBundle {
  puuid: string;
  season: string;
  cards: InsightCard[];
}
