import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { FiHome, FiArrowLeft, FiAlertTriangle } from "react-icons/fi";

export default function NotFoundPage() {
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
      >
        
        <Box
          p={6}
          rounded="full"
          bg={{ base: "orange.50", _dark: "orange.900" }}
          border="2px solid"
          borderColor={{ base: "orange.200", _dark: "orange.700" }}
        >
          <Icon
            as={FiAlertTriangle}
            boxSize={16}
            color={{ base: "orange.500", _dark: "orange.400" }}
          />
        </Box>

        
        <VStack gap={4} align="center">
          <Heading
            size={{ base: "2xl", md: "3xl" }}
            color={{ base: "gray.800", _dark: "white" }}
            fontWeight="bold"
          >
            404
          </Heading>
          <Heading
            size={{ base: "lg", md: "xl" }}
            color={{ base: "gray.700", _dark: "gray.200" }}
            fontWeight="medium"
          >
            Trang không tồn tại
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color={{ base: "gray.600", _dark: "gray.400" }}
            maxW="md"
            lineHeight="tall"
          >
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
            Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
          </Text>
        </VStack>

        
        <HStack gap={4} wrap="wrap" justify="center">
          <Link to="/home">
            <Button
              colorScheme="teal"
              size={{ base: "md", md: "lg" }}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              transition="all 0.2s"
            >
              Về trang chủ
              <FiHome />
            </Button>
          </Link>

          <Button
            variant="outline"
            colorScheme="gray"
            size={{ base: "md", md: "lg" }}
            onClick={() => window.history.back()}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "md",
            }}
            transition="all 0.2s"
          >
            Quay lại
            <FiArrowLeft />
          </Button>
        </HStack>

        
        <Text
          fontSize="sm"
          color={{ base: "gray.500", _dark: "gray.500" }}
          textAlign="center"
        >
          Nếu bạn cho rằng đây là lỗi, vui lòng{" "}
          <Text
            as="span"
            color="teal.500"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
          >
            liên hệ với chúng tôi
          </Text>
        </Text>
      </VStack>
    </Container>
  );
}
