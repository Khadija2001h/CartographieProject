import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Stack, IconButton,
    Typography, Select, MenuItem, FormControl, InputLabel, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { SelectChangeEvent } from '@mui/material/Select';

interface EntrepriseFormData {
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
    logo: File | null;
    telephones: { numero: string }[];
    faxes: { numero: string }[];
    gerants: { nom: string; prenom: string }[];
    formeJuridiqueId: string;
    secteurId: string;
}

interface FormeJuridique {
    id: string;
    nom: string;
}

interface SecteurActivite {
    id: string;
    nom: string;
}

interface AddEntrepriseProps {
    open: boolean;
    handleClose: () => void;
}

const AddEntreprise: React.FC<AddEntrepriseProps> = ({ open, handleClose }) => {
    const [formData, setFormData] = useState<EntrepriseFormData>({
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
        logo: null,
        telephones: [{ numero: '' }],
        faxes: [{ numero: '' }],
        gerants: [{ nom: '', prenom: '' }],
        formeJuridiqueId: '',
        secteurId: ''
    });

    const [formesJuridiques, setFormesJuridiques] = useState<FormeJuridique[]>([]);
    const [newFormeJuridique, setNewFormeJuridique] = useState<string>('');
    const [secteursActivite, setSecteursActivite] = useState<SecteurActivite[]>([]);
    const [newSecteurActivite, setNewSecteurActivite] = useState<string>('');
    const isDateBeforeCurrent = (date: string): boolean => {
        return new Date(date) < new Date();
    };
    
    useEffect(() => {
        const fetchFormesJuridiques = async () => {
            try {        const token = localStorage.getItem('authToken');

                const response = await axios.get('http://localhost:9192/api/formesJuridiques', {
                    
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    },
          
                  });
          
                setFormesJuridiques(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des formes juridiques', error);
            }
        };
        fetchFormesJuridiques();
    }, []);

    useEffect(() => {
        const fetchSecteursActivite = async () => {
            try {        const token = localStorage.getItem('authToken');

                const response = await axios.get('http://localhost:9192/api/secteursDactivite', {
                    
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    },
          
                  });
          
                setSecteursActivite(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des secteurs d\'activité', error);
            }
        };
        fetchSecteursActivite();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFormData({ ...formData, logo: e.target.files[0] });
        }
    };

    const handleTelephoneChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const telephones = [...formData.telephones];
        telephones[index] = { ...telephones[index], numero: value };
        setFormData({ ...formData, telephones });
    };

    const handleFaxChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const faxes = [...formData.faxes];
        faxes[index] = { ...faxes[index], numero: value };
        setFormData({ ...formData, faxes });
    };

    const handleGerantChange = (index: number, fieldName: 'nom' | 'prenom') => (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const gerants = [...formData.gerants];
        gerants[index] = { ...gerants[index], [fieldName]: value };
        setFormData({ ...formData, gerants });
    };

    const addTelephoneField = () => {
        setFormData({ ...formData, telephones: [...formData.telephones, { numero: '' }] });
    };

    const addFaxField = () => {
        setFormData({ ...formData, faxes: [...formData.faxes, { numero: '' }] });
    };

    const addGerantField = () => {
        setFormData({ ...formData, gerants: [...formData.gerants, { nom: '', prenom: '' }] });
    };

    const removeTelephoneField = (index: number) => {
        const telephones = [...formData.telephones];
        telephones.splice(index, 1);
        setFormData({ ...formData, telephones });
    };

    const removeFaxField = (index: number) => {
        const faxes = [...formData.faxes];
        faxes.splice(index, 1);
        setFormData({ ...formData, faxes });
    };

    const removeGerantField = (index: number) => {
        const gerants = [...formData.gerants];
        gerants.splice(index, 1);
        setFormData({ ...formData, gerants });
    };

    const handleAddFormeJuridique = async () => {
        try {
            const token = localStorage.getItem('authToken');

            const response = await axios.post('http://localhost:9192/api/formesJuridiques', { nom: newFormeJuridique }, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
      
              });
      
            setFormesJuridiques([...formesJuridiques, response.data]);
            setFormData({ ...formData, formeJuridiqueId: response.data.id });
            setNewFormeJuridique('');
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la nouvelle forme juridique', error);
        }
    };

    const handleAddSecteurActivite = async () => {
        try {
            const token = localStorage.getItem('authToken');

            const response = await axios.post('http://localhost:9192/api/secteursDactivite', { nom: newSecteurActivite }, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
      
              });
      
            setSecteursActivite([...secteursActivite, response.data]);
            setFormData({ ...formData, secteurId: response.data.id });
            setNewSecteurActivite('');
        } catch (error) {
            console.error('Erreur lors de l\'ajout du nouveau secteur d\'activité', error);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const { dateCreation, dateCessationActivite } = formData;
    
        // Vérifiez que les dates ne sont pas vides et sont avant la date courante
        if (!dateCreation || !isDateBeforeCurrent(dateCreation)) {
            alert('La date de création doit être avant la date courante.');
            return;
        }
    
        if (dateCessationActivite && !isDateBeforeCurrent(dateCessationActivite)) {
            alert('La date de cessation d\'activité doit être avant la date courante.');
            return;
        }
    
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'logo' && value instanceof File) {
                formDataToSend.append(key, value);
            } else if (key === 'gerants' && Array.isArray(value)) {
                value.forEach((gerant: any) => {
                    formDataToSend.append('gerants', `${gerant.nom} ${gerant.prenom}`);
                });
            } else if (key === 'telephones' && Array.isArray(value)) {
                value.forEach((telephone: any) => {
                    formDataToSend.append('telephones', telephone.numero);
                });
            } else if (key === 'faxes' && Array.isArray(value)) {
                value.forEach((fax: any) => {
                    formDataToSend.append('faxes', fax.numero);
                });
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    formDataToSend.append(`${key}[${index}]`, JSON.stringify(item));
                });
            } else {
                formDataToSend.append(key, value);
            }
        });
    
        try {
            const token = localStorage.getItem('authToken');
    
            const response = await axios.post('http://localhost:9192/api/entreprises/add', formDataToSend, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log(response.data);
            // Afficher un message de succès
            alert('L\'entreprise a été ajoutée avec succès.');
            // Réinitialiser le formulaire
            setFormData({
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
                logo: null,
                telephones: [{ numero: '' }],
                faxes: [{ numero: '' }],
                gerants: [{ nom: '', prenom: '' }],
                formeJuridiqueId: '',
                secteurId: ''
            });
            handleClose(); // Fermer la boîte de dialogue
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'entreprise', error);
            // Afficher un message d'erreur
            alert('Erreur lors de l\'ajout de l\'entreprise. Veuillez réessayer.');
        }
    };
    

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Ajouter une entreprise</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Dénomination"
                            name="denomination"
                            value={formData.denomination}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Capital social"
                            name="capitalSocial"
                            value={formData.capitalSocial}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="ICE"
                            name="ice"
                            value={formData.ice}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Identifiant fiscal"
                            name="identifiantFiscal"
                            value={formData.identifiantFiscal}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Numéro de registre de commerce"
                            name="numRegistreCommerce"
                            value={formData.numRegistreCommerce}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Numéro de patente"
                            name="numPatente"
                            value={formData.numPatente}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Numéro d'affiliation CNSS"
                            name="numAffiliationCnss"
                            value={formData.numAffiliationCnss}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Adresse"
                            name="adresse"
                            value={formData.adresse}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Ville"
                            name="ville"
                            value={formData.ville}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="E-mail"
                            type="email"
                            name="mail"
                            value={formData.mail}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Site web"
                            name="siteWeb"
                            value={formData.siteWeb}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Nombre d'employés"
                            name="nombreEmployes"
                            value={formData.nombreEmployes}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Latitude"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Longitude"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                        />
                      <TextField
    name="dateCreation"
    label="Date de Création"
    type="date"
    value={formData.dateCreation}
    onChange={handleChange}
    InputLabelProps={{
        shrink: true,
    }}
    required
