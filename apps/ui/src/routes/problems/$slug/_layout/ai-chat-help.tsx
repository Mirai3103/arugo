import { createFileRoute } from "@tanstack/react-router"
import {
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  Input,
  IconButton,
  Icon,
  Spacer,
  Textarea,
} from "@chakra-ui/react";
import {
  LuSun,
  LuCoffee,
  LuCode,
  LuBookOpen,
  LuPaperclip,
  LuMic,
  LuSend,
} from "react-icons/lu";
import React from "react";
import { useSession } from "@/libs/auth/client";

// Định nghĩa kiểu dữ liệu cho một thẻ gợi ý
interface SuggestionCardProps {
  text: string;
  icon: React.ElementType;
}

// Component cho mỗi thẻ gợi ý
const SuggestionCard: React.FC<SuggestionCardProps> = ({ text, icon }) => {
  return (
    // Sử dụng Card.Root từ snippets của Chakra UI v3
    <Card.Root
      bg={{ _light: "teal.100", _dark: "rgba(45, 212, 191, 0.1)" }}
      p={4}
      borderRadius="lg"
      position="relative"
      minH="120px"
      transition="background-color 0.2s"
      cursor="pointer"
      _hover={{
        bg: { _light: "teal.200", _dark: "rgba(45, 212, 191, 0.2)" },
      }}
    >
      <Text fontWeight="medium">{text}</Text>
      <Icon
        as={icon}
        position="absolute"
        bottom={3}
        right={3}
        boxSize={5}
        color={{ _light: "gray.600", _dark: "gray.400" }}
      />
    </Card.Root>
  )
};

// Component chính của giao diện Chat
const ChatUI = () => {
  // Dữ liệu cho các thẻ gợi ý
  const suggestions: SuggestionCardProps[] = [
    { text: "What's the weather like today?", icon: LuSun },
    { text: "Share the closest coffee shop around me", icon: LuCoffee },
    { text: "What does React.js do?", icon: LuCode },
    { text: "Recommend some books I can read", icon: LuBookOpen },
  ];
  const { data: session } = useSession();

  return (
    <Flex
      direction="column"
      minH="60vh"
      bg={{ _dark: "gray.900" }}
      color={{ _dark: "white" }}
      align="center"
    >
      <Spacer />

      <VStack gap={8} w="100%">
        <VStack>
          <Heading
            as="h1"
            size="2xl"
            color={{ _light: "teal.600", _dark: "teal.300" }}
          >
            Chào {session?.user.name}
          </Heading>
          <Text fontSize="xl" color="gray.500">
            Mình có thể giúp gì cho bạn?
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4} w="100%">
          {suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={index}
              text={suggestion.text}
              icon={suggestion.icon}
            />
          ))}
        </SimpleGrid>
      </VStack>

      {/* Spacer đẩy input xuống dưới cùng */}
      <Spacer />

      {/* Phần Input và footer */}
      <VStack gap={2} w="100%" pb={4}>
        <HStack
          w="100%"
          bg={{ _light: "white", _dark: "gray.800" }}
          borderRadius="xl"
          p={1.5}
          boxShadow="md"
        >
          <Textarea
            placeholder="Ask me anything..."
            variant="outline"
            px={3}
            rows={1}
            resize="none"
            _placeholder={{ color: "gray.500" }}
          />
          <IconButton
            aria-label="Send message"
            colorPalette="teal" // v3 sử dụng colorPalette
            rounded="full"
          >
            <LuSend />
          </IconButton>
        </HStack>
      </VStack>
    </Flex>
  );
};

export const Route = createFileRoute("/problems/$slug/_layout/ai-chat-help")({
  component: ChatUI,
});
