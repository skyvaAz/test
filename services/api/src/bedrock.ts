import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

export interface BedrockConfig {
  region: string;
  modelId: string;
}

export function createBedrockClient(region: string) {
  return new BedrockRuntimeClient({ region });
}

export async function summarizeInsights(params: {
  client: BedrockRuntimeClient;
  modelId: string;
  puuid: string;
  season: string;
  cards: Array<{ id: string; title: string; summary: string; metrics?: Record<string, any> }>;
}) {
  const system = `You are a witty, supportive League of Legends performance coach. Generate a concise, fun end-of-year recap. Avoid toxic language. Offer 2-3 specific improvement tips.`;
  const user = JSON.stringify({ puuid: params.puuid, season: params.season, cards: params.cards }, null, 2);

  const command = new ConverseCommand({
    modelId: params.modelId,
    system: [{ text: system }],
    messages: [
      { role: "user", content: [{ text: `Create a recap from these insights:\n${user}` }] },
    ],
    inferenceConfig: {
      maxTokens: 600,
      temperature: 0.6,
      topP: 0.9,
    },
  });

  const res = await params.client.send(command);
  const text = res.output?.message?.content?.[0]?.text || "";
  return text;
}
