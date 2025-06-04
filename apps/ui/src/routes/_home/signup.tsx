import { signIn } from "@/libs/auth/client";
import { getServerSession } from "@/server/transports/server-functions/auth";
import {
	AbsoluteCenter,
	Box,
	Button,
	Link as ChakraLink,
	Checkbox,
	Field,
	Flex,
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
import { Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import {
	FiEye,
	FiEyeOff,
	FiGithub,
	FiLock,
	FiMail,
	FiUser,
	FiUserPlus,
} from "react-icons/fi";
function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const formBgColor = { "base": "white", "_dark": "gray.700" };

    return (
        <Flex flex="1" align="center" justify="center" p={4}>
            <Box
                bg={formBgColor}
                p={{ base: 6, sm: 8, md: 10 }}
                rounded="xl"
                boxShadow="xl"
                w="full"
                maxW="md"
            >
                <VStack gap={5} align="stretch">
                    <Heading
                        as="h1"
                        size="xl"
                        textAlign="center"
                        color={{ "base": "gray.700", "_dark": "white" }}
                    >
                        Tạo Tài Khoản Mới
                    </Heading>
                    <Text
                        textAlign="center"
                        color={{ "base": "gray.600", "_dark": "gray.300" }}
                        fontSize="sm"
                    >
                        Tham gia CodeMaster để nâng cao kỹ năng lập trình của bạn!
                    </Text>

                    <Field.Root id="username">
                        <Field.Label fontSize="sm">Tên người dùng</Field.Label>
                        <InputGroup startElement={<Icon as={FiUser} color="gray.400" />}>
                            <Input
                                id="username"
                                type="text"
                                placeholder="tendangnhap123"
                                css={{
                                    "--focus-color": "var(--chakra-colors-teal-500)",
                                }}
                            />
                        </InputGroup>
                    </Field.Root>

                    <Field.Root id="email-signup">
                        <Field.Label fontSize="sm">Địa chỉ Email</Field.Label>
                        <InputGroup startElement={<Icon as={FiMail} color="gray.400" />}>
                            <Input
                                id="email-signup"
                                type="email"
                                placeholder="email@example.com"
                                css={{
                                    "--focus-color": "var(--chakra-colors-teal-500)",
                                }}
                            />
                        </InputGroup>
                    </Field.Root>

                    <Field.Root id="password-signup">
                        <Field.Label fontSize="sm">Mật khẩu</Field.Label>
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
                                id="password-signup"
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                css={{
                                    "--focus-color": "var(--chakra-colors-teal-500)",
                                }}
                            />
                        </InputGroup>
                    </Field.Root>

                    <Field.Root id="repeat-password">
                        <Field.Label fontSize="sm">Nhập lại mật khẩu</Field.Label>
                        <InputGroup
                            startElement={<Icon as={FiLock} color="gray.400" />}
                            endElement={
                                <IconButton
                                    variant="ghost"
                                    aria-label={
                                        showRepeatPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                                    }
                                    h={"100%"}
                                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                    w={"100%"}
                                    size="sm"
                                >
                                    {showRepeatPassword ? <FiEyeOff /> : <FiEye />}
                                </IconButton>
                            }
                        >
                            <Input
                                id="repeat-password"
                                type={showRepeatPassword ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu"
                                css={{
                                    "--focus-color": "var(--chakra-colors-teal-500)",
                                }}
                            />
                        </InputGroup>
                    </Field.Root>

                    <Checkbox.Root colorPalette="teal" size="sm" defaultChecked>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                            <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label>
                            Tôi đồng ý với{" "}
                            <ChakraLink
                                asChild
                                color={{
                                    _light: "teal.600",
                                    _dark: "teal.300",
                                }}
                                textDecoration="underline"
                            >
                                <Link to="/terms">Điều khoản dịch vụ</Link>
                            </ChakraLink>
                            và
                            <ChakraLink
                                asChild
                                color={{
                                    _light: "teal.600",
                                    _dark: "teal.300",
                                }}
                                textDecoration="underline"
                            >
                                <Link to="/privacy">Chính sách Bảo mật</Link>
                            </ChakraLink>
                            .
                        </Checkbox.Label>
                    </Checkbox.Root>

                    <Button colorScheme="teal" w="full" mt={2}>
                        <FiUserPlus />
                        Đăng Ký
                    </Button>

                    <Box position="relative" py={2}>
                        <Separator />
                        <AbsoluteCenter
                            bg={formBgColor}
                            px="4"
                            fontSize="sm"
                            color={{ "base": "gray.500", "_dark": "gray.400" }}
                        >
                            Hoặc đăng ký với
                        </AbsoluteCenter>
                    </Box>

                    <Stack direction={"column"} gap={3}>
                        <Button
                            w="full"
                            variant="outline"
                            colorScheme="red"
                            _hover={{
                                bg: { "base": "red.50", "_dark": "red.900" },
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
                            colorScheme={{"base": "gray", "_dark": "gray"}}
                            _hover={{
                                bg: { "base": "gray.100", "_dark": "gray.600" },
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
                        Đã có tài khoản?{" "}
                        <Link to="/login">
                            <Text
                                as="span"
                                fontWeight="medium"
                                color="teal.500"
                                _hover={{ textDecoration: "underline" }}
                            >
                                Đăng nhập ngay
                            </Text>
                        </Link>
                    </Text>
                </VStack>
            </Box>
        </Flex>
    );
}

export const Route = createFileRoute({
    component: SignupPage,
    async beforeLoad() {
        const session = await getServerSession();
        if (session.data?.user) {
            // Redirect to the home page if already logged in
            throw redirect({ to: "/home" });
        }
    },
});