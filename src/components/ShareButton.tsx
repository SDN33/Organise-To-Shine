import { useState } from 'react';
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Share,
  MessageSquare,
} from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title?: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Mostrar mensaje durante 2 segundos
    });
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
        title || 'Check out this article!'
      )}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(
        title || 'Check out this article!'
      )}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareOnReddit = () => {
    window.open(
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(
        title || 'Check out this article!'
      )}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(title || '')} ${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  return (
    <div className="flex gap-2 mx-auto justify-center ">
      {/* Copy to Clipboard */}
      <button
        onClick={handleCopyToClipboard}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition duration-200"
        title="Copier le lien"
      >
        {isCopied ? (
          <span className="text-sm font-medium">Copié !</span>
        ) : (
          <>
            <Share2 className="size-4" />
            <span className="sr-only">{title ? `Partager "${title}"` : 'Partager'}</span>
          </>
        )}
      </button>

      {/* Facebook */}
      <button
        onClick={shareOnFacebook}
        className="p-2 rounded-full hover:bg-blue-50 text-blue-600 transition duration-200"
        title="Partager sur Facebook"
      >
        <Facebook className="size-4" />
      </button>

      {/* X (Twitter) */}
      <button
        onClick={shareOnTwitter}
        className="p-2 rounded-full hover:bg-sky-50 text-sky-600 transition duration-200"
        title="Partager sur X (Twitter)"
      >
        <Twitter className="size-4" />
      </button>

      {/* LinkedIn */}
      <button
        onClick={shareOnLinkedIn}
        className="p-2 rounded-full hover:bg-blue-50 text-blue-700 transition duration-200"
        title="Partager sur LinkedIn"
      >
        <Linkedin className="size-4" />
      </button>

      {/* Reddit */}
      <button
        onClick={shareOnReddit}
        className="p-2 rounded-full hover:bg-red-50 text-red-600 transition duration-200"
        title="Partager sur Reddit"
      >
        <Share className="size-4" />
      </button>

      {/* WhatsApp */}
      <button
        onClick={shareOnWhatsApp}
        className="p-2 rounded-full hover:bg-green-50 text-green-600 transition duration-200"
        title="Partager sur WhatsApp"
      >
        <MessageSquare className="size-4" />
      </button>
    </div>
  );
}
