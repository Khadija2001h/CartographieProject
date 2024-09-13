import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, IconButton, Box, Grid, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import FaxIcon from '@mui/icons-material/Print';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import WebIcon from '@mui/icons-material/Language';
import GroupIcon from '@mui/icons-material/Group';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NumbersIcon from '@mui/icons-material/Numbers';
import MapIcon from '@mui/icons-material/Map';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './styles.css'; // Importez le fichier CSS personnalisé

// Initialiser l'icône par défaut de Leaflet pour éviter l'erreur 404
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface SecteurDactivite {
  id: string;
  nom: string;
}

interface FormeJuridique {
  id: string;
  nom: string;
}

interface Telephone {
  numero: string;
}

interface Fax {
  numero: string;
}

interface Gerant {
  nom: string;
  prenom: string;
}

interface HistoriqueDentreprise {
  id: string;
  attributModifie: string;
  ancienneValeur: string;
  nouvelleValeur: string;
  dateModification: string;
}

interface Entreprise {
  id: string;
  denomination: string;
  capitalSocial?: number;
  ice?: number;
  identifiantFiscal?: number;
  numRegistreCommerce?: number;
  numPatente?: number;
  numAffiliationCnss?: number;
  adresse: string;
  ville?: string;
  mail: string;
  siteWeb: string;
  nombreEmployes: number;
  latitude?: string;
  longitude?: string;
  dateCreation?: string;
  logo?: string;
  dateCessationActivite?: string;
  secteurDactivite?: SecteurDactivite;
  formeJuridique?: FormeJuridique;
  telephones: Telephone[];
  faxes: Fax[];
  gerants: Gerant[];
  historiqueDentreprise?: HistoriqueDentreprise[];
}

