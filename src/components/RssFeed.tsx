import React, { useState, useEffect } from 'react';
import Parser from 'rss-parser';

interface NewsItem {
  title: string;
  link: string;
  pubDate?: string;
}

const RssFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const parser = new Parser();
        const response = await fetch(
          'https://api.allorigins.win/get?url=' + encodeURIComponent('https://news.google.com/rss?hl=fr')
        );
        const data = await response.json();

        const feed = await parser.parseString(data.contents);
        const newsData = feed.items.map((item) => ({
          title: item.title || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
        }));

        setNews(newsData.slice(0, 4)); // Limiter à 4 articles
      } catch (error) {
        console.error('Erreur lors de la récupération des actualités :', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Chargement des actualités...</p>
      </div>
    );
  }

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {news.map((item, index) => (
        <div key={index} className="p-2 bg-gray-50 dark:bg-black rounded-lg">
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
            <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
          </a>
          <p className="text-xs text-gray-500">{new Date(item.pubDate || '').toLocaleString('fr-FR')}</p>
        </div>
      ))}
    </div>
  );
};

export default RssFeed;
