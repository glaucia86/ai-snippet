import app, { connectDatabase } from './app';

const PORT = process.env.API_PORT || 3000;

async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start server
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

startServer();