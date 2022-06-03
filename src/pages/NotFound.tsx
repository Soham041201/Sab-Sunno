import { Container, Typography } from "@mui/material";
import { FunctionComponent } from "react";

const NotFound: FunctionComponent = () => {
  return (
    <div>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mx: "auto",
          width: "50%",
        }}
      >
        <Typography variant={"h1"} textAlign={"center"}>
          404
        </Typography>
        <Typography variant={"h2"} textAlign={"center"}>
          Oops! This page does not exist
        </Typography>
      </Container>
    </div>
  );
};

export default NotFound;
