import { toastAtom, type ToastParams } from "@/shared/store/toast/toastAtom";
import { useAtom } from "jotai";

const useGlobalToast = () => {
  const [, setToastState] = useAtom(toastAtom);

  const openToast = ({ title, description, type }: ToastParams) => {
    setToastState({
      isOpen: true,
      title: title,
      description: description || "",
      type: type,
    });
  };

  const closeToast = () => {
    setToastState({
      isOpen: false,
      title: "",
      description: "",
      type: null,
    });
  };

  return {
    openToast,
    closeToast,
  };
};

export { useGlobalToast };
