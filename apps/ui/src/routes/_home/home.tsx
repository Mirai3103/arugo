import ProblemsTable from "@/components/features/problem/ProblemsTable";
import ProblemsTableSkeleton from "@/components/features/problem/ProblemsTable/ProblemsTableSkeleton";
import { useColorModeValue } from "@/components/ui/color-mode";
import { getAllProblemsQueryOptions } from "@/libs/queries/problems";
import { getAllTagsQueryOptions } from "@/libs/queries/tag";
import { problemQuerySchema } from "@/validations/problem";
import {
	Avatar,
	Box,
	Button,
	Card,
	Container,
	Grid,
	GridItem,
	HStack,
	Heading,
	Icon,
	SimpleGrid,
	Stat,
	Tag,
	Text,
	VStack,
	Wrap,
	WrapItem,
	chakra,
	useBreakpointValue,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Suspense } from "react";
import {
	FiAward,
	FiCalendar,
	FiCheckCircle,
	FiGift,
	FiStar,
	FiTrendingUp,
	FiUsers,
} from "react-icons/fi";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const sampleProblems: any[] = [
	{
		id: "p1",
		title: "Tổng hai số",
		difficulty: "Dễ",
		tags: ["Mảng", "Toán"],
		acceptance: "90.5%",
		status: "Đã giải",
	},
	{
		id: "p2",
		title: "Chuỗi đối xứng",
		difficulty: "Dễ",
		tags: ["Chuỗi"],
		acceptance: "85.2%",
	},
	{
		id: "p3",
		title: "Tìm cây khung nhỏ nhất",
		difficulty: "Trung bình",
		tags: ["Đồ thị", "Tham lam"],
		acceptance: "60.1%",
		status: "Thử lại",
	},
	{
		id: "p4",
		title: "Đường đi ngắn nhất Dijkstra",
		difficulty: "Trung bình",
		tags: ["Đồ thị", "Quy hoạch động"],
		acceptance: "55.8%",
	},
	{
		id: "p5",
		title: "Luồng cực đại",
		difficulty: "Khó",
		tags: ["Đồ thị", "Luồng"],
		acceptance: "30.7%",
	},
	{
		id: "p6",
		title: "Bài toán ba lô",
		difficulty: "Trung bình",
		tags: ["Quy hoạch động"],
		acceptance: "65.0%",
	},
	{
		id: "p7",
		title: "Phân tích số nguyên tố",
		difficulty: "Dễ",
		tags: ["Toán", "Số học"],
		acceptance: "88.2%",
	},
	{
		id: "p8",
		title: "Tìm kiếm nhị phân trên mảng xoay",
		difficulty: "Trung bình",
		tags: ["Mảng", "Chia để trị"],
		acceptance: "58.5%",
	},
	{
		id: "p9",
		title: "Cây đoạn (Segment Tree)",
		difficulty: "Khó",
		tags: ["Cấu trúc dữ liệu"],
		acceptance: "40.3%",
	},
	{
		id: "p10",
		title: "Ký tự xuất hiện nhiều nhất",
		difficulty: "Dễ",
		tags: ["Chuỗi", "Đếm"],
		acceptance: "92.1%",
	},
];
const sampleLeaderboard = [
	{
		rank: 1,
		name: "CoderPro123",
		avatar: "https://via.placeholder.com/30?text=C1",
		points: 15000,
	},
	{
		rank: 2,
		name: "LogicMaster",
		avatar: "https://via.placeholder.com/30?text=L2",
		points: 14500,
	},
	{
		rank: 3,
		name: "AlgoQueen",
		avatar: "https://via.placeholder.com/30?text=A3",
		points: 13800,
	},
	{
		rank: 4,
		name: "BugHunter",
		avatar: "https://via.placeholder.com/30?text=B4",
		points: 12000,
	},
	{
		rank: 5,
		name: "ScriptKid",
		avatar: "https://via.placeholder.com/30?text=S5",
		points: 11500,
	},
];

const sampleContests = [
	{
		id: "c1",
		name: "Thử Thách Thuật Toán Tháng 5",
		date: "20/05/2025",
		registered: 1200,
		type: "Cá nhân",
	},
	{
		id: "c2",
		name: "Đấu Trường Lập Trình Mùa Hè",
		date: "15/06/2025",
		registered: 850,
		type: "Đội nhóm",
	},
	{
		id: "c3",
		name: "Giải Vô Địch CodeMaster 2025",
		date: "01/08/2025",
		registered: 500,
		type: "Cá nhân",
	},
];
// --- END: Sample Data ---

// --- START: Page Specific Components ---

