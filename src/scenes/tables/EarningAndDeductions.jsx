import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import Header from "../../components/Header";
import { tokens } from '../../theme';

const EarningAndDeductions = ({ setTotalExpenses }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {}; // Ensure colors is always an object

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const employees = await axios.get("https://a-khuhro-abidipro.mdbgo.io/api/EmployeesPayroll");
      setProjects(employees.data);

      // Calculate the total expenses (sum of basic salaries)
      const totalExpenses = employees.data.reduce((acc, employee) => acc + (employee.basicSalary || 0), 0);
      setTotalExpenses(totalExpenses);

    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    { field: "employeeId", headerName: "Employee ID", width: 150 },
    { field: "employeeName", headerName: "Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "basicSalary", headerName: "Basic Salary", width: 150 },
    { field: "deductions", headerName: "Deductions", width: 150 },
    { field: "designation", headerName: "Designation", width: 150 },
    { field: "netSalary", headerName: "Total Salary", width: 150 },
  ];

  return (
    <Box m="20px">
      <Header title="EARNING AND DEDUCTIONS" subtitle="Managing Employee Payroll" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
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
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={projects}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 20, 50]}
          checkboxSelection
          disableMultipleRowSelection={true}
        />
      </Box>
    </Box>
  );
};

export default EarningAndDeductions;
