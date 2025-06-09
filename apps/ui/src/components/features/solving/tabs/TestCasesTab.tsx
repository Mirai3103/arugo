import React from "react";
import {
  Badge,
  Card,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  SubmissionTestcaseStatus,
  SubmissionTestcaseStatusLabel,
} from "@/types/enum";
import type { SubmissionDetails } from "@repo/backend/submissions/submissionService";
import {
  getTestCaseIcon,
  getTestCaseBackgroundColor,
} from "../utils/submissionHelpers";
import { THEME_COLORS } from "../utils/submissionConstants";

interface TestCasesTabProps {
  testcases: Exclude<SubmissionDetails, undefined>["submissionTestcases"];
  passedTestCases: number;
  totalTestCases: number;
}

export const TestCasesTab: React.FC<TestCasesTabProps> = ({
  testcases,
  passedTestCases,
  totalTestCases,
}) => {
  const subduedTextColor = THEME_COLORS.subduedTextColor;

  return (
    <>
      <HStack justifyContent="space-between" mb={4}>
        <Heading size="sm">Chi tiết Test Cases</Heading>
        <Text fontSize="sm" fontWeight="medium" color="teal.500">
          Đã đạt: {passedTestCases}/{totalTestCases}
        </Text>
      </HStack>
      <VStack gap={3} align="stretch">
        {testcases.map((tc) => {
          const { icon, color } = getTestCaseIcon(
            tc.status as SubmissionTestcaseStatus,
          );
          const itemBgConditional = getTestCaseBackgroundColor(
            tc.status as SubmissionTestcaseStatus,
          );

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
                    <Text fontWeight="medium" fontSize="sm">
                      Test Case #{tc.testcaseId}
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
                    {!tc.testcase.isSample &&
                      tc.testcase.label === undefined && (
                        <Badge
                          colorPalette="gray"
                          variant="subtle"
                          fontSize="0.6rem"
                        >
                          Hidden
                        </Badge>
                      )}
                  </HStack>
                  <HStack color={color} fontWeight="medium" fontSize="sm">
                    <Icon as={icon} />
                    <Text>
                      {
                        SubmissionTestcaseStatusLabel[
                          tc.status as SubmissionTestcaseStatus
                        ]
                      }
                    </Text>
                  </HStack>
                </Flex>
                {(tc.runtimeMs || tc.memoryUsedKb) && (
                  <HStack
                    mt={1.5}
                    gap={4}
                    fontSize="xs"
                    color={subduedTextColor}
                  >
                    {tc.runtimeMs && <Text>Thời gian: {tc.runtimeMs}ms</Text>}
                    {tc.memoryUsedKb && (
                      <Text>Bộ nhớ: {tc.memoryUsedKb}KB</Text>
                    )}
                  </HStack>
                )}
              </Card.Body>
            </Card.Root>
          );
        })}
      </VStack>
    </>
  );
};
