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
import { SubmissionTestcaseStatus, SubmissionTestcaseStatusLabel } from "@/types/enum";
import type { SubmissionDetails } from "@repo/backend/submissions/submissionService";
import { SubmissionStatus } from "@repo/backend/submissions/validations/enum";

// --- START: Types and Sample Data ---

// --- END: Types and Sample Data ---

// --- START: Helper Components & Functions ---
interface StatusBadgeProps {
	status: SubmissionTestcaseStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
	const statusConfig = {
		[SubmissionTestcaseStatus.Success]: {
			label: "Chấp nhận",
			colorScheme: "green",
			icon: FiCheckCircle,
		},
		[SubmissionTestcaseStatus.WrongAnswer]: {
			label: "Sai kết quả",
			colorScheme: "red",
			icon: FiXCircle,
		},
		[SubmissionTestcaseStatus.TimeLimitExceeded]: {
			label: "Quá thời gian",
			colorScheme: "orange",
			icon: FiClock,
		},
		[SubmissionTestcaseStatus.MemoryLimitExceeded]: {
			label: "Quá bộ nhớ",
			colorScheme: "purple",
			icon: FiDatabase,
		},
		[SubmissionTestcaseStatus.Running]: {
			label: "Đang chấm",
			colorScheme: "blue",
			icon: FiActivity,
			animate: true,
		},
		[SubmissionTestcaseStatus.CompileError]: {
			label: "Lỗi biên dịch",
			colorScheme: "red",
			icon: FiXCircle,
		},
		[SubmissionTestcaseStatus.RuntimeError]: {
			label: "Lỗi thực thi",
			colorScheme: "red",
			icon: FiAlertTriangle,
		},
		[SubmissionTestcaseStatus.None]: {
			label: "Bản nháp",
			colorScheme: "gray",
			icon: FiClock,
		},
		[SubmissionStatus.Failed]: {
			label: "Không thành công",
			colorScheme: "red",
			icon: FiXCircle,
		},
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

const getTestCaseIcon = (status: SubmissionTestcaseStatus) => {
	switch (status) {
		case SubmissionTestcaseStatus.Success:
			return { icon: FiCheckCircle, color: "green.500" };
		case SubmissionTestcaseStatus.Running:
			return {
				icon: FiRefreshCw,
				color: "blue.500",
				animate: "spin 1s linear infinite",
			};
		case SubmissionTestcaseStatus.WrongAnswer:
			return { icon: FiXCircle, color: "red.500" };
		case SubmissionTestcaseStatus.TimeLimitExceeded:
			return { icon: FiClock, color: "orange.500" };
		case SubmissionTestcaseStatus.MemoryLimitExceeded:
			return { icon: FiDatabase, color: "purple.500" };
		case SubmissionTestcaseStatus.RuntimeError:
			return { icon: FiAlertTriangle, color: "red.500" };
		case SubmissionTestcaseStatus.CompileError:
			return { icon: FiXCircle, color: "red.500" };
		default:
			return { icon: FiClock, color: "gray.400" };
	}
};
// --- END: Helper Components & Functions ---

// --- START: Main Component ---

export interface SubmissionDetailsPageProps {
	submissionData: Exclude<SubmissionDetails, undefined>;
}

export const SubmissionDetailPanel: React.FC<SubmissionDetailsPageProps> = ({
	submissionData,
}) => {
	const {
		id: submissionId,
		problemId,
		executionTimeMs: timeExecutionInMs,
		memoryUsageKb: memoryUsageInKb,
		status,
		language: {
			id: languageId,
			version: languageVersion,
			name: languageName,
		},
		submittedAt: createdAt,
		submissionTestcases: testcases,
		code,
	} = submissionData!;
	const totalTestCases = testcases.length;
	const passedTestCases = testcases.filter(
		(tc) => tc.status === SubmissionTestcaseStatus.Success
	).length;

	const cardBg = { base: "white", _dark: "gray.800" };

	const subduedTextColor = { base: "gray.500", _dark: "gray.400" };
	const progressPercent =
		status === SubmissionTestcaseStatus.Running && totalTestCases > 0
			? Math.round(((passedTestCases || 0) / totalTestCases) * 100)
			: status === SubmissionTestcaseStatus.Success
				? 100
				: 0;

	// Performance bar calculation (example)
	const timeLimitMs = 200;
	const memoryLimitKb = 32 * 1024; // 32MB in KB

	const timeUsagePercent = Math.min(
		100,
		(timeExecutionInMs / timeLimitMs) * 100
	);
	const memoryUsagePercent = Math.min(
		100,
		(memoryUsageInKb / (memoryLimitKb / 1024)) * 100
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
					<Heading as="h1" size="lg">1
						Bài nộp #{submissionId}
					</Heading>
				</VStack>
				<Box mt={{ base: 3, md: 0 }}>
					<StatusBadge status={status as SubmissionTestcaseStatus} />
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
											getTestCaseIcon(
												tc.status as SubmissionTestcaseStatus
											);
										return (
											<Tooltip.Root key={tc.testcaseId}>
												<Tooltip.Content>
													`Test Case #$
													{tc.testcaseId}$
													{tc.testcase.label
														? ` (${tc.testcase.label})`
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
															{tc.testcase.label}
														</Text>
													</Flex>
												</Tooltip.Trigger>
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
									tc.status as SubmissionTestcaseStatus
								);
								const itemBgConditional = // Logic bg được đưa trực tiếp vào prop
									tc.status ===
									SubmissionTestcaseStatus.Success
										? {
												_light: "green.50",
												_dark: "green.800",
											}
										: tc.status ===
													SubmissionTestcaseStatus.WrongAnswer ||
											  tc.status ===
													SubmissionTestcaseStatus.CompileError ||
											  tc.status ===
													SubmissionTestcaseStatus.RuntimeError
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
													{tc.testcase.isSample && (
														<Badge
															colorPalette="purple"
															variant="solid"
															fontSize="0.6rem"
														>
															Sample
														</Badge>
													)}
													{/* colorScheme -> colorPalette */}
													{!tc.testcase.isSample &&
														tc.testcase.label ===
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
													<Text>{SubmissionTestcaseStatusLabel[tc.status as SubmissionTestcaseStatus]}</Text>
												</HStack>
											</Flex>
											{(tc.runtimeMs ||
												tc.memoryUsedKb) && (
												<HStack
													mt={1.5}
													gap={4}
													fontSize="xs"
													color={subduedTextColor}
												>
													{tc.runtimeMs && (
														<Text>
															Thời gian:{" "}
															{tc.runtimeMs}ms
														</Text>
													)}
													{tc.memoryUsedKb && (
														<Text>
															Bộ nhớ:{" "}
															{tc.memoryUsedKb}KB
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
								Mã nguồn: ({languageName}
								{" "}{languageVersion && `v${languageVersion}`})
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
