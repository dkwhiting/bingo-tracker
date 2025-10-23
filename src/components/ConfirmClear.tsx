import {
  Dialog as HeadlessDialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

type ConfirmClearProps = {
  open: boolean;
  totalCalled: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmClear({
  open,
  totalCalled,
  onCancel,
  onConfirm,
}: ConfirmClearProps) {
  return (
    <HeadlessDialog open={open} onClose={onCancel} className="relative z-20">
      <DialogBackdrop className="fixed inset-0 bg-black/60" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#12121a] p-6 text-left shadow-xl outline outline-1 outline-white/10 transition-all">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-red-500/10">
                  <ExclamationTriangleIcon
                    aria-hidden
                    className="size-6 text-red-400"
                  />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-lg font-semibold text-white">
                    Clear all called numbers?
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-300">
                    This will remove {totalCalled} called number
                    {totalCalled === 1 ? "" : "s"} from the history. This action
                    cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn secondary w-full sm:w-auto"
                >
                  Keep numbers
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="btn primary w-full sm:w-auto"
                >
                  Clear history
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </HeadlessDialog>
  );
}
