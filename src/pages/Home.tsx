import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import TrendingArticles from '../components/TrendingArticles';
import RssFeed from '../components/RssFeed';

export default function Home() {
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    const { error } = await supabase.from('favorites').select('article_id').eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-center gap-4 mb-2">
        <img src="https://res.cloudinary.com/daroyxenr/image/upload/v1739149891/07a8a9c192544fe28acd5ee09fc6c6ca-free-removebg-preview_ulqtxh.png" alt="DataBuzz Logo" className="size-20" />
        <h1 className="text-5xl font-bold text-center text-indigo-600">DataBuzz</h1>
      </div>

      <h1 className="text-3xl font-bold mb-16 text-center text-gray-900">Retrouvez nos articles sur la Tech et le Monde Digital</h1>
      <div className='border-b border-gray-300 my-16'></div>
      <TrendingArticles />
      <div className='border-b border-gray-300 my-16'></div>
      <RssFeed />
    </div>
  );
}
