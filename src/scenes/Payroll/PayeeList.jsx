import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Header";
import { tokens } from "../../theme";

const PayeeList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [payees, setPayees] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingPayee, setEditingPayee] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        employeeId: '',
        department: '',
        bankAccount: '',
        taxId: '',
        taxCategory: '',
        taxPercentage: '',
    });
    const [reFetch, setReFetch] = useState(false);

    useEffect(() => {
        fetchPayees();
    }, [reFetch]);

    const fetchPayees = async () => {
        try {
            const response = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/payees');
            const payeesWithId = response.data.map((payee, index) => ({
                ...payee,
                id: payee._id || index,  // Fallback to index if _id is missing
            }));
            setPayees(payeesWithId);
        } catch (error) {
            toast.error("Failed to fetch payees");
        }
    };

    const handleEditClick = (payee) => {
        setEditingPayee(payee);
        setFormData({
            name: payee.name,
            employeeId: payee.employeeId,
            department: payee.department,
            bankAccount: payee.bankAccount,
            taxId: payee.taxInformation?.taxId || '',
            taxCategory: payee.taxInformation?.taxCategory || '',
            taxPercentage: payee.taxInformation?.taxPercentage || '',
        });
        setOpenDialog(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await axios.delete(`https://a-khuhro-abidipro.mdbgo.io/api/payees/${id}`);
            setReFetch(!reFetch);
            toast.success("Payee deleted successfully");
        } catch (error) {
            toast.error("Failed to delete payee");
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingPayee(null);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFormSubmit = async () => {
        try {
            if (editingPayee) {
                await axios.put(`https://a-khuhro-abidipro.mdbgo.io/api/payees/${editingPayee._id}`, formData);
                toast.success("Payee updated successfully");
            } else {
                await axios.post('https://a-khuhro-abidipro.mdbgo.io/api/payees', formData);
                toast.success("Payee created successfully");
            }
            fetchPayees();
            handleCloseDialog();
        } catch (error) {
            toast.error("Failed to save the payee");
        }
    };

    const columns = [
        { field: "name", headerName: "Payee Name", flex: 1 },
        { field: "employeeId", headerName: "Employee ID", flex: 1 },
        { field: "department", headerName: "Department", flex: 1 },
        { field: "bankAccount", headerName: "Bank Account", flex: 1 },
        { 
            field: "taxId", 
            headerName: "Tax ID", 
            flex: 1,
            valueGetter: (params) => params.row.taxInformation?.taxId || ''
        },
        { 
            field: "taxCategory", 
            headerName: "Tax Category", 
            flex: 1,
            valueGetter: (params) => params.row.taxInformation?.taxCategory || ''
        },
        { 
            field: "taxPercentage", 
            headerName: "Tax Percentage (%)", 
            flex: 1,
            valueGetter: (params) => params.row.taxInformation?.taxPercentage || ''
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleEditClick(params.row)}
                        sx={{ marginRight: 1 }}
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
            <Header title="PAYEE LIST" subtitle="Manage Payees" />
            <Box
                height="75vh"
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
                        alignItems: 'center',
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
                    rows={payees}
                    columns={columns}
                    getRowId={(row) => row.id}  // Using `id` instead of `_id` now
                    pageSize={10}
                    pageSizeOptions={[10, 20, 50]}
                    checkboxSelection
                />
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editingPayee ? 'Edit Payee' : 'Add Payee'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Payee Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Employee ID"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Bank Account"
                        name="bankAccount"
                        value={formData.bankAccount}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Tax ID"
                        name="taxId"
                        value={formData.taxId}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <Select
                        label="Tax Category"
                        name="taxCategory"
                        value={formData.taxCategory}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        margin="dense"
                    >
                        <MenuItem value="Exempt">Exempt</MenuItem>
                        <MenuItem value="Standard Rate">Standard Rate</MenuItem>
                        <MenuItem value="Reduced Rate">Reduced Rate</MenuItem>
                    </Select>
                    <TextField
                        margin="dense"
                        label="Tax Percentage"
                        name="taxPercentage"
                        type="number"
                        value={formData.taxPercentage}
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

            <ToastContainer />
        </Box>
    );
};

export default PayeeList;
