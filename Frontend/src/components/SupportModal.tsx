import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

const SupportModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await axios.post('http://localhost:9192/api/support/submit', formData);
      console.log('Support request submitted:', response.data);
      setIsSubmitted(true);
      
      // Réinitialiser le formulaire après l'envoi
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        companyName: '',
        message: ''
      });

      // Le message de confirmation disparaît après 3 secondes
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting support request:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          width: '80%',
          maxWidth: 1000,
          bgcolor: 'background.paper',
          padding: 4,
          borderRadius: 2,
          boxShadow: 24,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'grey.500',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'row',
            width: '100%',
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginRight: '20px',
            }}
          >
            <Typography
              variant="h6"
              component="p"
              gutterBottom
              sx={{ textAlign: 'center', width: '100%', marginBottom: 5, marginLeft:'-70px' }}
            >
              Vous rencontrez un problème ?
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              paragraph
              sx={{ textAlign: 'center', width: '75%', marginBottom: 5 }}
            >
              N'hésitez pas à nous faire part de tout problème rencontré. Notre équipe prendra contact avec vous pour y répondre dans les meilleurs délais.
            </Typography>
            <Image
              src="/assets/support.png"
              alt="Support"
              width={700}
              height={370}
              style={{ marginLeft: '-130px', marginBottom: 20 }}
            />
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              flex: 2,
              marginLeft: '-60px',
              width: '100%'
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
            >
              Formulaire de support
            </Typography>
            <TextField
              label="Entrez votre nom"
              name="name"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
              sx={{ width: '100%', mb: 2 }}
            />
            <TextField
              label="Entrez votre email"
              name="email"
              type="email"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
              sx={{ width: '100%', mb: 2 }}
            />
            <TextField
              label="Entrez votre numéro de téléphone"
              name="phoneNumber"
              variant="outlined"
              margin="normal"
              fullWidth
              value={formData.phoneNumber}
              onChange={handleChange}
              sx={{ width: '100%', mb: 2 }}
            />
            <TextField
              label="Entrez le nom de votre entreprise"
              name="companyName"
              variant="outlined"
              margin="normal"
              fullWidth
              value={formData.companyName}
              onChange={handleChange}
              sx={{ width: '100%', mb: 2 }}
            />
            <TextField
              label="Entrez votre message"
              name="message"
              variant="outlined"
              margin="normal"
              fullWidth
              multiline
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              sx={{ width: '100%', mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, width: '27%', marginLeft:'300px' }}
            >
              Envoyer
            </Button>
          </Box>
        </Box>

        {isSubmitted && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 50, color: '#4caf50' }} />
            <Typography variant="h6" sx={{ color: '#4caf50', mt: 1 }}>
              Votre demande a été envoyée !
            </Typography>
          </Box>
        )}

        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ marginTop: '20px' }}
        >
          Support disponible du lundi au vendredi de 09h00 à 13h00 et de 14h00 à 17h30.
        </Typography>
      </Box>
    </Modal>
  );
};

export default SupportModal;
