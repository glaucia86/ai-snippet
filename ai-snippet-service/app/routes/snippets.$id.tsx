import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link, useRouteError } from "@remix-run/react";
import { useState } from "react";

interface Snippet {
  id: string;
  text: string;
  summary: string;
  createdAt: string;
}

interface LoaderData {
  snippet: Snippet;
}

// Mock data for demonstration when API is not available
const mockSnippets = [
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

export const loader: LoaderFunction = async ({ params }) => {
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? process.env.API_BASE_URL || 'http://localhost:3001'
    : 'http://localhost:3001';

  const { id } = params;

  if (!id) {
    throw new Response("Snippet ID is required", { status: 400 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/snippets/${id}`);

    if (response.status === 404) {
      // Try to find in mock data as fallback
      const mockSnippet = mockSnippets.find(s => s.id === id);
      if (mockSnippet) {
        return { snippet: mockSnippet };
      }
      throw new Response("Snippet not found", { status: 404 });
    }

    if (!response.ok) {
      // Try to find in mock data as fallback
      const mockSnippet = mockSnippets.find(s => s.id === id);
      if (mockSnippet) {
        console.log('API failed, using mock data for snippet:', id);
        return { snippet: mockSnippet };
      }
      throw new Response("Failed to load snippet", { status: 500 });
    }

    const snippet = await response.json();

    return { snippet };
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    
    // Try to find in mock data as fallback
    const mockSnippet = mockSnippets.find(s => s.id === id);
    if (mockSnippet) {
      console.log('Error loading snippet, using mock data:', error);
      return { snippet: mockSnippet };
    }
    
    console.error('Error loading snippet:', error);
    throw new Response("Internal server error", { status: 500 });
  }
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) {
    return [
      { title: "Snippet Not Found | AI Snippet Service" },
      { name: "description", content: "The requested snippet could not be found." }
    ];
  }

  const { snippet } = data as LoaderData;
  
  return [
    { title: `Snippet: ${snippet.summary} | AI Snippet Service` },
    { name: "description", content: snippet.summary }
  ];
};

export default function SnippetDetail() {
  const { snippet } = useLoaderData<LoaderData>();
  const [copied, setCopied] = useState<'summary' | 'text' | null>(null);

  const copyToClipboard = async (text: string, type: 'summary' | 'text') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-primary-600 hover:text-primary-500 text-sm font-medium"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Snippet Header */}
      <div className="card mb-8">
        <div className="card-header">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                AI-Generated Summary
              </h1>
              <p className="text-sm text-gray-500">
                Created {formatDate(snippet.createdAt)}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => copyToClipboard(snippet.summary, 'summary')}
                className="btn-secondary text-xs"
              >
                {copied === 'summary' ? 'Copied!' : 'Copy Summary'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Summary (≤ 30 words)
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p className="text-lg font-medium leading-relaxed">
                    {snippet.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Original Text */}
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Original Text
            </h2>
            <button
              onClick={() => copyToClipboard(snippet.text, 'text')}
              className="btn-secondary text-xs"
            >
              {copied === 'text' ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
        </div>
        
        <div className="card-body">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {snippet.text}
            </p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-500">
              <span>{snippet.text.length} characters</span>
              <span>
                {snippet.text.split(/\s+/).filter(word => word.length > 0).length} words
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-center space-x-4">
        <Link to="/" className="btn-primary">
          Create Another Snippet
        </Link>
        <Link to="/snippets" className="btn-secondary">
          View All Snippets
        </Link>
      </div>
    </div>
  );
}

// Error boundary for this route
export function ErrorBoundary() {
  const error = useRouteError();
  const isResponse = error instanceof Response;
  const status = isResponse ? error.status : 500;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-primary-600 hover:text-primary-500 text-sm font-medium"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            {status === 404 ? 'Snippet Not Found' : 'Error Loading Snippet'}
          </h1>
          
          <p className="mt-2 text-gray-600">
            {status === 404 
              ? "The snippet you're looking for doesn't exist or may have been deleted."
              : "There was an error loading the snippet. Please try again."}
          </p>
          
          <div className="mt-6">
            <Link to="/" className="btn-primary">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
