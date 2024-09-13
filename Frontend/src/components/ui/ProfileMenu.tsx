import React, { useState } from 'react';
import { Menu, MenuItem, CircularProgress, Avatar, Button } from '@mui/material';

function ProfileMenu({ onProfileClick }: { onProfileClick: () => void }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Logique de déconnexion ici (ex. suppression du token JWT, redirection, etc.)
      localStorage.removeItem('authToken');
      // Vous pouvez rediriger l'utilisateur vers la page de connexion après déconnexion
      window.location.href = '/auth/sign-in';
    }, 2000); // Spinner pendant 2 secondes
  };

  const handleProfile = () => {
    onProfileClick(); // Appeler la fonction pour afficher le profil
    handleClose(); // Fermer le menu
  };

  return (
    <>
      <Button color="inherit" onClick={handleClick}>
        <Avatar alt="User Avatar" />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 160,
          },
        }}
      >
        <MenuItem onClick={handleProfile}>
          {loading ? <CircularProgress size={20} /> : 'Profile'}
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          {loading ? <CircularProgress size={20} /> : 'Logout'}
        </MenuItem>
      </Menu>
    </>
  );
}

export default ProfileMenu;