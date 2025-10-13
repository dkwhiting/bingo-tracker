"use client";

import React, { useState } from "react";
import {
  Dialog as DialogUi,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  type DialogProps,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface Props extends Omit<DialogProps, "title" | "onClose"> {
  icon?: React.ReactNode;
  title?: string;
  body?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function Dialog({ icon, title, body, open, setOpen, ...rest }: Props) {

  return (

      <DialogUi open={open} onClose={setOpen} className="relative z-10" {...rest}>
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  {icon && (
                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:size-10">
                      <ExclamationTriangleIcon
                        aria-hidden="true"
                        className="size-6 text-red-400"
                      />
                    </div>
                  )}
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    {title && title.length > 0 && (
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold text-white"
                      >
                        {title}
                      </DialogTitle>
                    )}
                    {body && body.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-400">{body}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
                >
                  Deactivate
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </DialogUi>
    </div>
  );
}
