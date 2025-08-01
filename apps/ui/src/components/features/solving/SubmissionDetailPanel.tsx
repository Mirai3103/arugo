import React from "react";
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Tabs,
  Badge,
  ProgressCircle,
  AbsoluteCenter,
} from "@chakra-ui/react";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDatabase,
  FiActivity,
  FiBarChart2,
  FiList,
  FiCode,
  FiRefreshCw,
  FiAlertTriangle,
} from "react-icons/fi";
import { useNavigate } from "@tanstack/react-router";
import { useEditorContext } from "./contexts/EditorContext";
import { SubmissionTestcaseStatus } from "@/types/enum";
import type { SubmissionDetails } from "@repo/backend/submissions/submissionService";
import { SubmissionStatus } from "@repo/backend/submissions/validations/enum";
import { SubmissionHeader } from "./components/SubmissionHeader";
import { ProgressTracker } from "./components/ProgressTracker";
import { ActionButtons } from "./components/ActionButtons";
import { OverviewTab } from "./tabs/OverviewTab";
import { TestCasesTab } from "./tabs/TestCasesTab";
import { SourceCodeTab } from "./tabs/SourceCodeTab";
import { THEME_COLORS } from "./utils/submissionConstants";
import { calculateProgress, getAvgScore } from "./utils/submissionHelpers";

export interface SubmissionDetailsPageProps {
  submissionData: Exclude<SubmissionDetails, undefined>;
}
export const SubmissionDetailPanel: React.FC<SubmissionDetailsPageProps> = ({
  submissionData,
}) => {
  const navigate = useNavigate();
  const {
    id: submissionId,
    problemId,
    executionTimeMs: timeExecutionInMs,
    memoryUsageKb: memoryUsageInKb,
    status,
    language: { version: languageVersion, name: languageName },
    submittedAt: createdAt,
    submissionTestcases: testcases,
    code,
    aiScore,
  } = submissionData!;
  const totalTestCases = testcases.length;
  const passedTestCases = testcases.filter(
    (tc) => tc.status === SubmissionTestcaseStatus.Success,
  ).length;

  const progressPercent = calculateProgress(
    status as SubmissionTestcaseStatus,
    passedTestCases,
    totalTestCases,
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

  const handleBackToProblem = () => {
    navigate({ to: `/problems/${problemId}` });
  };

  const handleResubmit = () => {
    
    console.log("Resubmit logic");
  };

  const handleContinueChallenge = () => {
    
    console.log("Continue challenge logic");
  };

  return (
    <VStack gap={6} align="stretch">
      <SubmissionHeader
        submissionId={submissionId}
        status={status as SubmissionTestcaseStatus}
      />

      {status === "PENDING" && (
        <ProgressTracker progressPercent={progressPercent} />
      )}

      <Box
        bg={THEME_COLORS.cardBg}
        borderRadius="lg"
        boxShadow="sm"
        overflow="hidden"
      >
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
            <OverviewTab
              submissionData={submissionData}
              passedTestCases={passedTestCases}
              totalTestCases={totalTestCases}
            />
          </Tabs.Content>

          <Tabs.Content value="testcases" p={{ base: 4, md: 6 }}>
            <TestCasesTab
              testcases={testcases}
              passedTestCases={passedTestCases}
              totalTestCases={totalTestCases}
            />
          </Tabs.Content>

          <Tabs.Content value="sourcecode" p={{ base: 4, md: 6 }}>
            <SourceCodeTab
              code={code}
              languageName={languageName}
              languageVersion={languageVersion!}
            />
          </Tabs.Content>
        </Tabs.Root>
      </Box>

      <ActionButtons
        problemId={problemId}
        status={status}
        onBackToProblem={handleBackToProblem}
        onResubmit={handleResubmit}
        onContinueChallenge={handleContinueChallenge}
      />
    </VStack>
  );
};
