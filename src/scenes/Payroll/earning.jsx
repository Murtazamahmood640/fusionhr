import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Earnings = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [earnings, setEarnings] = useState([]);

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        try {
            const response = await axios.get('https://murtaza011-abidipro.mdbgo.io/api/payments');
            const earningsData = response.data.filter(payment => payment.bonuses && payment.bonuses > 0);
            setEarnings(earningsData);
        } catch (error) {
            toast.error("Failed to fetch earnings");
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
            field: "bonuses", 
            headerName: "Bonuses", 
            flex: 1,
            valueGetter: (params) => params.row.bonuses || 0 
        },
        { 
            field: "totalAmount", 
            headerName: "Total Amount", 
            flex: 1,
            valueGetter: (params) => (params.row.paymentAmount || 0) + (params.row.bonuses || 0) 
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
            <Header title="EARNINGS" subtitle="View Earnings Records" />
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
                    rows={earnings}
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

export default Earnings;
