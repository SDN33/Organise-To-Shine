import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateArticle(topic: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Écrivez un article détaillé sur ${topic}. L'article doit suivre la structure suivante:

# Titre principal

## Introduction

## Sous-titre 1
[Contenu détaillé]

## Sous-titre 2
[Contenu détaillé]

## Sous-titre 3
[Contenu détaillé]

## Conclusion

L'article doit être informatif, bien structuré et captivant.`
      }
    ],
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    max_tokens: 1500,
  });

  return completion.choices[0].message.content || '';
}

export async function generateImage(prompt: string): Promise<string> {
  const response = await openai.images.generate({
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    style: 'natural'
  });

  return response.data[0].url || '';
}
