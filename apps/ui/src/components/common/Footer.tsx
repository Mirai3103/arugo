import { useColorModeValue } from "@/components/ui/color-mode";
import { Box, Container, Text } from "@chakra-ui/react";
export const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<Box
			bg={useColorModeValue("gray.100", "gray.900")}
			color={useColorModeValue("gray.700", "gray.200")}
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
