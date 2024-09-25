import React, { useState, useEffect } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import LanguageIcon from "@mui/icons-material/Language"; // Import the web icon
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import PieChart from "../../components/PieChart";
import axios from 'axios';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [employeeCount, setEmployeeCount] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    fetchEmployeeData();
    fetchProjectCount();
    fetchTasks();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get("https://a-khuhro-abidipro.mdbgo.io/api/EmployeesPayroll");
      const totalBasicSalary = response.data.reduce((acc, employee) => acc + (employee.basicSalary || 0), 0);
      setTotalExpenses(totalBasicSalary);
      setEmployeeCount(response.data.length);
    } catch (err) {
      console.log("Error fetching employee data:", err);
    }
  };

  const fetchProjectCount = async () => {
    try {
      const response = await axios.get("https://a-khuhro-abidipro.mdbgo.ioapi/project/count");
      setProjectCount(response.data.count);
    } catch (err) {
      console.log("Error fetching project count:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/my-tasks', {
        params: { name: localStorage.getItem("name") },
      });
      const taskData = response.data;
      setTasks(taskData);
      processTaskData(taskData);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const processTaskData = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.taskStatus === 'Completed').length;
    const pending = tasks.filter(task => task.taskStatus === 'Pending').length;

    setTotalTasks(total);
    setCompletedTasks(completed);
    setPendingTasks(pending);
  };

  // Calculate the progress as a percentage of completed tasks
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={employeeCount}
            subtitle="Active Employees"
            progress="0.75"
            increase="+14%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalExpenses}
            subtitle="Salary Expense"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={projectCount}
            subtitle="Active Projects"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p="20px"
        >
          <LanguageIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
          <Typography variant="h6" fontWeight="600" textAlign="center" mt="10px">
            <a href="https://abidisolutions.com" target="_blank" rel="noopener noreferrer" style={{ color: colors.grey[100], textDecoration: 'none' }}>
              Visit Our Website
            </a>
            <p style={{color: colors.greenAccent[600]}}>Abidi Solutions</p>
          </Typography>
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p="20px"
        >
          <Typography variant="h5" fontWeight="600" textAlign="center">
            Employee Dept
          </Typography>
          <Box width="100%" height="80%" mt="20px">
            <PieChart />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p="20px"
        >
          <Typography variant="h5" fontWeight="600" textAlign="center">
            Roles
          </Typography>
          <Box width="80%" height="80%" mt="20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p="30px"
        >
          <Typography variant="h5" fontWeight="600" textAlign="center">
            My Tasks
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
            width="100%"
          >
            <ProgressCircle size="125" progress={progress} />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {completedTasks} / {totalTasks} tasks completed
            </Typography>
            <Typography>Total tasks: {totalTasks}</Typography>
            <Typography>Pending tasks: {pendingTasks}</Typography>
            <Typography>Completed tasks: {completedTasks}</Typography>
          </Box>
        </Box>

        {/* Website Section */}
       
      </Box>
    </Box>
  );
};

export default Dashboard;
