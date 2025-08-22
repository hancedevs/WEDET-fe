"use client";

import * as React from "react";
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
  type ToasterProps,
} from "sonner";

// Re-export `toast` so you can: import { toast } from "@/components/ui/sonner"
export const toast = sonnerToast;

/**
 * Shadcn-style wrapper for Sonner.
 * - Uses Tailwind tokens (bg-background, text-foreground, etc.)
 * - Nice defaults: top-center, rich colors, close button
 * - You can still override via <Toaster {...props} />
 */
export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        duration: 3200,
        classNames: {
          toast:
            "group pointer-events-auto relative flex w-full items-start gap-3 rounded-2xl border bg-background/95 p-4 pr-9 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80",
          title: "text-sm font-semibold text-foreground",
          description: "text-sm text-muted-foreground",
          actionButton:
            "inline-flex items-center justify-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90",
          cancelButton:
            "inline-flex items-center justify-center rounded-md border bg-muted px-3 py-1 text-sm font-medium text-foreground hover:bg-muted/80",
          closeButton:
            "absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted",
        },
      }}
      {...props}
    />
  );
}
