"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";

export default function InsightsClient() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/insights");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const featuredPost = posts.find(p => p.featured);
  const regularPosts = posts.filter(p => !p.featured);

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
      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section 
        className="relative pt-24 md:pt-32 pb-12 md:pb-16 mt-16"
        style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)' }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(201, 162, 39, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold tracking-tight mb-4" style={{ lineHeight: 1.2 }}>
            Insights
          </h1>
          <p className="text-xl mb-4 max-w-2xl mx-auto" style={{ color: '#8b949e' }}>
            Analysis for people buying Post Office branches
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ INTRO ═══════════════════════════ */}
      <section className="py-12 md:py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg leading-relaxed" style={{ color: '#c9d1d9' }}>
            We read the documents nobody else reads. We analyse the data nobody else has. We publish what we find.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ POSTS ═══════════════════════════ */}
      <section className="pb-20 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#c9a227' }}></div>
              <p className="mt-4" style={{ color: '#8b949e' }}>Loading insights...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-400">Failed to load posts. Please try again later.</p>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div 
              className="text-center py-16 px-6 rounded-lg border"
              style={{ background: '#161b22', borderColor: '#30363d' }}
            >
              <p className="text-lg" style={{ color: '#8b949e' }}>
                New insights are being written. Check back soon...
              </p>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <Link 
                  href={`/insights/${featuredPost.slug}`}
                  className="block mb-8 p-8 rounded-lg border transition-all hover:border-[#c9a227] group"
                  style={{ background: '#161b22', borderColor: '#30363d' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span 
                      className="px-3 py-1 text-xs font-semibold uppercase rounded-full border"
                      style={{ background: 'rgba(201, 162, 39, 0.1)', borderColor: '#c9a227', color: '#c9a227' }}
                    >
                      Featured
                    </span>
                    <span 
                      className={`px-3 py-1 text-xs font-semibold uppercase rounded-full border ${getCategoryColor(featuredPost.category)}`}
                    >
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-3 group-hover:text-[#c9a227] transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-base mb-4" style={{ color: '#8b949e' }}>
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm" style={{ color: '#8b949e' }}>
                    <span>📅 {formatDate(featuredPost.published_at)}</span>
                    <span>⏱️ {featuredPost.reading_time_minutes} min read</span>
                  </div>
                </Link>
              )}

              {/* Regular Posts */}
              {regularPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regularPosts.map(post => (
                    <Link 
                      key={post.slug}
                      href={`/insights/${post.slug}`}
                      className="block p-6 rounded-lg border transition-all hover:border-[#c9a227] group"
                      style={{ background: '#161b22', borderColor: '#30363d' }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span 
                          className={`px-3 py-1 text-xs font-semibold uppercase rounded-full border ${getCategoryColor(post.category)}`}
                        >
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[#c9a227] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm mb-4" style={{ color: '#8b949e' }}>
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs" style={{ color: '#8b949e' }}>
                        <span>📅 {formatDate(post.published_at)}</span>
                        <span>⏱️ {post.reading_time_minutes} min read</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </AppLayout>
  );
}