export function EntrepriseDetails(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entreprise, setEntreprise] = React.useState<Entreprise | null>(null);
  const [showMap, setShowMap] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [selectedAttribute, setSelectedAttribute] = React.useState<string | null>(null);
  const mapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fetchEntrepriseDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const entrepriseResponse = await axios.get(`http://localhost:9192/api/entreprises/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },

        });

        setEntreprise(entrepriseResponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'entreprise", error);
      }
    };

    fetchEntrepriseDetails();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Navigate back
  };

  const handleShowMap = () => {
    setShowMap(true);
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleHistory = () => {
    setShowHistory(!showHistory);
    setSelectedAttribute(null); // Réinitialiser l'attribut sélectionné lorsque l'historique est masqué
  };

  const handleSelectAttribute = (attribute: string) => {
    setSelectedAttribute(attribute === selectedAttribute ? null : attribute);
  };

  if (!entreprise) {
    return <div>Chargement...</div>;
  }

  const renderAttribute = (icon: React.ReactNode, label: string, value: React.ReactNode) => {
    return (
      value && (
        <Box display="flex" alignItems="center" mt={1} mb={1}>
          {icon}
          <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold', color: 'grey.700', fontSize: '0.875rem' }}>
            {label}:
          </Typography>
          <Typography variant="body2" sx={{ ml: 1, fontSize: '0.875rem' }}>
            {value}
          </Typography>
        </Box>
      )
    );
  };

  const defaultLogo = '/assets/logo_par_default.png'; // Chemin de l'image par défaut

  const attributes = [
    { icon: <BusinessIcon />, label: "Activité", value: entreprise.secteurDactivite?.nom },
    { icon: <LocationOnIcon />, label: "Adresse", value: entreprise.ville ? `${entreprise.adresse}, ${entreprise.ville}` : entreprise.adresse },
    { icon: <BusinessIcon />, label: "Forme juridique", value: entreprise.formeJuridique?.nom },
    { icon: <PhoneIcon />, label: "Téléphone(s)", value: entreprise.telephones.map(tel => tel.numero).join(', ') },
    { icon: <FaxIcon />, label: "Fax", value: entreprise.faxes.map(fax => fax.numero).join(', ') },
    { icon: <PersonIcon />, label: "Gérant(s)", value: entreprise.gerants.map(gerant => `${gerant.nom} ${gerant.prenom}`).join(', ') },
    { icon: <MailIcon />, label: "Email", value: entreprise.mail },
    { icon: <WebIcon />, label: "Site Web", value: entreprise.siteWeb ? <a href={entreprise.siteWeb}>{entreprise.siteWeb}</a> : null },
    { icon: <GroupIcon />, label: "Nombre d'employés", value: entreprise.nombreEmployes },
    { icon: <MonetizationOnIcon />, label: "Capital Social", value: entreprise.capitalSocial },
    { icon: <NumbersIcon />, label: "ICE", value: entreprise.ice },
    { icon: <NumbersIcon />, label: "Identifiant Fiscal", value: entreprise.identifiantFiscal },
    { icon: <NumbersIcon />, label: "Numéro de Registre de Commerce", value: entreprise.numRegistreCommerce },
    { icon: <NumbersIcon />, label: "Numéro de Patente", value: entreprise.numPatente },
    { icon: <NumbersIcon />, label: "Numéro d'Affiliation CNSS", value: entreprise.numAffiliationCnss },
    { icon: null, label: "Date de Création", value: entreprise.dateCreation ? new Date(entreprise.dateCreation).toDateString() : undefined },
    { icon: null, label: "Date de Cessation d'Activité", value: entreprise.dateCessationActivite ? new Date(entreprise.dateCessationActivite).toDateString() : undefined }
  ].filter(attr => attr.value); // Filtrer les attributs avec des valeurs nulles ou undefined

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item>
            <Box border={1} padding={1} style={{ borderColor: '#c4c4c4', borderRadius: '4px' }}>
              <img
                 src={entreprise.logo ? `data:image/jpeg;base64,${entreprise.logo}` : defaultLogo}
                  alt="Logo de l'entreprise"
                style={{ maxHeight: '100px', maxWidth: '100px' }}
                onError={(e) => e.currentTarget.src = defaultLogo}
              />
            </Box>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {entreprise.denomination}
            </Typography>
            <Grid container spacing={1}>
              {attributes.map((attr, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  {renderAttribute(attr.icon, attr.label, attr.value)}
                </Grid>
              ))}
            </Grid>
          </Grid>
          {entreprise.latitude && entreprise.longitude && (
            <Grid item>
              <IconButton color="primary" onClick={handleShowMap} sx={{ mt: 1 }}>
                <MapIcon sx={{ fontSize: '2rem' }} />
              </IconButton>
            </Grid>
          )}
        </Grid>
        {showMap && entreprise.latitude && entreprise.longitude && (
          <Box
            mt={1}
            border={1}
            padding={1}
            style={{ borderColor: '#c4c4c4', borderRadius: '4px', display: 'flex', justifyContent: 'center' }}
            ref={mapRef}
          >
            <Box style={{ width: '70%' }}>
              <MapContainer
                center={[parseFloat(entreprise.latitude), parseFloat(entreprise.longitude)]}
                zoom={13}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[parseFloat(entreprise.latitude), parseFloat(entreprise.longitude)]}>
                  <Popup>
                    {entreprise.denomination}
                  </Popup>
                </Marker>
              </MapContainer>
            </Box>
          </Box>
        )}
        <Button variant="contained" color="primary" onClick={handleBack} startIcon={<ArrowBackIcon />} sx={{ mt: 1 }}>
          Retour
        </Button>
        {entreprise.historiqueDentreprise && entreprise.historiqueDentreprise.length > 0 && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleToggleHistory}
            sx={{ mt: 1, ml: 1 }}
          >
            {showHistory ? 'Masquer l\'historique' : 'Afficher l\'historique'}
          </Button>
        )}
        {showHistory && entreprise.historiqueDentreprise && entreprise.historiqueDentreprise.length > 0 && (
          <Box mt={1}>
            <Typography variant="h6" gutterBottom>
              Historique de l'entreprise
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {Array.from(new Set(entreprise.historiqueDentreprise.map(h => h.attributModifie))).map((attribute, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  color={selectedAttribute === attribute ? "primary" : "inherit"}
                  onClick={() => handleSelectAttribute(attribute)}
                >
                  {attribute}
                </Button>
              ))}
            </Box>
            {selectedAttribute && (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Ancienne valeur</th>
                    <th>Nouvelle valeur</th>
                    <th>Date de modification</th>
                  </tr>
                </thead>
                <tbody>
                  {entreprise.historiqueDentreprise
                    .filter(historique => historique.attributModifie === selectedAttribute)
                    .map((historique, index) => (
                      <tr key={index}>
                        <td>{historique.ancienneValeur}</td>
                        <td>{historique.nouvelleValeur}</td>
                        <td>{new Date(historique.dateModification).toLocaleDateString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
