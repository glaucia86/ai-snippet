import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AIService } from './src/services/ai-service';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Initialize AI Service
const aiService = new AIService();

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is running',
    port: PORT,
    timestamp: new Date().toISOString() 
  });
});

// Mock snippets data
let mockSnippets = [
  {
    id: '1',
    text: 'This is a sample text for testing purposes.',
    summary: 'Sample text for testing.',
    createdAt: new Date().toISOString()
  },
  {
    id: '2', 
    text: 'Another example of a longer text that would normally be summarized by AI.',
    summary: 'Example of text summarized by AI.',
    createdAt: new Date().toISOString()
  }
];

// Mock snippets endpoint - GET all snippets
app.get('/snippets', (req, res) => {
  res.json(mockSnippets);
});

// Mock snippets endpoint - POST new snippet
app.post('/snippets', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Text is required and must be a non-empty string'
      });
    }

    console.log('📝 Generating AI summary for text:', text.substring(0, 50) + '...');

    // Use real AI service to generate summary
    let summary: string;
    try {
      summary = await aiService.generateSummary(text.trim());
      console.log('✅ AI Summary generated:', summary);
    } catch (error) {
      console.error('❌ AI Service failed, using fallback:', error);
      // Fallback to simple summary if AI service fails
      summary = `Summary: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`;
    }
    
    const newSnippet = {
      id: (mockSnippets.length + 1).toString(),
      text: text.trim(),
      summary,
      createdAt: new Date().toISOString()
    };

    mockSnippets.unshift(newSnippet); // Add to beginning of array
    
    console.log('🎉 New snippet created:', { id: newSnippet.id, summary: newSnippet.summary });
    res.status(201).json(newSnippet);
  } catch (error) {
    console.error('Error creating snippet:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Mock snippet by ID endpoint
app.get('/snippets/:id', (req, res) => {
  const { id } = req.params;
  const snippet = mockSnippets.find(s => s.id === id);
  
  if (!snippet) {
    return res.status(404).json({
      error: 'Snippet not found'
    });
  }
  
  res.json(snippet);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Test API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Snippets: http://localhost:${PORT}/snippets`);
  console.log(`🤖 AI Service: ${process.env.GITHUB_MODELS_TOKEN ? '✅ Configured' : '❌ Missing token'}`);
  console.log('🔄 Server is ready and listening for requests...');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📥 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📥 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Keep the process alive
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;
