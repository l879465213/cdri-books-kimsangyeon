import { ErrorWrapper } from "@/shared/components/ErrorWrapper";
import GlobalToast from "@/shared/components/GlobalToast";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <div className="flex grow">
        {/* 에러 바운더리 */}
        <ErrorWrapper>
          {/* 동적 컴포넌트 로딩 */}
          <Suspense fallback={<div>loading...</div>}>
            {/* 메인 콘텐츠 영역 */}
            <div className="grow">
              <Outlet />
            </div>
          </Suspense>
        </ErrorWrapper>
      </div>
      <GlobalToast />
    </div>
  );
};
