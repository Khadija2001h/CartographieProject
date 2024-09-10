import React, { useState } from 'react';
import { EntreprisesFilters, Filters } from './EntreprisesFilters';
import Map from './Map';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import EntreprisesAffichage from './Entreprises_Affichage'; 

const Home: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    ville: '',
    formeJuridiqueNom: '',
    secteurNom: '',
    denomination: '',
  });

  const [view, setView] = useState<'maps' | 'societes'>('maps');

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div>
       <nav className="navbar">
        <ul>
          <li>
            <Link to="#" onClick={() => setView('maps')}>Maps</Link>
          </li>
          <li>
            <Link to="#" onClick={() => setView('societes')}>Sociétés</Link>
          </li>
        </ul>
      </nav>


      {view === 'maps' ? (
        <>
          <EntreprisesFilters onFilterChange={handleFilterChange} />
          <Map filters={filters} />
        </>
      ) : (
        <>
        <EntreprisesFilters onFilterChange={handleFilterChange} />
        <EntreprisesAffichage filters={filters} />
        </>
        
      )}
    </div>
  );
};

export default Home;