import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import '../styles/global.css';

const NewsCarousel = () => {
    const [articles, setArticles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('/api/news');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setArticles(data.results.filter(article => article.image_url));
            } catch (error) {
                setError('Failed to fetch articles.');
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles();
    }, []);

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => 
            (prevIndex - 3 + articles.length) % articles.length
        );
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => 
            (prevIndex + 3) % articles.length
        );
    };

    if (error) {
        return (
            <div style={{ textAlign: 'left', marginTop: '40px', fontSize: '18px', color: '#d9534f', padding: '0 20px' }}>
                {error}
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '18px', color: '#333', padding: '0 20px' }}>
                Loading articles...
            </div>
        );
    }

    // Get the current set of visible articles
    const visibleArticles = articles.slice(currentIndex, currentIndex + 3);

    return (
        <div className="carouselContainer">
            <button className="navButton" onClick={handlePrevClick}>
                <ChevronLeftIcon className="navIcon" />
            </button>
            <div className="carousel">
                {visibleArticles.map((article, index) => (
                    <div
                        key={article.article_id}
                        className={`carouselItem ${index === currentIndex ? 'active' : ''}`}
                    >
                        <a href={article.link} className="articleLink">
                            <img src={article.image_url} alt={article.title} className="image" />
                            <div className="textContainer">
                                <h3 className="title">{article.title}</h3>
                                <p className="description">{article.description}</p>
                                <p className="source">Source: {article.source_id}</p>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
            <button className="navButton" onClick={handleNextClick}>
                <ChevronRightIcon className="navIcon" />
            </button>
        </div>
    );
};

export default NewsCarousel;
