import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Clock, Heart, ArrowLeft, MessageCircle } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
  slug: string;
  image_url: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    fetchArticle();
    if (user) {
      checkIfFavorited();
    }
  }, [slug, user]);

  async function fetchArticle() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      navigate('/'); // Redirect to home if article not found
    } else {
      setArticle(data);
      fetchComments(data.id);
    }
  }

  async function checkIfFavorited() {
    if (!user || !article) return;

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('article_id', article.id)
      .single();

    if (!error && data) {
      setIsFavorited(true);
    }
  }

  async function toggleFavorite() {
    if (!user || !article) return;

    if (isFavorited) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', article.id);
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, article_id: article.id });
    }
    setIsFavorited(!isFavorited);
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
      setComments(data || []);
    }
  }

  async function addComment() {
    if (!user || !article || !newComment.trim()) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        content: newComment,
        article_id: article.id,
        user_id: user.id
      });

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setNewComment('');
      fetchComments(article.id);
    }
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Retour
      </button>

      <article className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold text-gray-900">
            {article.title}
          </h1>
            <button
            onClick={user ? toggleFavorite : () => navigate('/login')}
            className={`p-2 rounded-full hover:bg-gray-100 group relative ${
              isFavorited ? 'text-red-500' : 'text-gray-400'
            }`}
            >
            <Heart className="w-6 h-6" fill={isFavorited ? 'currentColor' : 'none'} />
            {!user && (
              <div className="hidden group-hover:block absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
              Se connecter pour ajouter aux favoris
              </div>
            )}
            </button>

        </div>

        <div className="flex items-center text-gray-500 text-sm mb-6">
          <Clock className="w-4 h-4 mr-1" />
          <time>
            {new Date(article.created_at).toLocaleDateString()} à {new Date(article.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </time>
        </div>

        {article.image_url && (
          <div className="mb-8">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="prose max-w-none mb-8">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="border-t pt-8">
          <div className="flex items-center mb-6">
            <MessageCircle className="w-5 h-5 mr-2" />
            <h2 className="text-xl font-semibold">Commentaires</h2>
          </div>

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">{comment.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}

            {user && (
              <div className="flex flex-col gap-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[100px] p-3"
                />
                <button
                  onClick={addComment}
                  className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Publier le commentaire
                </button>
              </div>
            )}

            {!user && (
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  Connectez-vous pour laisser un commentaire
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Se connecter
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
