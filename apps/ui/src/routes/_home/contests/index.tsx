import { getPublishContestQueryOptions } from "@/libs/queries/contests";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  Separator,
  SimpleGrid,
  Text,
  VStack,
  chakra,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ContestStatus } from "@repo/backend/contests/validations/enum";
import { ContestBrief } from "@repo/backend/contests/contests.service";
import { Link, createFileRoute } from "@tanstack/react-router";
import React from "react"; // Ensure React is imported
import { FaCrown, FaMedal } from "react-icons/fa"; // For medals

import {
  FiActivity,
  FiArrowRight,
  FiAward,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCode,
  FiPlayCircle,
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
  const cardBg = { base: "white", _dark: "gray.700" };
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
        <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>
          {title}
        </Text>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color={{ base: "gray.800", _dark: "white" }}
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import dayjs from "dayjs";
// --- START: Featured Contest ---
const FeaturedContestCard = ({ contest }: { contest: ContestBrief }) => {
  return (
    <Box
      position="relative"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      h={{ base: "280px", md: "320px" }} // Chiều cao cố định cho các card
      bgImage={`url(${contest.image || "https://placewaifu.com/image/800/600"})`}
      bgSize="cover"
      backgroundPosition="center"
      display="flex"
      flexDirection="column"
      justifyContent="flex-end"
      p={{ base: 5, md: 6 }}
      transition="transform 0.3s ease-out, box-shadow 0.3s ease-out"
      color="white"
    >
      {/* Lớp phủ gradient */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        background={"blackAlpha.600"}
      />
      <VStack
        gap={2}
        alignItems="flex-start"
        position="relative"
        zIndex={1}
        px={{ base: 4, md: 14 }}
      >
        <Badge colorScheme="red" variant="solid" fontSize="xs">
          NỔI BẬT
        </Badge>
        <Heading as="h3" size="md" lineClamp={2}>
          {contest.title}
        </Heading>
        <HStack gap={4} color="gray.200" fontSize="xs" wrap="wrap">
          <HStack>
            <Icon as={FiCalendar} />
            <span>{dayjs(contest.startTime).format("D MMMM YYYY HH:mm")}</span>
          </HStack>
          <HStack>
            <Icon as={FiUsers} />
            <span>{contest.totalParticipants}+ tham gia</span>
          </HStack>
        </HStack>
        <Button size="sm" colorScheme="yellow" mt={2} asChild>
          <Link to={`/contests/${contest.id}`}>
            Xem Chi Tiết
            <FiArrowRight />
          </Link>
        </Button>
      </VStack>
    </Box>
  );
};

// --- END: Định nghĩa kiểu dữ liệu và Component Card ---

// --- START: Component Slider chính ---
export const FeaturedContestsSlider = () => {
  const featuredContests = Route.useLoaderData().featuredContests;
  const navigationButtonStyles = {
    color: { base: "teal.600", _dark: "white" },
    bg: { base: "whiteAlpha.800", _dark: "blackAlpha.600" },
    _hover: { bg: { base: "white", _dark: "blackAlpha.800" } },
    borderRadius: "full",
    boxShadow: "lg",
  };

  if (!featuredContests || featuredContests.length === 0) {
    return null; // Không hiển thị gì nếu không có cuộc thi nổi bật
  }

  return (
    <Box position="relative" my={8}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next-featured",
          prevEl: ".swiper-button-prev-featured",
        }}
        style={{ paddingBottom: "40px" }} // Thêm padding dưới cho pagination
      >
        {featuredContests.map((contest) => (
          <SwiperSlide key={contest.id}>
            <FeaturedContestCard contest={contest} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <IconButton
        aria-label="Previous slide"
        className="swiper-button-prev-featured"
        position="absolute"
        left={{ base: 2, md: 4 }}
        top="50%"
        transform="translateY(-50%)"
        zIndex={10}
        {...navigationButtonStyles}
      >
        <FiChevronLeft />
      </IconButton>
      <IconButton
        aria-label="Next slide"
        className="swiper-button-next-featured"
        position="absolute"
        right={{ base: 2, md: 4 }}
        top="50%"
        transform="translateY(-50%)"
        zIndex={10}
        {...navigationButtonStyles}
      >
        <FiChevronRight />
      </IconButton>
    </Box>
  );
};

const ContestCard = ({ contest }: { contest: ContestBrief }) => {
  // Không cần useColorModeValue, sẽ áp dụng trực tiếp trong JSX

  const statusConfig = {
    ONGOING: {
      label: "Đang diễn ra",
      colorPalette: "green",
      icon: FiPlayCircle,
    },
    UPCOMING: { label: "Sắp diễn ra", colorPalette: "blue", icon: FiCalendar },
    FINISHED: {
      label: "Đã kết thúc",
      colorPalette: "gray",
      icon: FiCheckCircle,
    },
  };
  const status = React.useMemo(() => {
    if (contest.startTime > new Date()) {
      return "UPCOMING";
    }
    if (contest.endTime < new Date()) {
      return "FINISHED";
    }
    return "ONGOING";
  }, [contest.startTime, contest.endTime]);
  const currentStatus = statusConfig[status] || statusConfig.UPCOMING;

  const contestDuration = dayjs.duration(
    dayjs(contest.endTime).diff(dayjs(contest.startTime)),
  );
  const formattedDuration = contestDuration.humanize();

  return (
    <Flex
      bg={{ _light: "white", _dark: "gray.750" }} // useColorModeValue -> object syntax
      boxShadow="md"
      borderRadius="lg"
      overflow="hidden"
      direction={{ base: "column", md: "row" }}
      transition="all 0.3s"
      _hover={{
        boxShadow: "xl",
        transform: "translateY(-4px)",
      }}
      w="full"
      alignItems={{ md: "stretch" }}
    >
      <Box
        w={{ base: "100%", md: "220px" }}
        h={{ base: "150px", md: "auto" }}
        flexShrink={0}
      >
        <Image
          w="full"
          h="full"
          objectFit="cover"
          src={
            contest.image ||
            `https://placewaifu.com/image/400/300?id=${contest.id}`
          }
          alt={`Banner cuộc thi ${contest.title}`}
        />
      </Box>

      <Flex direction="column" p={5} flex="1">
        <VStack align="flex-start" gap={3} flex="1">
          {" "}
          {/* spacing -> gap */}
          <HStack gap={3}>
            {" "}
            {/* spacing -> gap */}
            <Badge
              colorPalette={currentStatus.colorPalette} // colorScheme -> colorPalette
              variant="solid"
              fontSize="xs"
              py={1}
              px={2.5}
              borderRadius="full"
            >
              <HStack>
                <Icon as={currentStatus.icon} />
                <Text>{currentStatus.label}</Text>
              </HStack>
            </Badge>
          </HStack>
          <Heading size="md" lineClamp={2} title={contest.title}>
            {" "}
            {/* noOfLines -> lineClamp */}
            {contest.title}
          </Heading>
          {contest.description && (
            <Text
              fontSize="sm"
              color={{ _light: "gray.600", _dark: "gray.300" }}
              lineClamp={2}
            >
              {" "}
              {/* noOfLines -> lineClamp, useColorModeValue -> object syntax */}
              {contest.description}
            </Text>
          )}
          <Separator my={2} /> {/* Divider -> Separator */}
          <HStack
            gap={{ base: 4, md: 6 }} // spacing -> gap
            color={{ _light: "gray.600", _dark: "gray.300" }} // useColorModeValue -> object syntax
            fontSize="sm"
            wrap="wrap"
          >
            <HStack title="Thời gian bắt đầu">
              <Icon as={FiCalendar} />
              <Text>
                {dayjs(contest.startTime).format("HH:mm, DD/MM/YYYY")}
              </Text>
            </HStack>
            <HStack title="Thời lượng">
              <Icon as={FiClock} />
              <Text>{formattedDuration}</Text>
            </HStack>
            <HStack title="Số bài toán">
              <Icon as={FiCode} />
              <Text>{contest.totalProblems} bài</Text>
            </HStack>
          </HStack>
        </VStack>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          mt={4}
          pt={4}
          borderTopWidth="1px"
          borderColor={{ _light: "gray.200", _dark: "gray.600" }} // useColorModeValue -> object syntax
        >
          <HStack>
            <Icon
              as={FiUsers}
              color={{ _light: "gray.600", _dark: "gray.300" }}
            />{" "}
            {/* useColorModeValue -> object syntax */}
            <Text fontSize="sm" fontWeight="medium">
              {contest.totalParticipants.toLocaleString("vi-VN")}
              <Text
                as="span"
                color={{ _light: "gray.600", _dark: "gray.300" }}
                fontWeight="normal"
              >
                {" "}
                người tham gia
              </Text>{" "}
              {/* useColorModeValue -> object syntax */}
            </Text>
          </HStack>

          {contest.status === "ONGOING" && (
            <Button colorPalette="green" size="sm">
              {" "}
              {/* colorScheme -> colorPalette, rightIcon bị loại bỏ */}
              Tham Gia Ngay
              <Icon as={FiArrowRight} ml={1.5} />{" "}
              {/* Icon được đặt làm con trực tiếp */}
            </Button>
          )}
          {contest.status === "UPCOMING" && (
            <Button variant="outline" colorPalette="teal" size="sm">
              {" "}
              {/* colorScheme -> colorPalette */}
              Đăng Ký
            </Button>
          )}
          {contest.status === "ENDED" && (
            <Button disabled variant="outline" colorPalette="gray" size="sm">
              {" "}
              {/* isDisabled -> disabled, colorScheme -> colorPalette */}
              Xem kết quả
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

const ContestListSection = () => {
  const { ongoingContests, upcomingContests } = Route.useLoaderData();
  return (
    <VStack gap={10} align="stretch">
      <Box>
        <HStack mb={4}>
          <Icon as={FiClock} boxSize={6} color="orange.500" />
          <Heading size="lg">Đang Diễn Ra</Heading>
        </HStack>
        <SimpleGrid columns={{ base: 1, md: 1 }} gap={6}>
          {ongoingContests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </SimpleGrid>
      </Box>
      <Box>
        <HStack mb={4}>
          <Icon as={FiCalendar} boxSize={6} color="blue.500" />
          <Heading size="lg">Sắp Diễn Ra</Heading>
        </HStack>
        <SimpleGrid columns={{ base: 1, md: 1 }} gap={6}>
          {upcomingContests.map((contest) => (
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
      bg={{ base: "white", _dark: "gray.800" }}
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
              bg: { base: "gray.100", _dark: "gray.700" },
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
                color={{ base: "gray.500", _dark: "gray.400" }}
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
      bg={{ base: "white", _dark: "gray.800" }}
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
            bg={{ base: "gray.50", _dark: "gray.700" }}
          >
            <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
              {result.contestName}
            </Text>
            <HStack justifyContent="space-between" mt={1}>
              <Text
                fontSize="xs"
                color={{ base: "gray.600", _dark: "gray.400" }}
              >
                Hạng: <chakra.span fontWeight="bold">{result.rank}</chakra.span>
              </Text>
              <Text
                fontSize="xs"
                color={result.ratingChange >= 0 ? "green.500" : "red.500"}
              >
                {result.ratingChange >= 0
                  ? `+${result.ratingChange}`
                  : result.ratingChange}
                rating
              </Text>
              <Text
                fontSize="xs"
                color={{ base: "gray.600", _dark: "gray.400" }}
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
  const mainContentBg = { base: "gray.50", _dark: "gray.900" };

  return (
    <Box bg={mainContentBg}>
      <Container
        maxW="container.2xl"
        py={{ base: 4, md: 8 }}
        px={{ base: 4, md: 6 }}
      >
        <FeaturedContestsSlider />

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
              {/* Sticky sidebar for desktop */}
              <TopRankersSidebar />
              <RecentResultsSidebar />
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
// --- END: Contest Page Component ---

export const Route = createFileRoute("/_home/contests/")({
  // Adjust route as needed
  component: ContestPage,
  loader: async ({ context }) => {
    const p1 = context.queryClient.ensureQueryData(
      getPublishContestQueryOptions({
        isFeatured: true,
        page: 1,
        pageSize: 10,
        orderBy: "startTime",
      }),
    );
    const p2 = context.queryClient.ensureQueryData(
      getPublishContestQueryOptions({
        isFeatured: undefined,
        page: 1,
        pageSize: 5,
        orderBy: "startTime",

        status: ContestStatus.ACTIVE,
        isAfter: new Date(),
      }),
    );
    const p3 = context.queryClient.ensureQueryData(
      getPublishContestQueryOptions({
        isFeatured: undefined,
        page: 1,
        pageSize: 5,
        orderBy: "startTime",
        status: ContestStatus.ACTIVE,
        isBefore: new Date(),
      }),
    );
    const [featuredContests, ongoingContests, upcomingContests] =
      await Promise.all([p1, p2, p3]);
    return {
      featuredContests: featuredContests.data,
      ongoingContests: ongoingContests.data,
      upcomingContests: upcomingContests.data,
    };
  },
});
