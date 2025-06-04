import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import {
	Avatar,
	Badge,
	Box,
	Button,
	Card,
	Container,
	Flex,
	Grid,
	GridItem,
	HStack,
	Heading,
	Icon,
	Image,
	SimpleGrid,
	Stack,
	Text,
	VStack,
	chakra,
	useBreakpointValue,
} from "@chakra-ui/react";
import { } from "@tanstack/react-router";
import type React from "react"; // Ensure React is imported
import { FaCrown, FaMedal } from "react-icons/fa"; // For medals
import {
	FiActivity,
	FiArrowRight,
	FiAward,
	FiBarChart2,
	FiCalendar,
	FiClock,
	FiTrendingUp,
	FiUsers,
} from "react-icons/fi";

// --- START: Reusable Header ---

// --- END: Reusable Header ---

// --- START: Main Banner ---

// --- END: Main Banner ---

// --- START: Contest Stats Overview ---
interface StatCardProps {
    title: string;
    value: string;
    icon?: React.ElementType;
    avatar?: string;
}
const StatCard = ({ title, value, icon, avatar }: StatCardProps) => {
    const cardBg = { "base": "white", "_dark": "gray.700" };
    return (
        <Flex
            alignItems="center"
            justifyContent="space-between"
            p={4}
            bg={cardBg}
            borderRadius="md"
            boxShadow="md"
            bgGradient="linear(to-br, teal.50, gray.50)"
            _dark={{ bgGradient: "linear(to-br, gray.700, gray.800)" }}
            transition="all 0.2s"
            _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}
        >
            <VStack alignItems="flex-start" gap={0}>
                <Text fontSize="sm" color={{ "base": "gray.600", "_dark": "gray.400" }}>
                    {title}
                </Text>
                <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color={{ "base": "gray.800", "_dark": "white" }}
                >
                    {value}
                </Text>
            </VStack>
            {icon && <Icon as={icon} boxSize={6} color="teal.500" />}
            {avatar && (
                <Avatar.Root size="sm">
                    <Avatar.Image src={avatar} alt={title.split(" ").pop()} />
                    <Avatar.Fallback name={title.split(" ").pop()} />
                </Avatar.Root>
            )}
        </Flex>
    );
};

const ContestStatsOverview = () => {
    const stats: StatCardProps[] = [
        {
            title: "Xếp hạng toàn cầu",
            value: "#1234",
            avatar: "https://via.placeholder.com/30?text=U",
        },
        { title: "Rating", value: "1856", icon: FiTrendingUp },
        { title: "Cuộc thi đã tham gia", value: "25", icon: FiAward },
        { title: "Xếp hạng trung bình", value: "450", icon: FiBarChart2 },
    ];
    return (
        <Box pt={8}>
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={5}>
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </SimpleGrid>
        </Box>
    );
};
// --- END: Contest Stats Overview ---

// --- START: Featured Contest ---
const FeaturedContestCard = () => {
    return (
        <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="xl"
            minH="300px"
            bgImage="url('https://placewaifu.com/image/800/300')"
            bgSize="cover"
            backgroundPosition="center"
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={{ base: 6, md: 8 }}
            transition="transform 0.3s ease-out, box-shadow 0.3s ease-out"
            _hover={{ transform: "scale(1.02)", boxShadow: "2xl" }}
        >
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bgGradient="linear(to-t, blackAlpha.800 20%, blackAlpha.500 50%, transparent)"
            />
            <VStack
                gap={3}
                alignItems="flex-start"
                position="relative"
                zIndex={1}
                color="white"
            >
                <Badge colorScheme="red" variant="solid" fontSize="xs">
                    NỔI BẬT
                </Badge>
                <Heading as="h2" size={{ base: "lg", md: "xl" }}>
                    CodePro Championship 2025
                </Heading>
                <Text fontSize={{ base: "sm", md: "md" }} maxW="2xl">
                    Giải đấu lập trình lớn nhất năm với tổng giải thưởng lên đến 100 triệu
                    đồng. Thể hiện bản lĩnh và tranh tài cùng các coder hàng đầu!
                </Text>
                <HStack gap={4} color="gray.200" fontSize="sm" wrap="wrap">
                    <HStack>
                        <Icon as={FiCalendar} mr={1} />
                        <span>15 - 20 Tháng 8, 2025</span>
                    </HStack>
                    <HStack>
                        <Icon as={FiUsers} mr={1} />
                        <span>Đã đăng ký: 1500+</span>
                    </HStack>
                </HStack>
                <Button colorScheme="yellow" mt={2}>
                    Xem Chi Tiết
                    <FiArrowRight />
                </Button>
            </VStack>
        </Box>
    );
};
// --- END: Featured Contest ---

