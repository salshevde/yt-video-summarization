import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Search, Star } from 'lucide-react';
import type { Summary } from '../types';

export function History() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummaries();
  }, []);

  const loadSummaries = async () => {
    try {
      const { data, error } = await supabase
        .from('summaries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSummaries(data);
    } catch (error: any) {
      console.error('Error loading summaries:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSummaries = summaries.filter(summary => 
    summary.video_title.toLowerCase().includes(search.toLowerCase()) ||
    summary.video_url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8">Your Summaries</h2>
      
      <div className="relative mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search summaries..."
          className="w-full p-4 pl-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filteredSummaries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No summaries found</div>
      ) : (
        <div className="grid gap-6">
          {filteredSummaries.map((summary) => (
            <div key={summary.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex gap-6">
                <img
                  src={summary.thumbnail_url}
                  alt={summary.video_title}
                  className="w-48 h-28 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold mb-2">{summary.video_title}</h3>
                    {summary.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{summary.rating}/5</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mb-3">
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                      {summary.category}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      {summary.language}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{summary.summary.slice(0, 200)}...</p>
                  <div className="flex gap-2">
                    {summary.keywords.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-4">
                    Generated on {format(new Date(summary.created_at), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}