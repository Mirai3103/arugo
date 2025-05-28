import { useColorModeValue } from "@/components/ui/color-mode";
import { signIn } from "@/libs/auth/client";
import { getServerSession } from "@/server/transports/server-functions/auth";
import {
	AbsoluteCenter,
	Box,
	Button,
	Checkbox,
	Field,
	Flex,
	HStack,
	Heading,
	Icon,
	IconButton,
	Input,
	InputGroup,
	Separator,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react"; // Added React import
import { FaGoogle } from "react-icons/fa";
import {
	FiEye,
	FiEyeOff,
	FiGithub,
	FiLock,
	FiLogIn,
	FiMail,
} from "react-icons/fi";
function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const formBgColor = useColorModeValue("white", "gray.700");

	return (
		<Flex flex="1" my={10} align="center" justify="center" p={4}>
			<Box
				bg={formBgColor}
				p={{ base: 6, sm: 8, md: 10 }}
				rounded="xl"
				boxShadow="xl"
				w="full"
				maxW="md"
			>
				<VStack gap={6} align="stretch">
					<Heading
						as="h1"
						size="xl"
						textAlign="center"
						color={useColorModeValue("gray.700", "white")}
					>
						Đăng Nhập CodeMaster
					</Heading>
					<Text
						textAlign="center"
						color={useColorModeValue("gray.600", "gray.300")}
						fontSize="sm"
					>
						Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
					</Text>

					<Field.Root id="email">
						{/* FormControl -> Field.Root, id được giữ lại */}
						<Field.Label fontSize="sm">Địa chỉ Email</Field.Label>{" "}
						{/* FormLabel -> Field.Label */}
						<InputGroup startElement={<Icon as={FiMail} color="gray.400" />}>
							<Input
								type="email"
								placeholder="email@example.com"
								id="email" // Đảm bảo Input có id trùng với Field.Root để label hoạt động đúng
								css={{
									// focusBorderColor được thay bằng CSS variable
									"--focus-color": "var(--chakra-colors-teal-500)",
								}}
							/>
						</InputGroup>
					</Field.Root>

					<Field.Root id="password">
						{" "}
						{/* FormControl -> Field.Root */}
						<Field.Label fontSize="sm">Mật khẩu</Field.Label>{" "}
						{/* FormLabel -> Field.Label */}
						<InputGroup
							startElement={<Icon as={FiLock} color="gray.400" />}
							endElement={
								<IconButton
									variant="ghost"
									aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
									h={"100%"}
									onClick={() => setShowPassword(!showPassword)}
									w={"100%"}
									size="sm"
								>
									{showPassword ? <FiEyeOff /> : <FiEye />}
								</IconButton>
							}
						>
							<Input
								type={showPassword ? "text" : "password"}
								placeholder="Nhập mật khẩu của bạn"
								id="password" // Đảm bảo Input có id trùng với Field.Root
								css={{
									// focusBorderColor được thay bằng CSS variable
									"--focus-color": "var(--chakra-colors-teal-500)",
								}}
							/>
						</InputGroup>
					</Field.Root>

					<HStack justifyContent="space-between">
						<Checkbox.Root colorPalette="teal" size="sm">
							<Checkbox.HiddenInput />
							<Checkbox.Control>
								<Checkbox.Indicator />
							</Checkbox.Control>
							<Checkbox.Label>Ghi nhớ đăng nhập</Checkbox.Label>
						</Checkbox.Root>
						<Link to="/forgot-password">
							{" "}
							{/* Adjust route as needed */}
							<Text
								as="span"
								fontSize="sm"
								color="teal.500"
								_hover={{ textDecoration: "underline" }}
							>
								Quên mật khẩu?
							</Text>
						</Link>
					</HStack>

					<Button colorScheme="teal" w="full" mt={2}>
						<FiLogIn />
						Đăng Nhập
					</Button>

					<Box position="relative" py={2}>
						<Separator />
						<AbsoluteCenter
							bg={formBgColor}
							px="4"
							fontSize="sm"
							color={useColorModeValue("gray.500", "gray.400")}
						>
							Hoặc đăng nhập với
						</AbsoluteCenter>
					</Box>

					<Stack direction={"column"} gap={3}>
						<Button
							w="full"
							variant="outline"
							colorScheme="red"
							_hover={{
								bg: useColorModeValue("red.50", "red.900"),
							}}
							onClick={() => {
								signIn.social({
									provider: "google",
								});
							}}
						>
							<FaGoogle />
							Google
						</Button>
						<Button
							w="full"
							variant="outline"
							colorScheme={useColorModeValue("gray", "gray")} // For better contrast in dark mode
							_hover={{
								bg: useColorModeValue("gray.100", "gray.600"),
							}}
							onClick={() => {
								signIn.social({
									provider: "github",
								});
							}}
						>
							<FiGithub />
							GitHub
						</Button>
					</Stack>

					<Text textAlign="center" fontSize="sm" pt={2}>
						Chưa có tài khoản?{" "}
						<Link to="/signup">
							<Text
								as="span"
								fontWeight="medium"
								color="teal.500"
								_hover={{ textDecoration: "underline" }}
							>
								Đăng ký ngay
							</Text>
						</Link>
					</Text>
				</VStack>
			</Box>
		</Flex>
	);
}

export const Route = createFileRoute("/_home/login")({
	// Assuming '/login' is the route
	component: LoginPage,
	async beforeLoad(_ctx) {
		const session = await getServerSession();
		if (session.data?.user) {
			// Redirect to the home page if already logged in
			throw redirect({ to: "/home" });
		}
	},
});