// --- START: Contest List ---
interface Contest {
    id: string;
    name: string;
    imageUrl: string;
    status: "ongoing" | "upcoming";
    timeInfo: string; // Remaining or Start time
    participants: number;
    type?: "Weekly" | "Biweekly" | "Monthly";
}

const mockOngoingContests: Contest[] = [
    {
        id: "og1",
        name: "Thử Thách Hàng Tuần #23",
        imageUrl: "https://placewaifu.com/image/300/200?t=og1",
        status: "ongoing",
        timeInfo: "Còn 2 ngày 5 giờ",
        participants: 1205,
        type: "Weekly",
    },
    {
        id: "og2",
        name: "Đấu Trường DP Mùa Xuân",
        imageUrl: "https://placewaifu.com/image/300/200?t=og2",
        status: "ongoing",
        timeInfo: "Kết thúc sau 12 giờ",
        participants: 876,
    },
];

const mockUpcomingContests: Contest[] = [
    {
        id: "uc1",
        name: "Giải Đồ Thị Mở Rộng",
        imageUrl: "https://placewaifu.com/image/400/250?t=uc1",
        status: "upcoming",
        timeInfo: "Bắt đầu: 25/05/2025 09:00",
        participants: 560,
        type: "Monthly",
    },
    {
        id: "uc2",
        name: "Code Challenge Tháng 6",
        imageUrl: "https://placewaifu.com/image/400/250?t=uc2",
        status: "upcoming",
        timeInfo: "Bắt đầu: 01/06/2025 19:00",
        participants: 340,
    },
    {
        id: "uc3",
        name: "Summer Sprint Coding",
        imageUrl: "https://placewaifu.com/image/400/250?t=uc3",
        status: "upcoming",
        timeInfo: "Bắt đầu: 10/06/2025 14:00",
        participants: 0,
        type: "Biweekly",
    },
];

const ContestCard = ({ contest }: { contest: Contest }) => {
    const cardBg = { "base": "white", "_dark": "gray.750" };
    const badgeColor =
        contest.type === "Weekly"
            ? "pink"
            : contest.type === "Biweekly"
                ? "purple"
                : "blue";
    return (
        <Card.Root // Card được namespaced, giả sử Card.Root là component gốc
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
            bg={cardBg} // cardBg được giả định đã xử lý light/dark mode nếu cần
            boxShadow="md"
            transition="all 0.2s"
            _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
        >
            <Image
                objectFit="cover"
                maxW={{ base: "100%", sm: "200px" }}
                src={contest.imageUrl}
                alt={contest.name}
            />
            <Stack flex="1">
                {" "}
                {/* Stack vẫn được sử dụng cho layout */}
                <Card.Body>
                    {" "}
                    {/* CardBody được namespaced */}
                    {contest.type && (
                        <Badge colorPalette={badgeColor} mb={1}>
                            {" "}
                            {/* colorScheme -> colorPalette */}
                            {contest.type}
                        </Badge>
                    )}
                    <Heading size="md" lineClamp={2}>
                        {" "}
                        {/* noOfLines -> lineClamp */}
                        {contest.name}
                    </Heading>
                    <HStack
                        color={{ _light: "gray.600", _dark: "gray.300" }} // useColorModeValue -> object syntax
                        fontSize="sm"
                        mt={2}
                    >
                        <Icon as={contest.status === "ongoing" ? FiClock : FiCalendar} />
                        <Text>{contest.timeInfo}</Text>
                    </HStack>
                    <HStack
                        color={{ _light: "gray.600", _dark: "gray.300" }} // useColorModeValue -> object syntax
                        fontSize="sm"
                        mt={1}
                    >
                        <Icon as={FiUsers} />
                        <Text>{contest.participants} người tham gia</Text>
                    </HStack>
                </Card.Body>
                <Card.Footer pt={0}>
                    {" "}
                    {/* CardFooter được namespaced */}
                    {contest.status === "ongoing" ? (
                        <Button
                            variant="solid"
                            colorPalette="green" // colorScheme -> colorPalette
                            size="sm"
                        >
                            Tham Gia Ngay
                            <Icon as={FiArrowRight} ml={2} />{" "}
                            {/* rightIcon được chuyển thành Icon con */}
                        </Button>
                    ) : (
                        <Button variant="outline" colorPalette="teal" size="sm">
                            {" "}
                            {/* colorScheme -> colorPalette */}
                            Đăng Ký
                        </Button>
                    )}
                </Card.Footer>
            </Stack>
        </Card.Root>
    );
};

