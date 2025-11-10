import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

const ErrorWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showError, setShowError] = useState(false);
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => {
        return (
          <div className="flex h-[calc(100vh-48px)] w-full items-center justify-center pr-[80px]">
            <div className="shadow-nav rounded-lg bg-white p-6 text-center">
              <p
                onClick={() => setShowError(!showError)}
                className="text-lg font-semibold text-red-600"
              >
                Something went wrong.
              </p>
              {showError && (
                <div className="mt-4 rounded bg-red-50 p-4 text-left">
                  <p className="text-sm text-red-800">
                    {error.message || "An unexpected error occurred"}
                  </p>
                  <pre className="mt-2 max-h-[200px] overflow-auto text-xs text-red-600">
                    {error.stack}
                  </pre>
                </div>
              )}
              <button
                onClick={() => resetErrorBoundary()}
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export { ErrorWrapper };
