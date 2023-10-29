import { Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import  AuthClassicLayout  from "src/layouts/auth";
import { Paths } from "src/routers/paths";
import { Login } from "src/routers/elements";

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
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
