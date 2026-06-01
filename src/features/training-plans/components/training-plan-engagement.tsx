"use client";

import { useState } from "react";

import { TrainingPlanLikeButton } from "@/src/features/training-plans/components/training-plan-like-button";
import { TrainingPlanSaveButton } from "@/src/features/training-plans/components/training-plan-save-button";

type TrainingPlanEngagementProps = {
  planId: number;
  initialLiked: boolean;
  initialLikesCount: number;
  initialIsSaved?: boolean;
  labels: {
    likes: string;
    like: string;
    likedAction: string;
    save: string;
    savedAction: string;
    liked: string;
    saved: string;
    yes: string;
    notLiked: string;
    notSaved: string;
    likeErrorFallback: string;
    saveErrorFallback: string;
  };
};

export function TrainingPlanEngagement({
  planId,
  initialLiked,
  initialLikesCount,
  initialIsSaved,
  labels,
}: TrainingPlanEngagementProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [saved, setSaved] = useState(initialIsSaved ?? false);

  return (
    <>
      <div className="flex flex-wrap gap-4 text-sm text-white/52">
        <span>
          {labels.likes}: {likesCount}
        </span>
        <span>
          {labels.liked}: {liked ? labels.yes : labels.notLiked}
        </span>
        {typeof initialIsSaved === "boolean" ? (
          <span>
            {labels.saved}: {saved ? labels.yes : labels.notSaved}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <TrainingPlanLikeButton
          planId={planId}
          initialLiked={initialLiked}
          initialLikesCount={initialLikesCount}
          onStateChange={({ liked: nextLiked, likesCount: nextLikesCount }) => {
            setLiked(nextLiked);
            setLikesCount(nextLikesCount);
          }}
          labels={{
            like: labels.like,
            likedAction: labels.likedAction,
            likes: labels.likes,
            errorFallback: labels.likeErrorFallback,
          }}
        />
        {typeof initialIsSaved === "boolean" ? (
          <TrainingPlanSaveButton
            planId={planId}
            initialSaved={initialIsSaved}
            onStateChange={({ saved: nextSaved }) => {
              setSaved(nextSaved);
            }}
            labels={{
              save: labels.save,
              savedAction: labels.savedAction,
              errorFallback: labels.saveErrorFallback,
            }}
          />
        ) : null}
      </div>
    </>
  );
}
