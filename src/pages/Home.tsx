import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Clock, Heart, MessageCircle } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
  slug: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export default function Home() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchArticles();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  async function fetchArticles() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
    } else {
      setArticles(data || []);
    }
  }

  async function fetchFavorites() {
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
  }

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

  async function fetchComments(articleId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(prev => ({ ...prev, [articleId]: data }));
    }
  }

  async function addComment(articleId: string) {
    if (!user || !newComment[articleId]) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        content: newComment[articleId],
        article_id: articleId,
        user_id: user.id
      });

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setNewComment(prev => ({ ...prev, [articleId]: '' }));
      await fetchComments(articleId);
    }
  }

  const toggleComments = async (articleId: string) => {
    if (!showComments[articleId]) {
      await fetchComments(articleId);
    }
    setShowComments(prev => ({ ...prev, [articleId]: !prev[articleId] }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Latest Articles</h1>
      <div className="space-y-8">
        {articles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {article.title}
              </h2>
              {user && (
                <button
                  onClick={() => toggleFavorite(article.id)}
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
              <time>{new Date(article.created_at).toLocaleDateString()}</time>
            </div>
            <div className="prose max-w-none mb-4">
              {article.content}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <button
                onClick={() => toggleComments(article.id)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Comments
              </button>
              
              {showComments[article.id] && (
                <div className="mt-4 space-y-4">
                  {comments[article.id]?.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-800">{comment.content}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  
                  {user && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment[article.id] || ''}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [article.id]: e.target.value }))}
                        placeholder="Add a comment..."
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => addComment(article.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Comment
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}