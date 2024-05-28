import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

const spinAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Loader = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Box
        sx={{
          animation: `${spinAnimation} 1s linear infinite`,
          borderRadius: '50%',
          height: '1rem',
          width: '1rem',
          borderTop: '2px solid black',
          borderRight: '2px solid transparent',
          borderBottom: '2px solid transparent',
          borderLeft: '2px solid transparent',
        }}
      ></Box>
    </Box>
  );
};

export default Loader;
