import { ColorModeButton } from "@/components/ui/color-mode"; 
import { signOut, useSession } from "@/libs/auth/client"; 
import {
    Box,
    Button,
    Container,
    Drawer,
    Flex,
    HStack,
    Heading,
    Icon,
    IconButton,
    Separator,
    Text,
    VStack,
    useBreakpointValue,
    useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "@tanstack/react-router";
import React from "react";
import {
    FiBell,
    FiCode,
    FiLogOut,
    FiMenu,
    FiSettings,
    FiUser,
} from "react-icons/fi";
import { UserMenu } from "./UserMenu";

export const Header = () => {
  const bg = { base: "white", _dark: "gray.800" };
  const color = { base: "gray.800", _dark: "white" };
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const { data: session, isPending } = useSession();

  const isMobile = useBreakpointValue({ base: true, lg: false });
  const user = session?.user; 
  const navigate = useNavigate();
  return (
    <Box
      as="header"
      py={3}
      px={{ base: 4, md: 8 }}
      bg={bg}
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Container maxW="container.2xl">
        <Flex justifyContent="space-between" alignItems="center">
          <RouterLink to="/">
            <HStack gap={2}>
              <Icon as={FiCode} w={8} h={8} color="teal.500" />
              <Heading as="h1" size="md" color={color} letterSpacing="tight">
                Arugo
              </Heading>
            </HStack>
          </RouterLink>
          {isMobile ? (
            <IconButton
              ref={btnRef}
              aria-label="Mở menu"
              onClick={onOpen}
              variant="ghost"
              colorScheme="teal"
            >
              <FiMenu />
            </IconButton>
          ) : (
            <HStack gap={4}>
              <Button asChild variant="ghost" colorScheme="teal" size="sm">
                <RouterLink to="/home">Bài tập</RouterLink>
              </Button>
              <Button asChild variant="ghost" colorScheme="teal" size="sm">
                <RouterLink to="/contests">Cuộc thi</RouterLink>
              </Button>
              <Button asChild variant="ghost" colorScheme="teal" size="sm">
                <RouterLink to="/community">Cộng đồng</RouterLink>
              </Button>
              <Button asChild variant="ghost" colorScheme="teal" size="sm">
                <RouterLink to="/leaderboard">Xếp hạng</RouterLink>
              </Button>
              <ColorModeButton />
              <IconButton
                aria-label="Thông báo"
                variant="ghost"
                size="sm"
                position="relative"
              >
                <FiBell />
                
                <Box
                  as="span"
                  position="absolute"
                  top="1"
                  right="1"
                  fontSize="0.6rem"
                  p="3px"
                  bg="red.500"
                  borderRadius="full"
                  display={"block"} 
                />
              </IconButton>
              {user ? (
                <UserMenu isPending={isPending} user={user} />
              ) : (
                <HStack gap={2}>
                  <Button asChild variant="ghost" colorScheme="teal" size="sm">
                    <RouterLink to="/login">Đăng nhập</RouterLink>
                  </Button>
                  <Button asChild colorScheme="teal" size="sm">
                    <RouterLink to="/signup">Đăng ký</RouterLink>
                  </Button>
                </HStack>
              )}
            </HStack>
          )}
        </Flex>
      </Container>
      
      <Drawer.Root open={isOpen} onOpenChange={onClose} placement="end">
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg={bg}>
            <Drawer.CloseTrigger />
            <Drawer.Header borderBottomWidth="1px">
              <HStack gap={2}>
                <Icon as={FiCode} w={6} h={6} color="teal.500" />
                <Text fontWeight="bold">Arugo</Text>
              </HStack>
            </Drawer.Header>
            <Drawer.Body>
              
              <VStack gap={4} align="stretch">
                <Button
                  asChild
                  variant="ghost"
                  colorScheme="teal"
                  justifyContent="flex-start"
                  onClick={onClose}
                >
                  <RouterLink to="/home">Trang chủ</RouterLink>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  colorScheme="teal"
                  justifyContent="flex-start"
                  onClick={onClose}
                >
                  <RouterLink to="/home">Bài tập</RouterLink>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  colorScheme="teal"
                  justifyContent="flex-start"
                  onClick={onClose}
                >
                  <RouterLink to="/contests">Cuộc thi</RouterLink>
                </Button>
                <Button
                  variant="ghost"
                  colorScheme="teal"
                  justifyContent="flex-start"
                  onClick={onClose}
                  asChild
                >
                  <RouterLink to="/community">Cộng đồng</RouterLink>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  justifyContent="flex-start"
                  to="/leaderboard"
                  onClick={onClose}
                >
                  <RouterLink to="/leaderboard">Xếp hạng</RouterLink>
                </Button>
                <Separator />
                {user ? (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      colorScheme="teal"
                      justifyContent="flex-start"
                      to="/profile"
                      onClick={onClose}
                    >
                      <RouterLink to="/profile">
                        <FiUser /> Hồ sơ của tôi
                      </RouterLink>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      colorScheme="teal"
                      justifyContent="flex-start"
                      onClick={onClose}
                    >
                      <RouterLink to="/settings">
                        <FiSettings /> Cài đặt tài khoản
                      </RouterLink>
                    </Button>
                    <Button
                      variant="ghost"
                      colorScheme="red"
                      justifyContent="flex-start"
                      onClick={() => {
                        signOut({}).then(() => {
                          navigate({
                            to: "/",
                            reloadDocument: true,
                          });
                        });
                        onClose();
                      }}
                    >
                      <FiLogOut />
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      colorScheme="teal"
                      w="full"
                      onClick={onClose}
                    >
                      <RouterLink to="/login">Đăng nhập</RouterLink>
                    </Button>
                    <Button
                      asChild
                      colorScheme="teal"
                      w="full"
                      onClick={onClose}
                    >
                      <RouterLink to="/signup">Đăng ký</RouterLink>
                    </Button>
                  </>
                )}
                <Box pt={4}>
                  <ColorModeButton justifyContent="center" w="full" />
                </Box>
              </VStack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </Box>
  );
};
