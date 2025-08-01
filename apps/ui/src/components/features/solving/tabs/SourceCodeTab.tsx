import React from "react";
import { Box, Button, Code, Heading, HStack, Icon } from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";

interface SourceCodeTabProps {
  code: string;
  languageName: string;
  languageVersion?: string;
}

export const SourceCodeTab: React.FC<SourceCodeTabProps> = ({
  code,
  languageName,
  languageVersion,
}) => {
  return (
    <>
      <HStack justifyContent="space-between" mb={3}>
        <Heading size="sm">
          Mã nguồn: ({languageName} {languageVersion && `v${languageVersion}`})
        </Heading>
        <Button size="xs" variant="outline">
          <Icon as={FiDownload} mr={1} /> Tải xuống
        </Button>
      </HStack>
      <Box
        as="pre"
        bg={{ _light: "gray.100", _dark: "gray.900" }}
        color={{ _light: "gray.800", _dark: "gray.50" }}
        p={4}
        borderRadius="md"
        overflowX="auto"
        maxH="72vh"
        fontSize="sm"
        fontFamily="monospace"
      >
        <Code bg="transparent" p={0} whiteSpace="pre-wrap" display="block">
          {code}
        </Code>
      </Box>
    </>
  );
};
