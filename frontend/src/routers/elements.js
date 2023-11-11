import { lazy } from "react";

export const Login = lazy(() => import("src/pages/auth/login"));
export const Register = lazy(() => import("src/pages/auth/register"));
export const NewPassword = lazy(() => import("src/pages/auth/new-password"));
export const ForgotPassword = lazy(() =>
  import("src/pages/auth/forgot-password")
);
export const VerifyEmail = lazy(() => import("src/pages/auth/verify-email"));
export const HomePage = lazy(() => import("src/pages/home/home"));
export const NotFound = lazy(() => import("src/pages/404"));
export const About = lazy(() => import("src/pages/home/about"));
export const Class = lazy(() => import("src/pages/home/class"));
export const Store = lazy(() => import("src/pages/home/store"));
export const Price = lazy(() => import("src/pages/home/price"));
