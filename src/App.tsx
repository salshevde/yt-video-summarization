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

const cat_id =  {
  "1": "Film & Animation",
  "2": "Autos & Vehicles",
  "10": "Music",
  "15": "Pets & Animals",
  "17": "Sports",
  "18": "Short Movies",
  "19": "Travel & Events",
  "20": "Gaming",
  "21": "Videoblogging",
  "22": "People & Blogs",
  "23": "Comedy",
  "24": "Entertainment",
  "25": "News & Politics",
  "26": "Howto & Style",
  "27": "Education",
  "28": "Science & Technology",
  "29": "Nonprofits & Activism",
  "30": "Movies",
  "31": "Anime/Animation",
  "32": "Action/Adventure",
  "33": "Classics",
  "34": "Comedy",
  "35": "Documentary",
  "36": "Drama",
  "37": "Family",
  "38": "Foreign",
  "39": "Horror",
  "40": "Sci-Fi/Fantasy",
  "41": "Thriller",
  "42": "Shorts",
  "43": "Shows",
  "44": "Trailers"
}

function App() {
  const nhostClient = useNhostClient();
  const [session, setSession] = useState<NhostSession | null>(null)

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
  
  const [summaryId , setSummaryId] = useState(null)
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
    const sendToBackend = async (url: string) => {
      try {
        const response = await fetch(import.meta.env.VITE_PROXY_URL, {
          method: 'POST', // Use POST because you are sending data in the body
          headers: {
            'Content-Type': 'application/json', // Content type for sending JSON
          },
          body: JSON.stringify({ youtubeUrl: url , length: lengthPreference, language:language}), // Send the URL as part of the request body
        });
    
        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData[0].summary)
          if(responseData && responseData[0] && responseData[0].summary){
            console.log("video received")
          toast.success('Video summary received');}
          else{
            console.log("nto ")

            toast.error(responseData)
            return null;
          }
          return responseData; // Return the summary from n8n
        } else {
          toast.error('Failed to send YouTube URL to n8n');
        }
      } catch (error) {
        console.error('Error during request:', error);
        toast.error('Error sending YouTube URL');
      }
    };

    try {
      setStatus('Generating summary...');
      // error
      const n8data_ = await sendToBackend(url);
      
    //   const n8data ={
    //     "summary": "This episode of This Guy's Toast, hosted by Disguised Toast, featured three contestants: Sonic, QuarterJade, and returning champion Scarra. The questions covered a variety of categories, including web history, gaming, esports, pets, and physical challenges. After two rounds of questions, Sean (Sonic) emerged victorious with 11,000 points, while QuarterJade and Scarra trailed behind with 4,600 and 700 points, respectively. ",
    //     "title": "I exposed my friends and CHAOS ensued in my Gameshow...",
    //     "description": "Join us in the second episode of This Guy's Toast! a totally original gameshow with very unique prompts and topics that will make contestants compete with all their might for the win. Answers also include physical movements! will they be exposed for a lack of athletic ability?\n\nSupport DSG on Patreon ► https://patreon.com/Disguised\nJoin the DSG Discord ► https://discord.gg/Disguised\n\nWatch me Live on Twitch! ► https://twitch.tv/disguisedtoast\nFollow on Instagram! ► http://instagram.com/DisguisedToast\nFollow on Twitter! ► http://twitter.com/DisguisedToast\nLike on Facebook! ► http://facebook.com/DisguisedToast\n\nOutro Track ► \"French Toast\" by Drew.0 (https://youtube.com/c/drew0), co-written and produced by Steven Tran (https://instagram.com/snk_tran )\n\ntrivia by: otriggad & 4our\nedited by: https://twitter.com/_4our_\n\n#DisguisedToast #OfflineTV #DSG",
    //     "id": "2kWMkqthfYs",
    //     "youtubeUrl": "https://www.youtube.com/watch?v=2kWMkqthfYs",
    //     "thumbnails": {
    //         "default": {
    //             "url": "https://i.ytimg.com/vi/2kWMkqthfYs/default.jpg",
    //             "width": 120,
    //             "height": 90
    //         },
    //         "medium": {
    //             "url": "https://i.ytimg.com/vi/2kWMkqthfYs/mqdefault.jpg",
    //             "width": 320,
    //             "height": 180
    //         },
    //         "high": {
    //             "url": "https://i.ytimg.com/vi/2kWMkqthfYs/hqdefault.jpg",
    //             "width": 480,
    //             "height": 360
    //         },
    //         "standard": {
    //             "url": "https://i.ytimg.com/vi/2kWMkqthfYs/sddefault.jpg",
    //             "width": 640,
    //             "height": 480
    //         },
    //         "maxres": {
    //             "url": "https://i.ytimg.com/vi/2kWMkqthfYs/maxresdefault.jpg",
    //             "width": 1280,
    //             "height": 720
    //         }
    //     },
    //     "tags": [
    //         "among us",
    //         "among us impostor",
    //         "among us imposter",
    //         "among us gameplay",
    //         "disguised toast",
    //         "disguised toast among us",
    //         "among us funny",
    //         "among us big brain",
    //         "among us big brain plays",
    //         "among us funny moments",
    //         "offlinetv",
    //         "offlinetv and friends",
    //         "among us impostor tips",
    //         "among us gameplay funny moments",
    //         "Toast Twitch",
    //         "Disguised Toast Twitch",
    //         "this guys toast",
    //         "toast gameshow",
    //         "ludwig gameshow",
    //         "toast jeopardy",
    //         "ludwig jeopardy"
    //     ],
    //     "categoryId": "20",
    //     "defaultLanguage": "en",
    //     "statistics": {
    //         "viewCount": "1253525",
    //         "likeCount": "46680",
    //         "favoriteCount": "0",
    //         "commentCount": "943"
    //     },
    //     "player": {
    //         "embedHtml": "<iframe width=\"480\" height=\"270\" src=\"//www.youtube.com/embed/2kWMkqthfYs\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>"
    //     },
    //     "availableLangs": [
    //         "en"
    //     ],
    //     "transcription": "transcription",
    //     "keywords": [
    //         "Disguised Toast",
    //         "This Guy's Toast",
    //         "Sonic",
    //         "QuarterJade",
    //         "Scarra",
    //         "web history",
    //         "gaming",
    //         "esports",
    //         "pets",
    //         "physical challenges"
    //     ],
    //     "sentiment": "positive"
    // }
    if (!n8data_){

      throw new Error('No response received');
    }
      
      console.log('here')
      const n8data = n8data_[0]

      if (!n8data.availableLangs.includes(language)) {
        toast.error("Select language not available")
      }
      

      const transcript = n8data.transcription;

      setTranscript(transcript);

      const video_details = {
        video_title: n8data.title,
        thumbnail_url: n8data.thumbnails.default.url,
        summary: n8data.summary,
        keywords: n8data.keywords,
        category: n8data.categoryId,
        language: n8data.defaultLanguage,
        sentiment: n8data.sentiment,
      };
      setSummary(video_details);

      // Save to nhost IF NEW FIXME
      // GraphQL Mutation
      const user_id = user.id;
      const createSummaryMutation = `
      mutation SaveSummary($video_title: String!,$video_url: String!, $thumbnail_url: String!, $summary: String!, $keywords: [String!], $category: String, $language: String, $sentiment: String, $user_id: uuid!, $lengthPreference: String!) {
        insert_summaries_one(object: {
          user_id: $user_id,
          video_url: $video_url,

          video_title: $video_title,
          thumbnail_url: $thumbnail_url,
          summary: $summary,
          keywords: $keywords,
          category: $category,
          language: $language,
          sentiment: $sentiment,
          length_preference: $lengthPreference
        }) {
          summary_id
        }
      }
      `;
      console.log(lengthPreference,length)
      const { data: summaryData, error } = await nhostClient.graphql.request(createSummaryMutation, {
        video_url:url,
        video_title: video_details.video_title,
        thumbnail_url: video_details.thumbnail_url,
        summary: video_details.summary,
        keywords: video_details.keywords,
        category: video_details.category,
        language: video_details.language,
        sentiment: video_details.sentiment,
        user_id: user_id,
        lengthPreference: lengthPreference
      });

      setSummaryId(summaryData.insert_summaries_one.summary_id);
      if (error) {
        console.error("Error saving summary:", error);
      } else {
        console.log("Summary saved successfully:", summaryData);
      }
    } catch (error) {
      console.error("Error during handleSubmit:", error);
    } finally {
      setIsLoading(false);
      setStatus('');
    }
  };

  const handleRating = async (value: number) => {
    setRating(value); // Update local state for immediate feedback.

    if (summary) {
      try {
        console.log(summaryId)
        const { error } = await nhost.graphql.request(
          `
        mutation UpdateRating($summary_id: uuid!, $rating: Int!) {
          update_summaries(where: { summary_id: { _eq: $summary_id } }, _set: { rating: $rating }) {
            affected_rows
          }
        }
        `,
          {
            
            summary_id: summaryId, 
            rating: value,  // Rating to update in the database.
          }
        );

        if (error) throw error;
        console.log("Rating updated successfully.");
        toast.success("Rating updated")
      } catch (err: any) {
        console.error("Error saving rating:", err.message);
        toast.error("Rating not saved")
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
                            className={`w-full p-4 pr-12 rounded-xl border text-lg transition-colors ${isDark
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
                              className={`w-full p-3 rounded-lg border ${isDark
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
                              className={`w-full p-3 rounded-lg border ${isDark
                                  ? 'bg-gray-700/50 border-gray-600 text-white'
                                  : 'bg-white border-gray-200 text-gray-900'
                                }`}
                            >
                              <option value="en">English</option>
                              <option value="fr">French</option>
                              <option value="hi">Hindi</option>
                              <option value="ru">Russian</option>
                              <option value="de">Chinese</option>
                              <option value="zh-CN">German</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`w-full p-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] ${isDark
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
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                {cat_id[summary.category]}
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
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDark
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
                                className={`p-1 ${value <= (rating || 0)
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