import React from 'react';
import { Card, CardContent, Avatar, Box, Button, Typography, Grid, useTheme } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const ClockGrid = ({ time, isActive, checkInTime, checkInButtonText, handleCheckin }) => {
  const theme = useTheme();

  return (
    <Grid item xs={12} md={4}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent sx={{ backgroundColor: theme.palette.background.paper }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 80, height: 80 }}>
              <AccessTimeIcon fontSize="large" style={{ color: theme.palette.text.primary }} />
            </Avatar>
            <Typography variant="h5" sx={{ mt: 2, color: theme.palette.text.primary }}>Your Time</Typography>
            <Typography variant="h2" sx={{ color: theme.palette.text.primary }}>{time}</Typography>
            <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
              Clocked In: {isActive ? checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
            </Typography>
            <Button
              variant="contained"
              color={isActive ? 'secondary' : 'primary'}
              onClick={handleCheckin}
              startIcon={isActive ? <PauseIcon /> : <PlayArrowIcon />}
              sx={{ mt: 2 }}
            >
              {checkInButtonText}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ClockGrid;
