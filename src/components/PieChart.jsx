import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsivePie } from '@nivo/pie';
import { tokens } from '../theme';
import { useTheme } from '@mui/material';
import nlp from 'compromise';

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/getUser');
        setTeamData(response.data);
      } catch (error) {
        console.error('Error fetching team data', error);
      }
    };

    fetchTeamData();
  }, []);

  const categorizeDesignationAI = (designation) => {
    if (!designation || typeof designation !== 'string') {
      return { category: 'Other', subcategory: designation || 'Unknown' };
    }

    const doc = nlp(designation.toLowerCase());

    if (doc.has('developer') || doc.has('engineer')) {
      return { category: 'Development', subcategory: designation };
    } else if (doc.has('qa') || doc.has('tester')) {
      return { category: 'Testing ', subcategory: designation };
    } else if (doc.has('hr') || doc.has('recruiter')) {
      return { category: 'HR ', subcategory: designation };
    } else if (doc.has('finance') || doc.has('accountant')) {
      return { category: 'Finance ', subcategory: designation };
    } else {
      return { category: 'Other', subcategory: designation };
    }
  };

  const calculateDesignationCounts = (data) => {
    const counts = {};

    data.forEach(item => {
      const { category, subcategory } = categorizeDesignationAI(item.designation);
      if (!counts[category]) {
        counts[category] = { value: 0, subcategories: {} };
      }
      counts[category].value += 1;
      counts[category].subcategories[subcategory] = counts[category].subcategories[subcategory]
        ? counts[category].subcategories[subcategory] + 1
        : 1;
    });

    return Object.keys(counts).map(category => ({
      id: category,
      value: counts[category].value,
      subcategories: counts[category].subcategories,
    }));
  };

  const transformedData = calculateDesignationCounts(teamData);

  const CustomTooltip = ({ datum }) => (
    <div style={{ padding: '10px', background: 'white', border: '1px solid #ccc', borderRadius: '4px' }}>
      <strong>{datum.id}</strong>
      <ul style={{ margin: 0, padding: 0 }}>
        {Object.entries(datum.data.subcategories).map(([subcat, count]) => (
          <li key={subcat} style={{ listStyleType: 'none', padding: '2px 0' }}>
            {subcat}: {count}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <ResponsivePie
      data={transformedData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      margin={{ top: 40, right: 40, bottom: 80, left: 40 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      tooltip={CustomTooltip}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;
