import React, { useEffect, useState } from 'react'; // Assurez-vous que useState est bien importé
import axios from 'axios';
import { Card, CardContent, Typography, Box, Grid, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface SecteurDactivite {
  id: string;
  nom: string;
}

interface EntrepriseDTO {
  id: string;
  denomination: string;
  secteurDactivite?: SecteurDactivite;
  adresse?: string;
  logo?: string;
  latitude?: number;
  longitude?: number;
}

export interface Filters {
  ville: string;
  formeJuridiqueNom: string;
  secteurNom: string;
  denomination: string;
}

interface EntreprisesAffichageProps {
  filters: Filters;
}


const EntreprisesAffichage: React.FC<EntreprisesAffichageProps> = ({ filters }) => {
    const [entreprises, setEnterprises] = useState<EntrepriseDTO[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [page, setPage] = useState(1);
    const entreprisesParPage = 10;
  
    // Utilisation de useNavigate pour naviguer entre les pages
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchEnterprises = async () => {
        try {
          const queryParams = new URLSearchParams();
          if (filters.ville) queryParams.append('ville', filters.ville);
          if (filters.formeJuridiqueNom) queryParams.append('formeJuridiqueNom', filters.formeJuridiqueNom);
          if (filters.secteurNom) queryParams.append('secteurNom', filters.secteurNom);
          if (filters.denomination) queryParams.append('denomination', filters.denomination);
          const token = localStorage.getItem('authToken');

          const response = await axios.get(`http://localhost:9192/api/entreprises/filter?${queryParams.toString()}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
  
          });
  
  
          if (Array.isArray(response.data)) {
            const enterprisesWithSecteur = response.data.map((e: EntrepriseDTO) => ({
              ...e,
              secteurActivite: e.secteurDactivite?.nom || 'N/A',
            }));
  
            setEnterprises(enterprisesWithSecteur);
  
            if (enterprisesWithSecteur.length === 0) {
              setErrorMessage('Aucune entreprise trouvée avec ces filtres.');
            } else {
              setErrorMessage('');
            }
          } else {
            setErrorMessage('Aucune entreprise trouvée avec ces filtres.');
            setEnterprises([]);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des entreprises', error);
          setErrorMessage('Erreur lors de la récupération des entreprises.');
          setEnterprises([]);
        }
      };
  
      fetchEnterprises();
    }, [filters]);
  
    const totalPages = Math.ceil(entreprises.length / entreprisesParPage);
    const entreprisesAffichees = entreprises.slice(
      (page - 1) * entreprisesParPage,
      page * entreprisesParPage
    );
  
    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    };
  
    // Gestionnaire de clic pour naviguer vers les détails de l'entreprise
    const handleCardClick = (id: string) => {
      navigate(`/entreprises/${id}`);
    };
  
    return (
      <div>
        {errorMessage && (
          <Box style={{ margin: '16px 15%', color: 'red' }}>
            <Typography variant="body1">{errorMessage}</Typography>
          </Box>
        )}
        {entreprisesAffichees.map((entreprise, index) => (
          <Box key={index} style={{ margin: '16px 15%' }}>
            <Card onClick={() => handleCardClick(entreprise.id)} style={{ cursor: 'pointer' }}>
              <CardContent>
                <Grid container alignItems="center">
                  <Grid item xs={3}>
                    <Box
                      border={1}
                      padding={1}
                      style={{ 
                        borderColor: '#c4c4c4',
                        borderRadius: '4px',
                        textAlign: 'center',
                        maxWidth: '100px',
                        margin: '0 auto'
                      }}
                    >
                      <img
                        src={entreprise.logo ? `data:image/jpeg;base64,${entreprise.logo}` : '/assets/logo_par_default.png'}
                        alt="Logo de l'entreprise"
                        style={{ maxHeight: '100px', maxWidth: '100px' }}
                        onError={(e) => e.currentTarget.src = '/assets/logo_par_default.png'}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="h5">{entreprise.denomination}</Typography>
                    {entreprise.secteurDactivite && (
                      <Typography variant="body2">
                        Secteur d'activité: {entreprise.secteurDactivite.nom}
                      </Typography>
                    )}
                    {entreprise.adresse && (
                      <Typography variant="body2">Adresse: {entreprise.adresse}</Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        ))}
  
        <Box display="flex" justifyContent="center" marginTop={2}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handleChangePage} 
            color="primary"
            sx={{ backgroundColor: '#fff', padding: '8px', borderRadius: '4px' }}
          />
        </Box>
      </div>
    );
  };
  
  export default EntreprisesAffichage;