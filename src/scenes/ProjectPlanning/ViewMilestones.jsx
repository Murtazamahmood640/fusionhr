import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  useTheme,
  MenuItem,
  Select,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme'; // Assuming you have a tokens file for theme-based colors
import Header from '../../components/Header';

const MilestonesList = () => {
  const [milestones, setMilestones] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [formData, setFormData] = useState({
    milestoneName: '',
    dueDate: '',
    status: '',
    description: '',
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Fetch milestones data from the server
  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await axios.get('https://murtaza011-abidipro.mdbgo.io/api/milestones');
        const milestonesData = response.data.map((milestone, index) => ({
          ...milestone,
          id: milestone._id || index, // Ensure every row has a unique `id`
        }));
        setMilestones(milestonesData);
      } catch (error) {
        console.error('Error fetching milestones:', error);
      }
    };

    fetchMilestones();
  }, []);

  // Handle edit functionality
  const handleEdit = (milestone) => {
    if (!milestone._id) {
      console.error('No valid milestone ID found');
      return;
    }
    setSelectedMilestone(milestone);
    setFormData({
      milestoneName: milestone.milestoneName,
      dueDate: milestone.dueDate,
      status: milestone.status,
      description: milestone.description,
    });
    setOpenDialog(true);
  };
  

  // Handle delete functionality
  const handleDelete = async (id) => {
    console.log('Milestone ID to delete:', id); // Check if ID is properly passed
    try {
      await axios.delete(`https://murtaza011-abidipro.mdbgo.io/api/milestones/${id}`);
      setMilestones(milestones.filter((milestone) => milestone._id !== id));
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };
  

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission to update milestone
  const handleFormSubmit = async () => {
    if (!selectedMilestone?._id) {
      console.error('No valid milestone ID found for update');
      return;
    }
  
    try {
      await axios.put(`https://murtaza011-abidipro.mdbgo.io/api/milestones/${selectedMilestone._id}`, formData);
      setMilestones(milestones.map((milestone) => 
        milestone._id === selectedMilestone._id ? { ...formData, _id: selectedMilestone._id } : milestone
      ));
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };
  

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMilestone(null);
  };

  // DataGrid columns definition
  const columns = [
    { field: 'milestoneName', headerName: 'Milestone Name', flex: 1 },
    { field: 'dueDate', headerName: 'Due Date', flex: 1, type: 'date' },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row)}
            sx={{ marginRight: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="View Milestones" subtitle="Manage list of all milestones" />

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
        }}
      >
        <DataGrid 
  rows={milestones} 
  columns={columns} 
  pageSize={10} 
  checkboxSelection 
  getRowId={(row) => row._id} // Ensure it uses the actual `_id` field
/>

      </Box>

      {/* Edit Milestone Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Milestone</DialogTitle>
        <DialogContent>
          {/* Milestone Name (TextField, remains unchanged) */}
          <TextField
            margin="dense"
            label="Milestone Name"
            name="milestoneName"
            value={formData.milestoneName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            disabled // Make name uneditable
          />

          {/* Due Date Field (Updated to Date type) */}
          <TextField
            margin="dense"
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }} // Ensures the label stays above the date picker
            variant="outlined"
          />

          {/* Status Dropdown (Using Select with MenuItem) */}
          <Select
            margin="dense"
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            displayEmpty
          >
            <MenuItem value="" disabled>Select Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>

          {/* Description Field */}
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MilestonesList;
