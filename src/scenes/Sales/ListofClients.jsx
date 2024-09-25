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
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme'; // Assuming you have a tokens file for theme-based colors
import Header from '../../components/Header';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientId: '',
    companyName: '',
    email: '',
    contactNumber: '',
    billingAddress: '',
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    // Fetch clients data from the server
    const fetchClients = async () => {
      try {
        const response = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/clients');
        const clientsData = response.data.map((client, index) => ({
          ...client,
          id: client._id || index, // Ensure every row has a unique `id`
        }));
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  const handleEdit = (client) => {
    setSelectedClient(client);
    setFormData(client);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://a-khuhro-abidipro.mdbgo.io/api/clients/${id}`);
      setClients(clients.filter((client) => client._id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClient(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async () => {
    try {
      await axios.put(`https://a-khuhro-abidipro.mdbgo.io/api/clients/${selectedClient._id}`, formData);
      setClients(clients.map((client) => (client._id === selectedClient._id ? formData : client)));
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const columns = [
    { field: 'clientName', headerName: 'Client Name', flex: 1 },
    { field: 'clientId', headerName: 'Client ID', flex: 1 },
    { field: 'companyName', headerName: 'Company Name', flex: 1 },
    { field: 'email', headerName: 'Email Address', flex: 1 },
    { field: 'contactNumber', headerName: 'Contact Number', flex: 1 },
    { field: 'billingAddress', headerName: 'Billing Address', flex: 1 },
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
      <Header title="View Clients" subtitle="Manage list of all Clients" />

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
          rows={clients} 
          columns={columns} 
          pageSize={10} 
          checkboxSelection 
          getRowId={(row) => row.id} // Updated to use `id` for each row
        />
      </Box>

      {/* Update Client Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Client</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Client ID"
            name="clientId"
            value={formData.clientId}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Billing Address"
            name="billingAddress"
            value={formData.billingAddress}
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

export default ClientsList;
