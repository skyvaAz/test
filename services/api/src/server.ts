import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { z } from "zod";
import { PlayerSeasonDatasetSchema, PlayerSeasonDataset } from "./types.js";
import { generateInsights } from "@rr/insights";
import { createBedrockClient, summarizeInsights } from "./bedrock.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

const PORT = Number(process.env.PORT || 4000);
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-5-sonnet-20240620-v1:0";

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.post("/insights", async (req: Request, res: Response) => {
  try {
    const parse = PlayerSeasonDatasetSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: "Invalid dataset", details: parse.error.flatten() });
    }
    const dataset: PlayerSeasonDataset = parse.data;
    const cards = generateInsights(dataset);
    res.json({ puuid: dataset.puuid, season: dataset.season, cards });
  } catch (e: any) {
    res.status(500).json({ error: "Failed to generate insights", message: e?.message });
  }
});

app.post("/recap", async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      dataset: PlayerSeasonDatasetSchema,
    });
    const parse = schema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: "Invalid body", details: parse.error.flatten() });
    }
    const dataset = parse.data.dataset;
    const cards = generateInsights(dataset);

    const client = createBedrockClient(AWS_REGION);
    const recap = await summarizeInsights({
      client,
      modelId: BEDROCK_MODEL_ID,
      puuid: dataset.puuid,
      season: dataset.season,
      cards: cards.map(c => ({ id: c.id, title: c.title, summary: c.summary, metrics: c.metrics })),
    });

    res.json({ recap, cards });
  } catch (e: any) {
    res.status(500).json({ error: "Failed to generate recap", message: e?.message });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
