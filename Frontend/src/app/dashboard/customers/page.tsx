"use client";

import * as React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import AddEntreprise from '@/components/dashboard/customer/AddEntreprise';
import { EntrepriseDetails } from '@/components/dashboard/customer/entreprise-detail';

const customers = [
  // Vos données de clients (si nécessaire)
] satisfies Customer[];

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

  // Fonction pour gérer l'exportation du tableau
  const handleExport = () => {
    const exportToExcelEvent = new CustomEvent('exportToExcel');
    window.dispatchEvent(exportToExcelEvent);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Entreprise</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} onClick={handleExport}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleClickOpen}>
            Add
          </Button>
        </div>
      </Stack>

      <CustomersTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
      />
      <AddEntreprise open={open} handleClose={handleClose} />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
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
