import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from './styles/tailwind.css'

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },
];

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { title: "AI Snippet Service" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { name: "description", content: "Transform your text into AI-powered summaries" }
];

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-50">
        <div className="min-h-full">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    🤖 AI Snippet Service
                  </h1>
                </div>
                <div className="text-sm text-gray-500">
                  Transform text into smart summaries
                </div>
              </div>
            </div>
          </header>
          
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
        
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}