const RightSidebar = () => {
	return (
		<VStack
			borderSpacing={8}
			align="stretch"
			p={4}
			bg={useColorModeValue("gray.50", "gray.800")}
			rounded="lg"
			boxShadow="sm"
		>
			<Box>
				<Heading
					size="sm"
					mb={3}
					color={useColorModeValue("gray.700", "gray.200")}
				>
					Bảng xếp hạng
				</Heading>
				<VStack align="stretch" borderSpacing={3}>
					{sampleLeaderboard.map((user) => (
						<HStack
							key={user.rank}
							borderSpacing={3}
							_hover={{
								bg: useColorModeValue("gray.100", "gray.700"),
							}}
							p={1.5}
							rounded="md"
						>
							<Text
								fontWeight="bold"
								color="teal.500"
								w="20px"
								textAlign="center"
							>
								{user.rank}
							</Text>
							<Avatar.Root size="xs">
								<Avatar.Fallback name={user.name} />
								<Avatar.Image src={user.avatar} />
							</Avatar.Root>
							<Text fontSize="sm" fontWeight="medium" lineClamp={1}>
								{user.name}
							</Text>
							<Text fontSize="xs" color="gray.500" ml="auto">
								{user.points} pts
							</Text>
						</HStack>
					))}
					<Button
						size="xs"
						variant="ghost"
						colorScheme="teal"
						alignSelf="flex-end"
					>
						Xem tất cả
					</Button>
				</VStack>
			</Box>
			<ContestsEventsPreview />
		</VStack>
	);
};
// <Box
// 							p={6}
// 							bg={useColorModeValue("white", "gray.800")}
// 							rounded="lg"
// 							boxShadow="base"
// 						>
// 							<Heading size="lg" mb={1}>
// 								Chào mừng trở lại, Hoàng!
// 							</Heading>
// 							<Text
// 								color={useColorModeValue(
// 									"gray.600",
// 									"gray.300"
// 								)}
// 							>
// 								Hãy cùng chinh phục những thử thách mới hôm
// 								nay.
// 							</Text>
// 							<Progress.Root
// 								size="sm"
// 								colorScheme="teal"
// 								value={60}
// 								mt={3}
// 								rounded="full"
// 							>
// 								<Progress.Track>
// 									<Progress.Range />
// 								</Progress.Track>
// 							</Progress.Root>

// 							<HStack justifyContent="space-between" mt={1}>
// 								<Text fontSize="xs" color="gray.500">
// 									Tiến độ mục tiêu tuần: 60%
// 								</Text>
// 								<Link
// 									to="/goals"
// 									style={{
// 										fontSize: "0.75rem",
// 										color: "teal",
// 									}}
// 								>
// 									Đặt mục tiêu
// 								</Link>
// 							</HStack>
// 						</Box>
const StatsGamificationSection = () => {
	return (
		<Box py={4} mb={2} bg={useColorModeValue("white", "gray.900")}>
			<Container maxW="container.xl">
				<Heading size="lg" mb={6} textAlign="center">
					Thành Tích Của Bạn
				</Heading>
				<SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={6}>
					<Stat.Root
						p={4}
						borderWidth="1px"
						rounded="md"
						borderColor={useColorModeValue("gray.200", "gray.700")}
					>
						<Stat.Label display="flex" alignItems="center">
							<Icon as={FiCheckCircle} mr={2} color="green.500" />
							Bài đã giải
						</Stat.Label>
						<Stat.ValueText>125</Stat.ValueText>
						<Stat.HelpText>
							<Stat.UpIndicator />5 bài trong tuần này
						</Stat.HelpText>
					</Stat.Root>

					<Stat.Root
						p={4}
						borderWidth="1px"
						rounded="md"
						borderColor={useColorModeValue("gray.200", "gray.700")}
					>
						<Stat.Label display="flex" alignItems="center">
							<Icon as={FiStar} mr={2} color="yellow.500" />
							Điểm kinh nghiệm
						</Stat.Label>
						<Stat.ValueText>8,750 XP</Stat.ValueText>
						<Stat.HelpText>
							<Stat.UpIndicator />
							250 XP hôm nay
						</Stat.HelpText>
					</Stat.Root>

					<Stat.Root
						p={4}
						borderWidth="1px"
						rounded="md"
						borderColor={useColorModeValue("gray.200", "gray.700")}
					>
						<Stat.Label display="flex" alignItems="center">
							<Icon as={FiAward} mr={2} color="blue.500" />
							Huy hiệu đạt được
						</Stat.Label>
						<Stat.ValueText>12</Stat.ValueText>
						<Stat.HelpText>"Thuật toán gia"</Stat.HelpText>
					</Stat.Root>

					<Stat.Root
						p={4}
						borderWidth="1px"
						rounded="md"
						borderColor={useColorModeValue("gray.200", "gray.700")}
					>
						<Stat.Label display="flex" alignItems="center">
							<Icon as={FiTrendingUp} mr={2} color="purple.500" />
							Chuỗi ngày luyện tập
						</Stat.Label>
						<Stat.ValueText>35 ngày</Stat.ValueText>
						<Stat.HelpText>Kỷ lục: 50 ngày</Stat.HelpText>
					</Stat.Root>
				</SimpleGrid>
			</Container>
		</Box>
	);
};

