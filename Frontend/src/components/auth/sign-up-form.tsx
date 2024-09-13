'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2'; // Import de SweetAlert2 pour les alertes
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

// Schéma de validation avec Zod
const schema = zod.object({
  firstname: zod.string().min(1, { message: 'Le prénom est requis' }),
  lastname: zod.string().min(1, { message: 'Le nom est requis' }),
  email: zod.string().min(1, { message: 'L\'email est requis' }).email({ message: 'Email invalide' }),
  password: zod.string().min(6, { message: 'Le mot de passe doit comporter au moins 6 caractères' }),
  terms: zod.boolean().refine((value) => value, 'Vous devez accepter les termes et conditions'),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { firstname: '', lastname: '', email: '', password: '', terms: false } satisfies Values;

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      try {
        const response = await fetch('http://localhost:9192/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorText = await response.text();
          const errorData = errorText ? JSON.parse(errorText) : { message: 'Échec de l\'authentification' };
          setError('root', { type: 'server', message: errorData.message || 'Échec de l\'authentification' });
          setIsPending(false);
          return;
        }

      
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie!',
          text: 'Vous avez été inscrit avec succès.',
          confirmButtonText: 'Continuer',
        }).then(() => {
          router.push("/auth/sign-in");
        });
      } catch (error: any) {
        console.error('Erreur lors du traitement:', error);
        setError('root', { type: 'server', message: error.message || 'Une erreur inattendue est survenue.' });
        setIsPending(false);
      }
    },
    [router, setError]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">S'inscrire</Typography>
        <Typography color="text.secondary" variant="body2">
          Vous avez déjà un compte ?{' '}
          <Link component={RouterLink} href="/auth/sign-in" underline="hover" variant="subtitle2">
            Se connecter
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="firstname"
            render={({ field }) => (
              <FormControl error={Boolean(errors.firstname)}>
                <InputLabel>Prénom</InputLabel>
                <OutlinedInput {...field} label="Prénom" />
                {errors.firstname ? <FormHelperText>{errors.firstname.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="lastname"
            render={({ field }) => (
              <FormControl error={Boolean(errors.lastname)}>
                <InputLabel>Nom</InputLabel>
                <OutlinedInput {...field} label="Nom" />
                {errors.lastname ? <FormHelperText>{errors.lastname.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email</InputLabel>
                <OutlinedInput {...field} label="Email" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Mot de passe</InputLabel>
                <OutlinedInput {...field} label="Mot de passe" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <div>
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label={
                    <React.Fragment>
                      J'ai lu et j'accepte les <Link>termes et conditions</Link>
                    </React.Fragment>
                  }
                />
                {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
              </div>
            )}
          />

          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}

          <Button disabled={isPending} type="submit" variant="contained">
            S'inscrire
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
