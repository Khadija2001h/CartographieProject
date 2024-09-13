import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { Filters } from './EntreprisesFilters';
import { Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Enterprise {
  id: string;
  denomination: string;
  latitude: number | null;
  longitude: number | null;
  secteurActivite: string;
}

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const ZoomToCity: React.FC<{ city: string, enterprises: Enterprise[] }> = ({ city, enterprises }) => {
  const map = useMap();

  useEffect(() => {
    const cityEnterprise = enterprises.find(e => e.denomination === city && e.latitude !== null && e.longitude !== null);
    if (cityEnterprise) {
      map.setView([cityEnterprise.latitude!, cityEnterprise.longitude!], 13);
    }
  }, [city, enterprises, map]);

  return null;
};

const Map: React.FC<{ filters: Filters }> = ({ filters }) => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [detailedMessageId, setDetailedMessageId] = useState<string | null>(null);
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
          
          headers: {
            'Authorization': `Bearer ${token}`,
          },

        });


        if (Array.isArray(response.data)) {
          const validEnterprises = response.data.filter((e: Enterprise) => e.latitude !== null && e.longitude !== null);
          
          const enterprisesWithSecteur = validEnterprises.map((e: any) => ({
            ...e,
            secteurActivite: e.secteurDactivite?.nom || 'N/A',
          }));
          
          setEnterprises(enterprisesWithSecteur);

          if (validEnterprises.length === 0) {
            setErrorMessage('Aucune entreprise trouvée avec ces filtres.');
          } else {
            setErrorMessage('');
          }
        } else {
          setErrorMessage('Aucune entreprise trouvée avec ces filtres.');
          setEnterprises([]);
        }
      } catch (error) {
        console.error('Error fetching enterprises', error);
        setErrorMessage('Erreur lors de la récupération des entreprises.');
        setEnterprises([]);
      }
    };

    fetchEnterprises();
  }, [filters]);

  const handleDoubleClick = (id: string) => {
    navigate(`/entreprises/${id}`);
  };

  const handleClick = (id: string) => {
    setDetailedMessageId(detailedMessageId === id ? null : id);
  };

  return (
    <Box>
      {errorMessage && <Alert severity="warning">{errorMessage}</Alert>}
      <MapContainer center={[33.5731, -7.5898]} zoom={10} style={{ height: '600px', width: '100%', borderRadius: '3%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
        />
        {filters.ville && <ZoomToCity city={filters.ville} enterprises={enterprises} />}
        {enterprises.map((enterprise) => (
          <Marker
            key={enterprise.id}
            position={[enterprise.latitude!, enterprise.longitude!]}
            icon={markerIcon}
            eventHandlers={{
              dblclick: () => handleDoubleClick(enterprise.id),
            }}
          >
            <Popup>
              <div>
                <strong>{enterprise.denomination}</strong>
                <br />
                Secteur d'activité: <span style={{ color: 'red' }}>{enterprise.secteurActivite}</span>
                <br />
                <span style={{ color: 'gray', fontSize: '10px', opacity: 0.7, textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Double clique pour plus de détails</span>
              </div>
            </Popup>
          </Marker>
        ))}
        {enterprises.map((enterprise) => (
          <Circle
            key={enterprise.id}
            center={[enterprise.latitude!, enterprise.longitude!]}
            radius={2500} // 100 meters
            pathOptions={{ color: 'darkred' }}
          >
            <Popup>
              <div
                style={{
                  color: 'darkred',
                  backgroundColor: '#ffcccc',
                  padding: '10px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
                onClick={() => handleClick(enterprise.id)}
              >
                {detailedMessageId === enterprise.id
                  ? `Nous ne conseillons pas d'investir dans cette zone si vous avez le même secteur d'activité que cette entreprise (${enterprise.secteurActivite}).`
                  : "Nous ne conseillons pas d'investir dans cette zone"}
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </Box>
  );
};

export default Map;
