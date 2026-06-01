"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { toggleTrainingPlanLike } from "@/src/features/training-plans/api/toggle-training-plan-like";

type TrainingPlanLikeButtonProps = {
  planId: number;
  initialLiked: boolean;
  initialLikesCount: number;
  onStateChange?: (state: { liked: boolean; likesCount: number }) => void;
  labels: {
    like: string;
    likedAction: string;
    likes: string;
    errorFallback: string;
  };
};

export function TrainingPlanLikeButton({
  planId,
  initialLiked,
  initialLikesCount,
  onStateChange,
  labels,
}: TrainingPlanLikeButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  const mutation = useMutation({
    mutationFn: () => toggleTrainingPlanLike(planId),
    onSuccess: (response) => {
      const nextLikesCount =
        liked === response.liked
          ? likesCount
          : response.liked
            ? likesCount + 1
            : Math.max(likesCount - 1, 0);

      setLiked(response.liked);
      setLikesCount(nextLikesCount);
      onStateChange?.({
        liked: response.liked,
        likesCount: nextLikesCount,
      });

      startTransition(() => {
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
      disabled={mutation.isPending || isPending}
      aria-pressed={liked}
      aria-label={liked ? labels.likedAction : labels.like}
      title={liked ? labels.likedAction : labels.like}
      className={[
        "inline-flex h-11 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-all duration-200 disabled:opacity-60",
        liked
          ? "border-[#ff5a71]/25 bg-[#ff5a71]/10 text-[#ff7f90] hover:bg-[#ff5a71]/16"
          : "border-white/10 bg-white/[0.03] text-white/78 hover:bg-white/[0.06] hover:text-white",
      ].join(" ")}
    >
      <HeartIcon filled={liked} />
      <span className="text-sm font-semibold tabular-nums text-current/85">
        {likesCount}
      </span>
    </button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={[
        "h-5 w-5 transition-transform duration-200",
        filled ? "scale-110 fill-[#ff5a71] text-[#ff5a71]" : "fill-transparent text-white/82",
      ].join(" ")}
    >
      <path
        d="M12 20.8 4.85 13.9a4.98 4.98 0 0 1 0-7.1 4.87 4.87 0 0 1 6.98 0L12 7.02l.17-.22a4.87 4.87 0 0 1 6.98 0 4.98 4.98 0 0 1 0 7.1L12 20.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
