import { NextRequest, NextResponse } from 'next/server';

const API_KEY = 'AIzaSyDkqRdoAh3Baago_WCmff4GX97gWbFhqsE'; // Remplacez par votre clé API Gemini

const RELEVANT_TOPICS = [
  'entrepreneuriat',
  'loi marocaine',
  'secteurs d\'activité',
  'formes juridiques',
  'business',
  'projet',
  'SARL',
  'société à responsabilité limitée',
'SASU',
'SAS' ,
'SA',
'SNC',
  // Ajoutez d'autres termes spécifiques
];

function isRelevantQuestion(message: string): boolean {
  const lowercasedMessage = message.toLowerCase();
  return RELEVANT_TOPICS.some(topic => lowercasedMessage.includes(topic.toLowerCase()));
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!isRelevantQuestion(message)) {
      return NextResponse.json({ reply: 'Je m\'excuse, je ne peux répondre que sur vos questions en rapport avec l\'entrepreneuriat, la loi marocaine, les secteurs d\'activité et les formes juridiques au Maroc.' });
    }

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ],
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`La réponse du réseau n'était pas correcte: ${response.statusText}. Erreur: ${errorText}`);
      return NextResponse.json({ reply: 'Erreur lors de la récupération de la réponse du bot' }, { status: 500 });
    }

    const data = await response.json();
    console.log('Données de la réponse API:', data);

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    console.log('Réponse extraite:', reply);

    if (!reply) {
      console.warn('Aucun texte de réponse trouvé dans la réponse de l\'API');
    }

    return NextResponse.json({ reply: reply || 'Aucune réponse du bot' });
  } catch (error) {
    console.error('Erreur dans le gestionnaire POST:', error);
    return NextResponse.json({ reply: 'Erreur serveur interne' }, { status: 500 });
  }
}
