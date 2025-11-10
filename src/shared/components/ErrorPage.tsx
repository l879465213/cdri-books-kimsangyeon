import { appRoutes } from "@/config/path/routes";
import { clearLocalStorage } from "@/shared/utils";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const error = searchParams.get("error");
  const from = searchParams.get("from");

  const [showError, setShowError] = useState(false);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <p
          className="text-gray-500 mt-[40px] text-center font-normal"
          onClick={() => setShowError(!showError)}
        >
          웹 페이지를 찾을 수 없거나, 웹 사이트 서버에 문제가 있어 웹 페이지를 표시할 수 없습니다.
        </p>
        {showError && <p className="text-gray-500">{error || "에러가 발생했습니다."}</p>}
        <button
          className="mt-[50px] rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => {
            if (error === "ERR_NETWORK") {
              clearLocalStorage();
              navigate(appRoutes.root);
            } else {
              navigate(from ? from : appRoutes.root);
            }
          }}
        >
          메인페이지로 이동
        </button>
      </div>
    </div>
  );
};
