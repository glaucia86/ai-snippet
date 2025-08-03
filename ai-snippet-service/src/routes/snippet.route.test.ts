import request from 'supertest';
import express from 'express';
import { SnippetService } from '../services/snippet.service';
import { snippetsRouter } from './snippet.route';

jest.mock('../../services/SnippetService');
const MockedSnippetService = SnippetService as jest.MockedClass<typeof SnippetService>;

const app = express();
app.use(express.json());
app.use('/snippets', snippetsRouter);

describe('Snippets Routes', () => {
  let mockSnippetService: jest.Mocked<SnippetService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSnippetService = {
      createSnippet: jest.fn(),
      getSnippet: jest.fn(),
      getAllSnippets: jest.fn()
    } as any;

    MockedSnippetService.mockImplementation(() => mockSnippetService);
  });

  describe('POST /snippets', () => {
    it('should create a new snippet', async () => {
      const requestBody = { text: 'This is a test snippet text.' };
      const mockResponse = {
        id: '507f1f77bcf86cd799439011',
        text: 'This is a test snippet text.',
        summary: 'Test summary'
      };

      mockSnippetService.createSnippet.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/snippets')
        .send(requestBody)
        .expect(201);

      expect(response.body).toEqual(mockResponse);
      expect(mockSnippetService.createSnippet).toHaveBeenCalledWith(requestBody.text);
    });

    it('should return 400 for missing text', async () => {
      const response = await request(app)
        .post('/snippets')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Text is required');
    });

    it('should return 400 for empty text', async () => {
      const response = await request(app)
        .post('/snippets')
        .send({ text: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Text is required');
    });

    it('should handle service errors', async () => {
      mockSnippetService.createSnippet.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .post('/snippets')
        .send({ text: 'Test text' })
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Service error');
    });
  });

  describe('GET /snippets/:id', () => {
    it('should return snippet by id', async () => {
      const mockSnippet = {
        id: '507f1f77bcf86cd799439011',
        text: 'Test text',
        summary: 'Test summary'
      };

      mockSnippetService.getSnippet.mockResolvedValue(mockSnippet);

      const response = await request(app)
        .get('/snippets/507f1f77bcf86cd799439011')
        .expect(200);

      expect(response.body).toEqual(mockSnippet);
      expect(mockSnippetService.getSnippet).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should return 404 for non-existent snippet', async () => {
      mockSnippetService.getSnippet.mockResolvedValue(null);

      const response = await request(app)
        .get('/snippets/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Snippet not found');
    });

    it('should return 400 for invalid id format', async () => {
      mockSnippetService.getSnippet.mockRejectedValue(new Error('Invalid snippet ID format'));

      const response = await request(app)
        .get('/snippets/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid snippet ID format');
    });
  });

  describe('GET /snippets', () => {
    it('should return all snippets', async () => {
      const mockSnippets = [
        { id: '1', text: 'Text 1', summary: 'Summary 1' },
        { id: '2', text: 'Text 2', summary: 'Summary 2' }
      ];

      mockSnippetService.getAllSnippets.mockResolvedValue(mockSnippets);

      const response = await request(app)
        .get('/snippets')
        .expect(200);

      expect(response.body).toEqual(mockSnippets);
      expect(mockSnippetService.getAllSnippets).toHaveBeenCalled();
    });

    it('should return empty array when no snippets exist', async () => {
      mockSnippetService.getAllSnippets.mockResolvedValue([]);

      const response = await request(app)
        .get('/snippets')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should handle service errors', async () => {
      mockSnippetService.getAllSnippets.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/snippets')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Database error');
    });
  });
});