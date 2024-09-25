import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import { Box, Button, Typography, List, ListItem, ListItemText, Paper, Chip } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme'; // Assuming you have a theme file with tokens

const TaskCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('name')); // Assuming the user's name is stored in localStorage
        const response = await axios.get('https://murtaza011-abidipro.mdbgo.io/api/tasks-assigned', {
          params: { assignedTo: currentUser.name }, // Send the required parameter
        });
        if (response.data && Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          console.error('Invalid data format:', response.data);
        }
      } catch (error) {
        if (error.response) {
          console.error('API Error:', error.response.data);
        } else {
          console.error('Error fetching tasks:', error);
        }
      }
    };

    fetchTasks();
  }, []);

  // Sort tasks by priority and status
  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      const statusOrder = { Pending: 1, Complete: 2 };

      // First, sort by priority, then by status
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return statusOrder[a.taskStatus] - statusOrder[b.taskStatus];
    });
  };

  // Filter tasks for the selected date
  const getTasksForDate = (date) => {
    return sortTasks(
      tasks.filter((task) => {
        const taskStartDate = new Date(task.startDate);
        const taskEndDate = new Date(task.endDate);
        return date >= taskStartDate && date <= taskEndDate;
      })
    );
  };

  // Handle date change in the calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const tasksForSelectedDate = getTasksForDate(selectedDate);

  return (
    <Box m="20px">
      <Header title="Task Calendar" subtitle="View and manage tasks by date" />

      {/* Navigation Links */}
      <Box mb="20px">
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }}
          onClick={() => navigate('/assign-tasks')}
        >
          Assign Tasks
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate('/my-tasks')}>
          My Tasks
        </Button>
      </Box>

      {/* Calendar Component */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </Box>

        {/* Task List for Selected Date */}
        <Box sx={{ width: '50%', ml: 4 }}>
          <Typography variant="h6" sx={{ color: colors.primary[200] }}>
            Tasks for {selectedDate.toDateString()}
          </Typography>
          <List>
            {tasksForSelectedDate.length > 0 ? (
              tasksForSelectedDate.map((task) => (
                <Paper
                  key={task._id}
                  elevation={3}
                  sx={{
                    padding: '10px',
                    marginBottom: '10px',
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100],
                    borderRadius: '4px',
                  }}
                >
                  <ListItem>
                    <ListItemText
                      primary={task.taskName}
                      secondary={`Priority: ${task.priority} - Status: ${task.taskStatus}`}
                      sx={{ color: colors.grey[100] }}
                    />
                    {/* Priority Chip */}
                    <Chip
                      label={task.priority}
                      sx={{
                        backgroundColor:
                          task.priority === 'High'
                            ? colors.redAccent[500]
                            : task.priority === 'Medium'
                            ? colors.yellowAccent[500]
                            : colors.greenAccent[500],
                        color: colors.grey[100],
                      }}
                    />
                    {/* Status Chip */}
                    <Chip
                      label={task.taskStatus}
                      sx={{
                        backgroundColor:
                          task.taskStatus === 'Pending' ? colors.blueAccent[500] : colors.greenAccent[500],
                        color: colors.grey[100],
                        marginLeft: '10px',
                      }}
                    />
                  </ListItem>
                </Paper>
              ))
            ) : (
              <Typography sx={{ color: colors.grey[100] }}>No tasks for this date.</Typography>
            )}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskCalendar;
