import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Toast from "@radix-ui/react-toast";

import "./alert.css";
import "./toast.css";

interface ToastProps {
  title: string;
  isOpen: boolean | false;
  handleOpen: () => void;
  handleClose: () => void;
  description?: string;
}

export const ToastDialog = ({
  title,
  isOpen,
  handleOpen,
  handleClose,
  description,
}: ToastProps) => {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root className="ToastRoot" open={isOpen} onOpenChange={handleOpen}>
        <Toast.Title className="ToastTitle">{title}</Toast.Title>
        {description !== undefined && (
          <Toast.Description asChild>
            <span className="ToastDescription">{description}</span>
          </Toast.Description>
        )}
        <Toast.Action className="ToastAction" asChild altText="confirm">
          <button className="Button small green" onClick={handleClose}>
            OK
          </button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
};
