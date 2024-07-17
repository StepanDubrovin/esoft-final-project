import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../reducer/store';
import { fetchUserBookings, deleteBooking } from '../../reducer/slices/bookingSlice';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';


const MyBookings = () => {
  const dispatch: AppDispatch = useDispatch();
  
  const { userId, bookings, loading, error } = useSelector((state: RootState) => ({
    userId: state.auth.user?.id,
    bookings: state.bookings.bookings,
    loading: state.bookings.loading,
    error: state.bookings.error,
  }));
  const [successMessage, setSuccessMessage] = React.useState('');


  React.useEffect(() => {
    if (userId) {
      dispatch(fetchUserBookings(userId.toString()));
    }
  }, [dispatch, userId]);

  const handleDeleteBooking = (bookingId: string) => {
    dispatch(deleteBooking(bookingId))
      .then(() => {
        return dispatch(fetchUserBookings(userId.toString()));
      })
      .then(() => {
        setSuccessMessage('Отмена прошла успешно');
      })
      .catch(err => {
        console.error(err);
      });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error:{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 2, marginLeft: '50px' }}>
      <Typography variant="h4" gutterBottom>Мои записи на занятия</Typography>
      <Grid container spacing={2}>
        {Array.isArray(bookings) && bookings.length === 0 ? (
          <Typography variant='body1'>У вас нет записей на занятия</Typography>
        ) : (
          bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking.id}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="body2"><strong>Занятие:</strong> {booking.classes}</Typography>
                <Typography variant="body2"><strong>Начало:</strong> {booking.start_time ? booking.start_time.slice(0, -3) : ''}</Typography>
                <Typography variant="body2"><strong>Конец:</strong> {booking.end_time ? booking.end_time.slice(0, -3) : ''}</Typography>
                <Typography variant="body2"><strong>День:</strong> {booking.day}</Typography>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#9370DB',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#7A5DC7' }
                  }}
                  onClick={() => handleDeleteBooking(booking.id.toString())}
                >
                  Отменить запись
                </Button>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
      {successMessage && (
          <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
            {successMessage}
          </Typography>
        )}
    </Box>
  );
};

export default MyBookings;
