import type {
  PublicTrainingPlansQuery,
  PublicTrainingPlansResponse,
} from "./training-plans.types";

export function createEmptyPublicTrainingPlansResponse(
  query: PublicTrainingPlansQuery,
): PublicTrainingPlansResponse {
  return {
    data: [],
    meta: {
      total: 0,
      page: query.page,
      limit: query.limit,
      totalPages: 1,
    },
  };
}
