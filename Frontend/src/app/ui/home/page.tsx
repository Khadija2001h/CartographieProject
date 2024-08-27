'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Chatbot from '../../../components/chatbot';
import AboutUs from '../../../components/AboutUs';
import NewsCarousel from '../../../components/NewsCarousel';
import Footer from '../../../components/Footer';
import '../../../styles/global.css';
import { Padding } from '@mui/icons-material';
import ReactPlayer from 'react-player';

// Fonction pour obtenir les articles
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

// Composant principal
const Home: React.FC = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [videoSrc, setVideoSrc] = useState<string>('http://localhost:3000/assets/invideo-ai-1080%20D%C3%A9marrer%20une%20entreprise%20au%20Maroc%20avec%20Ch%202024-08-01.mp4');
    const [isYouTube, setIsYouTube] = useState<boolean>(false);
    const [videos, setVideos] = useState([
        { id: 'uA_dn-PefCI', title: 'Conseils pour les affaires 2024', description: 'Comment démarrer une entreprise au Maroc.' },
        { id: 'JzyG4LmKXnc', title: 'Tendances des affaires', description: 'Dernières tendances dans les affaires au Maroc.' },
        { id: 'vmcsXvXdRwo', title: 'Perspectives du marché', description: 'Perspectives du marché pour les entrepreneurs.' },
        { id: 'wvFGvRcnDgg', title: 'Histoires de succès', description: 'Histoires de succès des startups marocaines.' },
        { id: 'H5u20J0wJRU', title: 'Investir au Maroc', description: 'Comment investir sur le marché marocain.' },
        { id: 'o267yT6Hspg', title: 'Démarrer une entreprise', description: 'Conseils pour démarrer une entreprise au Maroc.' },
        { id: '698Ma4I_h90', title: 'Marché marocain', description: 'Comprendre le marché marocain.' },
        { id: 'M3P45tBWcJo', title: 'Croissance des affaires', description: 'Stratégies pour la croissance des affaires au Maroc.' }
    ]);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        fetchArticles().then((data) => {
            setArticles(data.slice(0, 10));
        });
    }, []);

    // Fonction pour changer la vidéo principale
    const handleVideoChange = (videoId: string) => {
        setVideoSrc(`https://www.youtube.com/watch?v=${videoId}`);
        setIsYouTube(true);
    };

    // Fonction pour passer à la page suivante
    const nextPage = () => {
        if ((currentPage + 1) * 4 < videos.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Fonction pour revenir à la page précédente
    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Les vidéos à afficher sur la page actuelle
    const displayedVideos = videos.slice(currentPage * 4, (currentPage + 1) * 4);

    return (
        <div>
            <Navbar />
            <header style={{
                textAlign: 'center',
                padding: '80px 20px 50px',
                marginBottom: '50px'
            }}>
                <h1 style={{
                    fontSize: '40px',
                    fontWeight: 'bold',
                    marginBottom: '20px'
                }}>
                    Charikaty: Localisez et analysez les entreprises au Maroc
                </h1>
                <p style={{ fontSize: '25px', marginBottom: '30px' }}>
                    Découvrez les opportunités d'investissement et les entreprises florissantes au Maroc.
                </p>
                <img src="/assets/image_signin.png" alt="Image Signin" style={{ margin: '20px auto', display: 'block', maxWidth: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button style={{
                        marginRight: '10px',
                        fontSize: '20px',
                        padding: '15px 30px',
                        backgroundColor: '#007cb9',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                        Get started
                    </button>
                    <p style={{ margin: '0 10px' }}>or</p>
                    <Chatbot />
                </div>
            </header>
            <div   id="mediatheque" style={{
    border: '2px solid #00008B',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '80px',
    marginLeft: '50px',
    marginRight: '50px',
}}>
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '20px'
        }}>Médiathèque</h2>
    </div>
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{
            color:'#007cb9',
            fontSize: '23px',
            fontWeight: 'bold',
            marginBottom: '20px'
        }}>Charikaty au service de votre business</p>
    </div>
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px',
    }}>
        <div style={{
            flex: '1',
            maxWidth: '60%',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            marginLeft: '30px'
        }}>
            {isYouTube ? (
                <ReactPlayer
                    url={videoSrc}
                    width="100%"
                    height="500px"
                    controls
                />
            ) : (
                <video
                    width="100%"
                    height="500"
                    controls
                    src={videoSrc}
                    style={{ borderRadius: '8px' }}
                ></video>
            )}
        </div>
        <div style={{
            flex: '1',
            maxWidth: '30%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            overflowY: 'auto',
            maxHeight: '500px', // Adjust according to the height of the main video
            marginRight: '40px'
        }}>
            {displayedVideos.map(video => (
                <div
                    key={video.id}
                    onClick={() => handleVideoChange(video.id)}
                    style={{
                        cursor: 'pointer',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        display: 'flex',
                        gap: '10px',
                        backgroundColor: '#f0f0f0',
                        padding: '10px'
                    }}
                >
                    <img
                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} // Use 'mqdefault' for a smaller image size
                        alt={video.title}
                        style={{ width: '180px', height: 'auto', borderRadius: '8px' }} // Adjust width for larger thumbnails
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ margin: '0', fontSize: '16px' }}>{video.title}</h4>
                        <p style={{ margin: '0', color: '#555' }}>{video.description}</p>
                    </div>
                </div>
            ))}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px'
            }}>
                <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    style={{
                        padding: '10px',
                        border: 'none',
                        backgroundColor: '#007cb9',
                        color: 'white',
                        borderRadius: '5px',
                        cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                        width: '100px' // Largeur fixe
                    }}
                >
                    Précédent
                </button>
                <button
                    onClick={nextPage}
                    disabled={(currentPage + 1) * 4 >= videos.length}
                    style={{
                        padding: '10px',
                        border: 'none',
                        backgroundColor: '#007cb9',
                        color: 'white',
                        borderRadius: '5px',
                        cursor: (currentPage + 1) * 4 >= videos.length ? 'not-allowed' : 'pointer',
                        width: '100px' // Largeur fixe
                    }}
                >
                    Suivant
                </button>
            </div>
        </div>
    </div>
</div>

            <div style={{ padding: '20px'}}>
            <p style={{
                                textAlign: 'center',

                        fontSize: '32px',
                        fontWeight: 'bold',
                        marginBottom: '-30px'
                    }}>Actualités</p>
            <NewsCarousel />
            </div>
            <div id="about-us" className="aboutUsContainer">
    <AboutUs />
    <Footer/>
</div>

        </div>
        
    );
};

export default Home;
