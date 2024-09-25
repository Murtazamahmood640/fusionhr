import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, useTheme } from '@mui/material';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const Team = ({ setEmployeeCount }) => {
  const [teamData, setTeamData] = useState([]);
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/getUser');
        const data = response.data.map((user, index) => ({
          ...user,
          id: user._id || index, // Ensure every row has a unique `id`
        }));
        setTeamData(data);
        setEmployeeCount(data.length);
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };

    fetchTeamData();
  }, [setEmployeeCount]);

  // Function to get the correct icon based on the role
  const getIconByRole = (role) => {
    switch (role) {
      case "Admin":
        return <AdminPanelSettingsOutlinedIcon />;
      case "HRManager":
        return <SupervisorAccountOutlinedIcon />;
      case "FinanceManager":
        return <AccountBalanceOutlinedIcon />;
      case "SalesManager":
        return <BusinessCenterOutlinedIcon />;
      case "ProjectManager":
        return <SecurityOutlinedIcon />;
      case "TeamLead":
        return <GroupOutlinedIcon />;
      case "Employee":
        return <LockOpenOutlinedIcon />;
      default:
        return null;
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'designation', headerName: 'Designation', flex: 1 },
    { 
      field: 'status', 
      headerName: 'Role', 
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          {getIconByRole(params.value)}
          <Typography sx={{ marginLeft: 1 }}>{params.value}</Typography>
        </Box>
      ),
    },
    { field: 'personalEmail', headerName: 'Email', flex: 1 },
    { field: 'phoneNumber', headerName: 'Contact No.', flex: 1 }, // Ensure this field exists in backend
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />

      <Box
        height="600px"
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
          rows={teamData} 
          columns={columns} 
          pageSize={10} 
          checkboxSelection 
          getRowId={(row) => row._id || row.id} // Ensure each row has a unique ID
        />
      </Box>
    </Box>
  );
};

export default Team;
