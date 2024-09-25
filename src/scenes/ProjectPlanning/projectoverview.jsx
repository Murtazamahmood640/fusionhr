import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Grid, Box, useTheme } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import FolderIcon from '@mui/icons-material/Folder';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const ProjectOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('https://murtaza011-abidipro.mdbgo.io/api/project-overview');
        console.log('API Response:', response.data); // Log API response to verify
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to fetch dashboard data.');
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!dashboardData) {
    return <div><CircularProgress /> Loading...</div>;
  }

  const { totalProjects, totalTasks, completedTasks, pendingTasks, recentProjects } = dashboardData;

  // Data for Pie Chart
  const taskDistribution = [
    { name: 'Completed Tasks', value: completedTasks || 0 },
    { name: 'Pending Tasks', value: pendingTasks || 0 },
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
      <Header title="Project Overview" subtitle="Overview of your projects and tasks" />

      {/* Top Section: 4 Grids */}
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Box style={gridStyles}>
            <FolderIcon style={iconStyles} />
            <Typography variant="h6" style={{ color: textColor }}>Total Projects</Typography>
            <Typography variant="h5" style={{ color: textColor }}>{totalProjects || 0}</Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box style={gridStyles}>
            <AssignmentIcon style={iconStyles} />
            <Typography variant="h6" style={{ color: textColor }}>Total Tasks</Typography>
            <Typography variant="h5" style={{ color: textColor }}>{totalTasks || 0}</Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box style={gridStyles}>
            <DoneAllIcon style={iconStyles} />
            <Typography variant="h6" style={{ color: textColor }}>Completed Tasks</Typography>
            <Typography variant="h5" style={{ color: textColor }}>{completedTasks || 0}</Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box style={gridStyles}>
            <PendingActionsIcon style={iconStyles} />
            <Typography variant="h6" style={{ color: textColor }}>Pending Tasks</Typography>
            <Typography variant="h5" style={{ color: textColor }}>{pendingTasks || 0}</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Bottom Section: 2 Grids */}
      <Grid container spacing={2} style={{ marginTop: 20 }}>
        <Grid item xs={6}>
          <Typography variant="h4" gutterBottom style={headingStyles}>
            Recent Projects
          </Typography>
          <Box style={{ ...gridStyles, paddingTop: 0 }}>
            {recentProjects && recentProjects.length > 0 ? (
              <TableContainer component={Paper} style={{ boxShadow: 'none', backgroundColor: colors.primary[400] }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={centeredTableCell}>Project Name</TableCell>
                      <TableCell style={centeredTableCell}>Start Date</TableCell>
                      <TableCell style={centeredTableCell}>End Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentProjects.map(project => (
                      <TableRow key={project._id}>
                        <TableCell style={centeredTableCell}>{project.projectName || "N/A"}</TableCell>
                        <TableCell style={centeredTableCell}>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                        <TableCell style={centeredTableCell}>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography style={{ color: textColor, textAlign: 'center' }}>No recent projects available.</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4" gutterBottom style={headingStyles}>
            Task Distribution
          </Typography>
          <Box style={gridStyles}>
            {taskDistribution && taskDistribution.length > 0 ? (
              <PieChart width={400} height={400}>
                <Pie
                  data={taskDistribution}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={150}
                  fill={theme.palette.primary.main}
                  label
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? theme.palette.secondary.main : theme.palette.success.main} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <Typography style={{ color: textColor, textAlign: 'center' }}>No task data available.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProjectOverview;
