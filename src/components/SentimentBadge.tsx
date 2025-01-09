import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

interface SentimentBadgeProps {
  sentiment: 'positive' | 'neutral' | 'negative';
}

export function SentimentBadge({ sentiment }: SentimentBadgeProps) {
  const config = {
    positive: {
      icon: Smile,
      text: 'Positive',
      colors: 'bg-green-100 text-green-600',
    },
    neutral: {
      icon: Meh,
      text: 'Neutral',
      colors: 'bg-gray-100 text-gray-600',
    },
    negative: {
      icon: Frown,
      text: 'Negative',
      colors: 'bg-red-100 text-red-600',
    },
  }[sentiment];
  
  const Icon = config.icon;
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${config.colors}`}>
      <Icon className="w-4 h-4" />
      {config.text}
    </span>
  );
}