const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

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

// Test endpoint
app.get('/health', (req, res) => {
  console.log('Health check received');
  res.json({ 
    status: 'ok', 
    message: 'API is running',
    port: PORT,
    timestamp: new Date().toISOString() 
  });
});

// Mock snippets endpoint - GET all snippets
app.get('/snippets', (req, res) => {
  console.log('GET /snippets received');
  res.json(mockSnippets);
});

// Mock snippets endpoint - POST new snippet
app.post('/snippets', (req, res) => {
  console.log('POST /snippets received', req.body);
  
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.log('Invalid text provided');
      return res.status(400).json({
        error: 'Text is required and must be a non-empty string'
      });
    }

    // Mock AI summary generation
    const summary = `AI Summary: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`;
    
    const newSnippet = {
      id: (mockSnippets.length + 1).toString(),
      text: text.trim(),
      summary,
      createdAt: new Date().toISOString()
    };

    mockSnippets.unshift(newSnippet);
    
    console.log('Created new snippet:', newSnippet);
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
  console.log('GET /snippets/:id received', req.params.id);
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
app.listen(PORT, () => {
  console.log(`🚀 Simple Test API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Snippets: http://localhost:${PORT}/snippets`);
  console.log('🔄 Server is ready and listening for requests...');
});

console.log('Starting server...');
