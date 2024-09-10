import React, { useState, useEffect, useCallback } from 'react';
import { Button, Grid, TextField, Box, Typography, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

interface EntrepriseDetailsProps {
  onBackClick: () => void;
  selectedEntrepriseId: string | null;
}

interface Telephone {
  numero: string;
}

interface Fax {
  numero: string;
}

interface Gerant {
  id: number;
  nom: string;
  prenom: string;
}

interface FormData {
  denomination: string;
  capitalSocial: string;
  ice: string;
  identifiantFiscal: string;
  numRegistreCommerce: string;
  numPatente: string;
  numAffiliationCnss: string;
  adresse: string;
  ville: string;
  mail: string;
  siteWeb: string;
  nombreEmployes: string;
  latitude: string;
  longitude: string;
  dateCreation: string;
  dateCessationActivite: string;
  telephones: Telephone[];
  faxes: Fax[];
  gerants: Gerant[];
  secteurDactivite: string;
  formeJuridique: string;
  logoUrl: string;
  logo: File | null;
}

type FormField = keyof FormData;

export function EntrepriseDetails({ onBackClick, selectedEntrepriseId }: EntrepriseDetailsProps): React.JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    denomination: '',
    capitalSocial: '',
    ice: '',
    identifiantFiscal: '',
    numRegistreCommerce: '',
    numPatente: '',
    numAffiliationCnss: '',
    adresse: '',
    ville: '',
    mail: '',
    siteWeb: '',
    nombreEmployes: '',
    latitude: '',
    longitude: '',
    dateCreation: '',
    dateCessationActivite: '',
    telephones: [{ numero: '' }],
    faxes: [{ numero: '' }],
    gerants: [{ id: 1, nom: '', prenom: '' }],
    secteurDactivite: '',
    formeJuridique: '',
    logoUrl: '',
    logo: null,
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [secteursDactivite, setSecteursDactivite] = useState<{ id: string; nom: string }[]>([]);
  const [formesJuridiques, setFormesJuridiques] = useState<{ id: string; nom: string }[]>([]);
  const [fieldsToAdd, setFieldsToAdd] = useState<Partial<Record<FormField, boolean>>>({});

  useEffect(() => {
    const fetchEntrepriseDetails = async () => {
      if (selectedEntrepriseId) {
        try {
          const token = localStorage.getItem('authToken');

          const response = await fetch(`http://localhost:9192/api/entreprises/${selectedEntrepriseId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
  
          });
          if (!response.ok) {
            throw new Error('Failed to fetch entreprise details');
          }
          const data = await response.json();

          const formattedData = {
            ...data,
            secteurDactivite: data.secteurDactivite?.id || '',
            formeJuridique: data.formeJuridique?.id || '',
            dateCreation: data.dateCreation ? new Date(data.dateCreation).toISOString().split('T')[0] : '',
            dateCessationActivite: data.dateCessationActivite ? new Date(data.dateCessationActivite).toISOString().split('T')[0] : '',
          };

          setFormData(formattedData);
          setLogoPreview(data.logo ? `data:image/png;base64,${data.logo}` : null);
        } catch (error) {
          console.error('Error fetching entreprise details:', error);
        }
      }
    };

    const fetchSelectData = async () => {
      try {        const token = localStorage.getItem('authToken');

        const [secteursResponse, formesResponse] = await Promise.all([
          fetch('http://localhost:9192/api/secteursDactivite', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajout du token dans les en-têtes
            },
        }),
        fetch('http://localhost:9192/api/formesJuridiques', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajout du token dans les en-têtes
            },
        })
        ]);

        if (!secteursResponse.ok || !formesResponse.ok) {
          throw new Error('Failed to fetch select data');
        }

        const secteursData = await secteursResponse.json();
        const formesData = await formesResponse.json();

        setSecteursDactivite(secteursData.map((secteur: any) => ({ id: secteur.id, nom: secteur.nom })));
        setFormesJuridiques(formesData.map((forme: any) => ({ id: forme.id, nom: forme.nom })));
      } catch (error) {
        console.error('Error fetching select data:', error);
      }
    };

    fetchEntrepriseDetails();
    fetchSelectData();
  }, [selectedEntrepriseId]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback(
    (name: FormField) => (event: SelectChangeEvent<string>) => {
      setFormData((prev) => ({ ...prev, [name]: event.target.value }));
    },
    []
  );

  const handleArrayChange = useCallback(
    (field: FormField, index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedArray = [...(formData[field] as any)];
      updatedArray[index].numero = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: updatedArray }));
    },
    [formData]
  );

 const handleAddItem = useCallback((field: FormField) => {
  setFormData((prev) => {
// Vérification si prev[field] est un tableau de type Gerant[]
const newId = Array.isArray(prev[field]) && prev[field].every(item => typeof item === 'object' && 'id' in item)
    ? prev[field].length + 1
    : 1;
    const newItem = { id: newId, numero: '' }; // Assurez-vous d'ajouter un id
    return {
      ...prev,
      [field]: [...(prev[field] as any), newItem],
    };
  });
}, []);


  const handleRemoveItem = useCallback((field: FormField, index: number) => () => {
    setFormData((prev) => {
      const updatedArray = [...(prev[field] as any)];
      updatedArray.splice(index, 1);
      return { ...prev, [field]: updatedArray };
    });
  }, []);

  const handleGerantChange = useCallback(
    (index: number, field: keyof Gerant) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedGerants = [...formData.gerants];
      updatedGerants[index][field] = e.target.value;
      setFormData((prev) => ({ ...prev, gerants: updatedGerants }));
    },
    [formData.gerants]
  );

  const handleAddGerant = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      gerants: [...prev.gerants, { id: prev.gerants.length + 1, nom: '', prenom: '' }],
    }));
  }, []);

  const handleRemoveGerant = useCallback((index: number) => () => {
    setFormData((prev) => {
      const updatedGerants = [...prev.gerants];
      updatedGerants.splice(index, 1);
      return { ...prev, gerants: updatedGerants };
    });
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, logo: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  }, []);

  const handleAddField = (field: FormField) => {
    setFieldsToAdd((prev) => ({ ...prev, [field]: true }));
  };

  const handleRemoveField = (field: FormField) => {
    setFormData((prev) => ({ ...prev, [field]: '' }));
    setFieldsToAdd((prev) => ({ ...prev, [field]: false }));
  };

  const handleEdit = async () => {
    try {
        if (isNaN(parseFloat(formData.capitalSocial))) {
            throw new Error('Le champ Capital Social doit être un nombre valide.');
        }

        const formDataToSend = new FormData();

        Object.keys(formData).forEach((key) => {
            const typedKey = key as FormField;
            const value = formData[typedKey];

            // Exclude the 'historiqueDentreprise' field if it exists in the form data
            if (
                value === null || 
                value === '' || 
                (Array.isArray(value) && value.length === 0) || 
                key === 'historiqueDentreprise' // Check the string key directly
            ) {
                return;
            }

            if (typedKey === 'logo' && value) {
                if (value instanceof File) {
                    formDataToSend.append(typedKey, value);
                } else {
                    formDataToSend.append(typedKey, new Blob([value.toString()], { type: 'text/plain' }));
                }
            } else if (Array.isArray(value)) {
                formDataToSend.append(typedKey, JSON.stringify(value));
            } else if (typedKey === 'dateCreation' || typedKey === 'dateCessationActivite') {
                if (typeof value === 'string') {
                    const date = new Date(value);
                    const formattedDate = date.toISOString().split('T')[0];
                    formDataToSend.append(typedKey, formattedDate);
                }
            } else if (typeof value === 'string' || typeof value === 'number') {
                formDataToSend.append(typedKey, value.toString());
            }
        });
        const token = localStorage.getItem('authToken');

        const response = await fetch(`http://localhost:9192/api/entreprises/${selectedEntrepriseId}`, {
            method: 'PATCH',
            body: formDataToSend,
          
              headers: {
                'Authorization': `Bearer ${token}`,
              },
    
        });

        const responseData = await response.text();
        console.log('Server response:', responseData);
        if (!response.ok) {
            throw new Error(`Failed to update entreprise: ${responseData}`);
        }

        alert('Entreprise mise à jour avec succès!');
    } catch (error) {
        console.error('Error details:', error);
        if (error instanceof Error) {
            alert(`Erreur lors de la mise à jour de l'entreprise: ${error.message}`);
        } else {
            alert(`Une erreur inattendue est survenue`);
        }
    }
};




  const renderFormField = (field: FormField, label: string, type: string = 'text', multiline: boolean = false) => {
    return fieldsToAdd[field] || formData[field] ? (
      <Box>
        <TextField
          label={label}
          name={field}
          value={formData[field] as string}
          onChange={handleChange}
          type={type}
          multiline={multiline}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Button onClick={() => handleRemoveField(field)}>Supprimer</Button>
      </Box>
    ) : (
      <Button onClick={() => handleAddField(field)}>Ajouter {label}</Button>
    );
  };

  return (
 
    <Box p={2}>
     
      <Typography variant="h4">Modifier l'entreprise</Typography>
      <form onSubmit={handleEdit}>
  
      <Box display="flex" flexDirection="column" alignItems="center">
        {/* Section du logo */}
          {logoPreview && (
          <Box mb={2}>
           <img src={logoPreview} alt="Logo" style={{ maxHeight: '150px', maxWidth: '150px' }} />
          </Box>
          )}
        <Button variant="contained" component="label">
          {logoPreview ? 'Modifier le logo' : 'Ajouter un logo'}
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
      </Box>
{/* */}
            {/* Sélection du Secteur d'activité */}
<Box mt={3} mb={2}>
  <Typography variant="h6">Secteur d'activité</Typography>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <Select
        fullWidth
        value={formData.secteurDactivite}
        onChange={handleSelectChange('secteurDactivite')}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Sélectionner un secteur d'activité
        </MenuItem>
        {secteursDactivite.map((secteur) => (
          <MenuItem key={secteur.id} value={secteur.id}>
            {secteur.nom}
          </MenuItem>
        ))}
      </Select>
    </Grid>

    {/* Affichage du Secteur d'activité sélectionné */}
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Secteur d'activité"
        value={secteursDactivite.find((secteur) => secteur.id === formData.secteurDactivite)?.nom || ''}
        InputProps={{
          readOnly: true,
        }}
      />
    </Grid>
  </Grid>
</Box>

<Box mt={3} mb={2}>
  <Typography variant="h6">Forme juridique</Typography>
  <Grid container spacing={2}>
    {/* Sélection de la Forme juridique */}
    <Grid item xs={12} sm={6}>
      <Select
        fullWidth
        value={formData.formeJuridique}
        onChange={handleSelectChange('formeJuridique')}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Sélectionner une forme juridique
        </MenuItem>
        {formesJuridiques.map((forme) => (
          <MenuItem key={forme.id} value={forme.id}>
            {forme.nom}
          </MenuItem>
        ))}
      </Select>
    </Grid>

    {/* Affichage de la Forme juridique sélectionnée */}
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Forme juridique"
        value={formesJuridiques.find((forme) => forme.id === formData.formeJuridique)?.nom || ''}
        InputProps={{
          readOnly: true,
        }}
      />
    </Grid>
  </Grid>
</Box>



        {renderFormField('denomination', 'Dénomination')}
        {renderFormField('capitalSocial', 'Capital Social', 'number')}
        {renderFormField('ice', 'ICE')}
        {renderFormField('identifiantFiscal', 'Identifiant Fiscal')}
        {renderFormField('numRegistreCommerce', 'Numéro Registre Commerce')}
        {renderFormField('numPatente', 'Numéro de Patente')}
        {renderFormField('numAffiliationCnss', 'Numéro Affiliation CNSS')}
        {renderFormField('adresse', 'Adresse', 'text', true)}
        {renderFormField('ville', 'Ville')}
        {renderFormField('mail', 'Mail', 'email')}
        {renderFormField('siteWeb', 'Site Web')}
        {renderFormField('nombreEmployes', 'Nombre d\'Employés', 'number')}
        {renderFormField('latitude', 'Latitude', 'number')}
        {renderFormField('longitude', 'Longitude', 'number')}
        {renderFormField('dateCreation', 'Date de Création', 'date')}
        {renderFormField('dateCessationActivite', 'Date de Cessation d\'Activité', 'date')}

        {fieldsToAdd.telephones || formData.telephones.length ? (
          <Box>
            <Typography variant="h6">Téléphones</Typography>
            {formData.telephones.map((telephone, index) => (
              <Box key={index} display="flex" alignItems="center">
                <TextField
                  label={`Téléphone ${index + 1}`}
                  value={telephone.numero}
                  onChange={handleArrayChange('telephones', index)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
                <Button onClick={handleRemoveItem('telephones', index)}>
                  Supprimer
                </Button>
              </Box>
            ))}
            <Button onClick={() => handleAddItem('telephones')}>Ajouter un téléphone</Button>
          </Box>
        ) : (
          <Button onClick={() => handleAddField('telephones')}>Ajouter Téléphones</Button>
        )}

        {fieldsToAdd.faxes || formData.faxes.length ? (
          <Box>
            <Typography variant="h6">Faxes</Typography>
            {formData.faxes.map((fax, index) => (
              <Box key={index} display="flex" alignItems="center">
                <TextField
                  label={`Fax ${index + 1}`}
                  value={fax.numero}
                  onChange={handleArrayChange('faxes', index)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
                <Button onClick={handleRemoveItem('faxes', index)}>
                  Supprimer
                </Button>
              </Box>
            ))}
            <Button onClick={() => handleAddItem('faxes')}>Ajouter un fax</Button>
          </Box>
        ) : (
          <Button onClick={() => handleAddField('faxes')}>Ajouter Faxes</Button>
        )}

        {fieldsToAdd.gerants || formData.gerants.length ? (
          <Box>
            <Typography variant="h6">Gérants</Typography>
            {formData.gerants.map((gerant, index) => (
              <Box key={index} display="flex" alignItems="center">
                <TextField
                  label={`Nom Gérant ${index + 1}`}
                  value={gerant.nom}
                  onChange={handleGerantChange(index, 'nom')}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  label={`Prénom Gérant ${index + 1}`}
                  value={gerant.prenom}
                  onChange={handleGerantChange(index, 'prenom')}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
                <Button onClick={handleRemoveGerant(index)}>
                  Supprimer
                </Button>
              </Box>
            ))}
            <Button onClick={handleAddGerant}>Ajouter un gérant</Button>
          </Box>
        ) : (
          <Button onClick={() => handleAddField('gerants')}>Ajouter Gérants</Button>
        )}

        
<Box mt={3} display="flex" justifyContent="space-around">
  <Button
    variant="contained"
    color="primary"
    startIcon={<SaveIcon />}
    onClick={handleEdit}
  >
    Enregistrer
  </Button>
  <Button variant="contained" color="primary" onClick={onBackClick}>
    Retour
  </Button>
</Box>
      </form>
    </Box>

  );
}