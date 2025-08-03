import app, { connectDatabase } from './app';

const PORT = process.env.API_PORT || 3001;

async function startServer() {
  try {
    console.log('Starting server...');
    
    // Try to connect to database, but don't fail if it's not available
    try {
      console.log('Connecting to database...');
      await connectDatabase();
      console.log('Database connection completed');
    } catch (error) {
      console.log('Database not available, continuing with in-memory storage...');
    }
    
    // Start server
    console.log(`Starting server on port ${PORT}...`);
    app.listen(PORT, () => {
      console.log(`API Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API Base URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

console.log('Server script loaded');
startServer();