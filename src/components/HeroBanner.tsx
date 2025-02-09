import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  slug: string;

}

const HeroSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '0',
      title: 'Chargement...',
      subtitle: 'Veuillez patienter',
      image: '/api/placeholder/1920/1080',
      color: 'from-indigo-500',
      slug: '',
    },
  ]);

  useEffect(() => {
    async function fetchLatestArticles() {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching articles:', error);
        return;
      }

      if (data) {
        const formattedSlides = data.map((article, index) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          subtitle: 'Nos derniers articles',
          image:
            'https://res.cloudinary.com/daroyxenr/image/upload/q_auto:best/v1739102257/Designer_9_j5mysd.avif',
          color:
            index === 0
              ? 'from-indigo-500'
              : index === 1
              ? 'from-blue-500'
              : 'from-purple-500',
        }));
        setSlides(formattedSlides);
      }
    }

    fetchLatestArticles();
  }, []);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [slides.length, nextSlide]);

  return (
    <div className="relative h-[25rem] w-full overflow-hidden">
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent opacity-60 z-10`}
              />
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="relative z-20 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {slide.title}
                </h2>
                <p className="mt-6 text-xl text-white sm:text-2xl">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 z-30 flex items-center justify-between p-4">
        <button
          onClick={prevSlide}
          className="rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50 focus:outline-none"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50 focus:outline-none"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === activeSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
