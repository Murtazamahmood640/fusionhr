import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({ progress = 0.75, size = "40" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
          conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
          ${colors.greenAccent[500]}`,
      }}
    >
      {/* Display the progress percentage inside the circle */}
      <Typography
        variant="caption"
        component="div"
        color={colors.grey[100]}
        sx={{
          position: "absolute",
          fontSize: `${size / 5}px`, // Adjust font size relative to the circle size
        }}
      >
        {`${Math.round(progress * 100)}%`}
      </Typography>
    </Box>
  );
};

export default ProgressCircle;
