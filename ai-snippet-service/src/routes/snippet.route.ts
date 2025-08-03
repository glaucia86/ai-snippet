import { Router, Request, Response } from 'express';
import { SnippetService } from '../services/snippet.service';

export const snippetsRouter = Router();
const snippetService = new SnippetService();

// POST /snippets - Create a new snippet
snippetsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Text is required and must be a non-empty string'
      });
    }

    const snippet = await snippetService.createSnippet(text);

    res.status(201).json(snippet);
  } catch (error) {
    console.error('Error creating snippet:', error);
    
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message
      });
    } else {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
});

// GET /snippets/:id - Get a specific snippet
snippetsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const snippet = await snippetService.getSnippet(id);

    if (!snippet) {
      return res.status(404).json({
        error: 'Snippet not found'
      });
    }

    res.json(snippet);
  } catch (error) {
    console.error('Error getting snippet:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid snippet ID')) {
        return res.status(400).json({
          error: error.message
        });
      }
      
      res.status(500).json({
        error: error.message
      });
    } else {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
});

// GET /snippets - Get all snippets
snippetsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const snippets = await snippetService.getAllSnippets();
    res.json(snippets);
  } catch (error) {
    console.error('Error getting all snippets:', error);
    
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message
      });
    } else {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
});