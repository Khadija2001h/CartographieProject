"use client";

import * as React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Download as DownloadIcon } from "@phosphor-icons/react/dist/ssr/Download";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { Upload as UploadIcon } from "@phosphor-icons/react/dist/ssr/Upload";
import { CustomersTable } from "@/components/dashboard/customer/customers-table";
import AddEntreprise from "@/components/dashboard/customer/AddEntreprise";
import { EntrepriseDetails } from "@/components/dashboard/customer/entreprise-detail";
import * as XLSX from "xlsx";

// Type pour une entreprise
type Entreprise = {
  denomination?: string;
  capitalSocial?: number;
  ice?: number;
  identifiantFiscal?: number;
  numRegistreCommerce?: number;
  numPatente?: number;
  numAffiliationCnss?: number;
  adresse?: string;
  ville?: string;
  telephones?: string[];
  faxes?: string[];
  gerants?: string[];
  mail?: string;
  siteWeb?: string;
  nombreEmployes?: number;
  latitude?: number;
  longitude?: number;
  dateCreation?: string | null;
  dateCessationActivite?: string | null;
  secteurId?: number | null;
  formeJuridiqueId?: number | null;
};

// Champs valides pour une entreprise avec variantes pour Forme Juridique et Secteur d'Activité
const validFields: Record<string, keyof Entreprise> = {
  denomination: "denomination",
  capitalsocial: "capitalSocial",
  ice: "ice",
  identifiantfiscal: "identifiantFiscal",
  numregistrecommerce: "numRegistreCommerce",
  numpatente: "numPatente",
  numaffiliationcnss: "numAffiliationCnss",
  adresse: "adresse",
  ville: "ville",
  telephones: "telephones",
  faxes: "faxes",
  gerants: "gerants",
  mail: "mail",
  siteweb: "siteWeb",
  nombreemployes: "nombreEmployes",
  latitude: "latitude",
  longitude: "longitude",
  datecreation: "dateCreation",
  datecessationactivite: "dateCessationActivite",
  secteurid: "secteurId",
  secteurdactivite: "secteurId",
  "secteur d'activite": "secteurId",
  formejuridiqueid: "formeJuridiqueId",
  "forme juridique": "formeJuridiqueId",
  formejuridique: "formeJuridiqueId",
  FormeJuridique: "formeJuridiqueId",
  SecteurDactivite: "secteurId",
};

