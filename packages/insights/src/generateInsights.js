import { aggregateSeason, computeChampionBreakdown, computeRoleBreakdown, computeTimeSeries } from "./metrics.js";
export function generateInsights(dataset) {
    const agg = aggregateSeason(dataset);
    const champs = computeChampionBreakdown(dataset);
    const roles = computeRoleBreakdown(dataset);
    const ts = computeTimeSeries(dataset);
    const favorite = champs[0];
    const cards = [];
    cards.push({
        id: "season-overview",
        title: "Season in a Snapshot",
        summary: `You played ${agg.totalGames} games with a ${Math.round(agg.winRate * 100)}% win rate and ${agg.kda.toFixed(2)} KDA.`,
        metrics: {
            games: agg.totalGames,
            wins: agg.wins,
            winRatePct: Math.round(agg.winRate * 100),
            kda: Number(agg.kda.toFixed(2)),
            avgDamage: Math.round(agg.avgDamage),
            avgGold: Math.round(agg.avgGold),
            avgVision: Math.round(agg.avgVision),
            avgCs: Math.round(agg.avgCs),
        },
        tags: ["overview", "season"],
    });
    if (favorite) {
        cards.push({
            id: "favorite-champion",
            title: `Your Main: ${favorite.championName}`,
            summary: `${favorite.games} games, ${Math.round(favorite.winRate * 100)}% win rate, ${favorite.kda.toFixed(2)} KDA.`,
            metrics: {
                games: favorite.games,
                winRatePct: Math.round(favorite.winRate * 100),
                kda: Number(favorite.kda.toFixed(2)),
            },
            tags: ["champion", favorite.championName],
        });
    }
    if (roles.length) {
        const best = [...roles].sort((a, b) => b.winRate - a.winRate)[0];
        cards.push({
            id: "best-role",
            title: `Best Role: ${best.role}`,
            summary: `Your top win rate came from ${best.role} at ${Math.round(best.winRate * 100)}%.`,
            tags: ["role", best.role],
        });
    }
    if (ts.length) {
        cards.push({
            id: "kda-trend",
            title: "Weekly KDA Trend",
            summary: "How your KDA evolved across the season.",
            chart: { series: ts, unit: "KDA" },
            tags: ["trend"],
        });
    }
    return cards;
}
//# sourceMappingURL=generateInsights.js.map