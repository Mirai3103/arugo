import React from "react";
import { Box, HStack, Text, Progress } from "@chakra-ui/react";
import { THEME_COLORS } from "../utils/submissionConstants";

interface ProgressTrackerProps {
  progressPercent: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progressPercent,
}) => {
  return (
    <Box bg={THEME_COLORS.cardBg} p={4} borderRadius="lg" boxShadow="sm">
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
  );
};