const ContestsEventsPreview = () => {
	return (
		<Box>
			<Heading
				size="sm"
				mb={3}
				color={useColorModeValue("gray.700", "gray.200")}
			>
				Cuộc Thi & Sự Kiện
			</Heading>
			<VStack borderSpacing={3} align="stretch">
				{sampleContests.slice(0, 2).map((contest) => (
					<Card.Root key={contest.id} variant="outline" size="sm">
						<Card.Body gap={2} p={4}>
							<Card.Title color="teal.500" fontSize="sm" mb={1}>
								{contest.name}
							</Card.Title>

							<Card.Description
								fontSize="xs"
								color={useColorModeValue("gray.600", "gray.400")}
							>
								<Icon as={FiCalendar} mr={1} />
								{contest.date}
							</Card.Description>

							<Card.Description
								fontSize="xs"
								color={useColorModeValue("gray.600", "gray.400")}
							>
								<Icon as={FiUsers} mr={1} />
								{contest.registered} người tham gia
							</Card.Description>

							<Card.Footer mt={2} p={0}>
								<Button
									size="xs"
									colorPalette={"green"}
									variant="ghost"
									colorScheme="teal"
								>
									Xem chi tiết
								</Button>
							</Card.Footer>
						</Card.Body>
					</Card.Root>
				))}
				<Button
					size="xs"
					variant="ghost"
					colorPalette="green"
					alignSelf="flex-start"
				>
					Xem tất cả sự kiện
				</Button>
			</VStack>
		</Box>
	);
};

const PersonalizedRecommendationsSection = () => {
	// This would typically fetch data based on user history
	const recommendedProblems: Problem[] = sampleProblems
		.slice(0, 3)
		.map((p) => ({ ...p, difficulty: "Trung bình" }));
	return (
		<Box py={{ base: 8 }}>
			<Container maxW="container.xl">
				<Heading size="lg" mb={6} textAlign={{ base: "center", md: "left" }}>
					Gợi Ý Cho Bạn <Icon as={FiGift} color="orange.400" />
				</Heading>
				<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
					{recommendedProblems.map((problem) => (
						<Card.Root
							key={problem.id}
							variant="outline"
							_hover={{
								borderColor: "teal.400",
								boxShadow: "md",
							}}
						>
							<Card.Body>
								<Card.Title fontSize="md" mb={2}>
									{problem.title}
								</Card.Title>

								<HStack justifyContent="space-between">
									<Text
										fontSize="sm"
										color={useColorModeValue("gray.600", "gray.400")}
									>
										Độ khó:{" "}
										<chakra.span
											fontWeight="medium"
											color={
												problem.difficulty === "Dễ"
													? "green.500"
													: problem.difficulty === "Trung bình"
														? "orange.500"
														: "red.500"
											}
										>
											{problem.difficulty}
										</chakra.span>
									</Text>

									<Button size="sm" variant="ghost" colorScheme="teal">
										Thử thách
									</Button>
								</HStack>

								<Wrap mt={2}>
									{problem.tags.map((tag) => (
										<WrapItem key={tag}>
											<Tag.Root size="sm">
												<Tag.Label>{tag}</Tag.Label>
											</Tag.Root>
										</WrapItem>
									))}
								</Wrap>
							</Card.Body>
						</Card.Root>
					))}
				</SimpleGrid>
			</Container>
		</Box>
	);
};

// --- END: Page Specific Components ---

// Main Home Page Component
function HomePage() {
	const showSidebars = useBreakpointValue({ base: false, lg: true });

	return (
		<Container maxW="container.2xl" py={6} px={{ base: 4, md: 6 }}>
			<StatsGamificationSection />
			<Grid
				templateAreas={
					showSidebars
						? `"main-content main-content aside"`
						: `"main-content main-content main-content"`
				}
				gridTemplateColumns={showSidebars ? "280px 1fr 280px" : "1fr"}
				gap={6}
			>
				<GridItem area="main-content">
					<VStack borderSpacing={8} align="stretch">
						<Suspense fallback={<ProblemsTableSkeleton />}>
							<ProblemsTable />
						</Suspense>
					</VStack>
				</GridItem>

				{showSidebars && (
					<GridItem area="aside">
						<RightSidebar />
					</GridItem>
				)}
			</Grid>
			<PersonalizedRecommendationsSection />

			{/* Sections that can appear below the main grid */}
		</Container>
	);
}
export const Route = createFileRoute("/_home/home")({
	validateSearch: zodValidator(problemQuerySchema),
	loaderDeps: ({ search }) => search,
	async loader({ context, deps }) {
		context.queryClient.prefetchQuery(getAllProblemsQueryOptions(deps));
		context.queryClient.prefetchQuery(getAllTagsQueryOptions());
	},
	component: HomePage,
});
