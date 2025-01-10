import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Search, Star } from 'lucide-react';
import { useNhostClient } from '@nhost/react';
import type { Summary } from '../types';

export function History() {
  const nhost = useNhostClient(); // Initialize Nhost client
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummaries();
  }, []);

  const loadSummaries = async () => {
    try {
      const query = `
        query GetSummaries {
          summaries(order_by: {created_at: desc}) {
            summary_id
            video_title
            video_url
            keywords
            thumbnail_url
            category
            language
            length_preference
            sentiment
            created_at
            rating
          }
        }
      `;
      
      const { data, error } = await nhost.graphql.request(query);

      if (error) {
        console.error('Error loading summaries:', error);
        throw new Error(error.message|| error);
      }

      setSummaries(data.summaries || []);
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">History</h1>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by title or URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 shadow-sm"
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {loading ? (
        <p>Loading summaries...</p>
      ) : filteredSummaries.length === 0 ? (
        <p>No summaries found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredSummaries.map((summary) => (
            <li key={summary.id} className="p-4 rounded-lg shadow-lg bg-white border border-gray-200">
              <div className="flex justify-between items-start">
                <div>                          <img
                            src={summary.thumbnail_url}
                            alt={summary.video_title}
                            className="w-48 h-28 object-cover rounded-lg"
                          />
                  <h2 className="text-lg font-bold">{summary.video_title}</h2>
                  <p className="text-sm text-gray-500">{format(new Date(summary.created_at), 'PPP')}</p>
                  <p className="text-sm text-blue-600 truncate">{summary.video_url}</p>
                </div>
                {summary.rating && (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4" />
                    <span>{summary.rating}</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
