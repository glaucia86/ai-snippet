import OpenAI from "openai";
import 'dotenv/config';

export class AIService {
  private client: OpenAI;
  private readonly modelName: string = 'gpt-4o';

  constructor() {
    this.validateEnvVariables();

    this.client = new OpenAI({
      baseURL: process.env.GITHUB_MODELS_ENDPOINT || 'https://models.inference.ai.azure.com',
      apiKey: process.env.GITHUB_MODELS_TOKEN,
    });    
  }

  private validateEnvVariables() {
    if (!process.env["GITHUB_MODELS_TOKEN"]) {
      throw new Error("Missing environment variable: GITHUB_MODELS_TOKEN");
    }
  }

  async generateSummary(text: string): Promise<string> {
    if (!text || text.trim().length === 0) {
      throw new Error("Text cannot be empty");
    }

    return this.retry(async () => {
      try {
        const response = await this.client.chat.completions.create({
          model: this.modelName,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that creates concise summaries. Always respond with only the summary text, no additional formatting or explanations.'
            },
            {
              role: 'user',
              content: `Summarize the following text in <= 30 words:\n\n${text.trim()}`
            }
          ],
          max_completion_tokens: 100,
          temperature: 0.3
        });

        const summary = response.choices[0]?.message?.content;

        if (!summary) {
          throw new Error('No summary generated');
        }

        return summary.trim();
      } catch (error) {
        console.error('Error in AI Service...: ', error);
        if (error instanceof Error) {
          throw new Error(`Failed to generate summary: ${error.message}`);
        }
        throw new Error('Failed to generate summary');
      }
    });
  }

  private async retry<T>(operation: () => Promise<T>, maxAttempts: number = 3, delayMs: number = 1000): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.warn(`AI Service attempt ${attempt} failed. ${maxAttempts - attempt} attempts left.`);

        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    throw lastError;
  }
 
}