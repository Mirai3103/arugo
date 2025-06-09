import {
  createSubmission,
  getMySubmissionsOfProblem,
  getSubmissionById,
  testSubmission,
} from "@/server/transports/server-functions/submission";
import type { CreateSubmission } from "@repo/backend/submissions/validations/submission";

export const getCreateSubmissionMutationOptions = () => {
  return {
    mutationKey: ["createSubmission"],
    mutationFn: (data: CreateSubmission) => createSubmission({ data }),
  };
};
export const getTestSubmissionMutationOptions = () => {
  return {
    mutationKey: ["testSubmission"],
    mutationFn: (data: CreateSubmission) => testSubmission({ data }),
  };
};

export const getSubmissionByIdQueryOptions = (id: string) => {
  return {
    queryKey: ["submission", id],
    queryFn: () => getSubmissionById({ data: { id } }),
  };
};

export const getMySubmissionsOfProblemQueryOptions = (problemId: string) => {
  return {
    queryKey: ["mySubmissionsOfProblem", problemId],
    queryFn: () => getMySubmissionsOfProblem({ data: { problemId } }),
  };
};
