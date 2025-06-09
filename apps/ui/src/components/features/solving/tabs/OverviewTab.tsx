import React from "react";
import {
  Box,
  Card,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  Progress,
  Grid,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import { FiCpu, FiDatabase, FiCheckCircle } from "react-icons/fi";
import dayjs from "dayjs";
import { SubmissionTestcaseStatus } from "@/types/enum";
import type { SubmissionDetails } from "@repo/backend/submissions/submissionService";
import { AIScoreCard } from "../components/AIScoreCard";
import { StatusBadge } from "../components/StatusBadge";
import { THEME_COLORS, LIMITS } from "../utils/submissionConstants";
import {
  getTimeUsagePercent,
  getMemoryUsagePercent,
  getTestCaseIcon,
  getAvgScore,
} from "../utils/submissionHelpers";

interface OverviewTabProps {
  submissionData: Exclude<SubmissionDetails, undefined>;
  passedTestCases: number;
  totalTestCases: number;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  submissionData,
  passedTestCases,
  totalTestCases,
}) => {
  const {
    executionTimeMs: timeExecutionInMs,
    memoryUsageKb: memoryUsageInKb,
    status,
    language: { version: languageVersion, name: languageName },
    submittedAt: createdAt,
    submissionTestcases: testcases,
    aiScore,
  } = submissionData;

  const timeUsagePercent = getTimeUsagePercent(timeExecutionInMs);
  const memoryUsagePercent = getMemoryUsagePercent(memoryUsageInKb);
  const subduedTextColor = THEME_COLORS.subduedTextColor;

  const overallScore = aiScore
    ? getAvgScore([
        aiScore.correctness || 0,
        aiScore.efficiency || 0,
        aiScore.readability || 0,
        aiScore.structure || 0,
        aiScore.best_practices || 0,
      ])
    : 0;

  return (
    <VStack gap={6} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
        <Card.Root variant="outline" size="sm">
          <Card.Header pb={2}>
            <Heading size="xs">Thông tin bài nộp</Heading>
          </Card.Header>
          <Card.Body pt={0}>
            <VStack align="stretch" gap={1.5} fontSize="sm">
              <HStack justifyContent="space-between">
                <Text color={subduedTextColor}>Ngôn ngữ:</Text>
                <Text fontWeight="medium">
                  {languageName}
                  {languageVersion && `(${languageVersion})`}
                </Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color={subduedTextColor}>Thời gian nộp:</Text>
                <Text fontWeight="medium">
                  {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
                </Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color={subduedTextColor}>Trạng thái:</Text>
                <StatusBadge status={status as SubmissionTestcaseStatus} />
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>

        <Card.Root variant="outline" size="sm">
          <Card.Header pb={2}>
            <Heading size="xs">Hiệu suất</Heading>
          </Card.Header>
          <Card.Body pt={0}>
            <VStack align="stretch" gap={1.5} fontSize="sm">
              <HStack justifyContent="space-between">
                <HStack>
                  <Icon as={FiCpu} color="blue.500" />
                  <Text color={subduedTextColor}>Thời gian chạy:</Text>
                </HStack>
                <Text fontWeight="medium">{timeExecutionInMs}ms</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <HStack>
                  <Icon as={FiDatabase} color="purple.500" />
                  <Text color={subduedTextColor}>Bộ nhớ sử dụng:</Text>
                </HStack>
                <Text fontWeight="medium">{memoryUsageInKb}KB</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <HStack>
                  <Icon as={FiCheckCircle} color="green.500" />
                  <Text color={subduedTextColor}>Test cases đạt:</Text>
                </HStack>
                <Text fontWeight="medium">
                  {passedTestCases}/{totalTestCases}
                </Text>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>

      {aiScore && (
        <AIScoreCard
          aiScore={aiScore}
          overallScore={overallScore}
          submissionId={submissionData.id}
        />
      )}

      {status === "ACCEPTED" && (
        <Card.Root
          bg={{
            _light: "green.50",
            _dark: "green.800",
          }}
          borderColor={{
            _light: "green.200",
            _dark: "green.600",
          }}
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
          <Card.Body>
            <VStack gap={4}>
              <Box w="full">
                <HStack justifyContent="space-between" mb={1}>
                  <Text fontSize="xs" color={subduedTextColor}>
                    Thời gian chạy
                  </Text>
                  <Text fontSize="xs" fontWeight="medium">
                    {timeExecutionInMs}/
                    <chakra.span color={subduedTextColor}>
                      {LIMITS.TIME_LIMIT_MS} ms
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
                <HStack justifyContent="space-between" mb={1}>
                  <Text fontSize="xs" color={subduedTextColor}>
                    Bộ nhớ sử dụng
                  </Text>
                  <Text fontSize="xs" fontWeight="medium">
                    {memoryUsageInKb} /
                    <chakra.span color={subduedTextColor}>
                      {LIMITS.MEMORY_LIMIT_KB / 1024}MB
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
            const { icon, color, animate } = getTestCaseIcon(
              tc.status as SubmissionTestcaseStatus,
            ) as any;
            return (
              <Tooltip.Root key={tc.testcaseId}>
                <Tooltip.Content>
                  Test Case #{tc.testcaseId}
                  {tc.testcase.label ? ` (${tc.testcase.label})` : ""}:{" "}
                  {tc.status}
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
                    <Text fontSize="2xs" color={subduedTextColor} mt={1}>
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
  );
};
