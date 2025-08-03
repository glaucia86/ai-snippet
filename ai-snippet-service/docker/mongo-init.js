// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

print('Initializing AI Snippets database...');

db = db.getSiblingDB('ai-snippets');

db.createCollection('snippets', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['text', 'summary'],
      properties: {
        text: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 10000,
          description: 'Text content is required and must be between 1-10000 characters'
        },
        summary: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 500,
          description: 'Summary is required and must be between 1-500 characters'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Creation timestamp'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'Update timestamp'
        }
      }
    }
  }
});

// Create indexes for better performance
db.snippets.createIndex({ createdAt: -1 });
db.snippets.createIndex({ text: 'text', summary: 'text' });

print('Database initialized successfully');
print('Collections created:');
print('  - snippets (with validation and indexes)');

// Create test database for running tests
db = db.getSiblingDB('ai-snippets-test');
db.createCollection('snippets');
db.snippets.createIndex({ createdAt: -1 });

print('Test database initialized successfully');