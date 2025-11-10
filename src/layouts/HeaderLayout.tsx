import { CustomButton } from "@/shared/components/CustomButton";
import { ErrorWrapper } from "@/shared/components/ErrorWrapper";
import GlobalToast from "@/shared/components/GlobalToast";
import { useAuth } from "@/shared/hooks/useAuth";
import { Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import reactLogo from "@/assets/react.svg";
import { twMerge } from "tailwind-merge";
import { appRoutes } from "@/config/path/routes";

export const HeaderLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="flex h-full min-h-screen flex-col">
      {/* 헤더 영역 */}
      <div className="border-b border-gray-200 h-[48px] shadow-sm flex items-center justify-between px-[24px]">
        <div className="flex items-center gap-[10px] justify-center h-full">
          <img src={reactLogo} alt="logo" className="h-[20px] w-[20px]" />
          <p className="h-[17px] text-[14px] text-[#7C7C7C] font-bold">Exchange app</p>
        </div>

        <div className="flex items-center gap-[24px] justify-center h-full">
          <p
            className={twMerge(
              `h-[17px] text-[14px] text-[#7C7C7C] font-semibold cursor-pointer`,
              location.pathname === appRoutes.root ? "text-[#111111]" : "text-[#7C7C7C]"
            )}
            onClick={() => navigate(appRoutes.root)}
          >
            환전 하기
          </p>
          <p
            className={twMerge(
              `h-[17px] text-[14px] text-[#7C7C7C] font-semibold cursor-pointer`,
              location.pathname === appRoutes.exchangeHistory ? "text-[#111111]" : "text-[#7C7C7C]"
            )}
            onClick={() => navigate(appRoutes.exchangeHistory)}
          >
            환전 내역
          </p>
          <CustomButton
            title="logout"
            onClick={() => logout()}
            type="primary"
            className="w-[80px] h-[32px]"
          />
        </div>
      </div>
      <div className="flex grow">
        {/* 에러 바운더리 */}
        <ErrorWrapper>
          {/* 동적 컴포넌트 로딩 */}
          <Suspense fallback={<div>loading...</div>}>
            {/* 메인 콘텐츠 영역 */}
            <div className="max-h-[calc(100vh-48px)] grow px-[24px] py-[16px]">
              <Outlet />
            </div>
          </Suspense>
        </ErrorWrapper>
      </div>
      <GlobalToast />
    </div>
  );
};
