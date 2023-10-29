// @mui
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import  Container  from "@mui/material/Container";
import Box from "@mui/material/Box"

import logo_dark from "src/assets/gym-logos_black.png"

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: 64,
            md: 80,
          },
          transition: theme.transitions.create(["height"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          color: theme.palette.background.default,
          mx:0
        }}
      >
        <Container maxWidth={false}  sx={{ height: 1, display: 'flex', alignItems: 'left'}}>
            <Box component="img" src={logo_dark} />
        </Container>
      </Toolbar>
    </AppBar>
  );
}
