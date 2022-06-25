import { Box, CircularProgress } from "@mui/material";

const CustomLoader = ()=>{
return(
    <Box
        sx={{
          position: "absolute",
          textAlign: "center",
          margin: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 'full',
          height: "screen",
          zIndex: 1,
        }}
      >
        <CircularProgress disableShrink />
      </Box>
)
}

export default CustomLoader;