import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

function CircularPro(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={props.value} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
export default CircularPro;
