import { Box, Button, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";

function GetStarted() {

  let navigate = useNavigate()
  return (
    <div className="App">
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          my: "15%",
        }}
      >
        <Title/>
        <Button
          variant="contained"
          disableElevation
          sx={{
            backgroundColor: "white",
            my: 4,
            width: 200,
            borderRadius: "60px",
            "&:hover": {
              backgroundColor: "rgba(248, 248, 248, 0.8)",
            },
          }}
          onClick={()=> navigate('/login')}
        >
          <Typography
            sx={{
              color: "black",
              textTransform: "none",
              fontFamily: "Raleway",
              fontWeight: "bold",
            }}
          >
            Get Started
          </Typography>
          <NavigateNextIcon
            sx={{
              color: "black",
            }}
          />
        </Button>
      </Box>
    </div>
  );
}

export default GetStarted;
