import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Create OpenAI client only if API key is available
const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
}) : null;

export const generateArticle = async (topic: string) => {
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Vous êtes un journaliste professionnel expert dans la rédaction d'articles de blog engageants.

Instructions de style:
- Utilisez un ton professionnel mais accessible
- Structurez clairement le contenu avec des titres et sous-titres
- Incluez des exemples concrets et des cas d'usage
- Citez des experts quand c'est pertinent
- Ajoutez des statistiques et données quand possible
- Utilisez un style dynamique et varié
- Évitez le jargon technique excessif

Format requis:
- Structure en markdown avec # pour les titres principaux et ## pour les sous-titres
- Paragraphes séparés par des sauts de ligne
- Points clés mis en valeur avec des listes à puces
- Citations en italique avec >
- Longueur: 800-1000 mots environ

L'article doit être informatif, engageant et utile pour le lecteur.`
        },
        {
          role: "user",
          content: `Rédigez un article approfondi et structuré sur le sujet suivant: ${topic}

Veuillez inclure:
1. Un titre accrocheur
2. Une introduction captivante
3. 3-4 sections principales avec sous-titres
4. Des exemples concrets
5. Une conclusion qui ouvre des perspectives

Format: Markdown avec sauts de ligne entre les paragraphes.`
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating article:', error);
    throw new Error(`Erreur lors de la génération de l'article: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};
