'use client';

import { useEffect, useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import Navbar from '../../../components/Navbar';

async function fetchArticles() {
    try {
        const response = await fetch('/api/news');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        return data.results;
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}

function NewsTicker({ articles }: { articles: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % articles.length);
        }, 6000); 

        return () => clearInterval(interval);
    }, [articles.length]);

    if (articles.length === 0) return null;

    return (
        <div style={{
            backgroundColor: '#e0f7fa',
            padding: '10px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px',
            position: 'relative',
            width: '100%',
            whiteSpace: 'nowrap'
        }}>
            <div style={{
               display: 'inline-block',
                paddingLeft: '100%',
                animation: 'ticker 14s linear infinite',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#00796b',
                lineHeight: '1.5'
            }}>
                {articles[currentIndex].title}
            </div>
            <style jsx>{`
                @keyframes ticker {
                    from { transform: translateX(100%); }
                    to { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    );
}

export default function ActualitesPage() {
    const [articles, setArticles] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchArticles().then((data) => {
            if (data.length === 0) {
                setError('No articles found.');
            } else {
                setArticles(data.filter(article => article.image_url));
            }
        });
    }, []);

    if (error) return (
        <div style={{
            textAlign: 'left',
            marginTop: '40px',
            fontSize: '18px',
            color: '#d9534f',
            padding: '0 20px'
        }}>
            {error}
        </div>
    );

    const truncateDescription = (description: string) => {
        const lines = description.split('\n');
        return lines.slice(0, 4).join('\n');
    };

    return (
        <div style={{
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <Navbar />
            <div style={{
        marginTop: '0px', // Adjust this margin based on the Navbar height if needed
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>

<h1 style={{
                    fontSize: '36px',
                    margin: '40px 0 20px 0',
                    color: '#333'
                }}>
                    Articles récents
                </h1>
                <NewsTicker articles={articles} />
             
                {articles.map((article) => (
                    <div key={article.article_id} style={{
                        display: 'flex',
                        marginBottom: '40px',
                        padding: '20px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        alignItems: 'flex-start'
                    }}>
                        {article.image_url && (
                            <div style={{ marginRight: '20px' }}>
                                <img
                                    src={article.image_url}
                                    alt={article.title}
                                    style={{
                                        width: '350px',
                                        height: 'auto',
                                        borderRadius: '8px',
                                        border: '2px solid #ddd',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                            </div>
                        )}
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: '28px',
                                margin: '0 0 10px 0'
                            }}>
                                <a href={article.link} style={{
                                    textDecoration: 'none',
                                    color: '#333',
                                    transition: 'color 0.3s'
                                }}>
                                    {article.title}
                                </a>
                            </h3>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '10px'
                            }}>
                                <CalendarIcon style={{
                                    width: '20px',
                                    height: '20px',
                                    color: '#888',
                                    marginRight: '8px'
                                }} />
                                <span style={{
                                    fontSize: '16px',
                                    color: '#888'
                                }}>
                                    {new Date(article.pubDate).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                            <p style={{
                                margin: '0',
                                color: '#555',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 4,
                                lineHeight: '1.5'
                            }}>
                                {truncateDescription(article.description)}
                            </p>
                            <p style={{
                                margin: '10px 0 0 0',
                                color: '#888'
                            }}>
                                Source: {article.source_id}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
