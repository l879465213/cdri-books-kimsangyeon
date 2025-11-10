import { lazy } from "react";
import { appRoutes } from "@/config/path/routes";
import { HeaderLayout } from "@/shared/layouts/HeaderLayout";

const Book = lazy(() => import("@/features/book/pages/Book"));
const SavedBook = lazy(() => import("@/features/book/pages/SavedBook"));

export const bookRoutes = {
  private: [
    {
      element: <HeaderLayout />,
      children: [
        {
          path: appRoutes.root,
          element: <Book />,
        },
        {
          path: appRoutes.savedBook,
          element: <SavedBook />,
        },
      ],
    },
  ],
  public: [],
};
