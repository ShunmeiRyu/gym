// @mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Box";
import { alpha, useTheme } from "@mui/material/styles";
import { useResponsive } from "src/hooks/use-responsive";
import { bgGradient } from "src/theme/css";
import Header from "src/layouts/auth/header";
import adImg from "src/assets/ad-img.jpeg";

export default function AuthClassicLayout({ children }) {
  const theme = useTheme();
  const upMd = useResponsive("up", "md");
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: 1 }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Stack
          flexGrow={1}
          spacing={10}
          alignItems="center"
          justifyContent="center"
          sx={{
            ...bgGradient({
              color: alpha(
                theme.palette.background.default,
                0.88
              ),
              imgUrl: "/assets/background/overlay_2.jpg",
            }),
          }}
        ></Stack>
        <Stack
          direction="row-reverse"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Box minWidth={upMd ? "480px" : 1}>{children}</Box>
          {upMd && (
            <Box
              sx={{
                height: 1,
                // width: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: theme.palette.background.neutral,
              }}
            >
              <Box component="img" src={adImg} />
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
