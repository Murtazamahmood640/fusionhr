import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, styled, useTheme, TextField } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Header from "../../components/Header";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const HighlightedTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#141b2d', // Light yellow color to highlight the row
  fontWeight: 'bold',
}));

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const radius = 120;
  const diameter = radius * 2;
  const cx = radius;
  const cy = radius;

  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  const hourAngle = (360 / 12) * (hour % 12) + (minute / 60) * 30;
  const minuteAngle = (360 / 60) * minute;
  const secondAngle = (360 / 60) * second;

  return (
    <Box sx={{ position: 'relative', width: diameter, height: diameter, margin: '0 auto', marginTop: 4 }}>
      <svg width={diameter} height={diameter}>
        <circle cx={cx} cy={cy} r={radius} fill="black" />
        <line x1={cx} y1={cy} x2={cx + radius * 0.5 * Math.cos(Math.PI / 2 - (Math.PI / 180) * hourAngle)} y2={cy - radius * 0.5 * Math.sin(Math.PI / 2 - (Math.PI / 180) * hourAngle)} stroke="white" strokeWidth="4" />
        <line x1={cx} y1={cy} x2={cx + radius * 0.75 * Math.cos(Math.PI / 2 - (Math.PI / 180) * minuteAngle)} y2={cy - radius * 0.75 * Math.sin(Math.PI / 2 - (Math.PI / 180) * minuteAngle)} stroke="white" strokeWidth="3" />
        <line x1={cx} y1={cy} x2={cx + radius * 0.85 * Math.cos(Math.PI / 2 - (Math.PI / 180) * secondAngle)} y2={cy - radius * 0.85 * Math.sin(Math.PI / 2 - (Math.PI / 180) * secondAngle)} stroke="red" strokeWidth="2" />
      </svg>
    </Box>
  );
};

const Clock = () => {
  const theme = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkInButtonText, setCheckInButtonText] = useState("Check In");
  const [timeEntries, setTimeEntries] = useState([]);
  const [totalOnlineTime, setTotalOnlineTime] = useState("0h : 0min : 0sec");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState([]);

  useEffect(() => {
    const storedCheckInTime = localStorage.getItem('checkInTime');
    const storedIsActive = JSON.parse(localStorage.getItem('isActive'));

    if (storedCheckInTime) {
      const checkInDate = new Date(storedCheckInTime);
      setCheckInTime(checkInDate);
      const timeElapsed = Math.floor((new Date() - checkInDate) / 1000);
      setElapsedTime(timeElapsed);
    }
    if (storedIsActive) {
      setIsActive(storedIsActive);
    }

    getEntries();
  }, []);

  useEffect(() => {
    filterEntriesByDateRange(); // Filter entries whenever startDate or endDate changes
  }, [startDate, endDate]);

  const handleCheckin = async () => {
    const now = new Date();
    if (!isActive) {
      setCheckInTime(now);
      setIsActive(true);
      setCheckInButtonText("Clock Out");
    } else {
      setIsActive(false);
      setCheckInButtonText("Check In");
      const checkOutTime = now;
      const totalTime = (checkOutTime - checkInTime) / 1000; // total time in seconds
      const newEntry = {
        date: checkInTime.toLocaleDateString(),
        day: checkInTime.toLocaleDateString('en-US', { weekday: 'long' }),
        checkIn: checkInTime.toISOString(),
        checkOut: checkOutTime.toISOString(),
        totalTime: formatTime(totalTime),
        email: localStorage.getItem('email')
      };
      axios.post("https://murtaza011-abidipro.mdbgo.io/api/timeEntries", newEntry)
        .then((res) => {
          getEntries();
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
      setElapsedTime(0);
      localStorage.removeItem('checkInTime');
      localStorage.removeItem('isActive');
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h : ${minutes}min : ${seconds}sec`;
  };

  const getEntries = async () => {
    try {
      const res = await axios.get('https://murtaza011-abidipro.mdbgo.io/api/timeEntries', {
        params: {
          email: localStorage.getItem('email')
        }
      });
      setTimeEntries(res.data);
      filterEntriesByDateRange(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const filterEntriesByDateRange = () => {
    if (!startDate || !endDate) {
      setFilteredEntries(timeEntries);
      calculateTotalOnlineTime(timeEntries);
      return;
    }

    const filtered = timeEntries.filter(entry => {
      const entryDate = new Date(entry.checkIn);
      return entryDate >= startDate && entryDate <= endDate;
    });
    setFilteredEntries(filtered);
    calculateTotalOnlineTime(filtered);
  };

  const calculateTotalOnlineTime = (entries) => {
    const totalSeconds = entries.reduce((acc, entry) => {
      const duration = (new Date(entry.checkOut) - new Date(entry.checkIn)) / 1000;
      return acc + duration;
    }, 0);
    setTotalOnlineTime(formatTime(totalSeconds));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Header title="ATTENDANCE" subtitle="Mark & Manage Your Attendance" />

      {/* Date Range Picker */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} sx={{ marginRight: 2 }} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', p: 3 }}>
        <Box sx={{ width: '55%', marginRight: 4 }}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>Your History</Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 3, maxHeight: '70vh', borderRadius: '16px', border: '6px solid #2AEAE3' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Day</StyledTableCell>
                  <StyledTableCell>Check In</StyledTableCell>
                  <StyledTableCell>Check Out</StyledTableCell>
                  <StyledTableCell>Total Time</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeEntries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.day}</TableCell>
                    <TableCell>{new Date(entry.checkIn).toLocaleTimeString()}</TableCell>
                    <TableCell>{new Date(entry.checkOut).toLocaleTimeString()}</TableCell>
                    <TableCell>{entry.totalTime}</TableCell>
                  </TableRow>
                ))}
                {/* Add a row to show the total online time for selected date range */}
                {startDate && endDate && (
                  <HighlightedTableRow>
                    <TableCell colSpan={4} align="right" style={{ fontWeight: 'bold' }}>Total Online Time for Selected Period:</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>{totalOnlineTime}</TableCell>
                  </HighlightedTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>Mark Your Attendance Here</Typography>
          <Card sx={{ width: '100%', boxShadow: 3, borderRadius: '16px', border: '6px solid #2AEAE3', marginBottom: 4, textAlign: 'center' }}>
            <CardContent sx={{ backgroundColor: theme.palette.background.paper }}>
              <Typography variant="h1" sx={{ color: theme.palette.text.primary }}>{formatTime(elapsedTime)}</Typography>
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

              <LiveClock /> {/* Live Clock restored */}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Clock;
