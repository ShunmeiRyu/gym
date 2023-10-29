import { lazy } from "react";

export const Login = lazy(() => import("src/pages/auth/login"));
export const Register = lazy(() => import("src/pages/auth/register"));
export const NewPassword = lazy(() => import("src/pages/auth/new-password"));
export const ForgotPassword = lazy(() => import("src/pages/auth/forgot-password"));
export const VerifyEmail = lazy(() => import("src/pages/auth/verify-email"));
