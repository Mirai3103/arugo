import { trpc } from "@/libs/query";

import { usePromiseStore } from "@/stores/usePromiseStore";
import { SubmissionTestcaseStatus } from "@/types/enum"; 
import { useQuery } from "@tanstack/react-query";
import React from "react";

export function useSubmissionPolling(
  submissionId: string | null,
  _clearSubmissionId: () => void,
) {
  const promiseStore = usePromiseStore();

  const submissionQuery = useQuery(trpc.submission.getSubmissionById.queryOptions({ id: submissionId || "" }, {
    enabled: promiseStore.isPending(),
    refetchInterval: 3000,
  }),
  );

  React.useEffect(() => {
    if (!submissionQuery.data || !submissionId) return;

    const { status } = submissionQuery.data;
    if (
      status === SubmissionTestcaseStatus.None ||
      status === SubmissionTestcaseStatus.Running
    ) {
      return;
    }

    if (status === SubmissionTestcaseStatus.Success) {
      promiseStore.resolvePending({
        status: "success",
        data: submissionQuery.data,
      });
    } else {
      promiseStore.rejectPending({
        status: "error",
        error: submissionQuery.data?.status, 
      });
    }
  }, [submissionQuery.data, submissionId, promiseStore]);

  return {
    isPolling:
      (submissionQuery.isFetching && !!submissionId) ||
      promiseStore.isPending(),
  };
}
