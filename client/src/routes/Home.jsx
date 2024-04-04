import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();

const Home = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          margin: 0,
          height: "calc(100vh - 68.5px - 76.2px)",
          backgroundImage: "url(../../public/hero_image.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 50px",
        }}>
        <Typography
          component="h1"
          variant="h2"
          gutterBottom
          sx={{
            fontFamily: "Inter",
            fontSize: "64px",
            fontWeight: "bold",
            color: "#00A8CD",
            textAlign: "center",
          }}>
          Design your own
          <br /> Christmas calendar
        </Typography>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: "Inter",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#00A8CD",
            textAlign: "center",
            marginBottom: "30px",
          }}>
          Use our platform to customise your digital advent calendar
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            backgroundColor: "#476C92",
            color: "#FFFFFF",
            textAlign: "center",
            "&:hover": {
              backgroundColor: "#FFFFFF",
              color: "#476C92",
            },
          }}>
          Create now
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
