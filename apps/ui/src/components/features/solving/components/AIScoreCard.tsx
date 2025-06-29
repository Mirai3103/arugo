import React from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Heading,
  HStack,
  Icon,
  Dialog,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiActivity,
  FiAward,
  FiEye,
  FiLayers,
  FiStar,
  FiTarget,
} from "react-icons/fi";
import { FaBrain } from "react-icons/fa";
import { ScoreCircle } from "./ScoreCircle";
import { getScoreColor } from "../utils/submissionHelpers";
import { useQuery } from "@tanstack/react-query";
import { Prose } from "@/components/ui/prose";
import { generateHTMLFromMarkdown } from "@repo/tiptap";
import { trpc } from "@/libs/query";


interface AIScore {
  correctness: number;
  efficiency: number;
  readability: number;
  structure: number;
  best_practices: number;
  summary?: string;
}

interface AIScoreCardProps {
  aiScore: AIScore;
  overallScore: number;
  submissionId: string;
}

export const AIScoreCard: React.FC<AIScoreCardProps> = ({
  aiScore,
  overallScore,
  submissionId,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const { data: aiReview, isLoading } = useQuery(
    trpc.genAi.getAiReview.queryOptions({ submissionId },{enabled: isModalOpen,
      select: (data) => generateHTMLFromMarkdown(data),
      staleTime: Infinity,
      gcTime: Infinity,}),
    
  );
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card.Root
        variant="outline"
        bg={{
          _light: "purple.50",
          _dark: "purple.900",
        }}
        borderColor={{
          _light: "purple.200",
          _dark: "purple.700",
        }}
      >
        <Card.Header>
          <HStack justifyContent="space-between" align="center">
            <HStack>
              <Icon as={FaBrain} color="purple.500" />
              <Heading size="md" color="purple.700">
                Đánh giá AI
              </Heading>
            </HStack>
            <HStack gap={3}>
              <Badge
                colorPalette={getScoreColor(overallScore)}
                variant="solid"
                px={3}
                py={1}
                borderRadius="full"
              >
                <HStack>
                  <Icon as={FiStar} boxSize={3} />
                  <Text fontWeight="bold">{overallScore.toFixed(1)}/100</Text>
                </HStack>
              </Badge>
              <Button size="xs" onClick={handleOpenModal}>
                Nhận đánh giá chi tiết
              </Button>
            </HStack>
          </HStack>
        </Card.Header>
        <Card.Body>
          <VStack gap={4}>
            <SimpleGrid columns={{ base: 3, md: 5 }} gap={4}>
              <ScoreCircle
                score={aiScore.correctness}
                label="Tính đúng"
                icon={FiTarget}
              />
              <ScoreCircle
                score={aiScore.efficiency}
                label="Hiệu quả"
                icon={FiActivity}
              />
              <ScoreCircle
                score={aiScore.readability}
                label="Dễ đọc"
                icon={FiEye}
              />
              <ScoreCircle
                score={aiScore.structure}
                label="Cấu trúc"
                icon={FiLayers}
              />
              <ScoreCircle
                score={aiScore.best_practices}
                label="Best Practice"
                icon={FiAward}
              />
            </SimpleGrid>

            {aiScore.summary && (
              <Box
                bg={{
                  _light: "white",
                  _dark: "purple.800",
                }}
                p={4}
                borderRadius="md"
                border="1px solid"
                borderColor={{
                  _light: "purple.200",
                  _dark: "purple.600",
                }}
                w="full"
              >
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color="purple.600"
                >
                  Nhận xét:
                </Text>
                <Text fontSize="sm" lineHeight="1.6">
                  {aiScore.summary}
                </Text>
              </Box>
            )}
          </VStack>
        </Card.Body>
      </Card.Root>
      <Dialog.Root
        open={isModalOpen}
        size={"xl"}
        onOpenChange={(details) => setIsModalOpen(details.open)} // onOpenChange nhận object details
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          {" "}
          {/* Thêm Dialog.Positioner để bao bọc Content */}
          <Dialog.Content>
            {" "}
            {/* size="xl" được chuyển vào Content */}
            <Dialog.Header>
              <Dialog.Title fontSize={"2xl"}>
                Đánh giá chi tiết từ AI
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body maxH="70vh" overflowY="auto">
              {isLoading && (
                <VStack gap={4} align="stretch">
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" width="80%" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" width="90%" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" width="75%" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" width="85%" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" width="70%" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" width="95%" />
                </VStack>
              )}
              {!isLoading && aiReview && (
                <Prose
                  size={"lg"}
                  maxW={"full"}
                  dangerouslySetInnerHTML={{ __html: aiReview }}
                />
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Đóng</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};
