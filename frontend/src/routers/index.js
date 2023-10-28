import { Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { Paths } from "src/routers/paths";


export default function Router() {
  return useRoutes([
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
