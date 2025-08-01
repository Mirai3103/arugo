import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  HStack,
  Code,
  Collapsible,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  FiHome,
  FiRefreshCw,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

interface ErrorPageProps {
  error?: Error;
  resetError?: () => void;
}

export default function ErrorPage({ error, resetError }: ErrorPageProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

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
          bg={{ base: "red.50", _dark: "red.900" }}
          border="2px solid"
          borderColor={{ base: "red.200", _dark: "red.700" }}
        >
          <Icon
            as={FiAlertCircle}
            boxSize={16}
            color={{ base: "red.500", _dark: "red.400" }}
          />
        </Box>

        
        <VStack gap={4} align="center">
          <Heading
            size={{ base: "xl", md: "2xl" }}
            color={{ base: "gray.800", _dark: "white" }}
            fontWeight="bold"
          >
            Oops! Có lỗi xảy ra
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color={{ base: "gray.600", _dark: "gray.400" }}
            maxW="lg"
            lineHeight="tall"
          >
            Xin lỗi, đã có lỗi không mong muốn xảy ra. Chúng tôi đã ghi nhận sự
            cố và sẽ khắc phục sớm nhất có thể.
          </Text>
        </VStack>

        
        <HStack gap={4} wrap="wrap" justify="center">
          <Button
            colorScheme="teal"
            size={{ base: "md", md: "lg" }}
            onClick={handleRefresh}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            transition="all 0.2s"
          >
            <FiRefreshCw /> Thử lại
          </Button>

          <Link to="/home">
            <Button
              variant="outline"
              colorScheme="teal"
              size={{ base: "md", md: "lg" }}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "md",
              }}
              transition="all 0.2s"
            >
              <FiHome /> Về trang chủ
            </Button>
          </Link>
        </HStack>

        
        {error && (
          <VStack gap={4} w="full" maxW="2xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              color={{ base: "gray.600", _dark: "gray.400" }}
            >
              Chi tiết lỗi {showDetails ? <FiChevronUp /> : <FiChevronDown />}
            </Button>

            <Collapsible.Root open={showDetails}>
              {" "}
              
              <Collapsible.Content>
                {" "}
                
                <Box
                  w="full"
                  p={4}
                  bg={{ _light: "gray.50", _dark: "gray.800" }} 
                  rounded="md"
                  borderWidth="1px"
                  borderColor={{ _light: "gray.200", _dark: "gray.700" }} 
                >
                  <VStack align="stretch" gap={3}>
                    <Text fontSize="sm" fontWeight="medium" color="red.500">
                      Thông tin lỗi:
                    </Text>
                    <Code
                      p={3}
                      rounded="md"
                      fontSize="xs"
                      colorPalette="red" 
                      variant="subtle"
                      overflowX="auto"
                      whiteSpace="pre-wrap"
                    >
                      {error.message}
                    </Code>
                    {error.stack && (
                      <>
                        <Text fontSize="sm" fontWeight="medium" color="red.500">
                          Stack trace:
                        </Text>
                        <Code
                          p={3}
                          rounded="md"
                          fontSize="xs"
                          colorPalette="red" 
                          variant="subtle"
                          overflowX="auto"
                          whiteSpace="pre-wrap"
                          maxH="200px"
                          overflowY="auto"
                        >
                          {error.stack}
                        </Code>
                      </>
                    )}
                  </VStack>
                </Box>
              </Collapsible.Content>
            </Collapsible.Root>
          </VStack>
        )}

        
        <Text
          fontSize="sm"
          color={{ base: "gray.500", _dark: "gray.500" }}
          textAlign="center"
        >
          Nếu sự cố tiếp tục xảy ra, vui lòng{" "}
          <Text
            as="span"
            color="teal.500"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
          >
            liên hệ hỗ trợ
          </Text>
        </Text>
      </VStack>
    </Container>
  );
}