const ContestListSection = () => {
    return (
        <VStack gap={10} align="stretch">
            <Box>
                <HStack mb={4}>
                    <Icon as={FiClock} boxSize={6} color="orange.500" />
                    <Heading size="lg">Đang Diễn Ra</Heading>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} gap={6}>
                    {mockOngoingContests.map((contest) => (
                        <ContestCard key={contest.id} contest={contest} />
                    ))}
                </SimpleGrid>
            </Box>
            <Box>
                <HStack mb={4}>
                    <Icon as={FiCalendar} boxSize={6} color="blue.500" />
                    <Heading size="lg">Sắp Diễn Ra</Heading>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} gap={6}>
                    {mockUpcomingContests.map((contest) => (
                        <ContestCard key={contest.id} contest={contest} />
                    ))}
                </SimpleGrid>
            </Box>
        </VStack>
    );
};
// --- END: Contest List ---

// --- START: Right Sidebar ---
const TopRankersSidebar = () => {
    const rankers = [
        {
            id: "r1",
            name: "Master Coder",
            avatar: "https://placewaifu.com/image/50/50?t=r1",
            problemsSolved: 350,
            rating: 2800,
            medalColor: "gold",
        },
        {
            id: "r2",
            name: "Algo Virtuoso",
            avatar: "https://placewaifu.com/image/50/50?t=r2",
            problemsSolved: 320,
            rating: 2750,
            medalColor: "silver",
        },
        {
            id: "r3",
            name: "Logic Ninja",
            avatar: "https://placewaifu.com/image/50/50?t=r3",
            problemsSolved: 300,
            rating: 2690,
            medalColor: "#CD7F32" /* Bronze */,
        },
    ];
    return (
        <Box
            bg={{ "base": "white", "_dark": "gray.800" }}
            borderRadius="lg"
            boxShadow="lg"
            overflow="hidden"
        >
            <Box
                h="150px"
                bgImage="url('https://placewaifu.com/image/400/200?t=rankbg')"
                bgSize="cover"
                backgroundPosition="center"
                position="relative"
            >
                <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    bgGradient="linear(to-t, blackAlpha.700, transparent)"
                    alignItems="flex-end"
                    p={4}
                >
                    <HStack color="white">
                        <Icon as={FaCrown} boxSize={6} color="yellow.400" />
                        <Heading size="md">Top Cao Thủ</Heading>
                    </HStack>
                </Flex>
            </Box>
            <VStack gap={3} p={4} align="stretch">
                {rankers.map((ranker, _index) => (
                    <Flex
                        key={ranker.id}
                        alignItems="center"
                        p={2}
                        borderRadius="md"
                        _hover={{
                            bg: { "base": "gray.100", "_dark": "gray.700" },
                        }}
                    >
                        <Icon as={FaMedal} color={ranker.medalColor} boxSize={5} mr={3} />
                        <Avatar.Root size="sm" mr={3}>
                            <Avatar.Image src={ranker.avatar} alt={ranker.name} />
                            <Avatar.Fallback name={ranker.name} />
                        </Avatar.Root>
                        <Box flex="1">
                            <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
                                {ranker.name}
                            </Text>
                            <Text
                                fontSize="xs"
                                color={{ "base": "gray.500", "_dark": "gray.400" }}
                            >
                                Rating: {ranker.rating}
                            </Text>
                        </Box>
                        <Text fontSize="xs" fontWeight="bold" color="teal.500">
                            {ranker.problemsSolved} bài
                        </Text>
                    </Flex>
                ))}
                <Button variant="outline" colorScheme="teal" size="sm" mt={2}>
                    Xem Bảng Xếp Hạng
                </Button>
            </VStack>
        </Box>
    );
};

