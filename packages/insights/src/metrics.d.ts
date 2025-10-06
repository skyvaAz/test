import { EndOfGameMatchParticipantStats, PlayerSeasonDataset } from "./types.js";
export declare function computeKDA(stats: EndOfGameMatchParticipantStats): number;
export declare function aggregateSeason(dataset: PlayerSeasonDataset): {
    totalGames: number;
    wins: number;
    winRate: number;
    kda: number;
    avgGold: number;
    avgDamage: number;
    avgVision: number;
    avgCs: number;
};
export declare function computeChampionBreakdown(dataset: PlayerSeasonDataset): {
    championName: string;
    games: number;
    wins: number;
    winRate: number;
    kda: number;
}[];
export declare function computeRoleBreakdown(dataset: PlayerSeasonDataset): {
    role: string;
    games: number;
    winRate: number;
}[];
export declare function computeTimeSeries(dataset: PlayerSeasonDataset): {
    x: string;
    y: number;
}[];
//# sourceMappingURL=metrics.d.ts.map