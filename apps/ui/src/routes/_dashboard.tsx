

import {
  Box,
  Flex,
  Drawer, useDisclosure,
  Icon,
  Text,
  VStack,
  HStack,
  InputGroup, Input,
  Avatar,
  Menu, IconButton,
  Heading, Spacer,
  Button,
  Separator,
  Portal
} from "@chakra-ui/react";
import {
  FiGrid,
  FiBarChart2,
  FiClock,
  FiStar,
  FiFileText,
  FiImage,
  FiUsers,
  FiSettings,
  FiCode,
  FiSearch,
  FiMoreVertical,
  FiMenu,
  FiBell,
  FiLogOut,
  FiUser
} from "react-icons/fi";
import React, { ReactNode } from "react";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { ColorModeButton } from "@/components/ui/color-mode";
export const Route = createFileRoute('/_dashboard')({
  component: DashboardLayout,
})
// --- START: Reusable Sub-components ---

// Component cho mỗi mục điều hướng trong Sidebar
const NavItem = ({ icon, children, isActive, ...rest }: { icon: React.ElementType; children: ReactNode; isActive?: boolean; to: string; }) => {
  const activeBg = { base: "teal.50", _dark: "teal.900" };
  const activeColor = { base: "teal.600", _dark: "teal.200" };

  return (
    <Button
      as={Link}
      variant="ghost"
      justifyContent="flex-start"
      w="full"
      bg={isActive ? activeBg : "transparent"}
      color={isActive ? activeColor : undefined}
      fontWeight={isActive ? "semibold" : "normal"}
      _hover={{
        bg: { base: "gray.100", _dark: "gray.700" },
      }}
      {...rest}
    ><Icon as={icon} boxSize={5} />
      {children}
    </Button>
  );
};

// Component chứa nội dung của Sidebar
const SidebarContent = ({ ...rest }) => {
  const navItems = [
    { name: "Dashboard", icon: FiGrid, to: "/dashboard" },
    { name: "Analysis", icon: FiBarChart2, to: "/analysis", isActive: true }, // Set active state for example
    { name: "History", icon: FiClock, to: "/history" },
    { name: "Favorites", icon: FiStar, to: "/favorites" },
  ];
  const contentItems = [
    { name: "Documents", icon: FiFileText, to: "/documents" },
    { name: "Media", icon: FiImage, to: "/media" },
    { name: "Users", icon: FiUsers, to: "/users" },
    { name: "Settings", icon: FiSettings, to: "/settings" },
  ];

  return (
    <Flex
      as="nav"
      direction="column"
      h="full"
      bg={{ "base": "white", "_dark": "gray.800" }}
      borderRightWidth="1px"
      borderColor={{ "base": "gray.200", "_dark": "gray.700" }}
      p={4}
      {...rest}
    >
      {/* Logo */}
      <HStack mb={8} gap={2}>
        <Icon as={FiCode} w={8} h={8} color="teal.500" />
        <Heading as="h1" size="md" letterSpacing="tight">
          Logo
        </Heading>
      </HStack>

      {/* Search */}
      <InputGroup mb={6} startElement={<Icon as={FiSearch} color="gray.400" />}>
        <Input placeholder="Search" variant="subtle" borderRadius="md" />
      </InputGroup>

      {/* Navigation Links */}
      <VStack gap={1} align="stretch" flex="1">
        {navItems.map((item) => (
          <NavItem key={item.name} icon={item.icon} to={item.to} isActive={item.isActive}>
            {item.name}
          </NavItem>
        ))}
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color="gray.500"
          mt={6}
          mb={2}
          px={2}
        >
          Content
        </Text>
        {contentItems.map((item) => (
          <NavItem key={item.name} icon={item.icon} to={item.to}>
            {item.name}
          </NavItem>
        ))}
      </VStack>

      {/* User Profile */}
      <Box mt={8}>
        <Separator mb={4} />
        <Flex align="center">
          <Avatar.Root size="sm">
            <Avatar.Fallback name="John Doe" />
            <Avatar.Image src="https://placewaifu.com/image/40/40" />
          </Avatar.Root>
          <Box ml="3" flex="1">
            <Text fontSize="sm" fontWeight="medium">John Doe</Text>
            <Text fontSize="xs" color="gray.500">
              john@chakra-ui.com
            </Text>
          </Box>
          <Menu.Root positioning={{ placement: "top-end" }}>
            <Menu.Trigger asChild>
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="User options"
              >
                <FiMoreVertical />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="profile">
                    <FiUser />
                    Profile
                  </Menu.Item>
                  <Menu.Item value="settings">
                    <FiSettings />
                    Settings
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item value="logout" color="red.500">
                    <FiLogOut />
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>
      </Box>
    </Flex>
  );
};
// --- END: Reusable Sub-components ---


// --- START: Main Dashboard Layout Component ---
const AdminDashboardLayout = ({ children }: { children: ReactNode }) => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <Flex minH="100vh" bg={{ "base": "gray.50", "_dark": "gray.900" }}>
      {/* Desktop Sidebar */}
      <Box display={{ base: "none", lg: "block" }} w="320px" flexShrink={0}>
        <SidebarContent />
      </Box>

      {/* Mobile Sidebar Drawer */}
      <Drawer.Root open={open} onOpenChange={({ open }) => !open && onClose()}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <SidebarContent />
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      {/* Main Content Area */}
      <Box flex="1">
        {/* Header for main content */}
        <Flex
          as="header"
          align="center"
          justify={{ base: "space-between", lg: "flex-end" }}
          px={4}
          py={3}
          bg={{ "base": "white", "_dark": "gray.800" }}
          borderBottomWidth="1px"
          borderColor={{ "base": "gray.200", "_dark": "gray.700" }}
          h="60px"
        >
          <IconButton
            aria-label="Open menu"
            onClick={onOpen}
            variant="ghost"
            display={{ base: "flex", lg: "none" }}
          >
            <FiMenu />
          </IconButton>

          <Spacer display={{ lg: "none" }} />

          <HStack gap={3}>
            <ColorModeButton />
            <IconButton
              aria-label="Notifications"
              variant="ghost"
              size="sm"
            >
              <FiBell />
            </IconButton>
            {/* UserMenu can be placed here as well if needed */}
            <Text fontSize="sm" display={{ base: "none", md: "block" }}>
              Welcome, John
            </Text>
          </HStack>
        </Flex>

        <Box as="main" p={6}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
};


function DashboardLayout() {
  return (
    <AdminDashboardLayout>
      <Outlet />
    </AdminDashboardLayout>
  );
}