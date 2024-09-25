import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import axios from 'axios';
import { tokens } from '../theme';

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://murtaza011-abidipro.mdbgo.io/api/getUser');
        const users = response.data;

        // Calculate the count of each role
        const roleCounts = users.reduce((acc, user) => {
          acc[user.status] = (acc[user.status] || 0) + 1;
          return acc;
        }, {});

        // Prepare data for the chart
        const data = [
          { role: 'Admin', count: roleCounts['Admin'] || 0 },
          { role: 'Manager', count: roleCounts['Manager'] || 0 },
          { role: 'Employee', count: roleCounts['Employee'] || 0 }
        ];

        setChartData(data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ResponsiveBar
        data={chartData}
        keys={['count']}
        indexBy="role"
        margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={theme.palette.mode === 'dark' ? 'white' : colors.primary[700]}  // White bars on dark theme, primary color on light theme
        borderColor={theme.palette.mode === 'dark' ? 'white' : colors.primary[700]} // Optional: Set border color to white for contrast in dark theme
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : 'Role',
          legendPosition: 'middle',
          legendOffset: 40,
          tickColor: theme.palette.mode === 'dark' ? 'white' : 'black', // Tick color based on theme
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : 'Count',
          legendPosition: 'middle',
          legendOffset: -50,
          tickColor: theme.palette.mode === 'dark' ? 'white' : 'black', // Tick color based on theme
        }}
        enableGridY={false} // Disable horizontal grid lines
        enableGridX={false} // Disable vertical grid lines
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        theme={{
          textColor: theme.palette.mode === 'dark' ? 'white' : 'black', // Text color based on theme
          axis: {
            ticks: {
              line: {
                stroke: theme.palette.mode === 'dark' ? 'white' : 'black', // Tick lines based on theme
              },
              text: {
                fill: theme.palette.mode === 'dark' ? 'white' : 'black', // Tick text color based on theme
              },
            },
          },
        }}
        role="application"
        barAriaLabel={(e) => `${e.id}: ${e.formattedValue} users with role: ${e.indexValue}`}
      />
    </div>
  );
};

export default BarChart;
