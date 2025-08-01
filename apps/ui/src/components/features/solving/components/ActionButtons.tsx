import React from "react";
import { Button, HStack, Icon } from "@chakra-ui/react";
import { FiChevronLeft, FiPlay, FiUploadCloud } from "react-icons/fi";

interface ActionButtonsProps {
  problemId: string;
  status: string;
  onBackToProblem?: () => void;
  onResubmit?: () => void;
  onContinueChallenge?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  problemId,
  status,
  onBackToProblem,
  onResubmit,
  onContinueChallenge,
}) => {
  return (
    <HStack justifyContent="flex-end" gap={3} mt={2}>
      <Button
        variant="outline"
        size="sm"
        leftIcon={<FiChevronLeft />}
        onClick={onBackToProblem}
      >
        Quay lại bài tập
      </Button>
      <Button
        variant="outline"
        colorScheme="blue"
        size="sm"
        onClick={onResubmit}
      >
        <FiUploadCloud /> Nộp lại
      </Button>
      {status === "ACCEPTED" && (
        <Button colorScheme="teal" size="sm" onClick={onContinueChallenge}>
          <FiPlay /> Tiếp tục thử thách
        </Button>
      )}
    </HStack>
  );
};
