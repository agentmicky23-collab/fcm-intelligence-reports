'use client';

import { useState } from 'react';
import FeedbackModal from './FeedbackModal';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop: vertical side tab */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-black border border-yellow-500 text-yellow-500 px-3 py-6 rounded-l-lg hover:bg-yellow-500 hover:text-black transition-colors text-sm font-medium z-50 hidden md:block"
        style={{ writingMode: 'vertical-rl' }}
      >
        Feedback?
      </button>

      {/* Mobile: small floating circle bottom-right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-black border-2 border-yellow-500 text-yellow-500 flex items-center justify-center z-50 md:hidden shadow-lg hover:bg-yellow-500 hover:text-black transition-colors"
        aria-label="Feedback"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
      
      {isOpen && <FeedbackModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
