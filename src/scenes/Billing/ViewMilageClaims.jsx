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
import Header from "../../components/Header";

const MileageClaimsList = () => {
  const [mileageClaims, setMileageClaims] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [formData, setFormData] = useState({
    claimName: '',
    serviceType: '',
    phone: '',
    email: '',
    address: '',
    ClaimedProjectFees: '',
    contractStartDate: '',
    contractEndDate: '',
    hourlyRate: '',
    ClaimDescription: '',
    notes: '',
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    // Fetch mileage claims data from the server
    const fetchMileageClaims = async () => {
      try {
        const response = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/mileage-claims');
  
        // Ensure that each row has a unique 'id' property
        const claimsWithId = response.data.map((claim, index) => ({
          ...claim,
          id: claim._id || index, // Use '_id' if available, otherwise use the index as fallback
        }));
  
        setMileageClaims(claimsWithId);
      } catch (error) {
        console.error('Error fetching mileage claims:', error);
      }
    };
  
    fetchMileageClaims();
  }, []);
  

  const handleEdit = (claim) => {
    setSelectedClaim(claim);
    setFormData(claim);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://a-khuhro-abidipro.mdbgo.io/api/mileage-claims/${id}`);
      setMileageClaims(mileageClaims.filter((claim) => claim._id !== id));
    } catch (error) {
      console.error('Error deleting mileage claim:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClaim(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async () => {
    try {
      await axios.put(`https://a-khuhro-abidipro.mdbgo.io/api/mileage-claims/${selectedClaim._id}`, formData);
      setMileageClaims(mileageClaims.map((claim) => (claim._id === selectedClaim._id ? formData : claim)));
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating mileage claim:', error);
    }
  };

  const columns = [
    { field: 'claimName', headerName: 'Claim Name', flex: 1 },
    { field: 'serviceType', headerName: 'Service Type', flex: 1 },
    { field: 'contactInformation.phone', headerName: 'Phone', flex: 1, valueGetter: (params) => params.row.contactInformation?.phone || '' },
    { field: 'contactInformation.address', headerName: 'Address', flex: 1, valueGetter: (params) => params.row.contactInformation?.address || '' },
    // { field: 'ClaimedProjectFees', headerName: 'Claimed Project Fees', flex: 1 },
    { field: 'contractStartDate', headerName: 'Contract Start Date', flex: 1, valueGetter: (params) => new Date(params.row.contractStartDate).toLocaleDateString() },
    // { field: 'hourlyRate', headerName: 'Hourly Rate ($)', flex: 1 },
    // { field: 'notes', headerName: 'Notes/Comments', flex: 1 },
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
      <Header title="EMPLOYEE MILEAGE CLAIMS" subtitle="Manage Your Mileage Claims" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid 
          rows={mileageClaims} 
          columns={columns} 
          pageSize={10} 
          checkboxSelection 
          getRowId={(row) => row._id} // Use _id as the unique identifier for each row
        />
      </Box>

      {/* Update Claim Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Mileage Claim</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Claim Name"
            name="claimName"
            value={formData.claimName}
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
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Claimed Project Fees"
            name="ClaimedProjectFees"
            value={formData.ClaimedProjectFees}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Contract Start Date"
            name="contractStartDate"
            type="date"
            value={formData.contractStartDate}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Contract End Date"
            name="contractEndDate"
            type="date"
            value={formData.contractEndDate}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Hourly Rate"
            name="hourlyRate"
            type="number"
            value={formData.hourlyRate}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Description"
            name="ClaimDescription"
            value={formData.ClaimDescription}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Notes/Comments"
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MileageClaimsList;
