import PendingPage from "@/components/common/PendingPage";
import { trpc } from "@/libs/tanstack-query/root-provider";
import { trpcClient } from "@/libs/trpc";
import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  List,
  Menu,
  Pagination,
  Separator,
  SimpleGrid,
  Stack,
  Tabs,
  Tag,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import { PostBrief } from "@repo/backend/posts/postService";
import { getPostQuerySchema } from "@repo/backend/posts/validations/index";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import dayjs from "dayjs";
import { PageChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/pagination/namespace";
import React from "react";
import { FaAward, FaCrown, FaMedal, FaRegCommentDots } from "react-icons/fa";
import {
  FiAward,
  FiBookOpen,
  FiBookmark,
  FiCheckSquare,
  FiClock,
  FiCode,
  FiEdit,
  FiEye,
  FiFilter,
  FiList,
  FiMessageSquare,
  FiMoreHorizontal,
  FiSearch,
  FiShare2,
  FiShield,
  FiTag as FiTagIcon,
  FiThumbsUp,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

// --- START: Sample Data ---

const communityStats = {
  members: "15,234",
  posts: "45,678",
};

const topContributors = [
  {
    id: "tc1",
    name: "Lập Trình Viên Pro",
    avatarUrl: "https://placewaifu.com/image/32/32?t=tc1",
    contributions: 500,
    rating: 2850,
    medal: "gold" as "gold" | "silver" | "bronze",
  },
  {
    id: "tc2",
    name: "Thuật Toán Gia",
    avatarUrl: "https://placewaifu.com/image/32/32?t=tc2",
    contributions: 450,
    rating: 2700,
    medal: "silver" as "gold" | "silver" | "bronze",
  },
  {
    id: "tc3",
    name: "Code Gõ Nhanh",
    avatarUrl: "https://placewaifu.com/image/32/32?t=tc3",
    contributions: 420,
    rating: 2650,
    medal: "bronze" as "gold" | "silver" | "bronze",
  },
];

const hotTopicsData = [
  {
    id: "ht1",
    title: "Tối ưu hóa truy vấn với Segment Tree",
    comments: 120,
    views: 3500,
    imageUrl: "https://placewaifu.com/image/80/60?t=ht1",
  },
  {
    id: "ht2",
    title: "Thảo luận về đề thi ICPC World Finals 2025",
    comments: 95,
    views: 2800,
    imageUrl: "https://placewaifu.com/image/80/60?t=ht2",
  },
  {
    id: "ht3",
    title: "Chia sẻ kinh nghiệm học Machine Learning",
    comments: 78,
    views: 2200,
    imageUrl: "https://placewaifu.com/image/80/60?t=ht3",
  },
];

const learningResourcesData = [
  {
    id: "lr1",
    title: "Giới thiệu về Cấu trúc dữ liệu và Giải thuật",
    updated: "2 ngày trước",
    icon: FiBookOpen,
  },
  {
    id: "lr2",
    title: "Kỹ thuật Quy hoạch động nâng cao",
    updated: "5 ngày trước",
    icon: FiTrendingUp,
  },
  {
    id: "lr3",
    title: "Các thuật toán đồ thị thường gặp",
    updated: "1 tuần trước",
    icon: FiCode,
  },
];
// --- END: Sample Data ---

// --- START: Main Banner ---
const CommunityBanner = () => {
  return (
    <Box
      position="relative"
      minHeight={{ base: "200px", md: "300px" }}
      bgImage="url('https://placewaifu.com/image/1200/400?t=community')"
      bgSize="cover"
      backgroundPosition="center"
      borderRadius="lg"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={{ base: 6, md: 10 }}
      textAlign="center"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgGradient="linear(to-r, blackAlpha.600, blackAlpha.300, blackAlpha.600)"
      />
      <VStack gap={4} position="relative" zIndex={1} color="white">
        <Heading as="h1" size={{ base: "xl", md: "2xl" }} fontWeight="bold">
          Cộng Đồng Arugo
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} maxW="xl">
          Chia sẻ kiến thức, học hỏi và phát triển cùng nhau trong cộng đồng lập
          trình viên đam mê.
        </Text>
        <Button
          colorScheme="teal"
          size="lg"
          _hover={{ transform: "scale(1.05)", shadow: "lg" }}
        >
          <FiEdit />
          Tạo Bài Viết Mới
        </Button>
      </VStack>
    </Box>
  );
};
// --- END: Main Banner ---

// --- START: Filters and Search ---
const PostFilters = () => {
  const { topics } = Route.useLoaderData();
  const categories = React.useMemo<
    { value: string; label: string; icon?: React.ElementType }[]
  >(() => {
    return [
      { value: "all", label: "Tất cả", icon: FiList },
      ...topics.map((topic) => ({
        value: topic.id.toString(),
        label: topic.name,
      })),
    ];
  }, [topics]);

  const navigate = useNavigate();
  const { topicId = "all" } = Route.useLoaderDeps();

  return (
    <VStack gap={4} align="stretch" my={6}>
      <Stack direction={{ base: "column", md: "row" }} gap={3}>
        <InputGroup
          flex={1}
          startElement={<Icon as={FiSearch} color="gray.400" />}
        >
          <Input placeholder="Tìm kiếm bài viết..." variant="subtle" />
        </InputGroup>

        <Button
          variant="outline"
          colorScheme="teal"
          w={{ base: "full", md: "auto" }}
        >
          <FiFilter /> Lọc
        </Button>
      </Stack>
      <Tabs.Root
        variant="line"
        colorPalette="teal"
        size="sm"
        value={topicId?.toString() ?? "all"}
        onValueChange={(details) =>
          navigate({
            to: "/community",
            search: {
              topicId:
                details.value === "all" ? undefined : Number(details.value),
            },
          })
        }
      >
        <Tabs.List overflowX="auto" pb={1}>
          {categories.map((cat) => (
            <Tabs.Trigger
              value={cat.value}
              key={cat.value}
              mr={2}
              whiteSpace="nowrap"
            >
              {cat.icon && <Icon as={cat.icon} mr={1.5} />} {cat.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>
    </VStack>
  );
};
// --- END: Filters and Search ---

// --- START: Post Card ---
const PostCard = ({ post }: { post: PostBrief }) => {
  const rankColors = {
    Expert: "blue.500",
    Intermediate: "green.500",
    Beginner: "gray.500",
  };
  const cardBg = { base: "white", _dark: "gray.800" };

  return (
    <Card.Root // Card -> Card.Root
      variant="outline"
      bg={cardBg}
      boxShadow="sm"
      transition="all 0.2s"
      _hover={{ boxShadow: "md", transform: "scale(1.01)" }}
    >
      <Card.Body bg={cardBg}>
        {/* CardBody -> Card.Body */}
        <Flex direction={{ base: "column", sm: "row" }} gap={4}>
          <VStack
            alignItems={{ base: "flex-start", sm: "center" }}
            gap={2}
            w={{ base: "full", sm: "120px" }}
            flexShrink={0}
          >
            {/* Avatar đã ở dạng v3 */}
            <Avatar.Root size="md">
              <Avatar.Image
                src={
                  post.author.avatar || "https://placewaifu.com/image/300/300"
                }
                alt={post.author.name}
              />
              <Avatar.Fallback
                name={post.author.name.substring(0, 2).toUpperCase()}
              />
            </Avatar.Root>
            <VStack gap={0} alignItems={{ base: "flex-start", sm: "center" }}>
              <Text fontSize="sm" fontWeight="bold" lineClamp={1}>
                {post.author.name}
              </Text>
              <Text
                fontSize="xs"
                color={rankColors["Expert"]}
                fontWeight="medium"
              >
                {"Expert"}
              </Text>
            </VStack>
          </VStack>
          <Separator // Divider -> Separator
            orientation={useBreakpointValue({
              // useBreakpointValue vẫn được giữ lại
              base: "horizontal",
              sm: "vertical",
            })}
            h={{ sm: "auto" }} // Giữ nguyên nếu Separator hỗ trợ
          />
          <VStack align="stretch" gap={2} flex={1}>
            <Heading
              as="h3"
              size="md"
              lineClamp={2} // noOfLines -> lineClamp
              _hover={{ color: "teal.500", cursor: "pointer" }}
            >
              <Link to={"/community/post/$slug"} params={{ slug: post.slug }}>
                {post.title}
              </Link>
            </Heading>
            <Wrap gap={1.5}>
              {post?.tags?.map((tag) => (
                <WrapItem key={tag}>
                  {/* Tag đã ở dạng v3 */}
                  <Tag.Root
                    size="sm"
                    variant="subtle"
                    colorPalette="gray" // colorScheme đã là colorPalette
                  >
                    <Tag.Label>#{tag}</Tag.Label>
                  </Tag.Root>
                </WrapItem>
              ))}
            </Wrap>
            <Text
              fontSize="sm"
              color={{ _light: "gray.600", _dark: "gray.300" }} // useColorModeValue -> object syntax
              lineClamp={2} // noOfLines -> lineClamp
            >
              {post.shortDescription}
            </Text>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              mt={2}
              wrap="wrap"
              gap={2}
            >
              <HStack
                gap={3}
                color={{
                  _light: "gray.500",
                  _dark: "gray.400",
                }} // useColorModeValue -> object syntax
                fontSize="xs"
              >
                <HStack gap={0.5}>
                  <Icon as={FiThumbsUp} /> <Text>400</Text>
                </HStack>
                <HStack gap={0.5}>
                  <Icon as={FaRegCommentDots} /> <Text>10</Text>
                </HStack>
                <HStack gap={0.5}>
                  <Icon as={FiEye} /> <Text>{200}</Text>
                </HStack>
                <HStack gap={0.5}>
                  <Icon as={FiClock} />{" "}
                  <Text>
                    {dayjs(post.createdAt).format("HH:mm DD/MM/YYYY")}
                  </Text>
                </HStack>
              </HStack>
              <HStack gap={1}>
                <IconButton aria-label="Lưu bài viết" variant="ghost" size="sm">
                  <FiBookmark /> {/* icon prop -> children */}
                </IconButton>
                <IconButton aria-label="Chia sẻ" variant="ghost" size="sm">
                  <FiShare2 /> {/* icon prop -> children */}
                </IconButton>
                <Menu.Root>
                  {/* Menu -> Menu.Root */}
                  <Menu.Trigger asChild>
                    {/* MenuButton -> Menu.Trigger asChild */}
                    <IconButton variant="ghost" size="sm" aria-label="Tùy chọn">
                      <FiMoreHorizontal /> {/* icon prop -> children */}
                    </IconButton>
                  </Menu.Trigger>
                  <Menu.Positioner>
                    {/* Thêm Positioner */}
                    <Menu.Content>
                      {/* MenuList -> Menu.Content */}
                      <Menu.Item value="report">Báo cáo</Menu.Item>
                      {/* MenuItem -> Menu.Item, thêm value */}
                    </Menu.Content>
                  </Menu.Positioner>
                </Menu.Root>
              </HStack>
            </Flex>
          </VStack>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};
// --- END: Post Card ---

// --- START: Right Sidebar Components ---
const SidebarSection = ({
  title,
  icon,
  children,
  ...rest
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
} & BoxProps) => (
  <Box
    bg={{ base: "white", _dark: "gray.800" }}
    p={4}
    borderRadius="md"
    boxShadow="sm"
    {...rest}
  >
    {title && (
      <HStack mb={3}>
        {icon && <Icon as={icon} color="teal.500" boxSize={5} />}
        <Heading size="sm" color={{ base: "gray.700", _dark: "gray.200" }}>
          {title}
        </Heading>
      </HStack>
    )}
    {children}
  </Box>
);

const CommunityStatsCard = () => (
  <SidebarSection title="Thống kê cộng đồng">
    <SimpleGrid columns={2} gap={3}>
      <Flex
        direction="column"
        p={3}
        bg="blue.50"
        _dark={{ bg: "blue.800" }}
        borderRadius="md"
        alignItems="center"
      >
        <Icon as={FiUsers} boxSize={6} color="blue.500" mb={1} />
        <Text fontSize="xs" color="blue.600" _dark={{ color: "blue.200" }}>
          Thành viên
        </Text>
        <Text
          fontWeight="bold"
          fontSize="lg"
          color="blue.700"
          _dark={{ color: "blue.100" }}
        >
          {communityStats.members}
        </Text>
      </Flex>
      <Flex
        direction="column"
        p={3}
        bg="green.50"
        _dark={{ bg: "green.800" }}
        borderRadius="md"
        alignItems="center"
      >
        <Icon as={FiMessageSquare} boxSize={6} color="green.500" mb={1} />
        <Text fontSize="xs" color="green.600" _dark={{ color: "green.200" }}>
          Bài viết
        </Text>
        <Text
          fontWeight="bold"
          fontSize="lg"
          color="green.700"
          _dark={{ color: "green.100" }}
        >
          {communityStats.posts}
        </Text>
      </Flex>
    </SimpleGrid>
  </SidebarSection>
);

const TopContributorsCard = () => {
  const medalIcons = {
    gold: FaCrown,
    silver: FaMedal,
    bronze: FaAward, // Using FiAward for bronze or a different medal icon
  };
  const medalColors = {
    gold: "yellow.400",
    silver: "gray.400",
    bronze: "orange.400",
  };

  return (
    <SidebarSection title="Top đóng góp" icon={FiAward}>
      <VStack gap={3} align="stretch">
        {topContributors.map((user, _index) => (
          <Flex
            key={user.id}
            alignItems="center"
            p={1.5}
            borderRadius="md"
            _hover={{
              bg: { base: "gray.50", _dark: "gray.700" },
            }}
          >
            <Icon
              as={medalIcons[user.medal]}
              color={medalColors[user.medal]}
              boxSize={5}
              mr={2}
            />
            <Avatar.Root size="sm" mr={2}>
              <Avatar.Image src={user.avatarUrl} alt={user.name} />
              <Avatar.Fallback name={user.name.substring(0, 2).toUpperCase()} />
            </Avatar.Root>
            <Box flex={1}>
              <Text fontSize="sm" fontWeight="medium" lineClamp={1}>
                {user.name}
              </Text>
              <Text
                fontSize="xs"
                color={{ base: "gray.500", _dark: "gray.400" }}
              >
                {user.rating} rating
              </Text>
            </Box>
            <Badge colorScheme="teal" variant="subtle" fontSize="0.7em">
              {user.contributions} posts
            </Badge>
          </Flex>
        ))}
        <Button variant="outline" colorScheme="teal" size="xs" mt={1}>
          Xem thêm
        </Button>
      </VStack>
    </SidebarSection>
  );
};

const PopularTagsCard = () => {
  const { topTags } = Route.useLoaderData();
  return (
    <SidebarSection title="Tags phổ biến" icon={FiTagIcon}>
      <Wrap gap={1.5}>
        {topTags.map((tag) => (
          <WrapItem key={tag.tag}>
            <Tag.Root
              size="sm"
              variant="solid"
              colorPalette="gray"
              cursor="pointer"
              _hover={{ bg: "teal.500", color: "white" }}
            >
              <Tag.Label>
                {tag.tag} ({tag.count})
              </Tag.Label>
            </Tag.Root>
          </WrapItem>
        ))}
      </Wrap>
    </SidebarSection>
  );
};

const HotTopicsCard = () => (
  <SidebarSection title="Chủ đề hot" icon={FiTrendingUp}>
    <VStack gap={3} align="stretch">
      {hotTopicsData.map((topic) => (
        <Flex
          key={topic.id}
          gap={3}
          p={1.5}
          borderRadius="md"
          _hover={{
            bg: { base: "gray.50", _dark: "gray.700" },
            transform: "scale(1.02)",
          }}
          transition="transform 0.2s"
        >
          <Image
            src={topic.imageUrl}
            alt={topic.title}
            boxSize="60px"
            borderRadius="md"
            objectFit="cover"
            _hover={{ transform: "scale(1.05)" }}
            transition="transform 0.2s ease-out"
          />
          <Box flex={1}>
            <Text
              fontSize="sm"
              fontWeight="medium"
              lineClamp={2}
              _hover={{ color: "teal.500", cursor: "pointer" }}
            >
              {topic.title}
            </Text>
            <HStack
              gap={2}
              fontSize="xs"
              color={{ base: "gray.500", _dark: "gray.400" }}
              mt={1}
            >
              <HStack gap={0.5}>
                <Icon as={FaRegCommentDots} /> <Text>{topic.comments}</Text>
              </HStack>
              <HStack gap={0.5}>
                <Icon as={FiEye} /> <Text>{topic.views}</Text>
              </HStack>
            </HStack>
          </Box>
        </Flex>
      ))}
    </VStack>
  </SidebarSection>
);

const CommunityGuidelinesCard = () => (
  <SidebarSection
    title="Nguyên tắc cộng đồng"
    icon={FiShield}
    bgGradient="linear(to-br, blue.50, indigo.50)"
    _dark={{ bgGradient: "linear(to-br, blue.900, indigo.800)" }}
  >
    <List.Root gap={1.5}>
      {/* List -> List.Root, prop 'gap' được giữ nguyên */}
      {[
        "Tôn trọng và hỗ trợ thành viên khác.",
        "Không spam hoặc đăng nội dung quảng cáo.",
        "Chia sẻ kiến thức một cách rõ ràng và xây dựng.",
        "Giữ gìn môi trường học tập tích cực.",
      ].map((rule, _index) => (
        <List.Item // ListItem -> List.Item
          key={rule}
          fontSize="sm"
          display="flex"
          alignItems="center"
        >
          <List.Indicator // ListIcon -> List.Icon
            as={FiCheckSquare}
            color="green.500"
            mr={2} // Thêm margin-right cho icon để có khoảng cách với text
          />
          {rule}
        </List.Item>
      ))}
    </List.Root>
  </SidebarSection>
);

const RightSidebar = () => {
  return (
    <VStack
      gap={6}
      align="stretch"
      position={{ lg: "sticky" }}
      top={{ lg: "20px" }} // Adjust based on your header height
      p={1}
    >
      <CommunityStatsCard />
      <TopContributorsCard />
      <PopularTagsCard />
      <HotTopicsCard />
      <CommunityGuidelinesCard />
    </VStack>
  );
};
// --- END: Right Sidebar Components ---

// Main Community Page Component
function CommunityPage() {
  const mainContentBg = { base: "gray.50", _dark: "gray.900" };
  const deps = Route.useLoaderDeps();
  const { data: posts } = useQuery(trpc.post.getPosts.queryOptions(deps));
  const navigate = useNavigate();
  const onPageChange = (detail: PageChangeDetails) => {
    navigate({
      to: "/community",
      search: (prev) =>
        ({
          ...prev,
          page: detail.page,
        }) as any,
    });
  };
  return (
    <Box bg={mainContentBg} minH="100vh">
      <Container
        maxW="container.2xl"
        py={{ base: 4, md: 6 }}
        px={{ base: 2, md: 4, lg: 6 }}
      >
        <CommunityBanner />
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "minmax(0, 2fr) minmax(0, 1fr)",
          }} // Ensure columns can shrink
          gap={{ base: 6, lg: 8 }}
          mt={6}
        >
          <GridItem overflow="hidden">
            {/* Added overflow hidden */}
            <PostFilters />
            <VStack gap={5} align="stretch">
              {posts?.posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              <Pagination.Root
                count={posts?.total || 10}
                pageSize={20}
                defaultPage={deps.page}
                page={deps.page}
                onPageChange={onPageChange}
                alignSelf={"center"}
              >
                <ButtonGroup variant="ghost" size="sm">
                  <Pagination.PrevTrigger asChild>
                    <IconButton>
                      <LuChevronLeft />
                    </IconButton>
                  </Pagination.PrevTrigger>

                  <Pagination.Items
                    render={(page) => (
                      <IconButton
                        variant={{ base: "ghost", _selected: "solid" }}
                      >
                        {page.value}
                      </IconButton>
                    )}
                  />

                  <Pagination.NextTrigger asChild>
                    <IconButton>
                      <LuChevronRight />
                    </IconButton>
                  </Pagination.NextTrigger>
                </ButtonGroup>
              </Pagination.Root>
            </VStack>
          </GridItem>
          <GridItem overflow="hidden">
            <RightSidebar />
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}

export const Route = createFileRoute("/_home/community/")({
  // Adjust this route as needed
  component: CommunityPage,
  validateSearch: zodValidator(getPostQuerySchema),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps }) => {
    const p1 = queryClient.prefetchQuery(trpc.post.getPosts.queryOptions(deps));
    const p2 = trpcClient.topic.getAllTopics.query();
    const p3 = trpcClient.post.getTopTags.query();
    const [_, topics, topTags] = await Promise.all([p1, p2, p3]);
    return { topics, topTags, deps };
  },

});

// Define BoxProps if it's not globally available or part of Chakra's exports you're using
// This is typically part of @chakra-ui/react, but ensure it's correctly typed.
type BoxProps = React.ComponentProps<typeof Box>;
