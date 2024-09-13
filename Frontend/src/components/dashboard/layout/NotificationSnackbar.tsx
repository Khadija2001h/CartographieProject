'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

const NotificationSnackbar = ({ open, onClose }) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('Token not found');
          return;
        }

        const response = await axios.get('http://localhost:9192/api/notifications/unread', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data.length > 0) {
          setNotification(response.data[0]);  // Récupère la première notification non lue
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (open) {
      fetchNotifications();  // Ne récupérer les notifications que si le `Snackbar` est ouvert
    }
  }, [open]);

  const handleClose = () => {
    if (notification) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Token not found');
        return;
      }

      // Marquer la notification comme lue
      axios.post(`http://localhost:9192/api/notifications/${notification.id}/markAsRead`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).catch(error => {
        console.error('Erreur lors du marquage de la notification comme lue:', error);
      });
    }

    onClose();  // Fermer le Snackbar
  };

  const handleClick = () => {
    if (notification) {
      // Naviguer vers la page de détail de la notification ou autre action
      window.location.href = `/notifications/${notification.id}`;  // Met à jour avec ton propre chemin de détail
    }
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClick={handleClick} onClose={handleClose} severity="info" style={{ cursor: 'pointer' }}>
        {notification ? notification.message : 'Nouvelle notification'}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
