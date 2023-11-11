import { Link as RouterLink } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import * as React from "react";
import Stack from "@mui/material/Stack";
import { alpha, useTheme } from "@mui/material/styles";

import { bgGradient } from "src/theme/css";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { useResponsive } from "src/hooks/use-responsive";

import img404 from "src/assets/404.jpg";

export default function Page404({ children }) {
  const theme = useTheme();

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Box>
        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          spacing={8}
        >
          <Box sx={{ textAlign: "center", width: "500px" }}>
            <Typography variant="h3" paragraph>
              Sorry, page not found!
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps
              you’ve mistyped the URL? Be sure to check your spelling.
            </Typography>
          </Box>
          <Box component="img" src={img404} sx={{ width: "500px" }} />
          <Box>
            <Button
              width="100px"
              variant="contained"
              color="success"
              to="/home"
              component={RouterLink}
            >
              GO to Home
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
