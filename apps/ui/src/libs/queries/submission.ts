import {
	createSubmission,
	getSubmissionById,
	testSubmission,
} from "@/server/transports/server-functions/submission";
import type { CreateSubmission } from "@/validations/submission";

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
