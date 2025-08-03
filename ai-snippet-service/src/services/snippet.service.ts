import mongoose from "mongoose";
import { AIService } from "./ai-service";
import { ISnippet, Snippet } from "../models/Snippet";

export interface SnippetDTO {
  id: string;
  text: string;
  summary: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SnippetService {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  async createSnippet(text: string): Promise<SnippetDTO> {
    if (!text || text.trim().length === 0) {
      throw new Error('Text is required');
    }

    try {
      const summary = await this.aiService.generateSummary(text.trim());

      const snippet = new Snippet({
        text: text.trim(),
        summary,
      });

      const savedSnippet = await snippet.save();

      return this.toDTO(savedSnippet as ISnippet & { _id: mongoose.Types.ObjectId });
    } catch (error) {
      throw new Error('Failed to create snippet');
    }
  }

  async getSnippet(id: string): Promise<SnippetDTO | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid snippet ID');
      }

      const snippet = await Snippet.findById(id);
      
      if (!snippet) {
        return null;
      }

      return this.toDTO(snippet as ISnippet & { _id: mongoose.Types.ObjectId });
    } catch (error) {
      throw new Error('Failed to retrieve snippet');
    }
  }

  async getAllSnippets(): Promise<SnippetDTO[]> {
    try {
      const snippets = await Snippet.find()
        .sort({ createdAt: -1 })
        .exec();

      return snippets.map(snippet => this.toDTO(snippet as ISnippet & { _id: mongoose.Types.ObjectId }));
    } catch (error) {
      throw new Error('Failed to retrieve snippets');
    }
  }

  private toDTO(snippet: ISnippet & { _id: mongoose.Types.ObjectId }): SnippetDTO {
    return {
      id: snippet._id.toString(),
      text: snippet.text,
      summary: snippet.summary,
      createdAt: snippet.createdAt,
      updatedAt: snippet.updatedAt,
    };
  }
}