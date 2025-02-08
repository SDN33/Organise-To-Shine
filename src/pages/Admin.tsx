import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { generateArticle } from '../lib/openai';
import { Settings, Clock, Edit, Trash2, Check, X, Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 's.deinegri2@gmail.com';

interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
  status: string;
}

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [lastGeneration, setLastGeneration] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) {
      navigate('/');
      return;
    }
    fetchArticles();
    checkLastGeneration();
  }, [user, navigate]);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setArticles(data);
    }
  };

  const checkLastGeneration = async () => {
    const { data, error } = await supabase
      .from('auto_generation_log')
      .select('generated_at')
      .order('generated_at', { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0) {
      setLastGeneration(data[0].generated_at);
    }
  };

  const generateCustomArticle = async () => {
    if (!customTopic.trim()) {
      setError("Veuillez entrer un sujet d'article");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const content = await generateArticle(customTopic);
      const slug = customTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const { error: insertError } = await supabase.from('articles').insert({
        title: customTopic,
        content,
        user_id: user?.id,
        slug,
        status: 'published'
      });

      if (insertError) throw insertError;

      await supabase.from('auto_generation_log').insert({
        generated_at: new Date().toISOString(),
        articles_count: 1
      });

      await fetchArticles();
      await checkLastGeneration();
      setCustomTopic('');
    } catch (err) {
      setError(`Erreur lors de la génération de l'article: ${(err as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDailyArticles = async () => {
    const topics = [
      'Dernières tendances technologiques en 2025',
      'L\'avenir du marketing digital',
      'Pratiques commerciales durables',
      'Innovation en IA et apprentissage automatique',
      'Meilleures pratiques du travail à distance',
      'Stratégies de transformation digitale',
      'Startups technologiques émergentes',
      'Meilleures pratiques en cybersécurité',
      'Tendances marketing des réseaux sociaux',
      'Leadership d\'entreprise à l\'ère numérique'
    ];

    setIsGenerating(true);
    setError(null);

    try {
      const selectedTopics = topics.sort(() => 0.5 - Math.random()).slice(0, 2);

      for (const topic of selectedTopics) {
        const content = await generateArticle(topic);
        const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const { error: insertError } = await supabase.from('articles').insert({
          title: topic,
          content,
          user_id: user?.id,
          slug,
          status: 'published'
        });

        if (insertError) throw insertError;
      }

      await supabase.from('auto_generation_log').insert({
        generated_at: new Date().toISOString(),
        articles_count: 2
      });

      await fetchArticles();
      await checkLastGeneration();
    } catch (err) {
      setError(`Erreur lors de la génération des articles: ${(err as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const startEditing = (article: Article) => {
    setEditingArticle(article);
    setEditedContent(article.content);
    setEditedTitle(article.title);
    setError(null);
  };

  const cancelEditing = () => {
    setEditingArticle(null);
    setEditedContent('');
    setEditedTitle('');
    setError(null);
  };

  const saveArticle = async () => {
    if (!editingArticle) return;

    setIsSaving(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('articles')
        .update({
          title: editedTitle,
          content: editedContent
        })
        .eq('id', editingArticle.id);

      if (updateError) throw updateError;

      await fetchArticles();
      cancelEditing();
    } catch (err) {
      setError(`Erreur lors de la sauvegarde: ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ? Tous les commentaires associés seront également supprimés.')) {
      setError(null);
      setDeletingIds(prev => [...prev, id]);

      try {
        const { error: commentsError } = await supabase
          .from('comments')
          .delete()
          .eq('article_id', id);

        if (commentsError) throw commentsError;

        const { error: articleError } = await supabase
          .from('articles')
          .delete()
          .eq('id', id);

        if (articleError) throw articleError;

        await fetchArticles();
      } catch (err) {
        setError(`Erreur lors de la suppression: ${(err as Error).message}`);
      } finally {
        setDeletingIds(prev => prev.filter(item => item !== id));
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
          <Settings className="w-6 h-6 text-gray-600" />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Génération d'articles</h2>

          <div className="flex items-center text-gray-600 mb-4">
            <Clock className="w-5 h-5 mr-2" />
            Dernière génération : {lastGeneration ? new Date(lastGeneration).toLocaleString() : 'Jamais'}
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Entrez un sujet personnalisé"
                className="flex-1 p-2 border rounded-md"
              />
              <button
                onClick={generateCustomArticle}
                disabled={isGenerating}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </div>
                ) : (
                  'Générer un article'
                )}
              </button>
            </div>

            <button
              onClick={generateDailyArticles}
              disabled={isGenerating}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Génération des articles...
                </div>
              ) : (
                'Générer des articles aléatoires'
              )}
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Articles récents</h2>
          <div className="space-y-6">
            {articles.map((article) => (
              <div key={article.id} className="border-b pb-6 last:border-b-0">
                {editingArticle?.id === article.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={10}
                      className="w-full p-2 border rounded-md font-mono resize-y"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={saveArticle}
                        disabled={isSaving}
                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Enregistrer
                          </>
                        )}
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={isSaving}
                        className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{article.title}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(article)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteArticle(article.id)}
                          disabled={deletingIds.includes(article.id)}
                          className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Supprimer"
                        >
                          {deletingIds.includes(article.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(article.created_at).toLocaleString()}
                    </p>
                    <div className="mt-4 text-gray-700 whitespace-pre-line">
                      {article.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
