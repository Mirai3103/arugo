import { UserMenu } from "@/components/common/UserMenu";
import CodeEditorArea from "@/components/features/solving/CodeEditorArea";
import { ColorModeButton, useColorModeValue } from "@/components/ui/color-mode"; // Assuming this path is correct for the project
import { Prose } from "@/components/ui/prose";
import { DEFAULT_EXTENSIONS } from "@/libs/tiptap/extension";
import type { ProblemSampleTestCase } from "@repo/backend/problems/problemService";
import { getServerSession } from "@/server/transports/server-functions/auth";
import { getProblemBySlug } from "@/server/transports/server-functions/problem";
import {
	SubmissionTestcaseStatus,
	SubmissionTestcaseStatusColor,
	SubmissionTestcaseStatusIcon,
} from "@/types/enum";
import {
	DIFFICULTY_COLORS_PALATE,
	DIFFICULTY_LABELS,
} from "@/utils/constants/difficulties";
import {
	Badge,
	Box,
	Button,
	Code,
	Container,
	Separator as Divider,
	Flex,
	HStack,
	Heading,
	Icon,
	IconButton,
	Skeleton,
	Tabs,
	Tag,
	Text,
	VStack,
	Wrap,
	useBreakpointValue,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { generateHTML } from "@tiptap/html";
import React, { useMemo } from "react";
import {
	FiBookOpen,
	FiCode,
	FiMessageCircle,
	FiShare2,
	FiThumbsDown,
	FiThumbsUp,
} from "react-icons/fi";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { usePromiseStore } from "@/stores/usePromiseStore";
import { useQuery } from "@tanstack/react-query";
import { getSubmissionByIdQueryOptions } from "@/libs/queries/submission";
const PageHeader = () => {
	const bg = useColorModeValue("white", "gray.800");
	const color = useColorModeValue("gray.800", "white");
	const { session } = Route.useLoaderData();
	return (
		<Box
			as="header"
			py={1}
			px={{ base: 4, md: 8 }}
			bg={bg}
			boxShadow="sm"
			position="sticky"
			top="0"
			zIndex="sticky"
		>
			<Container maxW="container.2xl">
				<Flex justifyContent="space-between" alignItems="center">
					<Link to="/">
						<HStack gap={2}>
							<Icon as={FiCode} w={8} h={8} color="teal.500" />
							<Heading
								as="h1"
								size="md"
								color={color}
								letterSpacing="tight"
							>
								CodeMaster
							</Heading>
						</HStack>
					</Link>
					<HStack gap={4}>
						<Button
							asChild
							variant="ghost"
							colorPalette="teal"
							size="sm"
						>
							<Link to="/home">Trang chủ</Link>
						</Button>
						<ColorModeButton />
						{session.data?.user ? (
							<UserMenu
								isPending={false}
								user={session.data?.user}
							/>
						) : (
							<HStack gap={2}>
								<Button
									asChild
									variant="ghost"
									colorScheme="teal"
									size="sm"
								>
									<Link to="/login">Đăng nhập</Link>
								</Button>
								<Button asChild colorScheme="teal" size="sm">
									<Link to="/signup">Đăng ký</Link>
								</Button>
							</HStack>
						)}
					</HStack>
				</Flex>
			</Container>
		</Box>
	);
};

// Problem Description Panel
const ProblemDescriptionPanel = () => {
	const { problem } = Route.useLoaderData();
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
				>
					<Tabs.List mb={4}>
						<Tabs.Trigger value="desc">Mô tả</Tabs.Trigger>
						<Tabs.Trigger value="editorial">Hướng dẫn</Tabs.Trigger>
						<Tabs.Trigger value="solutions">Giải pháp</Tabs.Trigger>
						<Tabs.Trigger value="submissions">Bài nộp</Tabs.Trigger>
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
					<Tabs.Content value="submissions" p={4}>
						<Text color={textColor}>
							Lịch sử các lần nộp bài của bạn cho bài toán này.
						</Text>
					</Tabs.Content>
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
type TestcaseDetails = ProblemSampleTestCase & {
		stdout?: string;
		status?: SubmissionTestcaseStatus;
	}
interface TestcaseItemProps {
	testcase: TestcaseDetails;
}

const TestcaseItem: React.FC<TestcaseItemProps> = ({ testcase }) => {
	const bgColor = useColorModeValue("gray.50", "gray.700");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const testcaseStatus = testcase.status || SubmissionTestcaseStatus.None;
	const isRunning = testcaseStatus === SubmissionTestcaseStatus.Running;
	console.log("isRunning", isRunning, testcaseStatus);
const colors = {
    gray: {
      bg: useColorModeValue("gray.100", "gray.800"),
      text: useColorModeValue("gray.800", "gray.200")
    },
    green: {
      bg: useColorModeValue("green.50", "green.900"),
      text: useColorModeValue("green.800", "green.200")
    },
    red: {
      bg: useColorModeValue("red.50", "red.900"),
      text: useColorModeValue("red.800", "red.200")
    }
  };

  // Use useMemo for computed values
  const resultBackground = useMemo(() => {
    if (isRunning) return colors.gray.bg;

    switch (testcaseStatus) {
      case SubmissionTestcaseStatus.Success:
        return colors.green.bg;
      case SubmissionTestcaseStatus.CompileError:
      case SubmissionTestcaseStatus.RuntimeError:
      case SubmissionTestcaseStatus.MemoryLimitExceeded:
      case SubmissionTestcaseStatus.WrongAnswer:
        return colors.red.bg;
      default:
        return colors.gray.bg;
    }
  }, [isRunning, testcaseStatus, colors]);

  const resultTextColor = useMemo(() => {
    if (isRunning) return colors.gray.text;

    switch (testcaseStatus) {
      case SubmissionTestcaseStatus.Success:
        return colors.green.text;
      case SubmissionTestcaseStatus.CompileError:
      case SubmissionTestcaseStatus.RuntimeError:
      case SubmissionTestcaseStatus.MemoryLimitExceeded:
      case SubmissionTestcaseStatus.WrongAnswer:
        return colors.red.text;
      default:
        return colors.gray.text;
    }
  }, [isRunning, testcaseStatus, colors]);
	return (
		<Box
			w="full"
			borderWidth="1px"
			borderRadius="lg"
			overflow="hidden"
			borderColor={borderColor}
			bg={bgColor}
		>
			<VStack align="stretch" gap={4} p={4}>
				<Box>
					<Text fontWeight="medium" mb={2}>
						Đầu vào:
					</Text>
					<Code
						p={3}
						borderRadius="md"
						w="full"
						fontSize="sm"
						bg={useColorModeValue("gray.100", "gray.800")}
					>
						{testcase.inputData}
					</Code>
				</Box>

				<Box>
					<Text fontWeight="medium" mb={2}>
						Kết quả mong đợi:
					</Text>
					<Code
						p={3}
						borderRadius="md"
						w="full"
						fontSize="sm"
						bg={useColorModeValue("gray.100", "gray.800")}
					>
						{testcase.expectedOutput}
					</Code>
				</Box>

				{(testcase.stdout || isRunning) && (
					<Box>
						<Text fontWeight="medium" mb={2}>
							Kết quả thực tế:
						</Text>
						<Code
							p={3}
							borderRadius="md"
							fontSize="sm"
							w="full"
							bg={resultBackground}
							color={resultTextColor}
						>
							{isRunning ? (
								<Skeleton height="20px" width="100%" />
							) : (
								testcase.stdout
							)}
						</Code>
					</Box>
				)}
			</VStack>
		</Box>
	);
};

const TestAndResultPanel: React.FC = () => {
  const { problem } = Route.useLoaderData();
  const testcases = React.useMemo(() => 
    problem.sampleTestCases || [], 
    [problem.sampleTestCases]
  );
  
  const { id } = usePromiseStore();
  const firstPending = id;
  
  const submissionQuery = useQuery({
    ...getSubmissionByIdQueryOptions(firstPending || ""),
    enabled: !!firstPending,
    refetchInterval: 3000,
  });

  const [cachedSubmission, setCachedSubmission] = React.useState(submissionQuery.data);
  
  React.useEffect(() => {
    if (submissionQuery.data) {
      setCachedSubmission(submissionQuery.data);
    }
  }, [submissionQuery.data]);

  const finalTestcases = React.useMemo<TestcaseDetails[]>(() => {
    if (!cachedSubmission) return testcases;
    
    const submissionTestcases = cachedSubmission.submissionTestcases || [];
    
    return testcases.map((testcase) => {
      const submissionTestcase = submissionTestcases.find(
        (tc) => tc.testcaseId === testcase.id
      );
      
      return {
        ...testcase,
        status: submissionTestcase?.status || SubmissionTestcaseStatus.None,
        stdout: submissionTestcase?.stdout || "",
      } ;
    });
  }, [cachedSubmission, testcases]);

  const getTabColor = (testcaseId: string) => {
    const testcase = finalTestcases.find(tc => tc.id === testcaseId);
    if (!testcase) return SubmissionTestcaseStatusColor[SubmissionTestcaseStatus.None];
    
    const status = testcase.status || SubmissionTestcaseStatus.None;
    return SubmissionTestcaseStatusColor[status];
  };

  const getTabIcon = (testcaseId: string) => {
    const testcase = finalTestcases.find(tc => tc.id === testcaseId);
    if (!testcase) return SubmissionTestcaseStatusIcon[SubmissionTestcaseStatus.None];
    
    const status = testcase.status || SubmissionTestcaseStatus.None;
    return SubmissionTestcaseStatusIcon[status];
  };
  const boxBg = useColorModeValue("gray.100", "gray.700");
  if (!testcases.length) return null;

  return (
    <Box w="full" shadow="md" borderRadius="lg" overflow="hidden">
      <Tabs.Root
        lazyMount
        defaultValue={testcases[0]?.id}
        variant="enclosed"
        width="100%"
      >
        <Box
          bg={boxBg}
          borderTopRadius="lg"
        >
          <Tabs.List
            bg="bg.muted"
            rounded="lg"
            p={2}
            width="100%"
          >
            {testcases.map((testcase) => (
              <Tabs.Trigger
                key={testcase.id}
                value={testcase.id}
                colorPalette={getTabColor(testcase.id)}
              >
                <Icon colorPalette={getTabColor(testcase.id)}>
                  {getTabIcon(testcase.id)}
                </Icon>
                {testcase.label}
              </Tabs.Trigger>
            ))}
            <Tabs.Indicator rounded="md" />
          </Tabs.List>
        </Box>
        
        {finalTestcases.map((testcase) => (
          <Tabs.Content 
            key={testcase.id}
            value={testcase.id} 
            p={2}
          >
            <TestcaseItem testcase={testcase} />
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Box>
  );
};
// Unauthenticated Right Panel - shows login prompt
const UnAuthRightResizablePanel = () => {
	const panelBg = useColorModeValue("white", "gray.800");
	const textColor = useColorModeValue("gray.600", "gray.300");
	const headingColor = useColorModeValue("gray.800", "white");

	return (
		<Flex
			direction="column"
			h="100%"
			bg={panelBg}
			boxShadow={{ md: "sm" }}
			rounded={{ md: "lg" }}
			overflow="hidden"
			alignItems="center"
			justifyContent="center"
			p={8}
		>
			<VStack gap={6} textAlign="center" maxW="400px">
				<Icon as={FiCode} w={16} h={16} color="teal.500" />

				<VStack gap={3}>
					<Heading as="h2" size="lg" color={headingColor}>
						Đăng nhập để giải bài
					</Heading>

					<Text color={textColor} fontSize="md" lineHeight="1.6">
						Bạn cần đăng nhập để có thể viết code, chạy thử và nộp
						bài giải. Hãy tạo tài khoản miễn phí để bắt đầu hành
						trình coding của bạn!
					</Text>
				</VStack>

				<VStack gap={3} w="100%">
					<Button asChild colorPalette="teal" size="lg" w="100%">
						<Link to="/login">Đăng nhập</Link>
					</Button>

					<Button
						asChild
						variant="outline"
						colorPalette="teal"
						size="lg"
						w="100%"
					>
						<Link to="/signup">Đăng ký miễn phí</Link>
					</Button>
				</VStack>

				<Text fontSize="sm" color={textColor}>
					Chưa có tài khoản? Đăng ký chỉ mất 30 giây!
				</Text>
			</VStack>
		</Flex>
	);
};
// Main Resizable Component for the Right Side
const RightResizablePanel = () => {
	const { problem } = Route.useLoaderData();
	const panelBg = useColorModeValue("white", "gray.800");
	const handleBg = useColorModeValue("gray.200", "gray.600");
	const handleActiveBg = useColorModeValue("gray.300", "gray.500");

	return (
		<Flex
			direction="column"
			h="100%"
			bg={panelBg}
			boxShadow={{ md: "sm" }}
			rounded={{ md: "lg" }}
			overflow="hidden"
		>
			<PanelGroup direction="vertical">
				<Panel
					defaultSize={70}
					minSize={30}
					collapsible
					collapsedSize={31}
				>
					<CodeEditorArea problem={problem} />
				</Panel>
				<PanelResizeHandle>
					<Flex
						alignItems="center"
						justifyContent="center"
						h="4px"
						bg={handleBg}
						outline="none"
						transition="background-color 0.2s"
						_hover={{ bg: handleActiveBg }}
						_active={{ bg: handleActiveBg }}
						data-panel-resize-handle-active // Attribute for potential active styling from library
					>
						<Box
							w="30px"
							h="4px"
							bg={useColorModeValue("gray.400", "gray.500")}
							rounded="full"
						/>
					</Flex>
				</PanelResizeHandle>
				<Panel
					defaultSize={30}
					minSize={20}
					collapsible
					collapsedSize={21}
				>
					<Box h="100%" overflowY="auto">
						<TestAndResultPanel />
					</Box>
				</Panel>
			</PanelGroup>
		</Flex>
	);
};

function RouteComponent() {
	const isMobile = useBreakpointValue({ base: true, lg: false });
	const panelBg = useColorModeValue("gray.100", "gray.900"); // Background for the panel group area
	const handleBg = useColorModeValue("gray.300", "gray.600");
	const handleActiveBg = useColorModeValue("gray.400", "gray.500");
	const { session } = Route.useLoaderData();
	if (isMobile) {
		return (
			<Flex direction="column" minH="100vh" bg={panelBg}>
				<PageHeader />
				<VStack gap={0} flex="1" overflowY="auto" className="con cac">
					<Box w="100%">
						<ProblemDescriptionPanel />
					</Box>
					<Divider borderColor={handleBg} my={0} />
					<Box w="100%">
						{session.data?.user ? (
							<RightResizablePanel />
						) : (
							<UnAuthRightResizablePanel />
						)}
					</Box>
				</VStack>
			</Flex>
		);
	}

	return (
		<Flex
			direction="column"
			h="100vh"
			maxH="100vh"
			overflow="hidden"
			bg={panelBg}
		>
			<PageHeader />
			<Box flex="1" p={{ base: 1, md: 2 }} overflow="hidden">
				<PanelGroup
					direction="horizontal"
					style={{ height: "calc(100vh - 30px - 16px)" }}
				>
					<Panel defaultSize={50} minSize={30}>
						<Box h="100%" px={{ base: 1, md: 2 }} overflow="hidden">
							<ProblemDescriptionPanel />
						</Box>
					</Panel>
					<PanelResizeHandle>
						<Flex
							alignItems="center"
							justifyContent="center"
							w="4px"
							h="100%"
							bg={handleBg}
							outline="none"
							transition="background-color 0.2s"
							_hover={{ bg: handleActiveBg }}
							_active={{ bg: handleActiveBg }}
							data-panel-resize-handle-active // For library's active state styling
						>
							<Box
								h="30px"
								w="4px"
								bg={useColorModeValue("gray.400", "gray.500")}
								rounded="full"
							/>
						</Flex>
					</PanelResizeHandle>
					<Panel defaultSize={50} minSize={30}>
						<Box h="100%" px={{ base: 1, md: 2 }} overflow="hidden">
							{session.data?.user ? (
								<RightResizablePanel />
							) : (
								<UnAuthRightResizablePanel />
							)}
						</Box>
					</Panel>
				</PanelGroup>
			</Box>
		</Flex>
	);
}

export const Route = createFileRoute({
	loader: async ({ params, context }) => {
		const { slug } = params;
		const session = await getServerSession();

		return {
			session,
			problem: await getProblemBySlug({
				data: { slug },
			}),
		};
	},
	component: RouteComponent,
});
