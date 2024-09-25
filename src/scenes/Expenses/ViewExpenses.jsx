import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Select, MenuItem, Grid, FormControl, InputLabel, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Header";
import { tokens } from "../../theme";
import "./Expenses.css"; // Import the CSS file

const ViewExpenses= () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [expenses, setExpenses] = useState([]);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [reFetch, setReFetch] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, [reFetch]);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('https://murtaza011-abidipro.mdbgo.io/api/expenses');
            console.log("response" , response)
            const expensesWithIds = response.data.map((expense, index) => ({
                ...expense,
                id: expense._id || index,  // Fallback to index if `_id` is missing
            }));
            setExpenses(expensesWithIds);
        } catch (error) {
            toast.error("Failed to fetch expenses");
        }
    };

    const handleEditClick = (expense) => {
        setEditingExpense(expense);
        setPopupOpen(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await axios.delete(`https://murtaza011-abidipro.mdbgo.io/api/expenses/${id}`);
            setReFetch(!reFetch);
            toast.success("Expense deleted successfully");
        } catch (error) {
            toast.error("Failed to delete expense");
        }
    };

    const handlePopupClose = () => {
        setPopupOpen(false);
        setEditingExpense(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            title: e.target.title.value,
            amount: parseFloat(e.target.amount.value),
            category: e.target.category.value,
            date: new Date(e.target.date.value),
            description: e.target.description.value,
            vendor: e.target.vendor.value,
            paymentMethod: e.target.paymentMethod.value,
            status: e.target.status.value,
        };

        try {
            if (editingExpense) {
                await axios.put(`https://murtaza011-abidipro.mdbgo.io/api/expenses/${editingExpense._id}`, formData);
                toast.success("Expense updated successfully");
            } else {
                await axios.post('https://murtaza011-abidipro.mdbgo.io/api/expenses', formData);
                toast.success("Expense created successfully");
            }
            fetchExpenses();
            handlePopupClose();
        } catch (error) {
            toast.error("Failed to save the expense");
        }
    };

    const columns = [
        { field: "title", headerName: "Title", flex: 1 },
        { field: "amount", headerName: "Amount", flex: 1 },
        { field: "category", headerName: "Category", flex: 1 },
        { field: "date", headerName: "Date", flex: 1, type: 'date', valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
        { field: "vendor", headerName: "Vendor", flex: 1 },
        { field: "paymentMethod", headerName: "Payment Method", flex: 1 },
        { field: "status", headerName: "Status", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <Button variant="contained" color="primary" onClick={() => handleEditClick(params.row)}>Edit</Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(params.row._id)}>Delete</Button>
                </Box>
            ),
        },
    ];

    return (
        <Box m="20px">
            <Header title="EXPENSE LIST" subtitle="Manage Expenses" />
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
                    rows={expenses}
                    columns={columns}
                    getRowId={(row) => row.id} // Use `id` which is either `_id` or the index fallback
                    pageSize={10}
                    pageSizeOptions={[10, 20, 50]}
                />
            </Box>

            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
                        <form onSubmit={handleFormSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        type="text"
                                        id="title"
                                        name="title"
                                        label="Title"
                                        required
                                        defaultValue={editingExpense ? editingExpense.title : ''}
                                        fullWidth
                                        className="custom-textfield"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        label="Amount"
                                        required
                                        defaultValue={editingExpense ? editingExpense.amount : ''}
                                        fullWidth
                                        className="custom-textfield"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined" className="custom-select">
                                        <InputLabel id="category-label">Category</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            id="category"
                                            name="category"
                                            label="Category"
                                            required
                                            defaultValue={editingExpense ? editingExpense.category : 'Travel'} // Set default value
                                        >
                                            <MenuItem value="Travel">Travel</MenuItem>
                                            <MenuItem value="Office Supplies">Office Supplies</MenuItem>
                                            <MenuItem value="Marketing">Marketing</MenuItem>
                                            <MenuItem value="Other">Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        type="date"
                                        id="date"
                                        name="date"
                                        label="Date"
                                        required
                                        defaultValue={editingExpense ? new Date(editingExpense.date).toISOString().split('T')[0] : ''}
                                        fullWidth
                                        className="custom-textfield"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        type="text"
                                        id="vendor"
                                        name="vendor"
                                        label="Vendor"
                                        defaultValue={editingExpense ? editingExpense.vendor : ''}
                                        fullWidth
                                        className="custom-textfield"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined" className="custom-select">
                                        <InputLabel id="paymentMethod-label">Payment Method</InputLabel>
                                        <Select
                                            labelId="paymentMethod-label"
                                            id="paymentMethod"
                                            name="paymentMethod"
                                            label="Payment Method"
                                            required
                                            defaultValue={editingExpense ? editingExpense.paymentMethod : 'Credit Card'} // Set default value
                                        >
                                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                            <MenuItem value="Cash">Cash</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined" className="custom-select">
                                        <InputLabel id="status-label">Status</InputLabel>
                                        <Select
                                            labelId="status-label"
                                            id="status"
                                            name="status"
                                            label="Status"
                                            required
                                            defaultValue={editingExpense ? editingExpense.status : 'Pending'} // Set default value
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Approved">Approved</MenuItem>
                                            <MenuItem value="Rejected">Rejected</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Box mt={2}>
                                <Button type="submit" variant="contained" color="primary">
                                    {editingExpense ? 'Save Changes' : 'Submit'}
                                </Button>
                                <Button onClick={handlePopupClose} type="button" variant="contained" color="secondary" style={{ marginLeft: 8 }}>
                                    Cancel
                                </Button>
                            </Box>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </Box>
    );
};

export default ViewExpenses;
