import { useEffect } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useAtom } from "jotai";
import { toastAtom } from "@/shared/store/toast/toastAtom";

const CustomToast = ({ title, description }: { title: string; description: string }) => (
  <div className="flex w-full! min-w-[320px] flex-col pr-[20px] pl-[10px]">
    <p className="text-[20px] font-semibold text-neutral-900">{title}</p>
    <p className="text-[14px] font-normal text-neutral-500">{description}</p>
  </div>
);

const GlobalToast = () => {
  const [{ isOpen, title, description, type }, setToastState] = useAtom(toastAtom);

  useEffect(() => {
    if (isOpen) {
      if (type === "success") {
        toast.success(<CustomToast title={title} description={description} />, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
          // theme: "dark",
          transition: Bounce,
        });
      } else if (type === "error") {
        toast.error(<CustomToast title={title} description={description} />, {
          position: "top-center",
          autoClose: 1000,
          className: "toast-message",
          hideProgressBar: false,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
          // theme: "dark",
          transition: Bounce,
        });
      } else if (type === "warning") {
        toast.warning(<CustomToast title={title} description={description} />, {
          position: "top-center",
          autoClose: 1000,
          className: "toast-message",
          hideProgressBar: false,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
          // theme: "dark",
          transition: Bounce,
        });
      } else {
        toast.info(<CustomToast title={title} description={description} />, {
          position: "top-center",
          autoClose: 1000,
          className: "toast-message",
          hideProgressBar: false,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
          // theme: "dark",
          transition: Bounce,
        });
      }

      // Close the toast after displaying
      setToastState({
        isOpen: false,
        description: "",
        type: "info",
        title: "",
      });
    }
  }, [isOpen, description, setToastState, type, title]);

  return (
    <ToastContainer
      className={`w-full! max-w-[920px] px-[20px]`}
      toastClassName={`w-fit!`}
      toastStyle={{ width: "fit-content" }}
    />
  );
};

export default GlobalToast;
