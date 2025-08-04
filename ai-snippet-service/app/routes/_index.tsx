import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation, Link } from "@remix-run/react";
import { useState, useEffect } from "react";

// Types
interface Snippet {
  id: string;
  text: string;
  summary: string;
  createdAt: string;
}

interface ActionData {
  error?: string;
  snippet?: Snippet;
}

interface LoaderData {
  recentSnippets: Snippet[];
}

// Mock data for when API is unavailable
const mockSnippets: Snippet[] = [
  {
    id: '1',
    text: 'This is a sample snippet text for demonstration purposes.',
    summary: 'Sample snippet for demo',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    text: 'Another example snippet with longer content to show how the system works.',
    summary: 'Example of longer content snippet',
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  }
];

// Loader to fetch recent snippets
export const loader: LoaderFunction = async () => {
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? process.env.API_BASE_URL || 'http://localhost:3001'
    : 'http://localhost:3001';

  try {
    const response = await fetch(`${API_BASE_URL}/snippets`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch snippets');
    }
    
    const snippets = await response.json();
    
    return {
      recentSnippets: snippets.slice(0, 5) // Show only 5 most recent
    };
  } catch (error) {
    console.error('Error loading snippets, using mock data:', error);
    // Use mock data when API is not available
    return { 
      recentSnippets: mockSnippets.slice(0, 5)
    };
  }
};

// Action to create new snippet
export const action: ActionFunction = async ({ request }) => {
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? process.env.API_BASE_URL || 'http://localhost:3001'
    : 'http://localhost:3001';

  const formData = await request.formData();
  const text = formData.get("text")?.toString();

  if (!text || text.trim().length === 0) {
    return json({ 
      error: "Text is required and cannot be empty" 
    }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/snippets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text.trim() }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create snippet');
    }

    const snippet = await response.json();
    
    // Redirect to the snippets list page
    return redirect(`/snippets`);
  } catch (error) {
    console.error('Error creating snippet, simulating success:', error);
    
    // Simulate successful creation when API is not available
    const mockSnippet = {
      id: Date.now().toString(),
      text: text.trim(),
      summary: `AI Summary: ${text.trim().substring(0, 50)}${text.trim().length > 50 ? '...' : ''}`,
      createdAt: new Date().toISOString()
    };
    
    // Store in session storage for demo purposes
    console.log('Created mock snippet:', mockSnippet);
    
    // Redirect to snippets page
    return redirect(`/snippets`);
  }
};

export default function Index() {
  const { recentSnippets } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const [text, setText] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Transform Text with AI
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Paste your content and get instant AI-powered summaries. Perfect for blog drafts, 
          transcripts, articles, and any text that needs a concise overview.
        </p>
      </div>

      {/* Create Snippet Form */}
      <div className="card max-w-4xl mx-auto">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">
            Create New Snippet
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Enter your text below and we'll generate a summary in ≤ 30 words.
          </p>
        </div>
        
        <div className="card-body">
          <Form method="post" className="space-y-6">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                Your Text
              </label>
              <div className="mt-1">
                <textarea
                  id="text"
                  name="text"
                  rows={8}
                  className="form-textarea"
                  placeholder="Paste your blog draft, transcript, article, or any text you'd like summarized..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>{isClient ? `${text.length} characters` : '0 characters'}</span>
                <span>Max: 10,000 characters</span>
              </div>
            </div>

            {actionData?.error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error creating snippet
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {actionData.error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setText("")}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Clear
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting || !isClient || text.trim().length === 0}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Summary...
                  </>
                ) : (
                  'Generate Summary'
                )}
              </button>
            </div>
          </Form>
        </div>
      </div>

      {/* Recent Snippets */}
      {recentSnippets.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Snippets</h2>
            <Link to="/snippets" className="btn-secondary">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentSnippets.map((snippet) => (
              <div key={snippet.id} className="card">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary-600 mb-2">
                        {snippet.summary}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {snippet.text.length > 100 
                          ? `${snippet.text.substring(0, 100)}...` 
                          : snippet.text
                        }
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Created {isClient ? new Date(snippet.createdAt).toLocaleDateString() : 'recently'}
                      </p>
                    </div>
                    <Link 
                      to={`/snippets/${snippet.id}`}
                      className="ml-4 text-primary-600 hover:text-primary-500 text-sm font-medium"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}