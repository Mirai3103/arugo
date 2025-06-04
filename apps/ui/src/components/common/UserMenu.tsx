import { signOut } from "@/libs/auth/client";
import {
	Avatar,
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	Menu,
	Portal,
	Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { FiHelpCircle, FiLogOut, FiSettings, FiUser } from "react-icons/fi";

interface User {
	name?: string | null;
	email?: string | null;
	image?: string | null;
}

interface UserMenuProps {
	user: User | undefined | null;
	isPending: boolean;
}

export const UserMenu = ({ user, isPending }: UserMenuProps) => {
const menuBg = { "base": "white", "_dark": "gray.700" };
    const menuItemHoverBg = { "base": "gray.100", "_dark": "gray.600" };
    const menuItemFocusBg = { "base": "gray.100", "_dark": "gray.650" };
    const menuItemColor = { "base": "gray.800", "_dark": "white" };
    const textColor = { "base": "gray.800", "_dark": "white" };
    const mutedTextColor = { "base": "gray.600", "_dark": "gray.400" };
    const dividerColor = { "base": "gray.200", "_dark": "gray.600" };
    const logoutHoverBgLight = { "base": "red.50", "_dark": "red.800" };
    const logoutHoverColorLight = { "base": "red.600", "_dark": "red.300" };
	const navigate = useNavigate();
	if (isPending) {
		return (
			<Avatar.Root size="sm">
				<Avatar.Fallback bg="gray.300" />
			</Avatar.Root>
		);
	}

	if (!user) {
		return (
			<HStack gap={2}>
				<Button asChild size="sm" variant="ghost" colorPalette="teal">
					<RouterLink to="/login">Đăng nhập</RouterLink>
				</Button>
				<Button asChild size="sm" colorPalette="teal">
					<RouterLink to="/signup">Đăng ký</RouterLink>
				</Button>
			</HStack>
		);
	}

	return (
		<Menu.Root positioning={{ placement: "bottom", gutter: 4 }}>
			<Menu.Trigger asChild>
				<Button
					variant="ghost"
					size="sm"
					px={1} // Reduce padding for a tighter fit around avatar
					py={1}
					rounded="full" // Make the button trigger itself rounded
					_hover={{
						bg: menuItemHoverBg,
					}}
					_active={{
						bg: menuItemFocusBg,
					}}
				>
					<Avatar.Root size="sm">
						<Avatar.Image
							alt={user.name ?? "User Avatar"}
							borderRadius="full" // Ensure image within avatar is also fully rounded
							boxSize="30px" // Consistent with fallback
							objectFit="cover"
							src={
								user.image ??
								`https://ui-avatars.com/api/?name=${user.name || "U"}&background=random`
							}
						/>
						<Avatar.Fallback
							bg="teal.500"
							color="white"
							fontSize="0.8rem"
							boxSize="30px" // Ensure fallback has explicit size
							rounded="full"
						>
							{user.name ? (
								user.name.charAt(0).toUpperCase()
							) : (
								<Icon as={FiUser} />
							)}
						</Avatar.Fallback>
					</Avatar.Root>
				</Button>
			</Menu.Trigger>
			<Portal>
				<Menu.Positioner>
					<Menu.Content
						minW="240px"
						zIndex="popover"
						boxShadow="lg"
						bg={menuBg}
						borderRadius="md"
						py={2}
					>
						<Box
							px={3}
							py={2}
							borderBottomWidth="1px"
							borderColor={dividerColor}
						>
							<Text
								fontWeight="semibold"
								fontSize="sm"
								color={textColor}
								lineClamp={1}
							>
								{user.name || "Người dùng"}
							</Text>
							<Text fontSize="xs" color={mutedTextColor} lineClamp={1}>
								{user.email || "email@example.com"}
							</Text>
						</Box>

						<Menu.ItemGroup>
							<Menu.Item value="profile" asChild>
								<RouterLink
									to="/profile"
									style={{
										display: "flex",
										alignItems: "center",
										width: "100%",
										textDecoration: "none",
									}}
								>
									<Flex align="center" w="full">
										<Icon
											as={FiUser}
											mr="3"
											boxSize="1.1em"
											color={mutedTextColor}
										/>
										<Text fontSize="sm" color={menuItemColor}>
											Hồ sơ của tôi
										</Text>
									</Flex>
								</RouterLink>
							</Menu.Item>
							<Menu.Item value="settings" asChild>
								<RouterLink
									to="/settings"
									style={{
										display: "flex",
										alignItems: "center",
										width: "100%",
										textDecoration: "none",
									}}
								>
									<Flex align="center" w="full">
										<Icon
											as={FiSettings}
											mr="3"
											boxSize="1.1em"
											color={mutedTextColor}
										/>
										<Text fontSize="sm" color={menuItemColor}>
											Cài đặt tài khoản
										</Text>
									</Flex>
								</RouterLink>
							</Menu.Item>
						</Menu.ItemGroup>
						<Menu.Separator borderColor={dividerColor} my={1} />
						<Menu.ItemGroup>
							<Menu.Item value="help" asChild>
								<RouterLink
									to="/help"
									style={{
										display: "flex",
										alignItems: "center",
										width: "100%",
										textDecoration: "none",
									}}
								>
									<Flex align="center" w="full">
										<Icon
											as={FiHelpCircle}
											mr="3"
											boxSize="1.1em"
											color={mutedTextColor}
										/>
										<Text fontSize="sm" color={menuItemColor}>
											Trung tâm hỗ trợ
										</Text>
									</Flex>
								</RouterLink>
							</Menu.Item>
						</Menu.ItemGroup>
						<Menu.Separator borderColor={dividerColor} my={1} />
						<Menu.Item
							value="logout"
							_hover={{
								bg: logoutHoverBgLight,
								color: logoutHoverColorLight,
							}}
							css={{
								'[data-theme="dark"] &:hover': {
									background: "colors.red.800",
									color: "colors.red.300",
								},
							}}
							onClick={() => {
								signOut({}).then(() => {
									navigate({
										to: "/",
										reloadDocument: true,
									});
								});
							}}
						>
							<Flex align="center" w="full" color="red.500">
								<Icon as={FiLogOut} mr="3" boxSize="1.1em" />
								<Text fontSize="sm">Đăng xuất</Text>
							</Flex>
						</Menu.Item>
					</Menu.Content>
				</Menu.Positioner>
			</Portal>
		</Menu.Root>
	);
};