const RecentResultsSidebar = () => {
    const results = [
        {
            id: "res1",
            contestName: "Thử Thách Hàng Tuần #22",
            rank: 5,
            ratingChange: 50,
            solved: 4,
        },
        {
            id: "res2",
            contestName: "Giải Đồ Thị Cơ Bản",
            rank: 12,
            ratingChange: -15,
            solved: 3,
        },
        {
            id: "res3",
            contestName: "Speed Coding #5",
            rank: 2,
            ratingChange: 75,
            solved: 5,
        },
    ];
    return (
        <Box
            bg={{ "base": "white", "_dark": "gray.800" }}
            borderRadius="lg"
            boxShadow="lg"
            overflow="hidden"
            mt={6}
        >
            <Box
                h="120px"
                bgImage="url('https://placewaifu.com/image/400/200?t=resbg')"
                bgSize="cover"
                backgroundPosition="center"
                position="relative"
            >
                <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    bgGradient="linear(to-t, blackAlpha.600, transparent)"
                    alignItems="flex-end"
                    p={4}
                >
                    <HStack color="white">
                        <Icon as={FiActivity} boxSize={5} />
                        <Heading size="md">Kết Quả Gần Đây</Heading>
                    </HStack>
                </Flex>
            </Box>
            <VStack gap={3} p={4} align="stretch">
                {results.map((result) => (
                    <Box
                        key={result.id}
                        p={2.5}
                        borderRadius="md"
                        bg={{ "base": "gray.50", "_dark": "gray.700" }}
                    >
                        <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
                            {result.contestName}
                        </Text>
                        <HStack justifyContent="space-between" mt={1}>
                            <Text
                                fontSize="xs"
                                color={{ "base": "gray.600", "_dark": "gray.400" }}
                            >
                                Hạng: <chakra.span fontWeight="bold">{result.rank}</chakra.span>
                            </Text>
                            <Text
                                fontSize="xs"
                                color={result.ratingChange >= 0 ? "green.500" : "red.500"}
                            >
                                {result.ratingChange >= 0
                                    ? `+${result.ratingChange}`
                                    : result.ratingChange}{" "}
                                rating
                            </Text>
                            <Text
                                fontSize="xs"
                                color={{ "base": "gray.600", "_dark": "gray.400" }}
                            >
                                {result.solved} bài
                            </Text>
                        </HStack>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};
// --- END: Right Sidebar ---

// --- START: Contest Page Component ---
function ContestPage() {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const mainContentBg = { "base": "gray.50", "_dark": "gray.900" };

    return (
        <Box bg={mainContentBg}>
            <Header />
            <Container
                maxW="container.2xl"
                py={{ base: 4, md: 8 }}
                px={{ base: 4, md: 6 }}
            >
                <FeaturedContestCard />

                <ContestStatsOverview />

                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8} mt={8}>
                    <GridItem>
                        <ContestListSection />
                    </GridItem>
                    <GridItem>
                        <VStack
                            gap={6}
                            align="stretch"
                            position={{ lg: "sticky" }}
                            top={{ lg: "80px" }}
                        >
                            {" "}
                            {/* Sticky sidebar for desktop */}
                            <TopRankersSidebar />
                            <RecentResultsSidebar />
                        </VStack>
                    </GridItem>
                </Grid>
            </Container>
            <Footer /> {/* Assuming a generic footer component */}
        </Box>
    );
}
// --- END: Contest Page Component ---

export const Route = createFileRoute({
    // Adjust route as needed
    component: ContestPage,
});