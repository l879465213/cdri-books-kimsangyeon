const defaultRoutes = {
  root: "/",
  error: "/error",
  notFound: "*",
};
const appRoutes = {
  book: "/book",
  savedBook: "/book/saved",
  ...defaultRoutes,
};

export { appRoutes, defaultRoutes };
