import { Routes } from "@/routes";
import { QueryProvider } from "@/shared/providers/queryProvider";

export const App = () => {
  return (
    <QueryProvider>
      <Routes />
    </QueryProvider>
  );
};
