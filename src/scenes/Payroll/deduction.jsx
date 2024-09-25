import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Deductions = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [deductions, setDeductions] = useState([]);

    useEffect(() => {
        fetchDeductions();
    }, []);

    const fetchDeductions = async () => {
        try {
            const response = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/payments');
            const filteredDeductions = response.data.filter(payment => payment.deductions && payment.deductions > 0);
            setDeductions(filteredDeductions);
        } catch (error) {
            toast.error("Failed to fetch deductions");
        }
    };

    const columns = [
        { 
            field: "payee", 
            headerName: "Payee Name", 
            flex: 1,
            valueGetter: (params) => params.row.payee ? params.row.payee.name : "Unknown" // Handling null payee
        },
        { 
            field: "deductions", 
            headerName: "Deductions", 
            flex: 1 
        },
        { 
            field: "totalAmount", 
            headerName: "Total Amount", 
            flex: 1,
            valueGetter: (params) => params.row.paymentAmount - (params.row.deductions || 0)
        },
        { 
            field: "paymentDate", 
            headerName: "Payment Date", 
            flex: 1,
            valueGetter: (params) => new Date(params.row.paymentDate).toLocaleDateString() 
        }
    ];

    return (
        <Box m="20px">
            <Header title="DEDUCTIONS" subtitle="View Deductions by Payee" />
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
                    rows={deductions}
                    columns={columns}
                    getRowId={(row) => row._id}
                    pageSize={10}
                    pageSizeOptions={[10, 20, 50]}
                    checkboxSelection // Enables checkboxes on the left
                />
            </Box>

            <ToastContainer />
        </Box>
    );
};

export default Deductions;
