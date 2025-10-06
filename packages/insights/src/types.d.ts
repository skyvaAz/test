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
    cs: number;
    gameCreation: number;
    gameDuration: number;
    queueId?: number;
    season?: string;
}
export interface PlayerMatchSummary {
    matchId: string;
    stats: EndOfGameMatchParticipantStats;
}
export interface PlayerSeasonDataset {
    puuid: string;
    season: string;
    matches: PlayerMatchSummary[];
}
export interface TrendPoint {
    x: string;
    y: number;
}
export interface InsightCard {
    id: string;
    title: string;
    subtitle?: string;
    summary: string;
    metrics?: Record<string, number | string>;
    chart?: {
        series: TrendPoint[];
        unit?: string;
    };
    tags?: string[];
    shareText?: string;
}
export interface InsightsBundle {
    puuid: string;
    season: string;
    cards: InsightCard[];
}
//# sourceMappingURL=types.d.ts.map