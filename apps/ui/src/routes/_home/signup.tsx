import { authClient, signIn } from "@/libs/auth/client";
import { trpcClient } from "@/libs/query/trpc";

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
import { Link, redirect, createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { trpc } from "@/libs/query";
import { useMutation } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";

const signupFormSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống")
    .refine(async (username) => {
      const isAvailable = await trpcClient.auth.isUsernameAvailable.query(username);
      return isAvailable;
    }, {
      message: "Tên đăng nhập đã tồn tại",
    }),
  email: z.string().email("Email không hợp lệ")
    .refine(async (email) => {
      const isAvailable = await trpcClient.auth.isEmailAvailable.query(email);
      return isAvailable;
    }, {
      message: "Email đã tồn tại",
    }),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Mật khẩu không khớp",
});

type SignupFormSchema = z.infer<typeof signupFormSchema>;
function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const form = useForm<SignupFormSchema>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });
  const formBgColor = { base: "white", _dark: "gray.700" };
  const navigate = useNavigate()
  const onSubmit = async (data: SignupFormSchema) => {
    await authClient.signUp.email({
      email: data.email,
      name: data.username,
      password: data.password,
      username: data.username,
      callbackURL: "/home",

    }).then(() => {
      toaster.success({
        title: "Đăng ký thành công",
        description: "Bạn đã đăng ký thành công, vui lòng đăng nhập để tiếp tục",
      });
      navigate({ to: "/login" });
    }).catch((e) => {
      toaster.error({
        title: "Đăng ký thất bại",
        description: e.message,
      });
    })

  };

  return (
    <Flex flex="1" align="center" justify="center" p={4}>
      <Box
        bg={formBgColor}
        p={{ base: 6, sm: 8, md: 10 }}
        rounded="xl"
        as={'form'}
        onSubmit={form.handleSubmit(onSubmit)}
        boxShadow="xl"
        w="full"
        maxW="md"
      >
        <VStack gap={5} align="stretch">
          <Heading
            as="h1"
            size="xl"
            textAlign="center"
            color={{ base: "gray.700", _dark: "white" }}
          >
            Tạo Tài Khoản Mới
          </Heading>
          <Text
            textAlign="center"
            color={{ base: "gray.600", _dark: "gray.300" }}
            fontSize="sm"
          >
            Tham gia Arugo để nâng cao kỹ năng lập trình của bạn!
          </Text>

          <Field.Root id="username" invalid={!!form.formState.errors.username}>
            <Field.Label fontSize="sm">Tên đăng nhập</Field.Label>
            <InputGroup startElement={<Icon as={FiUser} color="gray.400" />}>
              <Input
                id="username"
                type="text"
                placeholder="tendangnhap123"
                {...form.register("username")}
                css={{
                  "--focus-color": "var(--chakra-colors-teal-500)",
                }}
              />
            </InputGroup>
            {form.formState.errors.username && (
              <Field.ErrorText>{form.formState.errors.username.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root id="email-signup" invalid={!!form.formState.errors.email}>
            <Field.Label fontSize="sm">Địa chỉ Email</Field.Label>
            <InputGroup startElement={<Icon as={FiMail} color="gray.400" />}>
              <Input
                id="email-signup"
                type="email"
                placeholder="email@example.com"
                {...form.register("email")}
                css={{
                  "--focus-color": "var(--chakra-colors-teal-500)",
                }}
              />
            </InputGroup>
            {form.formState.errors.email && (
              <Field.ErrorText>{form.formState.errors.email.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root id="password-signup" invalid={!!form.formState.errors.password}>
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
                {...form.register("password")}
                css={{
                  "--focus-color": "var(--chakra-colors-teal-500)",
                }}
              />
            </InputGroup>
            {form.formState.errors.password && (
              <Field.ErrorText>{form.formState.errors.password.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root id="repeat-password" invalid={!!form.formState.errors.confirmPassword}>
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
                {...form.register("confirmPassword")}
                css={{
                  "--focus-color": "var(--chakra-colors-teal-500)",
                }}
              />
            </InputGroup>
            {form.formState.errors.confirmPassword && (
              <Field.ErrorText>{form.formState.errors.confirmPassword.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Checkbox.Root colorPalette="teal" size="sm" required>
            <Checkbox.HiddenInput required />
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
                <a href="/terms">Điều khoản dịch vụ</a>
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
                <a href="/privacy">Chính sách Bảo mật</a>
              </ChakraLink>
              .
            </Checkbox.Label>
          </Checkbox.Root>

          <Button colorScheme="teal" w="full" mt={2} type="submit" loading={form.formState.isSubmitting}>
            <FiUserPlus />
            Đăng Ký
          </Button>

          <Box position="relative" py={2}>
            <Separator />
            <AbsoluteCenter
              bg={formBgColor}
              px="4"
              fontSize="sm"
              color={{ base: "gray.500", _dark: "gray.400" }}
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
              colorScheme={{ base: "gray", _dark: "gray" }}
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

export const Route = createFileRoute("/_home/signup")({
  component: SignupPage,
  async beforeLoad() {
    const session = await trpcClient.auth.getServerSession.query()
    if (session?.user) {
      // Redirect to the home page if already logged in
      throw redirect({ to: "/home" });
    }
  },
});
