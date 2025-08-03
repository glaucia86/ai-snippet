import { Snippet } from "../../models/Snippet";

describe('Snippet Model', () => {
  it('should create a snippet with required fields', async () => {
    const snippetData = {
      text: 'This is a test snippet with some content to be summarized.',
      summary: 'This is a test summary.'
    };

    const snippet = new Snippet(snippetData);
    const savedSnippet = await snippet.save();

    expect(savedSnippet._id).toBeDefined();
    expect(savedSnippet.text).toBe(snippetData.text);
    expect(savedSnippet.summary).toBe(snippetData.summary);
    expect(savedSnippet.createdAt).toBeDefined();
    expect(savedSnippet.updatedAt).toBeDefined();
  });

  it('should require text field', async () => {
    const snippet = new Snippet({
      summary: 'Test summary without text'
    });

    let error: unknown;
    try {
      await snippet.save();
    } catch (err: unknown) {
      error = err;
    }

    expect(error).toBeDefined();
    expect((error as any).errors.text).toBeDefined();
  });

  it('should require summary field', async () => {
    const snippet = new Snippet({
      text: 'Test snippet without summary'
    });

    let error;
    try {
      await snippet.save();
    } catch (err: unknown) {
      error = err;
    }

    expect(error).toBeDefined();
    expect((error as any).errors.summary).toBeDefined();
  });

  it('should trim text and summary fields', async () => {
    const snippet = new Snippet({
      text: '   Snippet with leading and trailing spaces   ',
      summary: '   Summary with leading and trailing spaces   '
    });

    const savedSnippet = await snippet.save();

    expect(savedSnippet.text).toBe('Snippet with leading and trailing spaces');
    expect(savedSnippet.summary).toBe('Summary with leading and trailing spaces');
  });
});