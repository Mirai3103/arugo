import { UserMenu } from "@/components/common/UserMenu";
import CodeEditorArea from "@/components/features/solving/CodeEditorArea";
import { ColorModeButton } from "@/components/ui/color-mode"; // Assuming this path is correct for the project
import type { ProblemSampleTestCase } from "@repo/backend/problems/problemService";
import { getServerSession } from "@/server/transports/server-functions/auth";
import { getProblemBySlug } from "@/server/transports/server-functions/problem";
import {
  SubmissionTestcaseStatus,
  SubmissionTestcaseStatusColor,
  SubmissionTestcaseStatusIcon,
} from "@/types/enum";
import {
  Box,
  Button,
  Code,
  Container,
  Separator as Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  Skeleton,
  Tabs,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link, createFileRoute } from "@tanstack/react-router";
import React, { useMemo } from "react";
import { FiCode } from "react-icons/fi";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { usePromiseStore } from "@/stores/usePromiseStore";
import { useQuery } from "@tanstack/react-query";
import { getSubmissionByIdQueryOptions } from "@/libs/queries/submission";
import { ProblemDescriptionPanel } from "@/components/features/solving/ProblemDescriptionPanel";
import { EditorProvider } from "@/components/features/solving/contexts/EditorContext";
const PageHeader = () => {
  const bg = { base: "white", _dark: "gray.800" };
  const color = { base: "gray.800", _dark: "white" };
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
              <Heading as="h1" size="md" color={color} letterSpacing="tight">
                Arugo
              </Heading>
            </HStack>
          </Link>
          <HStack gap={4}>
            <Button asChild variant="ghost" colorPalette="teal" size="sm">
              <Link to="/home">Trang chủ</Link>
            </Button>
            <ColorModeButton />
            {session.data?.user ? (
              <UserMenu isPending={false} user={session.data?.user} />
            ) : (
              <HStack gap={2}>
                <Button asChild variant="ghost" colorScheme="teal" size="sm">
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

type TestcaseDetails = ProblemSampleTestCase & {
  stdout?: string;
  status?: SubmissionTestcaseStatus;
};
interface TestcaseItemProps {
  testcase: TestcaseDetails;
}
const colors = {
  gray: {
    bg: { base: "gray.100", _dark: "gray.800" },
    text: { base: "gray.800", _dark: "gray.200" },
  },
  green: {
    bg: { base: "green.50", _dark: "green.900" },
    text: { base: "green.800", _dark: "green.200" },
  },
  red: {
    bg: { base: "red.50", _dark: "red.900" },
    text: { base: "red.800", _dark: "red.200" },
  },
};
const TestcaseItem: React.FC<TestcaseItemProps> = ({ testcase }) => {
  const bgColor = { base: "gray.50", _dark: "gray.700" };
  const borderColor = { base: "gray.200", _dark: "gray.600" };
  const testcaseStatus = testcase.status || SubmissionTestcaseStatus.None;
  const isRunning = testcaseStatus === SubmissionTestcaseStatus.Running;

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
  }, [isRunning, testcaseStatus]);

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
            bg={{ base: "gray.100", _dark: "gray.800" }}
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
            bg={{ base: "gray.100", _dark: "gray.800" }}
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
  const testcases = React.useMemo(
    () => problem.sampleTestCases || [],
    [problem.sampleTestCases],
  );

  const { id } = usePromiseStore();
  const firstPending = id;

  const submissionQuery = useQuery({
    ...getSubmissionByIdQueryOptions(firstPending || ""),
    enabled: !!firstPending,
    refetchInterval: 3000,
  });

  const [cachedSubmission, setCachedSubmission] = React.useState(
    submissionQuery.data,
  );

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
        (tc) => tc.testcaseId === testcase.id,
      );

      return {
        ...testcase,
        status: submissionTestcase?.status || SubmissionTestcaseStatus.None,
        stdout: submissionTestcase?.stdout || "",
      };
    });
  }, [cachedSubmission, testcases]);

  const getTabColor = (testcaseId: string) => {
    const testcase = finalTestcases.find((tc) => tc.id === testcaseId);
    if (!testcase)
      return SubmissionTestcaseStatusColor[SubmissionTestcaseStatus.None];

    const status = testcase.status || SubmissionTestcaseStatus.None;
    return SubmissionTestcaseStatusColor[status];
  };

  const getTabIcon = (testcaseId: string) => {
    const testcase = finalTestcases.find((tc) => tc.id === testcaseId);
    if (!testcase)
      return SubmissionTestcaseStatusIcon[SubmissionTestcaseStatus.None];

    const status = testcase.status || SubmissionTestcaseStatus.None;
    return SubmissionTestcaseStatusIcon[status];
  };
  const boxBg = { base: "gray.100", _dark: "gray.700" };
  if (!testcases.length) return null;

  return (
    <Box w="full" shadow="md" borderRadius="lg" overflow="hidden">
      <Tabs.Root
        lazyMount
        defaultValue={testcases[0]?.id}
        variant="enclosed"
        width="100%"
      >
        <Box bg={boxBg} borderTopRadius="lg">
          <Tabs.List bg="bg.muted" rounded="lg" p={2} width="100%">
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
          <Tabs.Content key={testcase.id} value={testcase.id} p={2}>
            <TestcaseItem testcase={testcase} />
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Box>
  );
};
// Unauthenticated Right Panel - shows login prompt
const UnAuthRightResizablePanel = () => {
  const panelBg = { base: "white", _dark: "gray.800" };
  const textColor = { base: "gray.600", _dark: "gray.300" };
  const headingColor = { base: "gray.800", _dark: "white" };

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
            Bạn cần đăng nhập để có thể viết code, chạy thử và nộp bài giải. Hãy
            tạo tài khoản miễn phí để bắt đầu hành trình coding của bạn!
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
  const panelBg = { base: "white", _dark: "gray.800" };
  const handleBg = { base: "gray.200", _dark: "gray.600" };
  const handleActiveBg = { base: "gray.300", _dark: "gray.500" };

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
        <Panel defaultSize={70} minSize={30} collapsible collapsedSize={31}>
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
              bg={{ base: "gray.400", _dark: "gray.500" }}
              rounded="full"
            />
          </Flex>
        </PanelResizeHandle>
        <Panel defaultSize={30} minSize={20} collapsible collapsedSize={21}>
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
  const panelBg = { base: "gray.100", _dark: "gray.900" }; // Background for the panel group area
  const handleBg = { base: "gray.300", _dark: "gray.600" };
  const handleActiveBg = { base: "gray.400", _dark: "gray.500" };
  const { session, problem } = Route.useLoaderData();

  if (isMobile) {
    return (
      <Flex direction="column" minH="100vh" bg={panelBg}>
        <PageHeader />
        <VStack gap={0} flex="1" overflowY="auto" className="con cac">
          <Box w="100%">
            <ProblemDescriptionPanel problem={problem} />
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
    <EditorProvider>
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
                <ProblemDescriptionPanel problem={problem} />
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
                  bg={{ base: "gray.400", _dark: "gray.500" }}
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
    </EditorProvider>
  );
}

export const Route = createFileRoute("/problems/$slug/_layout")({
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
