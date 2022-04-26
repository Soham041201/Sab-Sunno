import { Box, Button, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

function App() {
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
        <Typography
          sx={{
            fontFamily: "Raleway",
            fontWeight: "bold",
            color: "white",
            fontSize: ["2rem", "3rem", "4rem"],
          }}
        >
          Sab Sunno.
        </Typography>
        <Typography
          sx={{
            fontFamily: "Raleway",
            fontWeight: "bold",
            color: "white",
            fontSize: "1rem",
          }}
          display="inline"
        >
          #Connecting
          <Typography
            display="inline"
            sx={{
              color: "#07F0FF",
              fontWeight: "bold",
            }}
          >
            People
          </Typography>
          Through
          <Typography
            display="inline"
            sx={{
              color: "#07F0FF",
              fontWeight: "bold",
            }}
          >
            Thoughts
          </Typography>
        </Typography>

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

export default App;
