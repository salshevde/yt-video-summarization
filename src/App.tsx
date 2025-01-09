import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { YoutubeIcon, FileText, Clock, Book, Sparkles, ChevronRight, Share2, Download, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { AuthModal } from './components/AuthModal';
import { Header } from './components/Header';
import { History } from './pages/History';
import { TranscriptPreview } from './components/TranscriptPreview';
import { SocialShare } from './components/SocialShare';
import { SentimentBadge } from './components/SentimentBadge';
import { downloadPDF, analyzeSentiment } from './lib/utils';

import { NhostClient, NhostSession, useNhostClient, useSignUpEmailPassword } from '@nhost/react';
import { NhostProvider } from '@nhost/react';
import { nhost } from './lib/nhost';
// require('dotenv').config();

function App() {
  const nhostClient = useNhostClient();
  const [session, setSession] = useState<NhostSession|null>(null)
  
  const [isDark, setIsDark] = useState(true);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(nhost.auth.getUser());
  const [summary, setSummary] = useState<any>(null);
  const [transcript, setTranscript] = useState('');
  const [lengthPreference, setLengthPreference] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [language, setLanguage] = useState('en');
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {

      setUser(nhost.auth.getUser());
      setSession(nhost.auth.getSession())
      nhost.auth.onAuthStateChanged((_, session) => {
        setSession(session)
      })
  }, [nhost.auth.getUser()]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuth(true);
      return;
    }

    setIsLoading(true);
    setStatus('Fetching video information...');
    
    // Function to send the YouTube URL to n8n
    const sendToN8n = async (url: string) => {
      try {
      const response = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeUrl: url }),
      });

      if (response.ok) {
        toast.success('YouTube URL sent to n8n');
      } else {
        toast.error('Failed to send YouTube URL');
      }
    } catch (error) {
      toast.error('Error sending YouTube URL');
    }
  };

  sendToN8n(url)
    
    try {
      // Simulate API calls with delays
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('Extracting transcript...');
      
      // Mock transcript data
      const mockTranscript = `In this video, we'll explore the fundamentals of React development.
First, we'll cover components and props.
Then, we'll dive into state management and hooks.
Finally, we'll look at best practices for production applications.`;
      setTranscript(mockTranscript);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('Generating summary...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock summary data
      const mockSummary = {
        video_title: 'How to Build a React App',
        thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        summary: 'This comprehensive tutorial covers React fundamentals, hooks, and best practices for building production-ready applications. The video explains component architecture, state management patterns, and advanced optimization techniques.',
        keywords: ['React', 'JavaScript', 'Web Development', 'Frontend', 'Hooks'],
        category: 'Technology',
        language,
        length_preference: lengthPreference,
        sentiment: analyzeSentiment(mockTranscript),
      };

      setSummary(mockSummary);
      
      // Save to nhost
      const { error } = await nhost.from('summaries').insert([{
        user_id: user.id,
        video_url: url,
        ...mockSummary,
      }]);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error:', error.message);
    } finally {
      setIsLoading(false);
      setStatus('');
    }
  };

  const handleRating = async (value: number) => {
    setRating(value);
    if (summary) {
      try {
        const { error } = await nhost
          .from('summaries')
          .update({ rating: value })
          .match({ video_url: url });
        
        if (error) throw error;
      } catch (error: any) {
        console.error('Error saving rating:', error.message);
      }
    }
  };


  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Header
            isDark={isDark}
            setIsDark={setIsDark}
            user={user}
            onAuthClick={() => setShowAuth(true)}
          />

          <Routes>
            <Route path="/history" element={<History />} />
            <Route
              path="/"
              element={
                <>
                  <div className="text-center mb-12">
                    <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Transform Videos into Knowledge
                    </h2>
                    <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Get instant AI-powered summaries of any YouTube video
                    </p>
                  </div>

                  <div className={`rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'}`}>
                    <div className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste YouTube URL here..."
                            className={`w-full p-4 pr-12 rounded-xl border text-lg transition-colors ${
                              isDark 
                                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                            }`}
                          />
                          <YoutubeIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-600" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Summary Length
                            </label>
                            <select
                              value={lengthPreference}
                              onChange={(e) => setLengthPreference(e.target.value as any)}
                              className={`w-full p-3 rounded-lg border ${
                                isDark
                                  ? 'bg-gray-700/50 border-gray-600 text-white'
                                  : 'bg-white border-gray-200 text-gray-900'
                              }`}
                            >
                              <option value="short">Short</option>
                              <option value="medium">Medium</option>
                              <option value="detailed">Detailed</option>
                            </select>
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Language
                            </label>
                            <select
                              value={language}
                              onChange={(e) => setLanguage(e.target.value)}
                              className={`w-full p-3 rounded-lg border ${
                                isDark
                                  ? 'bg-gray-700/50 border-gray-600 text-white'
                                  : 'bg-white border-gray-200 text-gray-900'
                              }`}
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`w-full p-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] ${
                            isDark
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                        >
                          {isLoading ? (
                            <>
                              <Sparkles className="w-5 h-5 animate-pulse" />
                              {status}
                            </>
                          ) : (
                            <>
                              Summarize Video
                              <ChevronRight className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    {transcript && !summary && (
                      <div className="px-8 pb-8">
                        <TranscriptPreview transcript={transcript} isDark={isDark} />
                      </div>
                    )}

                    {summary && (
                      <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} p-8`}>
                        <div className="flex gap-6 mb-6">
                          <img
                            src={summary.thumbnail_url}
                            alt={summary.video_title}
                            className="w-48 h-28 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {summary.video_title}
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                                {summary.category}
                              </span>
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                {summary.language}
                              </span>
                              <SentimentBadge sentiment={summary.sentiment} />
                            </div>
                          </div>
                        </div>

                        <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {summary.summary}
                        </p>

                        <div className="flex gap-2 mb-6 flex-wrap">
                          {summary.keywords.map((keyword: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                            >
                              #{keyword}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-4">
                            <button
                              onClick={() => downloadPDF(summary)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                isDark
                                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              <Download className="w-4 h-4" />
                              Download PDF
                            </button>
                            
                            <SocialShare summary={summary} isDark={isDark} />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Rate summary:
                            </span>
                            {[1, 2, 3, 4, 5].map((value) => (
                              <button
                                key={value}
                                onClick={() => handleRating(value)}
                                className={`p-1 ${
                                  value <= (rating || 0)
                                    ? 'text-yellow-400'
                                    : isDark
                                    ? 'text-gray-600'
                                    : 'text-gray-400'
                                }`}
                              >
                                <Star className={`w-5 h-5 ${value <= (rating || 0) ? 'fill-current' : ''}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={`grid grid-cols-3 divide-x ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      <div className="p-6 text-center">
                        <Clock className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-red-500' : 'text-red-600'}`} />
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Save Time</p>
                      </div>
                      <div className="p-6 text-center">
                        <Book className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-red-500' : 'text-red-600'}`} />
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Key Points</p>
                      </div>
                      <div className="p-6 text-center">
                        <FileText className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-red-500' : 'text-red-600'}`} />
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Easy Notes</p>
                      </div>
                    </div>
                  </div>
                </>
              }
            />
          </Routes>
        </div>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <Toaster position="bottom-right" />
    </Router>
  );
}

export default App;