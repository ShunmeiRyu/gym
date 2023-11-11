import { Paths } from "src/routers/paths";
import Iconify from "src/components/iconify/iconify";

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: "Home",
    icon: <Iconify icon="eva:home-fill" />,
    path: "/home",
  },
  {
    title: "Components",
    icon: <Iconify icon="ic:round-grain" />,
    path: Paths.components,
  },
  {
    title: "Pages",
    path: "/pages",
    icon: <Iconify icon="eva:file-fill" />,
    children: [
      {
        subheader: "Other",
        items: [
          { title: "About us", path: Paths.about },
          { title: "Contact us", path: Paths.contact },
          { title: "FAQs", path: Paths.faqs },
          { title: "Pricing", path: Paths.pricing },
          { title: "Coming Soon", path: Paths.comingSoon },
        ],
      },
      {
        subheader: "Authentication",
        items: [
          { title: "Login", path: Paths.login },
          { title: "Register", path: Paths.register },
          { title: "Reset password", path: Paths.forgot_password },
          { title: "Verify code", path: Paths.verify_email },
        ],
      },
      {
        subheader: "Error",
        items: [
          // { title: "Page 403", path: Paths.page403 },
          { title: "Page 404", path: Paths.page404 },
          // { title: "Page 500", path: Paths.page500 },
        ],
      },
    ],
  },
];

export default navConfig;
