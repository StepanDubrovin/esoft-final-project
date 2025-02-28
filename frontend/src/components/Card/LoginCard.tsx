import * as React from 'react';
import { Box, Button, TextField, Card, CardContent, Typography, Link, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../reducer/store';
import { login, registration } from '../../reducer/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { validateEmail, validatePassword } from '../../utils/validation';


const LoginCard: React.FC = () => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  
  const [isRegistering, setIsRegistering] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string, password?: string}>({});


  React.useEffect(() => {
    if (user) {
      navigate(`/users/${user.id}`);
    }
  }, [user, navigate]);

  const handleLogin = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({email: emailError, password: passwordError});
      return
    }

    if (isRegistering) {
      dispatch(registration({ email, password, name }));
    } else {
      dispatch(login({ email, password }));
    }
  };

  const handleRegisterClick = () => {
    setIsRegistering(!isRegistering);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#9370DB',
      },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: '#9370DB',
      },
    },
  };

  return (
    <Card sx={{ 
      width: 400, 
      height: isRegistering ? 600 : 500, 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      padding: 3, 
      border: '1px solid #9370DB', 
      borderRadius: '8px' 
    }}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h5" component="div" gutterBottom sx={{ textAlign: 'center', marginBottom: 2 }}>
            {isRegistering ? 'Регистрация' : 'Вход'}
          </Typography>
          {isRegistering && (
            <TextField
              margin="dense"
              id="name"
              label="Имя"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ ...textFieldStyles, marginBottom: 2 }}
            />
          )}
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Электронная почта"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{...textFieldStyles, marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            id="password"
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ ...textFieldStyles, marginBottom: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMousDown={handleMouseDownPassword}>
                      {showPassword ? <Visibility/> : <VisibilityOff/>}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {loading ? (
            <CircularProgress sx={{ marginTop: 2 }} />
          ) : (
            <Box mt={3} display="flex" justifyContent="center">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleLogin} 
                sx={{ 
                  backgroundColor: '#9370DB', 
                  '&:hover': {
                    backgroundColor: '#7A5DC7',
                  }
                }}
              >
                {isRegistering ? 'Зарегистрироваться' : 'Войти'}
              </Button>
            </Box>
          )}
          {error && (
            <Typography color="error" sx={{ marginTop: 2 }}>
              {typeof error === 'string' ? error : error}
            </Typography>
          )}
          {!isRegistering && (
            <Box mt={2}>
              <Typography variant="body2">
                Нет аккаунта? <Link component="button" variant="body2" onClick={handleRegisterClick} sx={{ color: '#9370DB', textDecorationColor: '#9370DB' }}>Зарегистрируйтесь</Link>
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginCard;
