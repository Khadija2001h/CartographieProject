"use client";
import React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

import { usePopover } from '@/hooks/use-popover';
import { NotificationPopover } from './NotificationPopover';
import { UserPopover } from './user-popover';
import { MobileNav } from './mobile-nav';
import NotificationSnackbar from './NotificationSnackbar'; // Import your NotificationSnackbar component
import axios from 'axios';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');
  const [unreadCount, setUnreadCount] = React.useState<number>(0); // Etat pour le nombre de notifications non lues

  const userPopover = usePopover<HTMLDivElement>();
  const notificationPopover = usePopover<HTMLDivElement>();

  // Fetch unread notifications
  React.useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:9192/api/notifications/unread');
        setUnreadCount(response.data.length); // Met à jour le nombre de notifications non lues
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchUnreadNotifications();
  }, []); // Fetch notifications only on component mount

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
           
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="Contacts">
              <IconButton>
                <UsersIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <Badge
                badgeContent={unreadCount}
                color="error"
                variant={unreadCount > 0 ? 'dot' : 'standard'} // Affiche le point seulement s'il y a des notifications non lues
              >
                <IconButton onClick={notificationPopover.handleOpen} ref={notificationPopover.anchorRef}>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src="/assets/avatar.png"
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <NotificationPopover
        anchorEl={notificationPopover.anchorRef.current}
        open={notificationPopover.open}
        onClose={notificationPopover.handleClose}
        setCurrentRequest={() => {}}
        setOpen={() => {}}
      />
      <MobileNav open={openNav} onClose={() => setOpenNav(false)} />
      <NotificationSnackbar open={snackbarOpen} message={snackbarMessage} onClose={() => setSnackbarOpen(false)} />
    </React.Fragment>
  );
}
