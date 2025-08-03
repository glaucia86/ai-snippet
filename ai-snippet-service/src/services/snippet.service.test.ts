import { Snippet } from "../models/Snippet";
import { AIService } from "./ai-service";
import { SnippetService } from "./snippet.service";

jest.mock("../services/ai-service");
const MockedAIService = AIService as jest.MockedClass<typeof AIService>;

describe("SnippetService", () => {
  let snippetService: SnippetService;
  let mockAIService: jest.Mocked<AIService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAIService = {
      generateSummary: jest.fn(),
    } as any;

    MockedAIService.mockImplementation(() => mockAIService);

    snippetService = new SnippetService();
  });

  describe("createSnippet", () => {
    it("should create a snippet with AI-generated summary", async () => {
      const text =
        "This is a test text that needs to be summarized by AI service.";
      const expectedSummary = "AI-generated summary";

      mockAIService.generateSummary.mockResolvedValue(expectedSummary);

      const result = await snippetService.createSnippet(text);

      expect(mockAIService.generateSummary).toHaveBeenCalledWith(text);
      expect(result.text).toBe(text);
      expect(result.summary).toBe(expectedSummary);
      expect(result.id).toBeDefined();
    });

    it("should handle AI service errors", async () => {
      const text = "Test text";
      mockAIService.generateSummary.mockRejectedValue(
        new Error("AI service error")
      );

      await expect(snippetService.createSnippet(text)).rejects.toThrow(
        "Failed to create snippet"
      );
    });

    it("should validate input text", async () => {
      await expect(snippetService.createSnippet("")).rejects.toThrow(
        "Text is required"
      );
      await expect(snippetService.createSnippet("   ")).rejects.toThrow(
        "Text is required"
      );
    });
  });

  describe("getSnippet", () => {
    it("should return snippet by id", async () => {
      const text = "Test text for retrieval";
      const summary = "Test summary";

      const snippet = new Snippet({ text, summary });
      const savedSnippet = (await snippet.save()) as any;

      const result = await snippetService.getSnippet(
        savedSnippet._id.toString()
      );

      expect(result).toBeDefined();
      expect(result!.id).toBe(savedSnippet._id.toString());
      expect(result!.text).toBe(text);
      expect(result!.summary).toBe(summary);
    });

    it("should return null for non-existing id", async () => {
      const result = await snippetService.getSnippet(
        "507f1f77bcf86cd799439011"
      ); // Invalid ID
      expect(result).toBeNull();
    });

    it("should handle invalid ObjectId", async () => {
      await expect(
        snippetService.getSnippet("invalid-object-id")
      ).rejects.toThrow("Invalid ObjectId");
    });
  });

  describe("getAllSnippets", async () => {
    it("should return all snippets", async () => {
      const snippets = [
        new Snippet({ text: "Snippet 1", summary: "Summary 1" }),
        new Snippet({ text: "Snippet 2", summary: "Summary 2" }),
      ];

      await Promise.all(snippets.map((s) => s.save()));

      const result = await snippetService.getAllSnippets();

      expect(result).toHaveLength(2);
      expect(result[0].text).toBe("Snippet 1");
      expect(result[1].text).toBe("Snippet 2");
    });

    it("should return empty array when no snippets exist", async () => {
      const result = await snippetService.getAllSnippets();
      expect(result).toEqual([]); // Expect empty array
    });
  });
});
