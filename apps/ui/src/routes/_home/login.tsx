import { toaster } from "@/components/ui/toaster";
import { authClient, signIn } from "@/libs/auth/client";
import { trpcClient } from "@/libs/query/trpc";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, redirect, createFileRoute } from "@tanstack/react-router";
import { useState } from "react"; // Added React import
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import {
  FiEye,
  FiEyeOff,
  FiGithub,
  FiLock,
  FiLogIn,
  FiMail,
} from "react-icons/fi";
import { z } from "zod";
const loginFormSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
  remember: z.boolean().optional(),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;
function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const formBgColor = { base: "white", _dark: "gray.700" };
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });
  const onSubmit = async (data: LoginFormSchema) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.remember ?? false,
      callbackURL: "/home",
    }).then(() => {
      toaster.success({
        title: "Đăng nhập thành công",
        description: "Bạn đã đăng nhập thành công, vui lòng đăng nhập để tiếp tục",
      });
    }).catch((e) => {
      toaster.error({
        title: "Đăng nhập thất bại",
        description: e.message,
      });
    })
  };
  return (
    <Flex flex="1" my={10} align="center" justify="center" p={4}>
      <Box
        bg={formBgColor}
        p={{ base: 6, sm: 8, md: 10 }}
        rounded="xl"
        boxShadow="xl"
        w="full"
        maxW="md"
        as={'form'}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <VStack gap={6} align="stretch">
          <Heading
            as="h1"
            size="xl"
            textAlign="center"
            color={{ base: "gray.700", _dark: "white" }}
          >
            Đăng Nhập Arugo
          </Heading>
          <Text
            textAlign="center"
            color={{ base: "gray.600", _dark: "gray.300" }}
            fontSize="sm"
          >
            Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
          </Text>

          <Field.Root id="email" invalid={!!form.formState.errors.email}>
            {/* FormControl -> Field.Root, id được giữ lại */}
            <Field.Label fontSize="sm">Email</Field.Label>
            {/* FormLabel -> Field.Label */}
            <InputGroup startElement={<Icon as={FiMail} color="gray.400" />}>
              <Input
                type="text"
                placeholder="email@example.com"
                id="email" // Đảm bảo Input có id trùng với Field.Root để label hoạt động đúng
                {...form.register("email")}
                css={{
                  // focusBorderColor được thay bằng CSS variable
                  "--focus-color": "var(--chakra-colors-teal-500)",
                }}
              />
            </InputGroup>
            {form.formState.errors.email && (
              <Field.ErrorText>{form.formState.errors.email.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root id="password" invalid={!!form.formState.errors.password}>

            {/* FormControl -> Field.Root */}
            <Field.Label fontSize="sm">Mật khẩu</Field.Label>
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
                {...form.register("password")}
                css={{
                  // focusBorderColor được thay bằng CSS variable
                  "--focus-color": "var(--chakra-colors-teal-500)",
                }}
              />
            </InputGroup>
            {form.formState.errors.password && (
              <Field.ErrorText>{form.formState.errors.password.message}</Field.ErrorText>
            )}
          </Field.Root>

          <HStack justifyContent="space-between">
            <Checkbox.Root colorPalette="teal" size="sm" >
              <Checkbox.HiddenInput {...form.register("remember")} />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Label>Ghi nhớ đăng nhập</Checkbox.Label>
            </Checkbox.Root>
            <Link to="/forgot-password">
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

          <Button colorScheme="teal" w="full" mt={2} type="submit" loading={form.formState.isSubmitting}>
            <FiLogIn />
            Đăng Nhập
          </Button>

          <Box position="relative" py={2}>
            <Separator />
            <AbsoluteCenter
              bg={formBgColor}
              px="4"
              fontSize="sm"
              color={{ base: "gray.500", _dark: "gray.400" }}
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
                bg: { base: "red.50", _dark: "red.900" },
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
              colorScheme={{ base: "gray", _dark: "gray" }} // For better contrast in dark mode
              _hover={{
                bg: { base: "gray.100", _dark: "gray.600" },
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
            Chưa có tài khoản?
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
    const session = await trpcClient.auth.getServerSession.query()
    if (session?.user) {
      // Redirect to the home page if already logged in
      throw redirect({ to: "/home" });
    }
  },
});
