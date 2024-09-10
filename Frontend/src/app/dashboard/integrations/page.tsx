"use client";

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from '@/components/dashboard/integrations/Home';
import { EntrepriseDetails } from '@/components/dashboard/integrations/detail-entreprise';
import Map from '@/components/ui/Map'; // Import Map if it's used here

const UserPage = () => {
  return <Home />;
};

export function PageDetail(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard/customers" element={<UserPage />} />
        <Route path="/entreprises/:id" element={<EntrepriseDetails />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}

export default PageDetail;
