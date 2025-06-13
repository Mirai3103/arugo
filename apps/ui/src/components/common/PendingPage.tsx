import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Spinner,
  Progress,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FiLoader } from "react-icons/fi";

interface PendingPageProps {
  message?: string;
  showProgress?: boolean;
  progressValue?: number;
}

export default function PendingPage({
  message = "Đang tải...",
  showProgress = false,
  progressValue,
}: PendingPageProps) {
  return (
    <Container maxW="container.lg" py={20}>
      <VStack
        gap={8}
        align="center"
        textAlign="center"
        bg={{ base: "white", _dark: "gray.900" }}
        p={{ base: 8, md: 12 }}
        rounded="xl"
        boxShadow="lg"
        borderWidth="1px"
        borderColor={{ base: "gray.200", _dark: "gray.700" }}
        minH="400px"
        justify="center"
      >
        {/* Loading Animation */}
        <Box position="relative">
          {/* Outer Ring */}
          <Box
            w={24}
            h={24}
            rounded="full"
            border="4px solid"
            borderColor={{ base: "teal.100", _dark: "teal.800" }}
            position="absolute"
            top={0}
            left={0}
          />

          {/* Spinner */}
          <Spinner
            borderWidth="4px" // thickness -> borderWidth
            animationDuration="0.8s" // speed -> animationDuration
            color="teal.500"
            size="xl"
            w={24}
            h={24}
          />

          {/* Center Icon */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            <Icon
              as={FiLoader}
              boxSize={6}
              color="teal.500"
              animation="spin 2s linear infinite"
              style={{
                animationDirection: "reverse",
              }}
            />
          </Box>
        </Box>

        {/* Content */}
        <VStack gap={4} align="center">
          <Heading
            size={{ base: "lg", md: "xl" }}
            color={{ base: "gray.700", _dark: "gray.200" }}
            fontWeight="medium"
          >
            {message}
          </Heading>

          <Text
            fontSize={{ base: "md", md: "lg" }}
            color={{ base: "gray.600", _dark: "gray.400" }}
            maxW="md"
            lineHeight="tall"
          >
            Vui lòng đợi trong giây lát. Chúng tôi đang xử lý yêu cầu của bạn.
          </Text>
        </VStack>

        {/* Progress Bar */}
        {showProgress && (
          <VStack gap={3} w="full" maxW="md">
            <Progress.Root
              value={progressValue}
              w="full"
              colorPalette="teal"
              size="lg"
              rounded="full"
            >
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>

            {progressValue !== undefined && (
              <Text
                fontSize="sm"
                color={{ base: "gray.500", _dark: "gray.400" }}
              >
                {Math.round(progressValue)}% hoàn thành
              </Text>
            )}
          </VStack>
        )}

        {/* Loading Dots Animation */}
        <HStack gap={2}>
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              w={2}
              h={2}
              bg="teal.500"
              rounded="full"
              animation={`pulse 1.4s ease-in-out ${index * 0.16}s infinite both`}
              css={{
                animationKeyframes: `
                  @keyframes pulse {
                    0%, 80%, 100% {
                      transform: scale(0);
                      opacity: 0.5;
                    }
                    40% {
                      transform: scale(1);
                      opacity: 1;
                    }
                  }
                `,
              }}
            />
          ))}
        </HStack>

        {/* Subtle Help Text */}
        <Text
          fontSize="xs"
          color={{ base: "gray.400", _dark: "gray.600" }}
          textAlign="center"
          mt={4}
        >
          Nếu trang này tải quá lâu, hãy thử làm mới trang
        </Text>
      </VStack>

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          @keyframes pulse {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </Container>
  );
}
