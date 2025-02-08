import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { generateArticle } from '../lib/openai';
import { Settings, Clock } from 'lucide-react';

const ADMIN_EMAIL = 's.deinegri2@gmail.com';

interface Article {
  id: string;
  title: string;
  created_at: string;
  status: string;
}

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [lastGeneration, setLastGeneration] = useState<string | null>(null);

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
      .select('id, title, created_at, status')
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

  const generateDailyArticles = async () => {
    const topics = [
      'Latest Technology Trends in 2025',
      'The Future of Digital Marketing',
      'Sustainable Business Practices',
      'Innovation in AI and Machine Learning',
      'Remote Work Best Practices',
      'Digital Transformation Strategies',
      'Emerging Tech Startups',
      'Cybersecurity Best Practices',
      'Social Media Marketing Trends',
      'Business Leadership in the Digital Age'
    ];

    try {
      // Generate two random topics
      const selectedTopics = topics.sort(() => 0.5 - Math.random()).slice(0, 2);
      
      for (const topic of selectedTopics) {
        const content = await generateArticle(topic);
        const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        await supabase.from('articles').insert({
          title: topic,
          content,
          user_id: user?.id,
          slug,
          status: 'published'
        });
      }

      // Log the generation
      await supabase.from('auto_generation_log').insert({
        generated_at: new Date().toISOString(),
        articles_count: 2
      });

      await fetchArticles();
      await checkLastGeneration();
    } catch (error) {
      console.error('Error generating articles:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Settings className="w-6 h-6 text-gray-600" />
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Auto-Generation Status</h2>
          <div className="flex items-center text-gray-600 mb-4">
            <Clock className="w-5 h-5 mr-2" />
            Last Generation: {lastGeneration ? new Date(lastGeneration).toLocaleString() : 'Never'}
          </div>
          <button
            onClick={generateDailyArticles}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Generate Articles Now
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Articles</h2>
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium text-gray-900">{article.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(article.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}