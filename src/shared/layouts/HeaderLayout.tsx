import { ErrorWrapper } from "@/shared/components/ErrorWrapper";
import GlobalToast from "@/shared/components/GlobalToast";
import { Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { appRoutes } from "@/config/path/routes";

export const HeaderLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="flex h-full min-h-screen flex-col">
      {/* 헤더 영역 */}
      <div className="border-b border-gray-200 h-[80px] shadow-none flex items-center justify-between px-[24px]">
        <div className="flex items-center gap-[10px] justify-center h-full">
          <p className=" text-[24px] text-text-primary font-bold">CERTICOS BOOKS</p>
        </div>

        <div className="flex items-center gap-[24px] justify-center h-full">
          <p
            className={twMerge(
              ` text-[20px] text-text-primary font-medium cursor-pointer`,
              location.pathname === appRoutes.root
                ? "underline underline-offset-[5px] decoration-primary"
                : ""
            )}
            onClick={() => navigate(appRoutes.root)}
          >
            도서 검색
          </p>
          <p
            className={twMerge(
              ` text-[20px] text-text-primary font-medium cursor-pointer`,
              location.pathname === appRoutes.savedBook
                ? "underline underline-offset-[5px] decoration-primary"
                : ""
            )}
            onClick={() => navigate(appRoutes.savedBook)}
          >
            내가 찜한 책
          </p>
        </div>
      </div>
      <div className="flex grow">
        {/* 에러 바운더리 */}
        <ErrorWrapper>
          {/* 동적 컴포넌트 로딩 */}
          <Suspense fallback={<div>loading...</div>}>
            {/* 메인 콘텐츠 영역 */}
            <div className="grow px-[48px] py-[40px]">
              <Outlet />
            </div>
          </Suspense>
        </ErrorWrapper>
      </div>
      <GlobalToast />
    </div>
  );
};
