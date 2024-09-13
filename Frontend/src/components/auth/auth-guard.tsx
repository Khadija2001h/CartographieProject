'use client'; // Ajoutez ceci en haut du fichier

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Utilisez `next/navigation` pour Next.js
import axios from 'axios';
import { paths } from '@/paths';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter(); // Utilisez `useRouter` pour la navigation dans Next.js

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          router.replace(paths.auth.signIn); // Utilisez `router.replace` pour la redirection
          return;
        }

        const response = await axios.get('http://localhost:9192/api/v1/auth/validate-token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.replace(paths.auth.signIn);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des permissions:', error);
        setIsAuthenticated(false);
        router.replace(paths.auth.signIn);
      }
    };

    checkPermissions();
  }, [router]); // Assurez-vous d'inclure `router` dans les dépendances

  if (isAuthenticated === null) {
    return <div>Chargement...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;
