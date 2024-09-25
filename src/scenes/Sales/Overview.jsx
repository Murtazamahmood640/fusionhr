import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Grid, Box, useTheme } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { tokens } from "../../theme";
import Header from '../../components/Header';

const Overview = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const response = await axios.get('https://murtaza011-abidipro.mdbgo.io/api/overview');
        setOverviewData(response.data);
      } catch (error) {
        console.error('Error fetching overview data:', error);
        setError('Failed to fetch overview data.');
      }
    };

    fetchOverviewData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!overviewData) {
    return <div><CircularProgress /> Loading...</div>;
  }

  const { totalProducts, totalInvoices, totalClients, totalRevenue, recentInvoices, topProducts } = overviewData;

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
      <Header title="Sales Overview" subtitle="Overview of payroll, sales, and expenses" />

      {/* Top Section: 4 Grids */}
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Box style={gridStyles}>
            <InventoryIcon style={iconStyles} />
            <Typography variant="h6" style={{ color: textColor }}>Total Products</Typography>
            <Typography variant="h5" style={{ color: textColor }}>{totalProducts || 0}</Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box style={gridStyles}>
            <ReceiptIcon style={iconStyles} />
            <Typography variant="h6" style={{ color: textColor }}>Total Invoices</Typography>
            <Typography variant="h5" style={{ color: textColor }}>{totalInvoices || 0}</Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box style={gridStyles}>
            <PeopleIcon style={iconStyles} />
            <Typography variant="h6" style={{ color: textColor }}>Total Clients</Typography>
            <Typography variant="h5" style={{ color: textColor }}>{totalClients || 0}</Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box style={gridStyles}>
            <MonetizationOnIcon style={iconStyles} />
            <Typography variant="h6" style={{ color: textColor }}>Total Revenue</Typography>
            <Typography variant="h5" style={{ color: textColor }}>${totalRevenue || 0}</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Bottom Section: 2 Grids */}
      <Grid container spacing={2} style={{ marginTop: 20 }}>
        <Grid item xs={6}>
          <Typography variant="h4" gutterBottom style={headingStyles}>
            Recent Invoices
          </Typography>
          <Box style={{ ...gridStyles, paddingTop: 0 }}>
          {recentInvoices && recentInvoices.length > 0 ? (
              <TableContainer component={Paper} style={{ boxShadow: 'none', backgroundColor: colors.primary[400] }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={centeredTableCell}>Invoice Number</TableCell>
                      <TableCell style={centeredTableCell}>Client</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentInvoices.map(invoice => (
                      <TableRow key={invoice._id}>
                        <TableCell style={centeredTableCell}>{invoice.invoiceNumber}</TableCell>
                        <TableCell style={centeredTableCell}>{invoice.client.clientName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography style={{ color: textColor, textAlign: 'center' }}>No recent invoices available.</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4" gutterBottom style={headingStyles}>
            Top Products
          </Typography>
          <Box style={gridStyles}>
            {topProducts && topProducts.length > 0 ? (
              <PieChart width={400} height={400}>
                <Pie
                  data={topProducts}
                  dataKey="totalSales"
                  nameKey="productName"
                  outerRadius={150}
                  fill={theme.palette.primary.main}
                  label
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? theme.palette.secondary.main : theme.palette.success.main} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <Typography style={{ color: textColor, textAlign: 'center' }}>No top products data available.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Overview;
