import { toastType, useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import {
  CheckCircle2Icon,
  CircleAlertIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        messageType,
        title,
        description,
        action,
        ...props
      }) {
        return (
          <Toast key={id} variant={messageType} {...props}>
            <div className="flex gap-3 items-center">
              {messageType === toastType.SUCCESS && <CheckCircle2Icon />}
              {messageType === toastType.INFO && <InfoIcon />}
              {messageType === toastType.WARNING && <TriangleAlertIcon />}
              {messageType === toastType.ERROR && <CircleAlertIcon />}
              {/* For some reason, trying to use an Icon component causes problems. */}
              <div className="grid gap-0">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
