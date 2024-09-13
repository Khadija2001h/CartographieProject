import React, { useState } from 'react';
import { Button } from '@mui/material';
import { EntreprisesFilters, Filters } from './EntreprisesFilters';
import Map from './Map';
import EntreprisesAffichage from './Entreprises_Affichage';
import Link from 'next/link';
import Image from 'next/image';
import SupportModal from '../SupportModal'; // Assurez-vous que le chemin est correct
import Profile from './Profile'; // Import du Profile
import ProfileMenu from './ProfileMenu'; // Import du ProfileMenu
import NewsCarousel from '../NewsCarousel'; // Import du composant NewsCarousel
import Footer from '../Footer'; // Import du composant Footer
import AuthGuard from '@/components/auth/auth-guard';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


function Home() {
  const [filters, setFilters] = useState<Filters>({
    ville: '',
    formeJuridiqueNom: '',
    secteurNom: '',
    denomination: '',
  });

  const [view, setView] = useState<'navbar' | 'maps' | 'societes' | 'profile'>('navbar');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleProfileClick = () => {
    setView('profile');
  };

  const handleBackClick = () => {
    setView('navbar');
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const Navbar = () => (
    <nav>
      <ul
        style={{
          display: 'flex',
          listStyleType: 'none',
          justifyContent: 'space-between', // Change to space-between
          padding: '10px 20px',
          alignItems: 'center',
        }}
      >
        <li style={{ flexShrink: 0 }}>
          <Link href="/ui/user" style={{ display: 'inline-block' }}>
            <Image
              src="/assets/icone_logo.svg"
              alt="Logo"
              width={100}
              height={60}
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </li>
        <li style={{ fontSize: '16px', margin: '0 10px' }}>
          <button
            onClick={openModal}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Support
          </button>
        </li>
        <li style={{ fontSize: '16px', margin: '0 10px' }}>
          <Button
            onClick={() => setView('maps')}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Maps
          </Button>
        </li>
        <li style={{ fontSize: '16px', margin: '0 10px' }}>
          <Button
            onClick={() => setView('societes')}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Sociétés
          </Button>
        </li>
        <li style={{ flexShrink: 0 }}>
          <ProfileMenu onProfileClick={handleProfileClick} />
        </li>
      </ul>

      <SupportModal open={isModalOpen} onClose={closeModal} />
    </nav>
  );

  return (
    <AuthGuard>
      <div>
        <Navbar />

        {view !== 'maps' && view !== 'societes' &&  view !== 'profile'  &&(
          <div style={{ position: 'relative', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* Blurred Background */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url("/assets/istockphoto-624031578-612x612.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(8px)',
                zIndex: 1,
              }}
            ></div>

            {/* Clear Content on top of blur */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                color: 'white',
                textAlign: 'center',
                padding: '20px',
              }}
            >
              <h2 style={{ fontSize: '30px', marginBottom: '15px' }}>
                Êtes-vous certain de connaître les meilleures zones géographiques pour implanter votre entreprise au Maroc ?
              </h2>
              <p style={{ fontSize: '20px', marginBottom: '20px' }}>
                Découvrez les zones idéales pour maximiser le succès de votre entreprise.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setView('maps')}
                  style={{ backgroundColor: '#004085', padding: '12px 24px', fontSize: '18px' }}
                >
                  Voir la carte
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setView('societes')}
                  style={{ backgroundColor: '#FFC107', color: '#000', padding: '12px 24px', fontSize: '18px' }}
                >
                  Voir les entreprises
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Only show this section if view is not maps or societes */}
        {view !== 'maps' && view !== 'societes' &&  view !== 'profile' &&(
          <div style={{ textAlign: 'center', padding: '150px 20px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>Actualités</h2>
            <NewsCarousel />
          </div>
        )}

        {/* Show Map or Sociétés view */}
        {view === 'maps' && (
          <div>
            <EntreprisesFilters onFilterChange={handleFilterChange} />
            <Map filters={filters} />
            <div style={{ textAlign: 'right', padding: '10px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBackClick}
                style={{ backgroundColor: '#004085' }}
              >
                Retour
              </Button>
            </div>
          </div>
        )}
        {view === 'societes' && (
          <div>
            <EntreprisesFilters onFilterChange={handleFilterChange} />
            <EntreprisesAffichage filters={filters} />
            <div style={{ textAlign: 'right', padding: '10px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBackClick}
                style={{ backgroundColor: '#004085' }}
              >
                Retour
              </Button>
            </div>
          </div>
        )}
        {view === 'profile' && (
          <div>
            <Profile/>
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <Button
                variant="contained"
                startIcon={<ArrowBackIosNewIcon />}
                onClick={handleBackClick}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#007bff',
                  border: '1px solid #007bff',
                  marginTop: '-100px',
                }}
              >
                Retour
              </Button>
            </div>
          </div>
        )}

        {/* Ajout du Footer */}
        <Footer />
      </div>
    </AuthGuard>
  );
}

export default Home;
