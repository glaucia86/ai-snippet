import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

interface Snippet {
  id: string;
  text: string;
  summary: string;
  createdAt: string;
}

interface LoaderData {
  snippets: Snippet[];
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.API_BASE_URL || 'http://localhost:3001'
  : 'http://localhost:3001';

export const meta: MetaFunction = () => [
  { title: "All Snippets | AI Snippet Service" },
  { name: "description", content: "Browse all your AI-generated snippet summaries" },
];

export const loader: LoaderFunction = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/snippets`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch snippets');
    }
    
    const snippets = await response.json();
    
    return { snippets };
  } catch (error) {
    console.error('Error loading snippets:', error);
    return { snippets: [] };
  }
};

export default function SnippetsList() {
  const { snippets } = useLoaderData<LoaderData>();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPreview = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Navigation */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-primary-600 hover:text-primary-500 text-sm font-medium"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Snippets</h1>
          <p className="mt-2 text-gray-600">
            {snippets.length === 0 
              ? "No snippets created yet" 
              : `${snippets.length} snippet${snippets.length === 1 ? '' : 's'} created`
            }
          </p>
        </div>
        <Link to="/" className="btn-primary">
          Create New Snippet
        </Link>
      </div>

      {/* Snippets List */}
      {snippets.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              No snippets yet
            </h3>
            <p className="mt-2 text-gray-600">
              Get started by creating your first AI-powered snippet summary.
            </p>
            <div className="mt-6">
              <Link to="/" className="btn-primary">
                Create Your First Snippet
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {snippets.map((snippet) => (
            <div key={snippet.id} className="card hover:shadow-lg transition-shadow">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    {/* Summary */}
                    <div className="mb-4">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mb-2">
                        AI Summary
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                        {snippet.summary}
                      </h3>
                    </div>

                    {/* Original Text Preview */}
                    <div className="mb-4">
                      <p className="text-gray-600 leading-relaxed">
                        {getPreview(snippet.text)}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>
                          📅 {formatDate(snippet.createdAt)}
                        </span>
                        <span>
                          📝 {snippet.text.length} characters
                        </span>
                        <span>
                          📊 {snippet.text.split(/\s+/).filter(word => word.length > 0).length} words
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-6 flex-shrink-0">
                    <Link 
                      to={`/snippets/${snippet.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                      View Details
                      <svg className="ml-2 -mr-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Actions */}
      {snippets.length > 0 && (
        <div className="mt-12 text-center">
          <Link to="/" className="btn-primary">
            Create Another Snippet
          </Link>
        </div>
      )}
    </div>
  );
}