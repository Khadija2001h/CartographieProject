import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Alert, 
  Card, 
  CardContent, 
  Grid, 
  Avatar, 
  Button 
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom'; 
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Custom theme for modern look
const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff', // Primary color for buttons and highlights
    },
    background: {
      default: '#f7f9fc', // Light background color for modern appearance
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Modern, no uppercase text
          borderRadius: '20px',  // Rounded corners
          boxShadow: '0px 4px 20px rgba(0, 123, 255, 0.3)', // Soft shadow
          transition: 'transform 0.3s', // Smooth hover effect
          '&:hover': {
            transform: 'scale(1.05)', // Subtle scale on hover
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // Rounded corners for card
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)', // Soft shadow for modern look
        },
      },
    },
  },
});

interface User {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:9192/api/v1/auth/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`, 
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container>
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
          <CircularProgress />
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Grid container direction="column" alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: '#007bff',
                      }}
                    >
                      <AccountCircleIcon fontSize="large" style={{ color: '#ffffff' }} />
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography variant="h4" gutterBottom>
                      Profile
                    </Typography>
                  </Grid>
                  {userData ? (
                    <>
                      <Grid item>
                        <Typography variant="body1" fontWeight="bold">First Name: {userData.firstname}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" fontWeight="bold">Last Name: {userData.lastname}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" fontWeight="bold">Email: {userData.email}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" fontWeight="bold">Role: {userData.role}</Typography>
                      </Grid>
                    </>
                  ) : (
                    <Typography variant="body1">No user data available.</Typography>
                  )}
                 
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default Profile;
 