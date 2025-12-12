import Toast from "@components/ui/Toast";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Modal } from "react-native";
import { BackHandler, View } from "react-native";

export type ToastModalParams = {
  title: string;
  description?: string;
  type: "success" | "error" | "warning";
  toastAction?: React.ReactNode;
  duration?: number;
};

type ToastProps = {
  showToastModal: (options: ToastModalParams, infinite?: boolean) => void;
  closeToastModal: () => void;
};

export const ToastContext = createContext<ToastProps>({
  showToastModal: () => {},
  closeToastModal: () => {},
});

export const useToast = () => {
  return useContext(ToastContext);
};

const ToastProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);

  const [toastModalOptions, setToastModalOptions] = useState<ToastModalParams>({
    title: "",
    description: "",
    type: "success",
    duration: 10000,
  });

  const showToastModal = (options: ToastModalParams, infinite?: boolean) => {
    setOpen(true);
    if (!infinite) {
      setToastModalOptions({
        ...toastModalOptions,
        duration: 10000,
        ...options,
      });
    } else {
      setToastModalOptions({ ...toastModalOptions, ...options });
    }
  };

  const closeToastModal = () => {
    setOpen(false);
  };

  const handleLeave = useCallback(() => {
    console.log("handle leave called opened", open);
    if (open) {
      closeToastModal();
      return;
    }
    return true;
  }, [open, closeToastModal]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleLeave
    );

    return () => {
      backHandler.remove();
    };
  }, [handleLeave]);

  const value = useMemo(
    () => ({
      showToastModal,
      closeToastModal,
    }),
    [showToastModal, closeToastModal]
  );

  return (
    <ToastContext.Provider value={value}>
      {/* <Modal
        visible={open}
        transparent
        statusBarTranslucent
        animationType="fade"
        pointerEvents="box-none"
        className="bg-transparent"
      > */}
      <Toast
        open={open}
        toastModalOptions={toastModalOptions}
        closeModal={() => {
          closeToastModal();
        }}
      />
      {children}
      {/* </Modal> */}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
