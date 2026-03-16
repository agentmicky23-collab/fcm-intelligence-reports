'use client';

import { useState } from 'react';
import FeedbackModal from './FeedbackModal';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-black border border-yellow-500 text-yellow-500 px-3 py-6 rounded-l-lg hover:bg-yellow-500 hover:text-black transition-colors text-sm font-medium z-50"
        style={{ writingMode: 'vertical-rl' }}
      >
        Feedback?
      </button>
      
      {isOpen && <FeedbackModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
