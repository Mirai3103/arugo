import { Box, Container, Text } from "@chakra-ui/react";
export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <Box
      bg={{ base: "gray.100", _dark: "gray.900" }}
      color={{ base: "gray.700", _dark: "gray.200" }}
      mt={16}
    >
      <Container maxW="container.xl" py={8}>
        <Text textAlign="center" fontSize="sm">
          &copy; {year} CodeMaster. Nơi tài năng lập trình tỏa sáng.
        </Text>
      </Container>
    </Box>
  );
};
