import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { appRoutes } from "@/config/path/routes";
import { ErrorPage } from "@/shared/components/ErrorPage";
import { bookRoutes } from "@/features/book/routes";

// 인증 안 된 사용자만 접근 가능
const routesForGuest = [
  {
    // element: <GuestRoute />,
    children: [...(bookRoutes.public || [])],
  },
];

// 인증 된 사용자만 접근 가능
const routesForAuthenticatedOnly = [
  {
    // element: <ProtectedRoute />,
    children: [...(bookRoutes.private || [])],
  },
];

// 항상 접근 가능한 경로
const routesForPublic = [
  {
    path: appRoutes.error,
    element: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];

export const Routes = () => {
  const router = createBrowserRouter([
    ...routesForGuest,
    ...routesForAuthenticatedOnly,
    ...routesForPublic,
  ]);

  return <RouterProvider router={router} />;
};