// Fonction pour récupérer les secteurs et formes juridiques depuis le backend
const fetchSectorsAndLegalForms = async () => {
  const token = localStorage.getItem('authToken');

  const secteursRes = await fetch("http://localhost:9192/api/secteursDactivite", {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const secteurs = await secteursRes.json();

  const formesJuridiquesRes = await fetch("http://localhost:9192/api/formesJuridiques", {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const formesJuridiques = await formesJuridiquesRes.json();
  
  return { secteurs, formesJuridiques };
};

// Fonction pour mapper les données Excel aux champs backend et comparer secteurs/formes
const mapExcelToBackendFields = (
  row: Record<string, any>,
  headers: string[],
  secteurs: any[],
  formesJuridiques: any[]
): Entreprise => {
  const entreprise: Entreprise = {};
  headers.forEach((header) => {
    const normalizedHeader = header.trim().toLowerCase().replace(/\s+/g, "");
    const fieldKey = validFields[normalizedHeader as keyof typeof validFields];

    if (fieldKey) {
      entreprise[fieldKey] = row[header];
    } else {
      console.warn(`Colonne "${header}" non reconnue, elle sera ignorée.`);
    }
  });

  // Comparaison secteur d'activité et forme juridique
  const secteurFromExcel = row['secteur d\'activite']?.toString().toLowerCase();
  const formeJuridiqueFromExcel = row['forme juridique']?.toString().toLowerCase();

  const secteurMatch = secteurs.find((secteur: any) => secteur.nom && secteur.nom.toLowerCase() === secteurFromExcel);
  const formeJuridiqueMatch = formesJuridiques.find((forme: any) => forme.nom && forme.nom.toLowerCase() === formeJuridiqueFromExcel);

  console.log({ secteurFromExcel, formeJuridiqueFromExcel, secteurs, formesJuridiques }); // Ajout pour vérification

  if (secteurMatch) entreprise.secteurId = secteurMatch.id;
  if (formeJuridiqueMatch) entreprise.formeJuridiqueId = formeJuridiqueMatch.id;

  // Traitement supplémentaire des champs si nécessaire
  entreprise.capitalSocial = parseFloat(entreprise.capitalSocial?.toString() || "") || 0;
  entreprise.ice = parseInt(entreprise.ice?.toString() || "") || 0;
  entreprise.identifiantFiscal = parseInt(entreprise.identifiantFiscal?.toString() || "") || 0;
  entreprise.numRegistreCommerce = parseInt(entreprise.numRegistreCommerce?.toString() || "") || 0;
  entreprise.numPatente = parseInt(entreprise.numPatente?.toString() || "") || 0;
  entreprise.numAffiliationCnss = parseInt(entreprise.numAffiliationCnss?.toString() || "") || 0;
  entreprise.telephones = Array.isArray(entreprise.telephones)
    ? entreprise.telephones
    : typeof entreprise.telephones === 'string'
    ? (entreprise.telephones as string).split(',')
    : [];
  entreprise.faxes = Array.isArray(entreprise.faxes)
    ? entreprise.faxes
    : typeof entreprise.faxes === 'string'
    ? (entreprise.faxes as string).split(',')
    : [];
  entreprise.nombreEmployes = parseInt(entreprise.nombreEmployes?.toString() || "") || 0;
  entreprise.dateCreation = entreprise.dateCreation ? new Date(entreprise.dateCreation).toISOString() : null;
  entreprise.dateCessationActivite = entreprise.dateCessationActivite
    ? new Date(entreprise.dateCessationActivite).toISOString()
    : null;

  return entreprise;
};

// Fonction pour gérer l'importation du fichier Excel
const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const { secteurs, formesJuridiques } = await fetchSectorsAndLegalForms();

  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1);

        for (const row of rows) {
          const rowData = headers.reduce((acc: Record<string, any>, header, index) => {
            acc[header] = row[index] || "";
            return acc;
          }, {});

          const entreprise = mapExcelToBackendFields(rowData, headers, secteurs, formesJuridiques);

          try {
            const formData = new FormData();
            Object.entries(entreprise).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
              }
            });
            
            const token = localStorage.getItem('authToken');
            const response = await fetch("http://localhost:9192/api/entreprises/add", {
              method: "POST",
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
              },
            });
           
            if (!response.ok) {
              throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }

            console.log(`Entreprise ${entreprise.denomination} enregistrée avec succès.`);
          } catch (error) {
            console.error(`Erreur lors de l'enregistrement de ${entreprise.denomination}`, error);
          }
        }

        alert("Importation terminée.");
      }
    };
    reader.readAsBinaryString(file);
  }
};



// Fonction pour gérer l'exportation du tableau
const handleExport = () => {
  const exportToExcelEvent = new CustomEvent("exportToExcel");
  window.dispatchEvent(exportToExcelEvent);
};

// Pagination des clients
const applyPagination = (rows: Entreprise[], page: number, rowsPerPage: number): Entreprise[] => {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
};

const customers: Entreprise[] = []; // Remplissez avec vos données si nécessaire

export function Page(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const page = 0;
  const rowsPerPage = 5;
  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
          <Typography variant="h4">Entreprises</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button component="label" color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
              <input type="file" accept=".xlsx, .xls" hidden onChange={handleImport} />
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} onClick={handleExport}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleClickOpen}>
            Ajouter
          </Button>
        </div>
      </Stack>

      <CustomersTable count={paginatedCustomers.length} page={page} rows={paginatedCustomers} rowsPerPage={rowsPerPage} />
      <AddEntreprise open={open} handleClose={handleClose} />
    </Stack>
  );
}

export function PageDetail(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard/customers" element={<Page />} />
        <Route path="/entreprises/:id" element={<EntrepriseDetails />} />
        <Route path="/" element={<Page />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Route par défaut */}
      </Routes>
    </Router>
  );
}

export default PageDetail;
