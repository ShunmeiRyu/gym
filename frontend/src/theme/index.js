// @mui
import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

import { palette } from "src/theme/palette";
import { shadows } from "src/theme/shadows";
import { typography } from "src/theme/typography";

export default function ThemeProvider({ children }) {
  const themeConfig = {
    palette: palette(),
    shadows: shadows(),
    typography: typography,
    shape: { borderRadius: 8 },
  };
  const theme = createTheme(themeConfig);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
