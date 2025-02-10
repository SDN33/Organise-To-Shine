import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Clock, Heart } from 'lucide-react';

import HeroBanner from '../components/HeroBanner';

interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
  slug: string;
  image_url: string;
}

export default function Home() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());


  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('favorites')
      .select('article_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
    } else {
      setFavorites(new Set(data.map(f => f.article_id)));
    }
  }, [user]);

  const fetchArticles = useCallback(async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
    } else {
      setArticles(data);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites, fetchArticles]);

  async function toggleFavorite(articleId: string) {
    if (!user) return;

    const isFavorited = favorites.has(articleId);
    if (isFavorited) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', articleId);
      favorites.delete(articleId);
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, article_id: articleId });
      favorites.add(articleId);
    }
    setFavorites(new Set(favorites));
  }

  const getExcerpt = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, content.lastIndexOf(' ', maxLength)) + '...';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <HeroBanner />
      <br />
      <br />
      <h1 className="text-4xl font-bold text-gray-900 mb-8 px-2">Derniers Articles</h1>
      <div className="space-y-8">
        {articles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:gap-6">
              {article.image_url && (
                <div className="w-full sm:w-48 mb-4 sm:mb-0">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-48 sm:w-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <Link
                    to={`/article/${article.slug}`}
                    className="hover:text-blue-600"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {article.title}
                    </h2>
                  </Link>
                  {user && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(article.id);
                      }}
                      className={`p-2 rounded-full hover:bg-gray-100 ${
                        favorites.has(article.id) ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      <Heart className="w-6 h-6" fill={favorites.has(article.id) ? 'currentColor' : 'none'} />
                    </button>
                  )}
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <Clock className="w-4 h-4 mr-1" />
                  <time>
                    {new Date(article.created_at).toLocaleDateString()} à {new Date(article.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </time>
                </div>
                <div className="prose max-w-none mb-4">
                  <p className="text-gray-700 mb-2 text-sm sm:text-base">
                    {getExcerpt(article.content).split('\n').map((line, index) => {
                      if (line.startsWith('# ')) {
                        return <strong key={index}>{line.substring(2).toUpperCase()} </strong>;
                      } else if (line.startsWith('## ')) {
                        return <strong key={index}>{line.substring(3)} </strong>;
                      }
                      return line + ' ';
                    })}
                  </p>
                </div>
                <Link
                  to={`/article/${article.slug}`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Lire la suite →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
