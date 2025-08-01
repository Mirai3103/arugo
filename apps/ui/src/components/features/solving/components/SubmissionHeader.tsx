import React from "react";
import { Box, Flex, Heading, VStack } from "@chakra-ui/react";
import { SubmissionTestcaseStatus } from "@/types/enum";
import { StatusBadge } from "./StatusBadge";
import { THEME_COLORS } from "../utils/submissionConstants";

interface SubmissionHeaderProps {
  submissionId: string;
  status: SubmissionTestcaseStatus;
}

export const SubmissionHeader: React.FC<SubmissionHeaderProps> = ({
  submissionId,
  status,
}) => {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ base: "flex-start", md: "center" }}
      bg={THEME_COLORS.cardBg}
      p={6}
      borderRadius="lg"
      boxShadow="md"
    >
      <VStack align="flex-start" gap={1}>
        <Heading as="h1" size="lg">
          Bài nộp #{submissionId}
        </Heading>
      </VStack>
      <Box mt={{ base: 3, md: 0 }}>
        <StatusBadge status={status} />
      </Box>
    </Flex>
  );
};
