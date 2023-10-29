// three
import { Navigate, useRoutes } from "react-router-dom";
// Layout
import AuthClassicLayout from "src/layouts/auth";
// .
import { Paths } from "src/routers/paths";
import { Login } from "src/routers/elements";
import { Register } from "src/routers/elements";
import { NewPassword } from "src/routers/elements";
import { ForgotPassword } from "src/routers/elements";
import { VerifyEmail } from "src/routers/elements";

export default function Router() {
  return useRoutes([
    {
      path: Paths.login,
      element: (
        <AuthClassicLayout>
          <Login />
        </AuthClassicLayout>
      ),
    },
    {
      path: Paths.register,
      element: (
        <AuthClassicLayout>
          <Register />
        </AuthClassicLayout>
      ),
    },
    {
      path: Paths.new_password,
      element: (
        <AuthClassicLayout>
          <NewPassword />
        </AuthClassicLayout>
      ),
    },
    {
      path: Paths.forgot_password,
      element: (
        <AuthClassicLayout>
          <ForgotPassword />
        </AuthClassicLayout>
      ),
    },
    {
      path: Paths.verify_email,
      element: (
        <AuthClassicLayout>
          <VerifyEmail />
        </AuthClassicLayout>
      ),
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
