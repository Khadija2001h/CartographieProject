// src/components/Actualites.tsx
import React from 'react';

interface Article {
  title: string;
  description: string;
  url: string;
}

interface ActualitesProps {
  articles: Article[];
}

const Actualites: React.FC<ActualitesProps> = ({ articles }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#333' }}>Actualités</h1>
      <div style={{ borderBottom: '2px solid #ddd', marginBottom: '20px', paddingBottom: '10px' }}>
        <p style={{ fontSize: '18px', color: '#666' }}>
          Voici les dernières actualités économiques du Maroc.
        </p>
      </div>
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {articles.map((article, index) => (
          <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: '#333',
                display: 'block',
                transition: 'color 0.3s, background-color 0.3s',
              }}
            >
              <h2 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>{article.title}</h2>
              <p style={{ fontSize: '16px', margin: '0' }}>{article.description}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Actualites;
