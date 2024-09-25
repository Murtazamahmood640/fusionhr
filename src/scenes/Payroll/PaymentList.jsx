import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Header";
import { tokens } from "../../theme";

const PaymentList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await axios.get('https://murtaza011-abidipro.mdbgo.io/api/payments');
            console.log("Payments Data: ", response.data); // Log the response data
            // Ensure each payment has a unique id, use array index as fallback if `_id` is missing
            const paymentsWithId = response.data.map((payment, index) => ({
                ...payment,
                id: payment._id || index,  // Fallback to index if `_id` is missing
            }));
            setPayments(paymentsWithId);
        } catch (error) {
            toast.error("Failed to fetch payments");
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
            field: "paymentDate", 
            headerName: "Payment Date", 
            flex: 1,
            valueGetter: (params) => new Date(params.row.paymentDate).toLocaleDateString() 
        },
        { 
            field: "paymentAmount", 
            headerName: "Amount", 
            flex: 1 
        },
        { 
            field: "paymentMethod", 
            headerName: "Payment Method", 
            flex: 1 
        },
        { 
            field: "deductions", 
            headerName: "Deductions", 
            flex: 1 
        },
        { 
            field: "bonuses", 
            headerName: "Bonuses", 
            flex: 1 
        },
        { 
            field: "totalAmount", 
            headerName: "Total Amount", 
            flex: 1,
            valueGetter: (params) => 
                params.row.paymentAmount + 
                (params.row.bonuses || 0) - 
                (params.row.deductions || 0)
        },
    ];

    return (
        <Box m="20px">
            <Header title="VIEW PAYMENTS" subtitle="Manage Payment Records" />
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
                    rows={payments}
                    columns={columns}
                    getRowId={(row) => row.id} // Use the `id` field that is set to `_id` or index
                    pageSize={10}
                    pageSizeOptions={[10, 20, 50]}
                />
            </Box>

            <ToastContainer />
        </Box>
    );
};

export default PaymentList;
