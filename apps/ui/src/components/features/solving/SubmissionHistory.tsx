import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  Flex,
  Alert,
  Skeleton,
  Separator,
  Tooltip,
  Heading,
} from "@chakra-ui/react";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDatabase,
  FiActivity,
  FiCpu,
  FiTerminal, // Icon for language
  FiEye, // Icon for View Details
  FiAlertCircle,
  FiCode,
} from "react-icons/fi";
import dayjs from "dayjs"; // Cần cài đặt: npm install dayjs
import relativeTime from "dayjs/plugin/relativeTime"; // For '5 minutes ago'
import "dayjs/locale/vi"; // For Vietnamese locale (optional)
import { trpc } from "@/libs/query";
import { useSession } from "@/libs/auth/client";

import { useQuery } from "@tanstack/react-query"; // Added QueryObserverResult for type clarity
import React from "react"; // Ensure React is imported
import { Link } from "@tanstack/react-router";

dayjs.extend(relativeTime);
dayjs.locale("vi"); // Optional: set Vietnamese locale for dayjs

// --- START: Types and Helper Data ---
type SubmissionStatusType =
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "PENDING"
  | "COMPILING" // Added a compiling state
  | "COMPILE_ERROR"
  | "RUNTIME_ERROR"
  | "JUDGING"; // Another intermediate state

// This type is based on the user's commented out structure
interface SubmissionItemData {
  id: string;
  // code: string; // Usually not shown in history list, but available
  status: SubmissionStatusType; // Assuming status string matches our type
  // problemId: string; // Parent component has this
  languageId: number;
  executionTimeMs: number | null; // Can be null if not run or error
  memoryUsageKb: number | null; // Can be null
  submittedAt: Date | string | null; // Allow string for ISO dates
}

interface SubmissionHistoryProps {
  problemId: string;
  onSubmissionClick?: (submissionId: string) => void;
}

const languageMap: {
  [key: number]: { name: string; icon?: React.ElementType };
} = {
  1: { name: "C++", icon: FiCode },
  2: { name: "Java", icon: FiCode },
  3: { name: "Python 3", icon: FiTerminal },
  4: { name: "JavaScript", icon: FiTerminal },
  // Add more as needed
  50: { name: "Python", icon: FiTerminal }, // Example from some platforms
  54: { name: "C++17", icon: FiCode },
  62: { name: "Java 8", icon: FiCode },
  71: { name: "Python 3.8", icon: FiTerminal },
};

const getStatusPresentation = (status: SubmissionStatusType) => {
  switch (status) {
    case "ACCEPTED":
      return {
        label: "Chấp nhận",
        colorScheme: "green",
        icon: FiCheckCircle,
      };
    case "WRONG_ANSWER":
      return {
        label: "Sai kết quả",
        colorScheme: "red",
        icon: FiXCircle,
      };
    case "TIME_LIMIT_EXCEEDED":
      return {
        label: "Quá thời gian",
        colorScheme: "orange",
        icon: FiClock,
      };
    case "MEMORY_LIMIT_EXCEEDED":
      return {
        label: "Quá bộ nhớ",
        colorScheme: "purple",
        icon: FiDatabase,
      };
    case "PENDING":
      return {
        label: "Đang chờ",
        colorScheme: "blue",
        icon: FiActivity,
        animate: true,
      };
    case "COMPILING":
      return {
        label: "Đang biên dịch",
        colorScheme: "cyan",
        icon: FiActivity,
        animate: true,
      };
    case "COMPILE_ERROR":
      return {
        label: "Lỗi biên dịch",
        colorScheme: "red",
        icon: FiXCircle,
      };
    case "RUNTIME_ERROR":
      return {
        label: "Lỗi thực thi",
        colorScheme: "pink",
        icon: FiAlertCircle,
      };
    case "JUDGING":
      return {
        label: "Đang chấm...",
        colorScheme: "yellow",
        icon: FiActivity,
        animate: true,
      };
    default:
      return { label: status, colorScheme: "gray", icon: FiClock };
  }
};
// --- END: Types and Helper Data ---

// --- START: Submission Item Row ---
interface SubmissionRowProps {
  submission: SubmissionItemData;
  onViewDetails: (submissionId: string) => void;
}