/>
<TextField
    name="dateCessationActivite"
    label="Date de Cessation d'Activité"
    type="date"
    value={formData.dateCessationActivite}
    onChange={handleChange}
    InputLabelProps={{
        shrink: true,
    }}
/>

                        <TextField
                            fullWidth
                            label="Logo"
                            name="logo"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <Box>
                            <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
                                Téléphones
                            </Typography>
                            {formData.telephones.map((telephone, index) => (
                                <Stack direction="row" spacing={2} key={index}>
                                    <TextField
                                        fullWidth
                                        label={`Téléphone ${index + 1}`}
                                        name={`telephone-${index}`}
                                        value={telephone.numero}
                                        onChange={handleTelephoneChange(index)}
                                    />
                                    <IconButton onClick={() => removeTelephoneField(index)} aria-label="Supprimer">
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            ))}
                            <IconButton onClick={addTelephoneField} aria-label="Ajouter">
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Box>
                            <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
                                Faxes
                            </Typography>
                            {formData.faxes.map((fax, index) => (
                                <Stack direction="row" spacing={2} key={index}>
                                    <TextField
                                        fullWidth
                                        label={`Fax ${index + 1}`}
                                        name={`fax-${index}`}
                                        value={fax.numero}
                                        onChange={handleFaxChange(index)}
                                    />
                                    <IconButton onClick={() => removeFaxField(index)} aria-label="Supprimer">
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            ))}
                            <IconButton onClick={addFaxField} aria-label="Ajouter">
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Box>
                            <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
                                Gérants
                            </Typography>
                            {formData.gerants.map((gerant, index) => (
                                <Stack direction="row" spacing={2} key={index}>
                                    <TextField
                                        fullWidth
                                        label={`Nom du gérant ${index + 1}`}
                                        name={`gerant-nom-${index}`}
                                        value={gerant.nom}
                                        onChange={handleGerantChange(index, 'nom')}
                                    />
                                    <TextField
                                        fullWidth
                                        label={`Prénom du gérant ${index + 1}`}
                                        name={`gerant-prenom-${index}`}
                                        value={gerant.prenom}
                                        onChange={handleGerantChange(index, 'prenom')}
                                    />
                                    <IconButton onClick={() => removeGerantField(index)} aria-label="Supprimer">
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            ))}
                            <IconButton onClick={addGerantField} aria-label="Ajouter">
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <FormControl fullWidth required>
                            <InputLabel>Forme juridique</InputLabel>
                            <Select
                                value={formData.formeJuridiqueId}
                                onChange={handleChange}
                                name="formeJuridiqueId"
                            >
                                {formesJuridiques.map(formeJuridique => (
                                    <MenuItem key={formeJuridique.id} value={formeJuridique.id}>
                                        {formeJuridique.nom}
                                    </MenuItem>
                                ))}
                                <MenuItem value={newFormeJuridique}>Ajouter une nouvelle forme juridique</MenuItem>
                            </Select>
                            {newFormeJuridique === '' ? (
                                <Button onClick={handleAddFormeJuridique} disabled={newFormeJuridique === ''}>
                                    Ajouter
                                </Button>
                            ) : (
                                <TextField
                                    fullWidth
                                    label="Nom de la nouvelle forme juridique"
                                    name="newFormeJuridique"
                                    value={newFormeJuridique}
                                    onChange={(e) => setNewFormeJuridique(e.target.value)}
                                />
                            )}
                        </FormControl>
                        <FormControl fullWidth required>
                            <InputLabel>Secteur d'activité</InputLabel>
                            <Select
                                value={formData.secteurId}
                                onChange={handleChange}
                                name="secteurId"
                            >
                                {secteursActivite.map(secteurActivite => (
                                    <MenuItem key={secteurActivite.id} value={secteurActivite.id}>
                                        {secteurActivite.nom}
                                    </MenuItem>
                                ))}
                                <MenuItem value={newSecteurActivite}>Ajouter un nouveau secteur d'activité</MenuItem>
                            </Select>
                            {newSecteurActivite === '' ? (
                                <Button onClick={handleAddSecteurActivite} disabled={newSecteurActivite === ''}>
                                    Ajouter
                                </Button>
                            ) : (
                                <TextField
                                    fullWidth
                                    label="Nom du nouveau secteur d'activité"
                                    name="newSecteurActivite"
                                    value={newSecteurActivite}
                                    onChange={(e) => setNewSecteurActivite(e.target.value)}
                                />
                            )}
                        </FormControl>
                    </Stack>
                    <DialogActions>
                        <Button onClick={handleClose}>Annuler</Button>
                        <Button type="submit">Ajouter</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddEntreprise;
