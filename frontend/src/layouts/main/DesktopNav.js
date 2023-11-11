import { Stack, ListItemButton } from "@mui/material";
import { useLocation, matchPath, useNavigate } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
import navConfig from "src/layouts/main/navConfig";

// ----------------------------------------------------------------------

export default function NavDesktop({ data }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <Stack component="nav" direction="row" spacing={5} sx={{ mr: 5 }}>
      {navConfig.map((item) => (
        <ListItem
          active={!!matchPath({ path: item.title, end: true }, pathname)}
          onClick={() => navigate(item.path)}
        >
          {item.title}
        </ListItem>
      ))}
    </Stack>
  );
}

const ListItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active, theme }) => {
  const dotActive = {
    content: '""',
    borderRadius: "50%",
    position: "absolute",
    width: 6,
    height: 6,
    left: -14,
    opacity: 0.48,
    backgroundColor: "currentColor",
  };

  return {
    ...theme.typography.subtitle2,
    padding: 0,
    color: theme.palette.text.primary,
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shorter,
    }),
    "&:hover": {
      opacity: 0.48,
      backgroundColor: "transparent",
    },
    // Active
    ...(active && {
      color: theme.palette.primary.main,
      "&::before": dotActive,
    }),
  };
});
