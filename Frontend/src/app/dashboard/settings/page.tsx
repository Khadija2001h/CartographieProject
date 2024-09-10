"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import {
  Stack,
  Typography,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function Page() {
  const [supportRequests, setSupportRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [filter, setFilter] = useState('all'); // Filter state
  const searchParams = useSearchParams();

  const getAuthToken = () => localStorage.getItem('authToken');

  useEffect(() => {
    const fetchSupportRequests = async () => {
      try {
        const token = getAuthToken();
        const response = await axios.get('http://localhost:9192/api/support', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const requests = response.data.map((request, index) => ({ ...request, order: index }));
        setSupportRequests(requests.reverse()); // Reverse the array to show the newest first
        setFilteredRequests(requests.reverse());
      } catch (error) {
        console.error('Error fetching support requests:', error);
      }
    };

    fetchSupportRequests();
  }, []);

  useEffect(() => {
    const supportRequestId = searchParams.get('supportRequestId');
    if (searchParams.get('open') === 'true' && supportRequestId) {
      const fetchSupportRequest = async () => {
        try {
          const token = getAuthToken();
          const response = await axios.get(`http://localhost:9192/api/support/${supportRequestId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setCurrentRequest(response.data);
          setOpen(true);
        } catch (error) {
          console.error('Error fetching support request:', error);
        }
      };

      fetchSupportRequest();
    }
  }, [searchParams]);

  useEffect(() => {
    // Filter support requests based on the selected filter
    if (filter === 'all') {
      setFilteredRequests(supportRequests);
    } else {
      const filtered = supportRequests.filter(request => (filter === 'responded') ? request.hasResponded : !request.hasResponded);
      setFilteredRequests(filtered);
    }
  }, [filter, supportRequests]);

  const handleClickOpen = (request) => {
    setCurrentRequest(request);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentRequest(null);
    setResponseMessage('');
  };

  const handleResponse = async () => {
    try {
      const token = getAuthToken();
      await axios.post('http://localhost:9192/api/support/respond', {
        id: currentRequest.id,
        message: responseMessage,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      handleClose(); // Close the dialog after sending the response
      alert('Réponse envoyée avec succès !');
      const response = await axios.get('http://localhost:9192/api/support', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const requests = response.data.map((request, index) => ({ ...request, order: index }));
      setSupportRequests(requests.reverse()); // Re-reverse after response
      setFilteredRequests(requests.reverse());
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      alert('Erreur lors de l\'envoi de la réponse');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:9192/api/support/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Message supprimé avec succès !');
      const response = await axios.get('http://localhost:9192/api/support', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const requests = response.data.map((request, index) => ({ ...request, order: index }));
      setSupportRequests(requests.reverse()); // Re-reverse after delete
      setFilteredRequests(requests.reverse());
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      alert('Erreur lors de la suppression du message');
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" gutterBottom>Support Requests</Typography>

      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Filtrer par statut</InputLabel>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          label="Filtrer par statut"
        >
          <MenuItem value="all">Tous</MenuItem>
          <MenuItem value="responded">Répondu</MenuItem>
          <MenuItem value="notResponded">Non répondu</MenuItem>
        </Select>
      </FormControl>

      {filteredRequests.map((request) => (
        <Card key={request.id} variant="outlined" style={{ marginBottom: 16 }}>
          <CardContent>
            <Stack direction="column" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {request.hasResponded ? (
                  <CheckCircleIcon color="success" fontSize="small" />
                ) : (
                  <CancelIcon color="error" fontSize="small" />
                )}
                <Typography variant="body2" style={{ marginLeft: 4 }}>
                  {request.hasResponded ? "Répondu" : "Non répondu"}
                </Typography>
              </Stack>
              <Typography variant="h6" style={{ marginBottom: 4 }}>
                Nom : {request.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Adresse mail : {request.email}
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="flex-end" style={{ marginTop: 16 }}>
                <IconButton color="primary" onClick={() => handleClickOpen(request)}>
                  <EmailIcon fontSize="small" />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDelete(request.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Répondre à {currentRequest?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} style={{ marginTop: 16 }}>
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>
              Adresse mail :
            </Typography>
            <Typography variant="body2" style={{ marginBottom: 8 }}>
              {currentRequest?.email}
            </Typography>
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>
              Message :
            </Typography>
            <Typography variant="body2" style={{ marginBottom: 8 }}>
              {currentRequest?.message}
            </Typography>
            <TextField
              multiline
              rows={4}
              variant="outlined"
              label="Votre réponse"
              fullWidth
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Annuler</Button>
          <Button onClick={handleResponse} color="primary">Envoyer</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