const SubmissionRow: React.FC<SubmissionRowProps> = ({
  submission,
  onViewDetails,
}) => {
  const cardBg = { base: "white", _dark: "gray.750" };
  const hoverBg = { base: "gray.50", _dark: "gray.700" };
  const textColor = { base: "gray.700", _dark: "gray.100" };
  const subduedTextColor = { base: "gray.500", _dark: "gray.300" };
  const statusPresentation = getStatusPresentation(submission.status);
  const langInfo = languageMap[submission.languageId] || {
    name: `ID ${submission.languageId}`,
    icon: FiCode,
  };

  return (
    <Flex
      bg={cardBg}
      p={4}
      borderRadius="md"
      boxShadow="sm"
      alignItems="center"
      justifyContent="space-between"
      _hover={{ bg: hoverBg, cursor: "pointer" }}
      onClick={() => onViewDetails(submission.id)}
      transition="background-color 0.2s, box-shadow 0.2s"
    >
      <HStack gap={4} flex={1} alignItems="center">
        <Tooltip.Root>
          <Tooltip.Trigger>{statusPresentation.label}</Tooltip.Trigger>
          <Tooltip.Trigger>
            <Icon
              as={statusPresentation.icon}
              color={
                statusPresentation.animate
                  ? `${statusPresentation.colorScheme}.500`
                  : statusPresentation.colorScheme
              } // Direct color for non-animated
              boxSize={5}
              animation={
                statusPresentation.animate ? `pulse 1.5s infinite` : undefined
              }
            />
          </Tooltip.Trigger>
        </Tooltip.Root>
        <VStack align="flex-start" gap={0} flex={1} minW="120px">
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={textColor}
            lineClamp={1}
          >
            {statusPresentation.label}
          </Text>
          <Text fontSize="xs" color={subduedTextColor}>
            {submission.submittedAt
              ? dayjs(submission.submittedAt).fromNow()
              : "Chưa có"}
          </Text>
        </VStack>
      </HStack>

      <HStack
        gap={4}
        flex={2}
        justifyContent="space-around"
        display={{ base: "none", md: "flex" }}
      >
        <VStack gap={0} alignItems="center" minW="80px">
          <Icon
            as={langInfo.icon || FiCode}
            boxSize={4}
            color={subduedTextColor}
            mb={0.5}
          />
          <Text fontSize="xs" color={textColor} textAlign="center">
            {langInfo.name}
          </Text>
        </VStack>
        <VStack gap={0} alignItems="center" minW="80px">
          <Icon as={FiCpu} boxSize={4} color={subduedTextColor} mb={0.5} />
          <Text fontSize="xs" color={textColor}>
            {submission.executionTimeMs !== null
              ? `${submission.executionTimeMs} ms`
              : "N/A"}
          </Text>
        </VStack>
        <VStack gap={0} alignItems="center" minW="80px">
          <Icon as={FiDatabase} boxSize={4} color={subduedTextColor} mb={0.5} />
          <Text fontSize="xs" color={textColor}>
            {submission.memoryUsageKb !== null
              ? `${submission.memoryUsageKb} KB`
              : "N/A"}
          </Text>
        </VStack>
      </HStack>

      <Button
        variant="ghost"
        colorScheme="teal"
        size="sm"
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click if button is clicked
          onViewDetails(submission.id);
        }}
        ml={2}
      >
        <FiEye />
        Chi tiết
      </Button>
    </Flex>
  );
};
// --- END: Submission Item Row ---

// --- START: Main Component ---
export default function SubmissionHistory({
  problemId,
  onSubmissionClick,
}: SubmissionHistoryProps) {
  const { data: sessionData, isPending: isSessionPending } = useSession(); // Renamed to avoid conflict

  // Typed the useQuery result
  const {
    data: submissionsData,
    isPending: areSubmissionsPending,
    isError: submissionsError,
    error: submissionFetchError,
  } = useQuery(trpc.submission.getMySubmissionsOfProblem.queryOptions({ problemId })); // Pass enabled flag
  const containerBg = { base: "gray.50", _dark: "gray.800" };
  const titleColor = { base: "gray.700", _dark: "white" };
  if (isSessionPending || areSubmissionsPending) {
    return (
      <VStack
        gap={4}
        p={5}
        bg={containerBg}
        borderRadius="lg"
        boxShadow="base"
        align="stretch"
      >
        <Heading as="h3" size="md" color={titleColor} mb={2}>
          Lịch sử bài nộp
        </Heading>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} height="60px" borderRadius="md" />
        ))}
      </VStack>
    );
  }

  if (!sessionData?.session) {
    return (
      <Box p={5} bg={containerBg} borderRadius="lg" boxShadow="base">
        <Alert.Root // Alert -> Alert.Root
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          borderRadius="md"
        >
          <Alert.Title mt={3} mb={1} fontSize="md">
            Vui lòng đăng nhập
          </Alert.Title>
          <Alert.Description maxWidth="sm" fontSize="sm">
            Bạn cần đăng nhập để xem lịch sử các bài nộp của mình.
          </Alert.Description>
          <Button
            colorPalette="teal" // colorScheme -> colorPalette
            variant="solid"
            size="sm"
            mt={4}
            asChild // Sử dụng asChild để kết hợp với Link từ react-router-dom
          >
            <Link to="/login">Đăng nhập ngay</Link>
          </Button>
        </Alert.Root>
      </Box>
    );
  }

  if (submissionsError) {
    return (
      <Box borderRadius="lg" boxShadow="base">
        <Alert.Root // Alert -> Alert.Root
          status="error"
          variant="subtle"
          borderRadius="md"
        >
          <Alert.Title mr={2} fontSize="sm">
            {/* AlertTitle -> Alert.Title */}
            Lỗi tải lịch sử!
          </Alert.Title>
          <Alert.Description fontSize="xs">
            {/* AlertDescription -> Alert.Description */}
            {submissionFetchError?.message || "Không thể tải dữ liệu bài nộp."}
          </Alert.Description>
        </Alert.Root>
      </Box>
    );
  }

  if (!submissionsData || submissionsData.length === 0) {
    return (
      <Box borderRadius="lg" boxShadow="base">
        <Text
          textAlign="center"
          color={{ base: "gray.600", _dark: "gray.400" }}
          fontSize="sm"
        >
          Bạn chưa có bài nộp nào cho thử thách này.
        </Text>
      </Box>
    );
  }

  return (
    <VStack gap={5} borderRadius="lg" boxShadow="base" align="stretch">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" size="md" color={titleColor}>
          Lịch sử bài nộp của bạn
        </Heading>
        <Text fontSize="sm" color={{ base: "gray.500", _dark: "gray.400" }}>
          Tổng số: {submissionsData.length}
        </Text>
      </Flex>
      <Separator />
      <VStack gap={3} align="stretch" overflowY="auto" pr={2}>
        {submissionsData.map((submission) => (
          <SubmissionRow
            key={submission.id}
            submission={submission as SubmissionItemData}
            onViewDetails={
              onSubmissionClick || ((id) => console.log("View submission:", id))
            }
          />
        ))}
      </VStack>
    </VStack>
  );
}
