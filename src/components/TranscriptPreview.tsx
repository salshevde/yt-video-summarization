import React from 'react';
import { FileText } from 'lucide-react';

interface TranscriptPreviewProps {
  transcript: string;
  isDark: boolean;
}

export function TranscriptPreview({ transcript, isDark }: TranscriptPreviewProps) {
  return (
    <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
      <div className="flex items-center gap-2 mb-4">
        <FileText className={isDark ? 'text-red-500' : 'text-red-600'} />
        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Video Transcript
        </h3>
      </div>
      
      <div className={`h-48 overflow-y-auto rounded-lg p-4 ${
        isDark ? 'bg-gray-900/50 text-gray-300' : 'bg-white text-gray-600'
      }`}>
        <p className="whitespace-pre-wrap">{transcript}</p>
      </div>
    </div>
  );
}