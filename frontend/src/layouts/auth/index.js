// @mui
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
// hooks
import { useResponsive } from "src/hooks/use-responsive";
// theme
import { bgGradient } from "src/theme/css";
// components
import blackLogo from "src/assets/gym-logos_black.png";
// ----------------------------------------------------------------------

export default function AuthClassicLayout({ children }) {
  const theme = useTheme();

  const mdUp = useResponsive("up", "md");

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: "100vh",
      }}
    >
      <Box
        component="img"
        src={blackLogo}
        sx={{
          width: "50px",
          zIndex: 9,
          position: "absolute",
          m: { xs: 2, md: 5 },
        }}
      />

      {mdUp && (
        <Box
          flexGrow={1}
          sx={{
            ...bgGradient({
              color: alpha(theme.palette.background.default, 0.6),
              imgUrl: "/assets/background/ad-img.png",
            }),
          }}
        />
      )}

      <Stack
        sx={{
          width: 1,
          mx: "auto",
          maxWidth: 480,
          px: { xs: 2, md: 8 },
          pt: { xs: 15, md: 20 },
          pb: { xs: 15, md: 0 },
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
}
