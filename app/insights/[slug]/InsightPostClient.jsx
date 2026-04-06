"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function InsightPostClient({ post }) {
  const getCategoryColor = (category) => {
    const colors = {
      remuneration: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      contract: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      operational: 'bg-green-500/20 text-green-400 border-green-500/50',
      insurance: 'bg-red-500/20 text-red-400 border-red-500/50',
      financial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      market: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <AppLayout>
      {/* Back link */}
      <div 
        className="border-b mt-16"
        style={{ background: '#0d1117', borderColor: '#30363d' }}
      >
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/insights" 
            className="inline-flex items-center gap-2 transition-colors hover:text-[#c9a227]"
            style={{ color: '#8b949e' }}
          >
            <span>←</span>
            <span>Back to Insights</span>
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Category pill */}
            <div className="mb-6">
              <span 
                className={`inline-block px-4 py-2 text-xs font-semibold uppercase rounded-full border ${getCategoryColor(post.category)}`}
              >
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ lineHeight: 1.2 }}>
              {post.title}
            </h1>

            {/* Byline */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b" style={{ color: '#8b949e', borderColor: '#30363d' }}>
              <span>📅 {formatDate(post.published_at)}</span>
              <span>⏱️ {post.reading_time_minutes} min read</span>
              <span>✍️ FCM Intelligence</span>
            </div>

            {/* Body */}
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-white
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-[#c9a227] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-gray-300 prose-li:my-2
                prose-blockquote:border-l-4 prose-blockquote:border-[#c9a227] 
                prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-400
                prose-code:text-[#c9a227] prose-code:bg-gray-900 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-lg"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.body_markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </article>

      {/* Footer CTAs */}
      <section 
        className="py-12 border-t"
        style={{ background: '#161b22', borderColor: '#30363d' }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/support"
              className="p-6 rounded-lg border transition-all hover:border-[#c9a227] group"
              style={{ background: '#0d1117', borderColor: '#30363d' }}
            >
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-[#c9a227] transition-colors">
                Check your branch insurance
              </h3>
              <p className="text-sm" style={{ color: '#8b949e' }}>
                Free 7-minute audit to find gaps in your Post Office insurance cover
              </p>
            </Link>

            <Link 
              href="/reports"
              className="p-6 rounded-lg border transition-all hover:border-[#c9a227] group"
              style={{ background: '#0d1117', borderColor: '#30363d' }}
            >
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-[#c9a227] transition-colors">
                Get a full branch intelligence report
              </h3>
              <p className="text-sm" style={{ color: '#8b949e' }}>
                Everything you need to know before making an offer
              </p>
            </Link>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
