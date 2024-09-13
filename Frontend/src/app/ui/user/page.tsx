"use client";

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from '@/components/ui/Home';
import { EntrepriseDetails } from '@/components/ui/detail-entreprise';
import Map from '@/components/ui/Map'; // Import Map if it's used here

const UserPage = () => {
  return <Home />;
};

export function PageDetail(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/ui/user" element={<UserPage />} />
        <Route path="/entreprises/:id" element={<EntrepriseDetails />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}

export default PageDetail;