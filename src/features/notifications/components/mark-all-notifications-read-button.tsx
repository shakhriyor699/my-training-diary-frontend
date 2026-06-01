"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";

import { markAllNotificationsRead } from "@/src/features/notifications/api/mark-all-notifications-read";

type MarkAllNotificationsReadButtonProps = {
  unreadCount: number;
  labels: {
    trigger: string;
    pending: string;
    successPrefix: string;
    nothingToUpdate: string;
    errorFallback: string;
  };
};

export function MarkAllNotificationsReadButton({
  unreadCount,
  labels,
}: MarkAllNotificationsReadButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const mutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: (response) => {
      startTransition(() => {
        const updatedCount = response.count;

        if (updatedCount > 0) {
          toast.success(`${labels.successPrefix}: ${updatedCount}`);
        } else {
          toast.info(labels.nothingToUpdate);
        }

        router.refresh();
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : labels.errorFallback;
      toast.error(message);
    },
  });

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={unreadCount === 0 || mutation.isPending || isPending}
      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {mutation.isPending || isPending ? labels.pending : labels.trigger}
    </button>
  );
}
