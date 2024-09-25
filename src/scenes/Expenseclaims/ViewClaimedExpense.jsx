import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Header";
import { tokens } from "../../theme";

const ViewClaims = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [claims, setClaims] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingClaim, setEditingClaim] = useState(null);
    const [formData, setFormData] = useState({
        claimName: '',
        claimType: '',
        phone: '',
        email: '',
        address: '',
        claimAmount: '',
        Date: '',
        ClaimDescription: '',
        notes: '',
    });
    const fetchClaims = async () => {
        try {
            const response = await fetch('https://murtaza011-abidipro.mdbgo.io/api/mileage-claims');

            // Check if the response content-type is JSON
            if (response.headers.get('content-type')?.includes('application/json')) {
                const data = await response.json();
                const claimsWithIds = data.map((claim, index) => ({
                    ...claim,
                    id: claim._id || index, // Use `_id` or fallback to index
                }));
                setClaims(claimsWithIds);
            } else {
                throw new Error('Invalid JSON response');
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            toast.error('Failed to fetch claimed expenses');
        }
    };
    useEffect(() => {



        fetchClaims();
    }, []);


    const handleOpenDialog = (claim = null) => {
        setEditingClaim(claim);
        setFormData({
            claimName: claim ? claim.claimName : '',
            claimType: claim ? claim.claimType : '',
            phone: claim ? claim.contactInformation.phone : '',
            email: claim ? claim.contactInformation.email : '',
            address: claim ? claim.contactInformation.address : '',
            claimAmount: claim ? claim.claimAmount : '',
            Date: claim ? claim.Date.split('T')[0] : '',
            ClaimDescription: claim ? claim.ClaimDescription : '',
            notes: claim ? claim.notes : '',
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingClaim(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormSubmit = async () => {
        try {
            if (editingClaim) {
                await axios.put(`https://murtaza011-abidipro.mdbgo.io/api/expense-claims/${editingClaim._id}`, formData);
                toast.success("Expense claim updated successfully");
            } else {
                await axios.post('https://murtaza011-abidipro.mdbgo.io/api/expense-claims', formData);
                toast.success("Expense claim created successfully");
            }
            fetchClaims();
            handleCloseDialog();
        } catch (error) {
            toast.error("Failed to save the expense claim");
        }
    };

    const handleEditClick = (claim) => {
        handleOpenDialog(claim);
    };

    const handleDeleteClick = async (id) => {
        try {
            await axios.delete(`https://murtaza011-abidipro.mdbgo.io/api/expense-claims/${id}`);
            setClaims(claims.filter((claim) => claim._id !== id));
            toast.success("Expense claim deleted successfully");
        } catch (error) {
            toast.error("Failed to delete expense claim");
        }
    };

    const columns = [
        {
            field: "claimName",
            headerName: "Claim Name",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "claimType",
            headerName: "Claim Type",
            flex: 1,
            minWidth: 120,
        },
        {
            field: "contactInformation",
            headerName: "Contact Info",
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <Tooltip title={`Phone: ${params.row.contactInformation.phone}\nEmail: ${params.row.contactInformation.email}\nAddress: ${params.row.contactInformation.address}`}>
                    <span>{`${params.row.contactInformation.phone} / ${params.row.contactInformation.email}`}</span>
                </Tooltip>
            ),
        },
        {
            field: "claimAmount",
            headerName: "Claim Amount",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "Date",
            headerName: "Date",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "ClaimDescription",
            headerName: "Description",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            minWidth: 180,
            renderCell: (params) => (
                <Box display="flex" gap={1}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditClick(params.row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteClick(params.row._id)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box m="20px">
            <Header title="EXPENSE CLAIMS" subtitle="Manage Expense Claims" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": { border: "none" },
                    "& .MuiDataGrid-cell": { borderBottom: "none", whiteSpace: 'normal' },
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
                    rows={claims}
                    columns={columns}
                    getRowId={(row) => row._id || row.id} // Use `id` as the unique row identifier
                    pageSize={10}
                    pageSizeOptions={[10, 20, 50]}
                />
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingClaim ? 'Edit Expense Claim' : 'Add Expense Claim'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="claimName"
                                label="Claim Name"
                                value={formData.claimName}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="claimType"
                                label="Claim Type"
                                value={formData.claimType}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="phone"
                                label="Phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="email"
                                name="email"
                                label="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="address"
                                label="Address"
                                value={formData.address}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number"
                                name="claimAmount"
                                label="Claim Amount"
                                value={formData.claimAmount}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="date"
                                name="Date"
                                label="Date"
                                value={formData.Date}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                name="ClaimDescription"
                                label="Description"
                                value={formData.ClaimDescription}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                name="notes"
                                label="Notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleFormSubmit} color="primary">
                        {editingClaim ? 'Save Changes' : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    );
};

export default ViewClaims;
