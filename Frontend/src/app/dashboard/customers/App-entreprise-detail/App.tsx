import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Page } from '@/app/dashboard/customers/page';
import { EntrepriseDetails } from '@/components/dashboard/customer/entreprise-detail';

export function App() {
    return (
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/dashboard/customers">Entreprise</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/dashboard/customers" element={<Page />} />
          <Route path="/entreprises/:id" element={<EntrepriseDetails />} />
          <Route path="/" element={<Page />} />
        </Routes>
      </Router>
    );
  }
  
  export default App;
