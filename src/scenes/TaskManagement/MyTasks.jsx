import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, useTheme } from '@mui/material';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { ToastContainer, toast } from 'react-toastify';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('name'));
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    // Fetch tasks assigned to the logged-in user
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/tasks-assigned', {
          params: { assignedTo: currentUser.name },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [currentUser.name]);

  const handleStatusChange = async (taskId) => {
    try {
      await axios.put(`https://a-khuhro-abidipro.mdbgo.io/api/tasks-assigned/${taskId}`, {
        taskStatus: 'Complete',
      });
      toast.success('Task status updated successfully');
      // Update the local state to reflect the status change
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, taskStatus: 'Complete' } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Error updating task status');
    }
  };

  const columns = [
    { field: 'taskName', headerName: 'Task Name', flex: 1 },
    { field: 'textDescription', headerName: 'Description', flex: 2 },
    { field: 'startDate', headerName: 'Start Date', flex: 1 },
    { field: 'endDate', headerName: 'End Date', flex: 1 },
    { field: 'taskStatus', headerName: 'Status', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleStatusChange(params.row._id)}
          disabled={params.row.taskStatus === 'Complete'}
        >
          Mark as Complete
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="My Tasks" subtitle="Tasks assigned to you" />
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
      <ToastContainer />
    </Box>
  );
};

export default MyTasks;
