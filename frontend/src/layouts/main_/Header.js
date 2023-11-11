import { useRef } from "react";
// @mui
import { useTheme } from "@mui/material/styles";
import { Box, Button, AppBar, Toolbar, Container, Link } from "@mui/material";
// hooks
import { useResponsive } from "src/hooks/use-responsive";
// components
import logo_dark from "src/assets/gym-logos_black.png";

import NavDesktop from "./DesktopNav";
// ----------------------------------------------------------------------

export default function Header() {
  const carouselRef = useRef(null);

  const theme = useTheme();

  const isDesktop = useResponsive("up", "md");

  return (
    <AppBar ref={carouselRef} color="transparent" sx={{ boxShadow: 0 }}>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: 64,
            md: 80,
          },
          background: theme.palette.common.white,
        }}
      >
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box component="img" src={logo_dark} height="40px" />

          <Box sx={{ flexGrow: 1 }} />

          {isDesktop && <NavDesktop />}

          <Button variant="outlined" sx={{ marginRight: 1 }}>
            login
          </Button>
          <Button variant="contained">register</Button>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
