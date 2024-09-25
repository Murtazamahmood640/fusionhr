import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Grid, Box, useTheme } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { tokens } from "../../theme";
import Header from '../../components/Header';

const PayrollDashboard = () => {
  const [overview, setOverview] = useState({
    totalPayees: 0,
    totalPayments: 0,
    totalDeductions: 0,
    totalBonuses: 0,
    recentPayments: [], // Ensure this is initialized as an empty array
  });
  const [error, setError] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/payroll/overview');
        setOverview(response.data);
      } catch (error) {
        console.error('Error fetching payroll overview:', error);
        setError('Failed to fetch overview data.');
      }
    };

    fetchOverview();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!overview) {
    return <div><CircularProgress /> Loading...</div>;
  }

  // Destructure and set defaults to avoid accessing undefined properties
  const { totalPayees, totalPayments, totalDeductions, totalBonuses, recentPayments = [] } = overview;

  // Debug output for recentPayments
  console.log('Recent Payments:', recentPayments);

  const pieData = [
    { name: 'Payments', value: totalPayments || 0 },
    { name: 'Deductions', value: totalDeductions || 0 },
    { name: 'Bonuses', value: totalBonuses || 0 },
  ];

  const gridStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: colors.primary[400],
    height: '100%', // Ensure the grid takes full height
  };

  const iconStyles = {
    fontSize: '40px',
    marginBottom: '10px',
    color: colors.greenAccent[600],
  };

  const textColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  const centeredTableCell = {
    color: textColor,
    textAlign: 'center',
  };

  const headingStyles = {
    paddingBottom: '20px',
    color: textColor,
    textAlign: 'center',
  };

  return (
    <Paper style={{ padding: 20, backgroundColor: theme.palette.background.paper }}>
      <Header title="Payroll Dashboard" subtitle="Overview of payroll statistics" />

      {/* Top Section: 4 Grids */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Box style={gridStyles}>
            <InventoryIcon style={iconStyles} />
            <Typography variant="h6" style={{ color: textColor }}>Total Payees</Typography>
            <Typography variant="h5" style={{ color: textColor }}>{totalPayees || 0}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box style={gridStyles}>
            <MonetizationOnIcon style={iconStyles} />
            <Typography variant="h6" style={{ color: textColor }}>Total Payments</Typography>
            <Typography variant="h5" style={{ color: textColor }}>${(totalPayments || 0).toFixed(2)}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box style={gridStyles}>
            <AttachMoneyIcon style={iconStyles} />
            <Typography variant="h6" style={{ color: textColor }}>Total Deductions</Typography>
            <Typography variant="h5" style={{ color: textColor }}>${(totalDeductions || 0).toFixed(2)}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box style={gridStyles}>
            <AccountBalanceIcon style={iconStyles} />
            <Typography variant="h6" style={{ color: textColor }}>Total Bonuses</Typography>
            <Typography variant="h5" style={{ color: textColor }}>${(totalBonuses || 0).toFixed(2)}</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Bottom Section: Pie Chart and Recent Payments */}
      <Grid container spacing={2} style={{ marginTop: 20 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom style={headingStyles}>
            Payroll Overview
          </Typography>
          <Box style={{ ...gridStyles, paddingTop: 0 }}>
            <PieChart width={400} height={400}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={150}
                fill={theme.palette.primary.main}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? theme.palette.secondary.main : theme.palette.success.main} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom style={headingStyles}>
            Recent Payments
          </Typography>
          <Box style={{ ...gridStyles, paddingTop: 0 }}>
            {recentPayments.length > 0 ? ( // Add check for array length
              <TableContainer component={Paper} style={{ boxShadow: 'none', backgroundColor: colors.primary[400] }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={centeredTableCell}>Payment ID</TableCell>
                      <TableCell style={centeredTableCell}>Amount</TableCell>
                      <TableCell style={centeredTableCell}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentPayments.slice(0, 5).map(payments => (
                      <TableRow key={payments._id}>
                        <TableCell style={centeredTableCell}>{payments.paymentId || 'N/A'}</TableCell>
                        <TableCell style={centeredTableCell}>${(payments.amount || 0).toFixed(2)}</TableCell>
                        <TableCell style={centeredTableCell}>{new Date(payments.date).toLocaleDateString() || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography style={{ color: textColor, textAlign: 'center' }}>No recent payments available.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PayrollDashboard;
