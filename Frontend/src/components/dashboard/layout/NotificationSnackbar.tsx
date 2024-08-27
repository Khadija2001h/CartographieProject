'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

const NotificationSnackbar = ({ open, onClose }) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:9192/api/notifications/unread');
        if (response.data.length > 0) {
          setNotification(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [open]);

  const handleClose = () => {
    onClose();
    if (notification) {
      axios.post(`http://localhost:9192/api/notifications/${notification.id}/markAsRead`)
        .catch(error => console.error('Error marking notification as read:', error));
    }
  };

  const handleClick = () => {
    if (notification) {
      // Navigate to the notification detail page or open a modal with details
      window.location.href = `/notifications/${notification.id}`; // Update with your actual detail route
    }
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClick={handleClick} onClose={handleClose} severity="info" style={{ cursor: 'pointer' }}>
        {notification ? notification.message : 'New notification'}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
