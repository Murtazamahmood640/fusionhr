import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, useTheme } from '@mui/material';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const TaskStatus = () => {
  const [tasks, setTasks] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('name'));
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    // Fetch tasks assigned by the current user (assigner)
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://murtaza011-abidipro.mdbgo.io/api/tasks-assigned', {
          params: { assignedBy: currentUser.name },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [currentUser.name]);

  const columns = [
    { field: 'taskName', headerName: 'Task Name', flex: 1 },
    { field: 'assignedTo', headerName: 'Assigned To', flex: 1 },
    { field: 'startDate', headerName: 'Start Date', flex: 1 },
    { field: 'endDate', headerName: 'End Date', flex: 1 },
    { field: 'taskStatus', headerName: 'Status', flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="Task Status" subtitle="Tasks assigned by you" />
      <Box
        height="600px"
        sx={{
          '& .MuiDataGrid-root': {
            backgroundColor: colors.primary[400],
            borderRadius: '4px',
            border: 'none',
            color: colors.grey[100],
          },
          '& .MuiDataGrid-cell': {
            padding: '8px',
            fontSize: '12px',
            color: colors.grey[100],
            borderBottom: `1px solid ${colors.primary[200]}`,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: '14px',
            borderBottom: 'none',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            borderTop: 'none',
          },
          '& .MuiCheckbox-root': {
            color: `${colors.blueAccent[200]} !important`,
          },
        }}
      >
        <DataGrid 
          rows={tasks} 
          columns={columns} 
          pageSize={10} 
          checkboxSelection 
          getRowId={(row) => row._id} 
        />
      </Box>
    </Box>
  );
};

export default TaskStatus;
