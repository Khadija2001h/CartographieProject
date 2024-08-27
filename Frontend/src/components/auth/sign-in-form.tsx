'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: zod.string().min(1, { message: 'Password is required' }),
});

const paths = {
  dashboard: '/dashboard',  // Assurez-vous que c'est bien une chaîne
  // autres chemins...
};


type FormValues = zod.infer<typeof schema>;

const defaultValues: FormValues = {
  email: '',
  password: '',
};

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = React.useCallback(
    async (values: FormValues): Promise<void> => {
      setIsPending(true);

      try {
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setError('root', {
            type: 'no-token',
            message: 'No token found. Please sign up first.',
          });
          setIsPending(false);
          return;
        }
        const response = await fetch('http://localhost:9192/api/v1/auth/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Utilisation des backticks pour inclure le token
          },
          body: JSON.stringify(values),
        });
        

        if (!response.ok) {
          const errorData = await response.json();
          setError('root', {
            type: 'server',
            message: errorData.message || 'Failed to sign in. Please try again.',
          });
          setIsPending(false);
          return;
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.token); // Mise à jour du token si nécessaire

        // Redirection après authentification réussie
        router.replace('/dashboard');
      } catch (error) {
        setError('root', {
          type: 'server',
          message: (error as Error).message || 'An unexpected error occurred. Please try again.',
        });
        setIsPending(false);
      }
    },
    [router, setError]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>
        <Typography color="text.secondary" variant="body2">
          Don’t have an account?{' '}
          <Link href="/auth/sign-up" underline="hover" variant="subtitle2">
            Sign up
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email</InputLabel>
                <OutlinedInput {...field} label="Email" type="email" />
                {errors.email ? (
                  <FormHelperText>{errors.email.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput {...field} label="Password" type="password" />
                {errors.password ? (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />

          {errors.root && (
            <Alert severity="error">{errors.root.message}</Alert>
          )}
          
          <Button
            disabled={isPending}
            type="submit"
            variant="contained"
            endIcon={isPending ? <CircularProgress size={20} /> : null}
          >
            Sign in
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}