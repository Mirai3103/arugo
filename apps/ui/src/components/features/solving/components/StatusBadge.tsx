import React from "react";
import { Badge, HStack, Icon, Text } from "@chakra-ui/react";
import { SubmissionTestcaseStatus } from "@/types/enum";
import { getStatusConfig } from "../utils/submissionHelpers";

interface StatusBadgeProps {
  status: SubmissionTestcaseStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config: any = getStatusConfig(status);

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
        <Icon
          as={config.icon}
          animation={config.animate ? "pulse 1.5s infinite" : undefined}
        />
        <Text>{config.label}</Text>
      </HStack>
    </Badge>
  );
};
