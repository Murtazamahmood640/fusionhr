import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Header";
import { tokens } from "../../theme";

const BillList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [bills, setBills] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingBill, setEditingBill] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        dueDate: '',
        vendor: '',
        category: '',
        status: '',
    });

    useEffect(() => {
        fetchBills();
    }, []);

    // Fetch bills from backend
    const fetchBills = async () => {
        try {
            const response = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/bills');
            
            // Ensure each bill has an 'id' field, fallback to index if '_id' is missing
            const billsWithIds = response.data.map((bill, index) => ({
                ...bill,
                id: bill._id || index // Use _id if available, otherwise fallback to index
            }));

            setBills(billsWithIds);
        } catch (error) {
            toast.error("Failed to fetch bills");
        }
    };

    // Handle opening of dialog
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // Handle closing of dialog and resetting state
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingBill(null);
        setFormData({
            title: '',
            amount: '',
            dueDate: '',
            vendor: '',
            category: '',
            status: '',
        });
    };

    // Handle input change in form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission for creating or updating a bill
    const handleFormSubmit = async () => {
        try {
            if (editingBill) {
                // Update bill
                await axios.put(`https://a-khuhro-abidipro.mdbgo.io/api/bills/${editingBill._id}`, formData);
                toast.success("Bill updated successfully");
            } else {
                // Create new bill
                await axios.post('https://a-khuhro-abidipro.mdbgo.io/api/bills', formData);
                toast.success("Bill created successfully");
            }
            fetchBills(); // Refresh bill list
            handleCloseDialog();
        } catch (error) {
            toast.error("Failed to save the bill");
        }
    };

    // Handle click for editing a bill
    const handleEditClick = (bill) => {
        setEditingBill(bill);
        setFormData({
            title: bill.title,
            amount: bill.amount,
            dueDate: bill.dueDate.split('T')[0], // Format date correctly for date input
            vendor: bill.vendor,
            category: bill.category,
            status: bill.status,
        });
        setOpenDialog(true);
    };

    // Handle click for deleting a bill
    const handleDeleteClick = async (id) => {
        try {
            await axios.delete(`https://a-khuhro-abidipro.mdbgo.io/api/bills/${id}`);
            setBills(bills.filter((bill) => bill._id !== id)); // Optimistically remove from state
            toast.success("Bill deleted successfully");
        } catch (error) {
            toast.error("Failed to delete bill");
        }
    };

    const columns = [
        { field: "title", headerName: "Bill Title/Name", flex: 1, minWidth: 150 },
        { field: "amount", headerName: "Amount", flex: 1, minWidth: 120 },
        { field: "dueDate", headerName: "Due Date", flex: 1, minWidth: 150 },
        { field: "vendor", headerName: "Vendor Name", flex: 1, minWidth: 150 },
        { field: "category", headerName: "Category", flex: 1, minWidth: 150 },
        { field: "status", headerName: "Status", flex: 1, minWidth: 150 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            minWidth: 180,
            renderCell: (params) => (
                <Box display="flex" gap={1}>
                    <Button variant="contained" color="primary" onClick={() => handleEditClick(params.row)}>Edit</Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(params.row._id)}>Delete</Button>
                </Box>
            ),
        },
    ];

    return (
        <Box m="20px">
            <Header title="BILL LIST" subtitle="Manage Bills" />
            <Box
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
                    rows={bills}
                    columns={columns}
                    getRowId={(row) => row.id} // Use the 'id' field as unique row identifier
                    pageSize={10}
                    checkboxSelection
                    pageSizeOptions={[10, 20, 50]}
                />
            </Box>

            {/* Dialog for Adding/Editing Bills */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingBill ? 'Edit Bill' : 'Add Bill'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="title"
                                label="Bill Title/Name"
                                value={formData.title}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number"
                                name="amount"
                                label="Amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="date"
                                name="dueDate"
                                label="Due Date"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="vendor"
                                label="Vendor Name"
                                value={formData.vendor}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="category"
                                label="Category"
                                value={formData.category}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                name="status"
                                label="Status"
                                value={formData.status}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                            >
                                <MenuItem value="Unpaid">Unpaid</MenuItem>
                                <MenuItem value="Paid">Paid</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleFormSubmit} color="primary">
                        {editingBill ? 'Save Changes' : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    );
};

export default BillList;
