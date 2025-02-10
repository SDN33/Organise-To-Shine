import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import TrendingArticles from '../components/TrendingArticles';

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    const { error } = await supabase.from('favorites').select('article_id').eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
    }
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <TrendingArticles />
    </div>
  );
}
