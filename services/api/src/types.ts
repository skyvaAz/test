import { z } from "zod";

export const EndOfGameMatchParticipantStatsSchema = z.object({
  puuid: z.string(),
  summonerName: z.string(),
  teamId: z.number(),
  championName: z.string(),
  role: z.enum(["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY", "UNKNOWN"]).optional().default("UNKNOWN"),
  win: z.boolean(),
  kills: z.number(),
  deaths: z.number(),
  assists: z.number(),
  goldEarned: z.number(),
  totalDamageDealtToChampions: z.number(),
  totalDamageTaken: z.number(),
  visionScore: z.number(),
  cs: z.number(),
  gameCreation: z.number(),
  gameDuration: z.number(),
  queueId: z.number().optional(),
  season: z.string().optional(),
});

export const PlayerMatchSummarySchema = z.object({
  matchId: z.string(),
  stats: EndOfGameMatchParticipantStatsSchema,
});

export const PlayerSeasonDatasetSchema = z.object({
  puuid: z.string(),
  season: z.string(),
  matches: z.array(PlayerMatchSummarySchema),
});

export type PlayerSeasonDataset = z.infer<typeof PlayerSeasonDatasetSchema>;
