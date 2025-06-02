import { useColorModeValue } from "@/components/ui/color-mode"; // Assuming this path is correct for the project
import { Prose } from "@/components/ui/prose";
import { DEFAULT_EXTENSIONS } from "@/libs/tiptap/extension";
import type { FullProblem } from "@repo/backend/problems/problemService";
import {
    DIFFICULTY_COLORS_PALATE,
    DIFFICULTY_LABELS,
} from "@/utils/constants/difficulties";
import {
    Badge,
    Box,
    Separator as Divider,
    Flex,
    HStack,
    Heading,
    IconButton,
    Tabs,
    Tag,
    Text,
    VStack,
    Wrap,
} from "@chakra-ui/react";
import { generateHTML } from "@tiptap/html";
import React from "react";
import {
    FiBookOpen,
    FiMessageCircle,
    FiShare2,
    FiThumbsDown,
    FiThumbsUp,
} from "react-icons/fi";
import { usePromiseStore } from "@/stores/usePromiseStore";
import { useQuery } from "@tanstack/react-query";
import { getSubmissionByIdQueryOptions } from "@/libs/queries/submission";
import { LuX } from "react-icons/lu";
import { SubmissionDetails } from "./SubmissionDetailsPage";
interface ProblemDescriptionPanelProps {
	problem: FullProblem;
}

