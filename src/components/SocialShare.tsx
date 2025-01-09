import React, { useState } from 'react';
import { Copy, Share2, Instagram, Linkedin } from 'lucide-react';
import { generateSocialPost } from '../lib/utils';
import toast from 'react-hot-toast';

interface SocialShareProps {
  summary: any;
  isDark: boolean;
}

export function SocialShare({ summary, isDark }: SocialShareProps) {
  const [platform, setPlatform] = useState<'instagram' | 'linkedin'>('instagram');
  const [showCopyModal, setShowCopyModal] = useState(false);
  
  const handleCopy = async () => {
    const text = generateSocialPost(summary, platform);
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
    setShowCopyModal(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowCopyModal(!showCopyModal)}
        className={`p-2 rounded-lg transition-colors ${
          isDark
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        <Share2 className="w-4 h-4" />
      </button>
      
      {showCopyModal && (
        <div className={`absolute right-0 mt-2 w-72 rounded-xl shadow-lg ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="p-4">
            <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Share as Social Post
            </h3>
            
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setPlatform('instagram')}
                className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-2 ${
                  platform === 'instagram'
                    ? 'bg-pink-100 text-pink-600'
                    : isDark
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </button>
              
              <button
                onClick={() => setPlatform('linkedin')}
                className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-2 ${
                  platform === 'linkedin'
                    ? 'bg-blue-100 text-blue-600'
                    : isDark
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </button>
            </div>
            
            <div className={`p-3 rounded-lg text-sm mb-4 ${
              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              <pre className="whitespace-pre-wrap font-mono">
                {generateSocialPost(summary, platform).slice(0, 100)}...
              </pre>
            </div>
            
            <button
              onClick={handleCopy}
              className="w-full p-2 bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-red-700"
            >
              <Copy className="w-4 h-4" />
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}