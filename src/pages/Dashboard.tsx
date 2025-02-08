import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Heart, BookOpen } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
  slug: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Article[]>([]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        article_id,
        articles (
          id,
          title,
          content,
          created_at,
          slug
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
    } else {
      setFavorites(data.map(f => f.articles) || []);
    }
  };

  const removeFavorite = async (articleId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('article_id', articleId);

    if (error) {
      console.error('Error removing favorite:', error);
    } else {
      setFavorites(favorites.filter(f => f.id !== articleId));
    }
  };

  if (!user) {
    return (
      <div className="text-center">
        Please log in to access the dashboard.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Your Reading List</h1>
        </div>

        <div className="space-y-6">
          {favorites.length === 0 ? (
            <p className="text-gray-500">No favorite articles yet.</p>
          ) : (
            favorites.map((article) => (
              <div key={article.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
                  <button
                    onClick={() => removeFavorite(article.id)}
                    className="p-2 rounded-full hover:bg-gray-100 text-red-500"
                  >
                    <Heart className="w-6 h-6" fill="currentColor" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(article.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}