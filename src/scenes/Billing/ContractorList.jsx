import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../components/Header';
import { tokens } from '../../theme';

const ContractorList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [contractors, setContractors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContractor, setEditingContractor] = useState(null);
  const [formData, setFormData] = useState({
    contractorName: '',
    serviceType: '',
    projectAssigned: '',
    hourlyRate: '',
    paymentSchedule: '',
    notes: '',
  });

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const response = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/contractors');
  
      // Ensure every row has an `id` by using `_id` if available, or falling back to the index
      const contractorsWithIds = response.data.map((contractor, index) => ({
        ...contractor,
        id: contractor._id || index, // Use `_id` if available, otherwise use the index
      }));
  
      setContractors(contractorsWithIds);
    } catch (error) {
      toast.error('Failed to fetch contractors');
    }
  };
  

  const handleEdit = (contractor) => {
    setEditingContractor(contractor);
    setFormData(contractor);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://a-khuhro-abidipro.mdbgo.io/api/contractors/${id}`);
      setContractors(contractors.filter((contractor) => contractor._id !== id));
      toast.success('Contractor deleted successfully');
    } catch (error) {
      toast.error('Failed to delete contractor');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingContractor(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async () => {
    try {
      if (editingContractor) {
        await axios.put(`https://a-khuhro-abidipro.mdbgo.io/api/contractors/${editingContractor._id}`, formData);
        setContractors(contractors.map((contractor) =>
          contractor._id === editingContractor._id ? formData : contractor
        ));
        toast.success('Contractor updated successfully');
      } else {
        await axios.post('https://a-khuhro-abidipro.mdbgo.io/api/contractors', formData);
        toast.success('Contractor created successfully');
      }
      fetchContractors();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to save the contractor');
    }
  };

  const columns = [
    { field: 'contractorName', headerName: 'Contractor Name', flex: 1 },
    { field: 'serviceType', headerName: 'Service Type', flex: 1 },
    { field: 'projectAssigned', headerName: 'Project Assigned', flex: 1 },
    { field: 'hourlyRate', headerName: 'Rate/Salary', flex: 1 },
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
      <Header title="Contractor List" subtitle="Manage Contractors" />

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
  rows={contractors}
  columns={columns}
  pageSize={10}
  checkboxSelection
  getRowId={(row) => row.id} // This will use the `id` field (either `_id` or fallback to index)
/>

      </Box>

      {/* Update Contractor Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingContractor ? 'Update Contractor' : 'Add Contractor'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Contractor Name"
            name="contractorName"
            value={formData.contractorName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Service Type"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Project Assigned"
            name="projectAssigned"
            value={formData.projectAssigned}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Rate/Salary"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Payment Schedule"
            name="paymentSchedule"
            value={formData.paymentSchedule}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Notes"
            name="notes"
            value={formData.notes}
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
            {editingContractor ? 'Save Changes' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

export default ContractorList;
