// @mui
import { Box } from "@mui/material";
//
import Header from "./Header";

// ----------------------------------------------------------------------

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: 1 }}>
      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: "64px", md: "80px" },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
