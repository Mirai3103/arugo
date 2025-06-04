import {
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Icon,
	Text,
	VStack, // Assuming Avatar might be used for user if submission has user info
	Tabs,
	Badge,
	Progress,
	SimpleGrid,
	Card, // For syntax highlighting block
	Grid, // For PENDING state or loading
	Tooltip,
	Code,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import {
	FiCheckCircle,
	FiXCircle,
	FiClock,
	FiDatabase, // For Memory Limit
	FiActivity, // For Pending
	FiBarChart2, // For Overview Tab
	FiList, // For Test Cases Tab
	FiCode, // For Source Code Tab
	FiChevronLeft,
	FiUploadCloud, // For Resubmit
	FiPlay, // For Continue/Next Problem
	FiCpu, // For Time Execution
	FiDownload, // For Download Source
	FiRefreshCw, // For Running Test Case
	FiAlertTriangle, // For Runtime Error
} from "react-icons/fi";
import dayjs from "dayjs"; // For date formatting, user needs to install: npm install dayjs
import React from "react";
import { Link } from "@tanstack/react-router";
import { useEditorContext } from "./contexts/EditorContext";

// --- START: Types and Sample Data ---
type SubmissionStatus =
	| "ACCEPTED"
	| "WRONG_ANSWER"
	| "TIME_LIMIT_EXCEEDED"
	| "MEMORY_LIMIT_EXCEEDED"
	| "PENDING"
	| "COMPILE_ERROR"
	| "RUNTIME_ERROR"
	| "DRAFT";

type TestCaseStatus =
	| "Success"
	| "WrongAnswer"
	| "TimeLimitExceeded"
	| "MemoryLimitExceeded"
	| "RuntimeError"
	| "CompileError"
	| "RUNNING"
	| "NONE"; // For not yet run testcases

interface TestCase {
	testcaseId: string;
	label?: string; // Optional label for sample test cases
	status: TestCaseStatus;
	runtimeInMs?: string;
	memoryUsedInKb?: string;
	isSample: boolean;
	input?: string; // For detailed view
	output?: string; // For detailed view
	expectedOutput?: string; // For detailed view
}

interface SubmissionDetailsData {
	submissionId: string;
	problemId: string;
	problemTitle: string; // Added for clarity
	status: SubmissionStatus;
	languageId: string; // e.g., "C++", "Python"
	timeExecutionInMs: string;
	memoryUsageInKb: string;
	testcases: TestCase[];
	createdAt: string; // ISO Date string
	code: string;
	languageVersion?: string; // e.g., "17" for C++17
	totalTestCases?: number; // For progress bar if not all testcases are in the array initially
	passedTestCases?: number; // For progress bar
}

const sampleSubmission: SubmissionDetailsData = {
	submissionId: "123",
	problemId: "two-sum",
	problemTitle: "Two Sum",
	status: "TIME_LIMIT_EXCEEDED", // Change this to test different states: PENDING, WRONG_ANSWER etc.
	languageId: "C++",
	languageVersion: "17",
	timeExecutionInMs: "15 ms",
	memoryUsageInKb: "12 MB",
	createdAt: "2025-06-03T01:29:00+07:00",
	code: ` #include <vector>\n #include <unordered_map>\n \n class Solution {\n public:\n  std::vector<int> twoSum(std::vector<int>& nums, int target) {\n    std::unordered_map<int, int> numMap;\n    for (int i = 0; i < nums.size(); ++i) {\n      int complement = target - nums[i];\n      if (numMap.count(complement)) {\n        return {numMap[complement], i};\n      }\n      numMap[nums[i]] = i;\n    }\n    return {}; // Should not happen based on problem description\n  }\n };`,
	testcases: [
		{
			testcaseId: "1",
			label: "Sample 1",
			status: "Success",
			runtimeInMs: "5 ms",
			memoryUsedInKb: "4 MB",
			isSample: true,
			input: "[2,7,11,15], 9",
			output: "[0,1]",
			expectedOutput: "[0,1]",
		},
		{
			testcaseId: "2",
			label: "Sample 2",
			status: "Success",
			runtimeInMs: "6 ms",
			memoryUsedInKb: "5 MB",
			isSample: true,
			input: "[3,2,4], 6",
			output: "[1,2]",
			expectedOutput: "[1,2]",
		},
		{
			testcaseId: "3",
			status: "Success",
			runtimeInMs: "4 ms",
			memoryUsedInKb: "3 MB",
			isSample: false,
		},
		{
			testcaseId: "4",
			status: "WRONG_ANSWER",
			runtimeInMs: "4 ms",
			memoryUsedInKb: "3 MB",
			isSample: false,
			input: "[0,0], 1",
			output: "[]",
			expectedOutput: "[0,1] (example)",
		},
		{
			testcaseId: "5",
			status: "TIME_LIMIT_EXCEEDED",
			runtimeInMs: "2001 ms",
			memoryUsedInKb: "3 MB",
			isSample: false,
		},
		{
			testcaseId: "6",
			status: "MEMORY_LIMIT_EXCEEDED",
			runtimeInMs: "10 ms",
			memoryUsedInKb: "256 MB",
			isSample: false,
		},
		{
			testcaseId: "7",
			status: "RUNTIME_ERROR",
			runtimeInMs: "N/A",
			memoryUsedInKb: "N/A",
			isSample: false,
		},
		// Add more test cases to see scrolling and grid layout
		...Array.from({ length: 10 }, (_, i) => ({
			testcaseId: `${8 + i}`,
			status: "NONE" as TestCaseStatus,
			isSample: false,
		})),
	],
	totalTestCases: 17, // Example: 7 detailed + 10 NONE
	passedTestCases: 3, // Example: 3 Success
};
// --- END: Types and Sample Data ---

// --- START: Helper Components & Functions ---
interface StatusBadgeProps {
	status: SubmissionStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
	const statusConfig = {
		ACCEPTED: {
			label: "Chấp nhận",
			colorScheme: "green",
			icon: FiCheckCircle,
		},
		WRONG_ANSWER: {
			label: "Sai kết quả",
			colorScheme: "red",
			icon: FiXCircle,
		},
		TIME_LIMIT_EXCEEDED: {
			label: "Quá thời gian",
			colorScheme: "orange",
			icon: FiClock,
		},
		MEMORY_LIMIT_EXCEEDED: {
			label: "Quá bộ nhớ",
			colorScheme: "purple",
			icon: FiDatabase,
		},
		PENDING: {
			label: "Đang chấm",
			colorScheme: "blue",
			icon: FiActivity,
			animate: true,
		},
		COMPILE_ERROR: {
			label: "Lỗi biên dịch",
			colorScheme: "red",
			icon: FiXCircle,
		},
		RUNTIME_ERROR: {
			label: "Lỗi thực thi",
			colorScheme: "red",
			icon: FiAlertTriangle,
		},
		DRAFT: { label: "Bản nháp", colorScheme: "gray", icon: FiClock },
		DEFAULT: {
			label: "Không xác định",
			colorScheme: "gray",
			icon: FiClock,
		},
	};

	const config = statusConfig[status] || statusConfig.DEFAULT;

	return (
		<Badge
			colorScheme={config.colorScheme}
			variant="subtle"
			px={3}
			py={1.5}
			borderRadius="md"
			fontSize="sm"
		>
			<HStack>
				<Icon as={config.icon} animation={"pulse 1.5s infinite"} />
				<Text>{config.label}</Text>
			</HStack>
		</Badge>
	);
};

const getTestCaseIcon = (status: TestCaseStatus) => {
	switch (status) {
		case "Success":
			return { icon: FiCheckCircle, color: "green.500" };
		case "RUNNING":
			return {
				icon: FiRefreshCw,
				color: "blue.500",
				animate: "spin 1s linear infinite",
			};
		case "WrongAnswer":
			return { icon: FiXCircle, color: "red.500" };
		case "TimeLimitExceeded":
			return { icon: FiClock, color: "orange.500" };
		case "MemoryLimitExceeded":
			return { icon: FiDatabase, color: "purple.500" };
		case "RuntimeError":
			return { icon: FiAlertTriangle, color: "red.500" };
		case "CompileError":
			return { icon: FiXCircle, color: "red.500" };
		default:
			return { icon: FiClock, color: "gray.400" };
	}
};
// --- END: Helper Components & Functions ---

// --- START: Main Component ---
interface SubmissionDetailsPageProps {
	submissionData?: SubmissionDetailsData; // Make it optional for easy testing
}

export const SubmissionDetails: React.FC<SubmissionDetailsPageProps> = ({
	submissionData = sampleSubmission,
}) => {
	const {
		submissionId,
		problemId,
		problemTitle,
		status,
		languageId,
		languageVersion,
		timeExecutionInMs,
		memoryUsageInKb,
		testcases,
		createdAt,
		code,
		totalTestCases = testcases.length,
		passedTestCases = testcases.filter((tc) => tc.status === "Success")
			.length,
	} = submissionData;

	const cardBg = { base: "white", _dark: "gray.800" };

	const subduedTextColor = { base: "gray.500", _dark: "gray.400" };
	const progressPercent =
		status === "PENDING" && totalTestCases > 0
			? Math.round(((passedTestCases || 0) / totalTestCases) * 100)
			: status === "ACCEPTED"
				? 100
				: 0;

	// Performance bar calculation (example)
	const timeLimitMs = 200;
	const memoryLimitKb = 32 * 1024; // 32MB in KB

	const parseValue = (valueStr: string) =>
		parseFloat(valueStr.split(" ")[0]) || 0;

	const timeUsagePercent = Math.min(
		100,
		(parseValue(timeExecutionInMs) / timeLimitMs) * 100
	);
	const memoryUsagePercent = Math.min(
		100,
		(parseValue(memoryUsageInKb) / (memoryLimitKb / 1024)) * 100
	);
	const { editor, setLanguage } = useEditorContext();
	React.useEffect(() => {
		if (editor.current && code) {
			const model = editor.current.getModel();
			if (model) {
				model.setValue(code);
			} else {
				console.error("Editor model not found");
			}
		}
	}, [editor, code]);
	return (
		<VStack gap={6} align="stretch">
			{/* Header Section */}
			<Flex
				direction={{ base: "column", md: "row" }}
				justifyContent="space-between"
				alignItems={{ base: "flex-start", md: "center" }}
				bg={cardBg}
				p={6}
				borderRadius="lg"
				boxShadow="md"
			>
				<VStack align="flex-start" gap={1}>
					<Heading as="h1" size="lg">
						Bài nộp #{submissionId}
					</Heading>
					<Text fontSize="sm" color={subduedTextColor}>
						Bài tập:
						<chakra.span fontWeight="medium">
							{problemTitle}
						</chakra.span>
						(
						<chakra.div
							color={{ base: "teal.600", _dark: "teal.300" }}
						>
							<Link
								to={`/problems/${problemId}`}
								style={{
									textDecoration: "underline",
								}}
							>
								{problemId}
							</Link>
						</chakra.div>
						)
					</Text>
				</VStack>
				<Box mt={{ base: 3, md: 0 }}>
					<StatusBadge status={status} />
				</Box>
			</Flex>

			{/* Progress Bar */}
			{status === "PENDING" && (
				<Box bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
					<HStack justifyContent="space-between" mb={1}>
						<Text fontSize="sm" fontWeight="medium">
							Tiến trình chạy
						</Text>
						<Text fontSize="sm" fontWeight="bold" color="teal.500">
							{progressPercent}%
						</Text>
					</HStack>

					<Progress.Root
						value={progressPercent}
						size="sm"
						colorPalette="teal"
						borderRadius="full"
						animated
						striped
					>
						<Progress.Track borderRadius="full">
							<Progress.Range />
						</Progress.Track>
					</Progress.Root>
				</Box>
			)}

			{/* Tabs Section */}
			<Box bg={cardBg} borderRadius="lg" boxShadow="sm" overflow="hidden">
				<Tabs.Root
					variant="enclosed"
					colorPalette="teal"
					defaultValue="overview"
				>
					<Tabs.List
						borderBottomColor={{
							_light: "gray.200",
							_dark: "gray.700",
						}}
						px={2}
					>
						<Tabs.Trigger value="overview">
							<Icon as={FiBarChart2} mr={2} />
							Tổng quan
						</Tabs.Trigger>
						<Tabs.Trigger value="testcases">
							<Icon as={FiList} mr={2} />
							Test Cases
						</Tabs.Trigger>
						<Tabs.Trigger value="sourcecode">
							<Icon as={FiCode} mr={2} />
							Mã nguồn
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="overview" p={{ base: 4, md: 6 }}>
						<VStack gap={6} align="stretch">
							<SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
								<Card.Root variant="outline" size="sm">
									{/* Card -> Card.Root */}
									<Card.Header pb={2}>
										<Heading size="xs">
											Thông tin bài nộp
										</Heading>
									</Card.Header>
									{/* CardHeader -> Card.Header */}
									<Card.Body pt={0}>
										{/* CardBody -> Card.Body */}
										<VStack
											align="stretch"
											gap={1.5}
											fontSize="sm"
										>
											<HStack justifyContent="space-between">
												<Text color={subduedTextColor}>
													Ngôn ngữ:
												</Text>
												<Text fontWeight="medium">
													{languageId}
													{languageVersion &&
														`(${languageVersion})`}
												</Text>
											</HStack>
											<HStack justifyContent="space-between">
												<Text color={subduedTextColor}>
													Thời gian nộp:
												</Text>
												<Text fontWeight="medium">
													{dayjs(createdAt).format(
														"DD/MM/YYYY HH:mm"
													)}
												</Text>
											</HStack>
											<HStack justifyContent="space-between">
												<Text color={subduedTextColor}>
													Trạng thái:
												</Text>
												<StatusBadge status={status} />
											</HStack>
											{/* Giả sử StatusBadge đã tương thích v3 */}
										</VStack>
									</Card.Body>
								</Card.Root>
								<Card.Root variant="outline" size="sm">
									{/* Card -> Card.Root */}
									<Card.Header pb={2}>
										<Heading size="xs">Hiệu suất</Heading>
									</Card.Header>
									{/* CardHeader -> Card.Header */}
									<Card.Body pt={0}>
										{/* CardBody -> Card.Body */}
										<VStack
											align="stretch"
											gap={1.5}
											fontSize="sm"
										>
											<HStack justifyContent="space-between">
												<HStack>
													<Icon
														as={FiCpu}
														color="blue.500"
													/>
													<Text
														color={subduedTextColor}
													>
														Thời gian chạy:
													</Text>
												</HStack>
												<Text fontWeight="medium">
													{timeExecutionInMs}
												</Text>
											</HStack>
											<HStack justifyContent="space-between">
												<HStack>
													<Icon
														as={FiDatabase}
														color="purple.500"
													/>
													<Text
														color={subduedTextColor}
													>
														Bộ nhớ sử dụng:
													</Text>
												</HStack>
												<Text fontWeight="medium">
													{memoryUsageInKb}
												</Text>
											</HStack>
											<HStack justifyContent="space-between">
												<HStack>
													<Icon
														as={FiCheckCircle}
														color="green.500"
													/>
													<Text
														color={subduedTextColor}
													>
														Test cases đạt:
													</Text>
												</HStack>
												<Text fontWeight="medium">
													{passedTestCases}/
													{totalTestCases}
												</Text>
											</HStack>
										</VStack>
									</Card.Body>
								</Card.Root>
							</SimpleGrid>

							{status === "ACCEPTED" && (
								<Card.Root // Card -> Card.Root
									bg={{
										_light: "green.50",
										_dark: "green.800",
									}} // Áp dụng _light, _dark trực tiếp
									borderColor={{
										_light: "green.200",
										_dark: "green.600",
									}} // Tương tự cho borderColor
									variant="outline"
								>
									<Card.Header>
										<Heading
											size="sm"
											color={{
												_light: "green.700",
												_dark: "green.200",
											}}
										>
											Kết quả bài nộp
										</Heading>
									</Card.Header>
									{/* CardHeader -> Card.Header */}
									<Card.Body>
										{/* CardBody -> Card.Body */}
										<VStack gap={4}>
											<Box w="full">
												<HStack
													justifyContent="space-between"
													mb={1}
												>
													<Text
														fontSize="xs"
														color={subduedTextColor}
													>
														Thời gian chạy
													</Text>
													<Text
														fontSize="xs"
														fontWeight="medium"
													>
														{timeExecutionInMs}/
														<chakra.span
															color={
																subduedTextColor
															}
														>
															{timeLimitMs} ms
														</chakra.span>
													</Text>
												</HStack>
												<Progress.Root
													value={timeUsagePercent}
													size="xs"
													colorPalette="green"
												>
													<Progress.Track borderRadius="full">
														<Progress.Range />
													</Progress.Track>
												</Progress.Root>
											</Box>
											<Box w="full">
												<HStack
													justifyContent="space-between"
													mb={1}
												>
													<Text
														fontSize="xs"
														color={subduedTextColor}
													>
														Bộ nhớ sử dụng
													</Text>
													<Text
														fontSize="xs"
														fontWeight="medium"
													>
														{memoryUsageInKb} /
														<chakra.span
															color={
																subduedTextColor
															}
														>
															{memoryLimitKb /
																1024}
															MB
														</chakra.span>
													</Text>
												</HStack>
												<Progress.Root
													value={memoryUsagePercent}
													size="xs"
													colorPalette="green"
												>
													<Progress.Track borderRadius="full">
														<Progress.Range />
													</Progress.Track>
												</Progress.Root>
											</Box>
										</VStack>
									</Card.Body>
								</Card.Root>
							)}

							<Box>
								<Heading size="sm" mb={3}>
									Tóm tắt Test Cases
								</Heading>
								<Grid
									templateColumns={{
										base: "repeat(3, 1fr)",
										sm: "repeat(4, 1fr)",
										md: "repeat(5, 1fr)",
										lg: "repeat(6, 1fr)",
									}}
									gap={2}
								>
									{testcases.map((tc) => {
										const { icon, color, animate } =
											getTestCaseIcon(tc.status);
										return (
											<Tooltip.Root key={tc.testcaseId}>
												<Tooltip.Content>
													`Test Case #$
													{tc.testcaseId}$
													{tc.label
														? ` (${tc.label})`
														: ""}
													: ${tc.status}`
												</Tooltip.Content>
												<Tooltip.Trigger>
													<Flex
														direction="column"
														alignItems="center"
														justifyContent="center"
														p={2}
														bg={{
															_light: "gray.100",
															_dark: "gray.700",
														}} 
														borderRadius="md"
														h="50px"
														transition="background-color 0.2s"
														_hover={{
															bg: {
																_light: "gray.200",
																_dark: "gray.600",
															},
														}} 
													>
														<Icon
															as={icon}
															color={color}
															boxSize={4}
															animation={animate}
														/>
														<Text
															fontSize="2xs"
															color={
																subduedTextColor
															}
															mt={1}
														>
															#{tc.testcaseId}
														</Text>
													</Flex>
												</Tooltip.Trigger>
												<Tooltip.Arrow />
											</Tooltip.Root>
										);
									})}
								</Grid>
							</Box>
						</VStack>
					</Tabs.Content>
					<Tabs.Content value="testcases" p={{ base: 4, md: 6 }}>
						<HStack justifyContent="space-between" mb={4}>
							<Heading size="sm">Chi tiết Test Cases</Heading>
							<Text
								fontSize="sm"
								fontWeight="medium"
								color="teal.500"
							>
								Đã đạt: {passedTestCases}/{totalTestCases}
							</Text>
						</HStack>
						<VStack gap={3} align="stretch">
							{testcases.map((tc) => {
								const { icon, color } = getTestCaseIcon(
									tc.status
								);
								const itemBgConditional = // Logic bg được đưa trực tiếp vào prop
									tc.status === "Success"
										? {
												_light: "green.50",
												_dark: "green.800",
											}
										: tc.status === "WrongAnswer" ||
											  tc.status === "CompileError" ||
											  tc.status === "RuntimeError"
											? {
													_light: "red.50",
													_dark: "red.800",
												}
											: {
													_light: "gray.50",
													_dark: "gray.700",
												};
								return (
									<Card.Root
										key={tc.testcaseId}
										variant="outline"
										size="sm"
										bg={itemBgConditional}
										_hover={{
											borderColor: {
												_light: "gray.400",
												_dark: "gray.500",
											},
										}}
									>
										<Card.Body p={3}>
											<Flex
												justifyContent="space-between"
												alignItems="center"
												wrap="wrap"
												gap={2}
											>
												<HStack>
													<Text
														fontWeight="medium"
														fontSize="sm"
													>
														Test Case #
														{tc.testcaseId}
													</Text>
													{tc.isSample && (
														<Badge
															colorPalette="purple"
															variant="solid"
															fontSize="0.6rem"
														>
															Sample
														</Badge>
													)}
													{/* colorScheme -> colorPalette */}
													{!tc.isSample &&
														tc.label ===
															undefined && (
															<Badge
																colorPalette="gray"
																variant="subtle"
																fontSize="0.6rem"
															>
																Hidden
															</Badge>
														)}
													{/* colorScheme -> colorPalette */}
												</HStack>
												<HStack
													color={color}
													fontWeight="medium"
													fontSize="sm"
												>
													<Icon as={icon} />
													<Text>{tc.status}</Text>
												</HStack>
											</Flex>
											{(tc.runtimeInMs ||
												tc.memoryUsedInKb) && (
												<HStack
													mt={1.5}
													gap={4}
													fontSize="xs"
													color={subduedTextColor}
												>
													{tc.runtimeInMs && (
														<Text>
															Thời gian:
															{tc.runtimeInMs}
														</Text>
													)}
													{tc.memoryUsedInKb && (
														<Text>
															Bộ nhớ:
															{tc.memoryUsedInKb}
														</Text>
													)}
												</HStack>
											)}
										</Card.Body>
									</Card.Root>
								);
							})}
						</VStack>
					</Tabs.Content>
					<Tabs.Content value="sourcecode" p={{ base: 4, md: 6 }}>
						<HStack justifyContent="space-between" mb={3}>
							<Heading size="sm">
								Mã nguồn ({languageId}
								{languageVersion && languageVersion})
							</Heading>
							<Button size="xs" variant="outline">
								{/* leftIcon được chuyển thành children */}
								<Icon as={FiDownload} mr={1} /> Tải xuống
							</Button>
						</HStack>
						<Box
							as="pre"
							bg={{ _light: "gray.100", _dark: "gray.900" }} // useColorModeValue
							color={{ _light: "gray.800", _dark: "gray.50" }} // useColorModeValue
							p={4}
							borderRadius="md"
							overflowX="auto"
							maxH="72vh"
							fontSize="sm"
							fontFamily="monospace"
						>
							<Code
								bg="transparent"
								p={0}
								whiteSpace="pre-wrap"
								display="block"
							>
								{code}
							</Code>
						</Box>
					</Tabs.Content>
				</Tabs.Root>
			</Box>

			{/* Action Buttons */}
			<HStack justifyContent="flex-end" gap={3} mt={2}>
				<Button
					as={Link}
					to={`/problems/${problemId}`}
					variant="outline"
					size="sm"
					leftIcon={<FiChevronLeft />}
				>
					Quay lại bài tập
				</Button>
				<Button variant="outline" colorScheme="blue" size="sm">
					<FiUploadCloud /> Nộp lại
				</Button>
				{status === "ACCEPTED" && (
					<Button colorScheme="teal" size="sm">
						<FiPlay /> Tiếp tục thử thách
					</Button>
				)}
			</HStack>
		</VStack>
	);
};
