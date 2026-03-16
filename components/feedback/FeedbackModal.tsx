'use client';

import { useState } from 'react';

export default function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [sentiment, setSentiment] = useState<'happy' | 'neutral' | 'sad' | null>(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sentiment,
        message,
        email,
        page: window.location.pathname,
      }),
    });
    
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-zinc-900 p-8 rounded-lg max-w-md text-center">
          <p className="text-yellow-500 text-xl">Thanks! We read every message.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-zinc-900 p-8 rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-4">How's your experience?</h2>
        
        <div className="flex gap-4 mb-6 justify-center">
          <button onClick={() => setSentiment('happy')} className={`text-4xl ${sentiment === 'happy' ? 'scale-125' : ''}`}>😊</button>
          <button onClick={() => setSentiment('neutral')} className={`text-4xl ${sentiment === 'neutral' ? 'scale-125' : ''}`}>😐</button>
          <button onClick={() => setSentiment('sad')} className={`text-4xl ${sentiment === 'sad' ? 'scale-125' : ''}`}>😟</button>
        </div>

        <textarea
          placeholder="Tell us more (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-black border border-zinc-700 text-white p-3 rounded mb-4 resize-none"
          rows={3}
        />

        <input
          type="email"
          placeholder="Your email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black border border-zinc-700 text-white p-3 rounded mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={!sentiment}
          className="w-full bg-yellow-500 text-black font-bold py-3 rounded hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send Feedback
        </button>
      </div>
    </div>
  );
}
