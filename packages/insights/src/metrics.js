export function computeKDA(stats) {
    const denominator = Math.max(1, stats.deaths);
    return (stats.kills + stats.assists) / denominator;
}
export function aggregateSeason(dataset) {
    const totalGames = dataset.matches.length;
    let wins = 0;
    let kills = 0;
    let deaths = 0;
    let assists = 0;
    let gold = 0;
    let damage = 0;
    let damageTaken = 0;
    let vision = 0;
    let cs = 0;
    for (const m of dataset.matches) {
        const s = m.stats;
        if (s.win)
            wins += 1;
        kills += s.kills;
        deaths += s.deaths;
        assists += s.assists;
        gold += s.goldEarned;
        damage += s.totalDamageDealtToChampions;
        damageTaken += s.totalDamageTaken;
        vision += s.visionScore;
        cs += s.cs;
    }
    const winRate = totalGames > 0 ? wins / totalGames : 0;
    const kda = (kills + assists) / Math.max(1, deaths);
    const avgGold = totalGames > 0 ? gold / totalGames : 0;
    const avgDamage = totalGames > 0 ? damage / totalGames : 0;
    const avgVision = totalGames > 0 ? vision / totalGames : 0;
    const avgCs = totalGames > 0 ? cs / totalGames : 0;
    return {
        totalGames,
        wins,
        winRate,
        kda,
        avgGold,
        avgDamage,
        avgVision,
        avgCs,
    };
}
export function computeChampionBreakdown(dataset) {
    const map = new Map();
    for (const m of dataset.matches) {
        const c = m.stats.championName;
        if (!map.has(c))
            map.set(c, { games: 0, wins: 0, kills: 0, deaths: 0, assists: 0 });
        const agg = map.get(c);
        agg.games += 1;
        if (m.stats.win)
            agg.wins += 1;
        agg.kills += m.stats.kills;
        agg.deaths += m.stats.deaths;
        agg.assists += m.stats.assists;
    }
    return [...map.entries()].map(([championName, v]) => ({
        championName,
        games: v.games,
        wins: v.wins,
        winRate: v.games ? v.wins / v.games : 0,
        kda: (v.kills + v.assists) / Math.max(1, v.deaths),
    })).sort((a, b) => b.games - a.games);
}
export function computeRoleBreakdown(dataset) {
    const map = new Map();
    for (const m of dataset.matches) {
        const r = m.stats.role || "UNKNOWN";
        if (!map.has(r))
            map.set(r, { games: 0, wins: 0 });
        const agg = map.get(r);
        agg.games += 1;
        if (m.stats.win)
            agg.wins += 1;
    }
    return [...map.entries()].map(([role, v]) => ({
        role,
        games: v.games,
        winRate: v.games ? v.wins / v.games : 0,
    })).sort((a, b) => b.games - a.games);
}
export function computeTimeSeries(dataset) {
    // weekly buckets by ISO week start
    const buckets = new Map();
    for (const m of dataset.matches) {
        const d = new Date(m.stats.gameCreation);
        const weekStart = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
        // normalize to Monday
        const day = weekStart.getUTCDay() || 7;
        if (day !== 1)
            weekStart.setUTCDate(weekStart.getUTCDate() - day + 1);
        const key = weekStart.toISOString().slice(0, 10);
        if (!buckets.has(key))
            buckets.set(key, { games: 0, wins: 0, kills: 0, deaths: 0, assists: 0 });
        const b = buckets.get(key);
        b.games += 1;
        if (m.stats.win)
            b.wins += 1;
        b.kills += m.stats.kills;
        b.deaths += m.stats.deaths;
        b.assists += m.stats.assists;
    }
    const points = [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([x, v]) => ({
        x,
        y: v.games ? (v.kills + v.assists) / Math.max(1, v.deaths) : 0
    }));
    return points;
}
//# sourceMappingURL=metrics.js.map