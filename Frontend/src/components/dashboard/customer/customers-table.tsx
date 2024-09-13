import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelection } from '@/hooks/use-selection';
import { CustomersFilters, Filters } from './customers-filters';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import EditIcon from '@mui/icons-material/Edit';
import {EntrepriseDetails} from './EntrepriseDetails';
import * as XLSX from 'xlsx'; // Import xlsx


export interface Entreprise {
  id: string;
  denomination: string;
  adresse: string;
  ville: string;
  secteurDactivite: {
    id: string;
    nom: string;
  };
  formeJuridique: {
    id: string;
    nom: string;
  };
}

export function CustomersTable(): React.JSX.Element {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [entreprises, setEntreprises] = React.useState<Entreprise[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedEntrepriseId, setSelectedEntrepriseId] = React.useState<string | null>(null);
  const handleView = (id: string) => {
    navigate(`/entreprises/${id}`); // Use navigate instead of history.push
  };

 
//////////////
const exportToExcel = () => {
  // Préparer les données
  const data = entreprises.map((entreprise) => ({
    Denomination: entreprise.denomination,
    Adresse: entreprise.adresse,
    Ville: entreprise.ville,
    SecteurDactivite: entreprise.secteurDactivite ? entreprise.secteurDactivite.nom : 'N/A',
    FormeJuridique: entreprise.formeJuridique ? entreprise.formeJuridique.nom : 'N/A',
  }));

  // Créer une feuille de calcul à partir des données
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Définir des styles pour les titres (première ligne)
  const titleStyle = {
    font: { bold: true, sz: 16, color: { rgb: 'FFFFFF' } }, // Style de police (taille, couleur blanche)
    fill: { fgColor: { rgb: '87CEEB' } }, // Couleur de fond bleu ciel
    alignment: { horizontal: 'center', vertical: 'center' }, // Centrer le texte
    border: {
      top: { style: 'thick', color: { rgb: '000000' } }, // Bordure épaisse
      bottom: { style: 'thick', color: { rgb: '000000' } },
      left: { style: 'thick', color: { rgb: '000000' } },
      right: { style: 'thick', color: { rgb: '000000' } },
    },
  };

  // Appliquer le style aux titres
  const columnTitles = Object.keys(data[0]);
  columnTitles.forEach((title, index) => {
    const cellAddress = XLSX.utils.encode_cell({ c: index, r: 0 });
    if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: title }; // Si la cellule n'existe pas, la créer avec le titre
    worksheet[cellAddress].s = titleStyle; // Appliquer le style défini à chaque cellule de titre
  });

  // Définir un style pour le contenu des cellules
  const contentStyle = {
    font: { sz: 12, color: { rgb: '000000' } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } }, // Bordure fine
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    },
  };

  // Appliquer le style aux cellules du contenu
  Object.keys(worksheet).forEach((cell) => {
    if (cell[0] === '!') return; // Ignorer les métadonnées (par exemple !ref ou !cols)
    worksheet[cell].s = contentStyle; // Appliquer le style à chaque cellule individuellement
  });

  // Ajuster la largeur des colonnes pour un meilleur affichage
  const columnWidths = [
    { wch: 20 }, // Denomination
    { wch: 30 }, // Adresse
    { wch: 15 }, // Ville
    { wch: 25 }, // SecteurDactivite
    { wch: 25 }, // FormeJuridique
  ];
  worksheet['!cols'] = columnWidths;

  // Créer le workbook et y ajouter la feuille
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Entreprises');

  // Exporter le fichier Excel
  XLSX.writeFile(workbook, 'entreprises.xlsx');
};

  
////////////////////////
  // Fetch entreprises data from API
  const fetchEntreprises = async () => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch('http://localhost:9192/api/entreprises', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },

      });

      if (!response.ok) {
        throw new Error('Failed to fetch entreprises');
      }
      const data = await response.json();
      setEntreprises(data);
    } catch (error) {
      console.error('Error fetching entreprises:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  React.useEffect(() => {
    fetchEntreprises();
  }, []);

  ///////////
  React.useEffect(() => {
    const handleExport = () => exportToExcel();

    window.addEventListener('exportToExcel', handleExport);

    return () => {
      window.removeEventListener('exportToExcel', handleExport);
    };
  }, [exportToExcel]);
  //////////

  // Memoize row IDs for selection
  const rowIds = React.useMemo(() => {
    return entreprises.map((entreprise) => entreprise.id);
  }, [entreprises]);

  // Use custom hook for selection logic
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  // Check if some or all rows are selected
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < entreprises.length;
  const selectedAll = entreprises.length > 0 && selected?.size === entreprises.length;

  // Handle page change in pagination
  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change in pagination
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = async (filters: Filters) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.ville) queryParams.append('ville', filters.ville);
      if (filters.formeJuridiqueNom) queryParams.append('formeJuridiqueNom', filters.formeJuridiqueNom);
      if (filters.secteurNom) queryParams.append('secteurNom', filters.secteurNom);
      if (filters.denomination) queryParams.append('denomination', filters.denomination);
      const token = localStorage.getItem('authToken');

      const response = await fetch(`http://localhost:9192/api/entreprises/filter?${queryParams.toString()}`, {
       
        headers: {
          'Authorization': `Bearer ${token}`,
        },

      });

      if (!response.ok) {
        throw new Error('Failed to fetch filtered entreprises');
      }
      const data = await response.text();
      if (!data) {
        setEntreprises([]);
      } else {
        setEntreprises(JSON.parse(data));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des entreprises filtrées:', error);
      // Gérer l'erreur (par exemple, afficher un message d'erreur à l'utilisateur)
    }
  };
  const handleViewUpDate = (id: string) => {
    console.log(id);
    setSelectedEntrepriseId(id);
  };
  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`http://localhost:9192/api/entreprises/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },

      });


      if (!response.ok) {
        throw new Error('Failed to delete entreprise');
      }

      // Remove the deleted entreprise from the state
      setEntreprises((prevEntreprises) => prevEntreprises.filter((entreprise) => entreprise.id !== id));
    } catch (error) {
      console.error('Error deleting entreprise:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  // Apply pagination to entreprises data
  const paginatedEntreprises = applyPagination(entreprises, page, rowsPerPage);
  const handleBackClick = () => {
    setSelectedEntrepriseId(null);
  };
  if (selectedEntrepriseId) {
    // Render the EntrepriseDetails component if an entreprise is selected
    return <EntrepriseDetails onBackClick={handleBackClick} selectedEntrepriseId={selectedEntrepriseId} />;
  }
  return (
    <Card>
      <CustomersFilters onFilterChange={handleFilterChange} />
      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Denomination</TableCell>
              <TableCell>Secteur d'Activité</TableCell>
              <TableCell>Forme Juridique</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEntreprises.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.denomination}</TableCell>
                  <TableCell>{row.secteurDactivite?.nom}</TableCell>
                  <TableCell>{row.formeJuridique?.nom}</TableCell>
                  <TableCell>{row.adresse}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(row.id)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleViewUpDate(row.id)}>
                      <EditIcon /> {/* Replace VisibilityIcon with EditIcon */}
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={entreprises.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}

// Function to apply pagination to rows
function applyPagination(rows: Entreprise[], page: number, rowsPerPage: number): Entreprise[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
