import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import TrendingArticles from '../components/TrendingArticles';

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
      <h1 className="text-4xl font-bold mb-16 text-center text-indigo-600">Retrouvez nos articles sur la Tech et le Monde Digital</h1>
      <TrendingArticles />
    </div>
  );
}
