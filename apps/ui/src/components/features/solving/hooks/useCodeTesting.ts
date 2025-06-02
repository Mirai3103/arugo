import { toaster } from "@/components/ui/toaster";
import { getTestSubmissionMutationOptions } from "@/libs/queries/submission";
import type { FullProblem } from "@repo/backend/problems/problemService";
import { usePromiseStore } from "@/stores/usePromiseStore";
import { useMutation } from "@tanstack/react-query";

export function useCodeTesting(
	problem: FullProblem,
	selectedLanguageId: string,
	getEditorCode: () => string,
	renewSubmissionId: () => string, // This is renewUuid from useUuid
) {
	const { mutateAsync: testCodeAsync, isPending: isTestingCode } = useMutation(
		getTestSubmissionMutationOptions(),
	);
	const promiseStore = usePromiseStore();

	const handleTestCode = async () => {
		const code = getEditorCode();
		if (!code) {
			toaster.error({ title: "Vui lòng nhập code " });
			return;
		}

		const language = problem.languages.find(
			(lang) => lang.id.toString() === selectedLanguageId,
		);

		if (!language) {
			toaster.error({ title: "Vui lòng chọn ngôn ngữ lập trình" });
			return;
		}

		const newId = renewSubmissionId();

		testCodeAsync({
			code,
			isTest: true,
			languageId: language.id,
			problemId: problem.id,
			id: newId,
		})
			.then(() => {
				// 'res' parameter removed as it wasn't used
				const promise = new Promise((resolve, reject) => {
					// Type the promise
					promiseStore.addPending(newId, { resolve, reject },'test');
				});
				toaster.promise(promise, {
					loading: { title: "Đang chạy thử code..." },
					success: { title: "Code đã pass tất cả testcase" },
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					error: (error: any) => ({
						title: "Code không pass tất cả testcase",
						description: error.message || String(error.error || error), // Try to get a more specific error message
					}),
				});
			})
			.catch((apiError) => {
				toaster.error({
					title: "Lỗi khi gửi code để test",
					description:
						apiError instanceof Error ? apiError.message : String(apiError),
				});
				// Note: If testCodeAsync fails, the promise might not be in promiseStore.
				// The renewUuid() was called, so polling might start for an ID that never made it.
				// The original clearUuid() in the polling effect will eventually clear it.
			});
	};

	return {
		handleTestCode,
		isTestingCode, // This reflects the mutation's pending state
	};
}
