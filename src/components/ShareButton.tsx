import { useState } from 'react';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  url: string;
  title?: string;
}

export default function ShareButton({ url, title }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Mostrar mensaje durante 2 segundos
    });
  };

  return (
    <button
      onClick={handleCopyToClipboard}
      className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition duration-200"
      title="Copier le lien"
    >
      {isCopied ? (
        <span className="text-sm font-medium">Copié !</span>
      ) : (
        <>
          <Share2 className="w-6 h-6" />
          <span className="sr-only">{title ? `Partager "${title}"` : 'Partager'}</span>
        </>
      )}
    </button>
  );
}
