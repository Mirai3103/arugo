import React from "react";
import {
  Box,
  VStack,
  Text,
  Icon,
  ProgressCircle,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { getScoreColor } from "../utils/submissionHelpers";

interface ScoreCircleProps {
  score: number;
  label: string;
  icon: IconType;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score,
  label,
  icon,
}) => {
  const colorScheme = getScoreColor(score);

  return (
    <VStack gap={2}>
      <Box position="relative">
        <ProgressCircle.Root value={score} size="lg" colorPalette={colorScheme}>
          <ProgressCircle.Circle>
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Circle>
          <AbsoluteCenter>
            <ProgressCircle.ValueText
              fontSize="sm"
              fontWeight="bold"
              color={`${colorScheme}.500`}
            >
              {score.toFixed(1)}
            </ProgressCircle.ValueText>
          </AbsoluteCenter>
        </ProgressCircle.Root>
      </Box>
      <Text fontSize="xs" textAlign="center" fontWeight="medium">
        {label} <Icon as={icon} boxSize={3} ml={1} />
      </Text>
    </VStack>
  );
};
