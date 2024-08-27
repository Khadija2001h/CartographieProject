"use client";
import React, { useEffect, useState } from 'react';
import { Popover, Typography, Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { MarkEmailRead as MarkEmailReadIcon } from '@mui/icons-material';

export const NotificationPopover = ({ anchorEl, open, onClose, setCurrentRequest, setOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get('http://localhost:9192/api/notifications');
          setNotifications(response.data);
          // Définir si de nouvelles notifications existent
          const unreadCount = response.data.filter(notification => !notification.isRead).length;
          setHasNewNotifications(unreadCount > 0);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
    }
  }, [open]);

  useEffect(() => {
    if (!open && hasNewNotifications) {
      const markAllAsRead = async () => {
        try {
          const unreadNotifications = notifications.filter(notification => !notification.isRead);
          for (const notification of unreadNotifications) {
            await axios.post(`http://localhost:9192/api/notifications/${notification.id}/markAsRead`);
          }
          // Mettre à jour l'état des notifications après les avoir marquées comme lues
          const updatedNotifications = notifications.map(notification => ({
            ...notification,
            isRead: true
          }));
          setNotifications(updatedNotifications);
          setHasNewNotifications(false);
        } catch (error) {
          console.error('Error marking notifications as read:', error);
        }
      };

      markAllAsRead();
    }
  }, [open]);

  const handleNotificationClick = async (notification) => {
    try {
      await axios.post(`http://localhost:9192/api/notifications/${notification.id}/markAsRead`);

      const response = await axios.get(`http://localhost:9192/api/support/${notification.supportRequestId}`);
      const supportRequest = response.data;

      const queryString = new URLSearchParams({
        open: 'true',
        supportRequestId: notification.supportRequestId
      }).toString();
      
      router.push(`/dashboard/settings?${queryString}`);

      setCurrentRequest(supportRequest);
      setOpen(true);
      onClose();
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      open={Boolean(anchorEl) && open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Box sx={{ p: 2, width: '400px' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <NotificationsIcon sx={{ mr: 1 }} />
          Notifications
        </Typography>
        <List>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="Aucune notification" />
            </ListItem>
          ) : (
            [...notifications].reverse().map((notification) => (
              <ListItem
                button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  backgroundColor: notification.isRead ? 'transparent' : '#e3f2fd', // Couleur pour non lues
                  mb: 1,
                  borderRadius: 1,
                  position: 'relative',
                }}
              >
                <ListItemIcon>
                  <MarkEmailReadIcon color={notification.isRead ? 'action' : 'error'} />
                </ListItemIcon>
                <ListItemText primary={notification.message} />
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </Popover>
  );
};
