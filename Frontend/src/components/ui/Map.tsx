import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet.heat'; // Importation du plugin heatmap
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

// Composant pour gérer le zoom et capturer le niveau de zoom
const ZoomHandler: React.FC<{ setZoomLevel: (zoom: number) => void }> = ({ setZoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    const handleZoomEnd = () => {
      setZoomLevel(map.getZoom());
    };

    map.on('zoomend', handleZoomEnd);

    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map, setZoomLevel]);

  return null;
};

const ZoomToCity: React.FC<{ city: string, enterprises: Enterprise[] }> = ({ city, enterprises }) => {
  const map = useMap();

  useEffect(() => {
    // Chercher une entreprise dans la ville spécifiée
    const cityEnterprise = enterprises.find(e => e.latitude !== null && e.longitude !== null && e.denomination.toLowerCase().includes(city.toLowerCase()));
    
    if (cityEnterprise) {
      // Centrer la carte sur l'entreprise trouvée
      map.setView([cityEnterprise.latitude!, cityEnterprise.longitude!], 13); // Zoom à 13
    }
  }, [city, enterprises, map]);

  return null;
};

const HeatmapLayer: React.FC<{ enterprises: Enterprise[] }> = ({ enterprises }) => {
  const map = useMap();

  useEffect(() => {
    if (enterprises.length > 0) {
      const heatmapPoints = enterprises
        .filter((enterprise) => enterprise.latitude !== null && enterprise.longitude !== null)
        .map((enterprise) => [enterprise.latitude!, enterprise.longitude!, 1]);

      // Effacer les anciennes couches heatmap si nécessaire
      map.eachLayer(layer => {
        if (layer instanceof (L as any).HeatLayer) {
          map.removeLayer(layer);
        }
      });

      // Ajouter une nouvelle heatmap pour les entreprises filtrées
      const heatLayer = (L as any).heatLayer(heatmapPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 12,
        max: 1.0,
        minOpacity: 0.5,
        gradient: {
          0.1: 'blue',
          0.4: 'lime',
          0.7: 'yellow',
          1.0: 'red'
        }
      });

      heatLayer.addTo(map);
    }
  }, [enterprises, map]);

  return null;
};

const Map: React.FC<{ filters: Filters }> = ({ filters }) => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [detailedMessageId, setDetailedMessageId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(10);
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
        <HeatmapLayer enterprises={enterprises} />
        <ZoomHandler setZoomLevel={setZoomLevel} />
        {zoomLevel >= 12 && enterprises.map((enterprise) => (
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
            radius={100}
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