export const ProblemDescriptionPanel = ({
	problem,
}: ProblemDescriptionPanelProps) => {
	const problemStatement = React.useMemo(() => {
		return generateHTML(problem.statement as JSON, DEFAULT_EXTENSIONS);
	}, [problem.statement]);
	const editorial = React.useMemo(() => {
		return generateHTML(
			(problem.description as JSON) ?? {},
			DEFAULT_EXTENSIONS
		);
	}, [problem.description]);
	const bgColor = useColorModeValue("white", "gray.800");
	const textColor = useColorModeValue("gray.700", "gray.200");
	const subduedTextColor = useColorModeValue("gray.500", "gray.400");
	const [isShowSubmissionPanel, setIsShowSubmissionPanel] =
		React.useState(true);
	const [value, setValue] = React.useState<string | null>("desc");
	const { id, type } = usePromiseStore();
	const submissionQuery = useQuery({
		...getSubmissionByIdQueryOptions(id || ""),
		enabled: !!id && type === "submit",
		refetchInterval: 3000,
	});
	const [cachedSubmission, setCachedSubmission] = React.useState(
		submissionQuery.data || null
	);
	React.useEffect(() => {
		if (submissionQuery.data) {
			setCachedSubmission(submissionQuery.data);
		}
	}, [submissionQuery.data]);
	React.useEffect(() => {
		if (id && type === "submit") {
			setIsShowSubmissionPanel(true);
		}
	}, [id, type]);

	return (
		<Flex
			direction="column"
			h="100%"
			bg={bgColor}
			rounded={{ md: "lg" }}
			overflowY="auto" // Allow scrolling within this panel
		>
			<Box p={{ base: 4, md: 6 }} flexGrow={1}>
				<Heading as="h1" size="lg" mb={4}>
					{problem.title}
				</Heading>
				<Tabs.Root
					variant="line"
					colorPalette="teal"
					size="sm"
					defaultValue="desc"
					value={value}
					onValueChange={({ value: newVal }) => {
						setValue(newVal);
						
					}}
				>
					<Tabs.List mb={4}>
						<Tabs.Trigger value="desc">Mô tả</Tabs.Trigger>
						<Tabs.Trigger value="editorial">Hướng dẫn</Tabs.Trigger>
						<Tabs.Trigger value="solutions">Giải pháp</Tabs.Trigger>
						<Tabs.Trigger value="histories">Lịch sử </Tabs.Trigger>
						{isShowSubmissionPanel && (
							<Tabs.Trigger value="submission">
								Bài nộp
								<IconButton
									variant={"ghost"}
									size={"xs"}
									rounded={"full"}
									colorPalette={"red"}
									onClick={() => {
										setIsShowSubmissionPanel(false);
                                        if( value === "submission") {
                                            setValue("desc");
                                        }
									}}
								>
									<LuX />
								</IconButton>
							</Tabs.Trigger>
						)}
					</Tabs.List>
					<Tabs.Content value="desc" p={0}>
						<VStack align="stretch" gap={5}>
							<Prose size={"lg"} maxWidth={"99%"}>
								<div
									// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
									dangerouslySetInnerHTML={{
										__html: problemStatement,
									}}
								/>
							</Prose>
							<VStack align="stretch" gap={3} pt={4}>
								<Heading as="h3" size="sm" mb={1}>
									Thông tin thêm
								</Heading>
								<HStack justifyContent="space-between">
									<Text
										fontSize="sm"
										color={subduedTextColor}
									>
										Độ khó:
									</Text>
									<Badge
										colorPalette={
											DIFFICULTY_COLORS_PALATE[
												problem.difficultyLevel!
											]
										}
										variant="solid"
										fontSize="xs"
									>
										{
											DIFFICULTY_LABELS[
												problem.difficultyLevel!
											]
										}
									</Badge>
								</HStack>
								<HStack justifyContent="space-between">
									<Text
										fontSize="sm"
										color={subduedTextColor}
									>
										Thẻ:
									</Text>
									<Wrap gap={1}>
										{problem.tags.map((tag) => (
											<Tag.Root
												size="sm"
												colorPalette="purple"
												variant="subtle"
												key={tag.id}
											>
												<Tag.Label>
													{tag.name}
												</Tag.Label>
											</Tag.Root>
										))}
									</Wrap>
								</HStack>
								<HStack justifyContent="space-between">
									<Text
										fontSize="sm"
										color={subduedTextColor}
									>
										Lượt chấp nhận:
									</Text>
									<Text fontSize="sm" fontWeight="medium">
										75.2%
									</Text>
								</HStack>
							</VStack>
						</VStack>
					</Tabs.Content>
					<Tabs.Content value="editorial" p={1}>
						<Prose size={"lg"}>
							<div
								// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
								dangerouslySetInnerHTML={{
									__html: editorial,
								}}
							/>
						</Prose>
					</Tabs.Content>
					<Tabs.Content value="solutions" p={4}>
						<Text color={textColor}>
							Các giải pháp từ cộng đồng sẽ được hiển thị ở đây.
						</Text>
					</Tabs.Content>
					<Tabs.Content value="histories" p={4}>
						<Text color={textColor}>
							Lịch sử các lần nộp bài của bạn cho bài toán này.
						</Text>
					</Tabs.Content>
					{isShowSubmissionPanel && (
						<Tabs.Content value="submission" p={1}>
							{cachedSubmission ? (
								<SubmissionDetails/>
							) : (
								<SubmissionDetails/>
							)}
						</Tabs.Content>
					)}
				</Tabs.Root>
			</Box>
			<Divider />
			<HStack
				p={{ base: 3, md: 4 }}
				gap={3}
				justifyContent="space-between"
				bg={useColorModeValue("gray.50", "gray.850")}
				borderBottomRadius={{ md: "lg" }}
			>
				<HStack gap={1}>
					<IconButton aria-label="Thích" variant="ghost" size="sm">
						<FiThumbsUp />
					</IconButton>
					<Text fontSize="sm" color={subduedTextColor}>
						{/* {problem.} */}
					</Text>
					<IconButton
						aria-label="Không thích"
						variant="ghost"
						size="sm"
					>
						<FiThumbsDown />
					</IconButton>
				</HStack>
				<HStack gap={1}>
					<IconButton
						aria-label="Thêm vào danh sách"
						variant="ghost"
						size="sm"
					>
						<FiBookOpen />
					</IconButton>
				</HStack>
				<HStack gap={1}>
					<IconButton
						aria-label="Bình luận"
						variant="ghost"
						size="sm"
					>
						<FiMessageCircle />
					</IconButton>
					<Text fontSize="sm" color={subduedTextColor}>
						{/* {problem.comments} */}
					</Text>
				</HStack>
				<IconButton aria-label="Chia sẻ" variant="ghost" size="sm">
					<FiShare2 />
				</IconButton>
			</HStack>
		</Flex>
	);
};
