import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Container, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const ManageException = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};

  const [data, setData] = useState([]);

  async function fetchHolidays() {
    let year = new Date();
    let res = await axios.get(
      `https://date.nager.at/api/v3/publicholidays/${year.getFullYear()}/US`
    );
    let holidays = res.data;

    // Add weekends as holidays
    const weekends = generateWeekends(year.getFullYear());
    holidays = holidays.concat(weekends);

    setData(holidays);
  }

  const generateWeekends = (year) => {
    let weekends = [];
    let date = new Date(year, 0, 1);

    while (date.getFullYear() === year) {
      if (date.getDay() === 0 || date.getDay() === 6) { // Sunday or Saturday
        weekends.push({
          date: date.toISOString().split("T")[0],
          name: date.getDay() === 0 ? "Sunday" : "Saturday",
          countryCode: "US",
          types: ["Weekend"],
        });
      }
      date.setDate(date.getDate() + 1);
    }

    return weekends;
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Holiday Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "date", headerName: "Date", width: 150 },
    { field: "countryCode", headerName: "Country", width: 150 },
    {
      field: "types",
      headerName: "Type",
      width: 150,
      valueGetter: (params) => params.row.types[0],
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box m="20px">
        <Header title="Holidays Exceptions" subtitle="Manage Holidays and Exceptions" />
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .name-column--cell": { color: colors.greenAccent[500] },
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
            <Box sx={{ height: "70vh", width: "100%" }}>
              <DataGrid
                rows={data}
                columns={columns}
                getRowId={(row) => row.date + row.name}
                pageSize={10}
                pageSizeOptions={[10, 20, 50]}
              />
            </Box>
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default ManageException;
