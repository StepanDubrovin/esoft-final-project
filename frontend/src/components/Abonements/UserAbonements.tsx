import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../reducer/store';
import { fetchUserAbonsById } from '../../reducer/slices/userAbonSlice';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { IUserAbon } from '../../models/IUserAbon';

const UserAbonements: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userAbons, loading, error } = useSelector((state: RootState) => state.userAbons);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  React.useEffect(() => {
    if (userId) {
      dispatch(fetchUserAbonsById(Number(userId)))
    }
  }, [dispatch, userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <Box sx={{ padding: 2, marginLeft: '50px' }}>
      <Typography variant="h4" gutterBottom >
        Мои абонементы
      </Typography>
      {Array.isArray(userAbons) && userAbons.length === 0 ? (
       <Typography variant='h4' sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%'
      }}>У вас нет активных абонементов</Typography>
      ) : (
        <Grid container spacing={3}>
        {Array.isArray(userAbons) && userAbons.map((abon: IUserAbon) => (
          <Grid item xs={12} sm={6} md={4} key={abon.abonement_id}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {abon.abonement_title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <div>Количество занятий: {abon.abonement_sessions}</div>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      )}
    </Box>
  );
};

export default UserAbonements;
