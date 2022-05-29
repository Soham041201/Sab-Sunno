import { Box, Typography } from "@mui/material";

const Title = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        variant={"h1"}
        sx={{
          fontSize: ["2rem", "3rem", "4rem"],
          textAlign: "center",
        }}
      >
        Sab Sunno.
      </Typography>
      <Typography
        sx={{
          textAlign: "center",
        }}
        display="inline"
        variant={"h2"}
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
    </Box>
  );
};

export default Title;
