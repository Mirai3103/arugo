import {
  createFileRoute,
  redirect,
  Link as RouterLink,
  useLoaderData,
} from "@tanstack/react-router";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
  Avatar,
  Separator,
  Tag,
  Wrap,
  Breadcrumb,
  Textarea,
  Menu,
  Card,
  Link,
  SimpleGrid,
  List,
} from "@chakra-ui/react";
import {
  FiHeart,
  FiMessageSquare,
  FiBookmark,
  FiShare2,
  FiMoreHorizontal,
  FiUserCheck,
  FiEdit,
  FiTrash2,
  FiUser,
  FiAward,
} from "react-icons/fi";
import { FaUserGraduate } from "react-icons/fa";
import React from "react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Prose } from "@/components/ui/prose"; // Component từ snippet
import dayjs from "dayjs";
import { PostDetail } from "@repo/backend/posts/postService";
import { generateHTMLFromJSON } from "@repo/tiptap";
import { trpcClient } from "@/libs/query/trpc";

interface Comment {
  id: string;
  author: Pick<Author, "name" | "avatar">;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

const sampleComments: Comment[] = [
  {
    id: "c1",
    author: {
      name: "Hỏi Đáp Viên",
      avatar: "https://placewaifu.com/image/40/40?t=a2",
    },
    content:
      "Bài viết rất hay! Kỹ thuật tối ưu không gian thực sự hữu ích. Cảm ơn bạn đã chia sẻ.",
    createdAt: "2025-06-12T11:30:00Z",
    likes: 15,
    replies: [
      {
        id: "c1r1",
        author: {
          name: "Thuật Toán Sư",
          avatar: "https://placewaifu.com/image/40/40?t=a1",
        },
        content: "Cảm ơn bạn! Rất vui vì nó giúp ích cho bạn.",
        createdAt: "2025-06-12T11:45:00Z",
        likes: 5,
      },
    ],
  },
  {
    id: "c2",
    author: {
      name: "Newbie Coder",
      avatar: "https://placewaifu.com/image/40/40?t=a5",
    },
    content:
      "Mình vẫn chưa hiểu rõ lắm về vòng lặp for thứ hai trong ví dụ Knapsack, tại sao lại chạy ngược từ W về `weights[i]` vậy ạ?",
    createdAt: "2025-06-12T14:00:00Z",
    likes: 8,
  },
];
// --- END: Sample Data & Types ---

type Author = PostDetail["author"];
// --- START: Main Post Components ---
const PostHeader = ({
  author,
  createdAt,
}: {
  author: Author;
  createdAt: string;
}) => {
  const rankConfig = {
    Expert: { colorScheme: "blue", icon: FiAward },
    Intermediate: { colorScheme: "green", icon: FaUserGraduate },
    Beginner: { colorScheme: "gray", icon: FiUser },
  };
  const currentRank = rankConfig["Expert"];
  return (
    <HStack gap={4} w="full">
      <Avatar.Root size="md">
        <Avatar.Image
          src={author.avatar || "https://placewaifu.com/image/400/400?t=a2"}
          alt={author.name}
        />
        <Avatar.Fallback name={author.name.substring(0, 2).toUpperCase()} />
      </Avatar.Root>
      <VStack align="flex-start" gap={0}>
        <Text fontWeight="bold">{author.name}</Text>
        <HStack fontSize="xs" color={{ base: "gray.500", _dark: "gray.400" }}>
          <Icon
            as={currentRank.icon}
            color={`${currentRank.colorScheme}.500`}
          />
          <Text>{"Expert"}</Text>
          <Text mx={1}>•</Text>
          <Text>{dayjs(createdAt).fromNow()}</Text>
        </HStack>
      </VStack>
      <Spacer />
      <Menu.Root positioning={{ placement: "bottom-end" }}>
        <Menu.Trigger asChild>
          <IconButton variant="ghost" size="sm" aria-label="Tùy chọn bài viết">
            <FiMoreHorizontal />
          </IconButton>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="edit">
              <Icon as={FiEdit} mr={2} />
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item value="delete" color="red.500">
              <Icon as={FiTrash2} mr={2} />
              Xóa bài viết
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </HStack>
  );
};

const PostContent = ({
  title,
  tags,
  content,
}: {
  title: string;
  tags: string[];
  content: string;
}) => {
  return (
    <VStack gap={4} align="stretch">
      <Heading as="h1" size={{ base: "lg", md: "xl" }}>
        {title}
      </Heading>
      <Wrap gap={2}>
        {tags.map((tag) => (
          <Tag.Root key={tag} size="md" variant="subtle" colorPalette="teal">
            <Tag.Label>#{tag}</Tag.Label>
          </Tag.Root>
        ))}
      </Wrap>
      <Separator />
      <Prose
        maxW={"full"}
        size={"lg"}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </VStack>
  );
};

const PostActions = ({
  likes,
  commentsCount,
  bookmarks,
}: {
  likes: number;
  commentsCount: number;
  bookmarks: number;
}) => (
  <HStack
    gap={2}
    py={3}
    borderTopWidth="1px"
    borderBottomWidth="1px"
    borderColor={{ base: "gray.200", _dark: "gray.700" }}
  >
    <Button variant="ghost" size="sm">
      {likes}
      <FiHeart />
    </Button>
    <Button variant="ghost" size="sm">
      {commentsCount}
      <FiMessageSquare />
    </Button>
    <Button variant="ghost" size="sm">
      {bookmarks}
      <FiBookmark />
    </Button>
    <Spacer />
    <IconButton aria-label="Chia sẻ" variant="ghost" size="sm">
      <FiShare2 />
    </IconButton>
  </HStack>
);

const CommentCard = ({ comment }: { comment: Comment }) => {
  const cardBg = { base: "gray.50", _dark: "gray.700" };
  return (
    <Flex gap={3}>
      <Avatar.Root size="sm" mt={1}>
        <Avatar.Image
          src={
            comment.author.avatar || "https://placewaifu.com/image/400/400?t=a1"
          }
          alt={comment.author.name}
        />
        <Avatar.Fallback
          name={comment.author.name.substring(0, 2).toUpperCase()}
        />
      </Avatar.Root>
      <VStack align="stretch" gap={2} w="full">
        <Box bg={cardBg} p={3} borderRadius="lg">
          <HStack>
            <Text fontSize="sm" fontWeight="bold">
              {comment.author.name}
            </Text>
            <Text fontSize="xs" color={{ base: "gray.500", _dark: "gray.400" }}>
              • {dayjs(comment.createdAt).fromNow()}
            </Text>
          </HStack>
          <Text fontSize="sm" mt={1}>
            {comment.content}
          </Text>
        </Box>
        <HStack gap={3} fontSize="xs">
          <Button variant="ghost" size="xs" colorScheme="gray">
            {comment.likes} Thích
          </Button>
          <Button variant="ghost" size="xs" colorScheme="gray">
            Trả lời
          </Button>
        </HStack>
        {comment.replies && (
          <VStack
            align="stretch"
            gap={3}
            pl={4}
            borderLeftWidth="2px"
            borderColor={{ base: "gray.200", _dark: "gray.600" }}
          >
            {comment.replies.map((reply) => (
              <CommentCard key={reply.id} comment={reply} />
            ))}
          </VStack>
        )}
      </VStack>
    </Flex>
  );
};

const CommentSection = ({
  comments,
  commentsCount,
}: {
  comments: Comment[];
  commentsCount: number;
}) => (
  <VStack gap={5} align="stretch">
    <Heading size="md">Bình luận ({commentsCount})</Heading>
    {/* Comment Form */}
    <HStack>
      <Avatar.Root size="sm">
        <Avatar.Fallback name="U" />
      </Avatar.Root>
      <Textarea placeholder="Viết bình luận của bạn..." size="sm" />
    </HStack>
    <Button alignSelf="flex-end" colorScheme="teal" size="sm">
      Gửi bình luận
    </Button>
    <Separator />
    {/* Comments List */}
    <VStack gap={6} align="stretch">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </VStack>
  </VStack>
);
// --- END: Main Post Components ---

// --- START: Sidebar Components ---
const AuthorCard = ({ author }: { author: Author }) => (
  <Card.Root variant="outline">
    {" "}
    {/* Card -> Card.Root */}
    <Card.Body>
      {/* CardBody -> Card.Body */}
      <VStack gap={4}>
        {/* Avatar đã ở dạng v3 */}
        <Avatar.Root size="xl">
          <Avatar.Image
            src={author.avatar || "https://placewaifu.com/image/400/400?t=a3"}
            alt={author.name}
          />
          <Avatar.Fallback name={author.name.substring(0, 2).toUpperCase()} />
        </Avatar.Root>
        <VStack gap={1}>
          <Heading size="md">{author.name}</Heading>
          <Text
            fontSize="sm"
            color={{ _light: "blue.600", _dark: "blue.300" }} // useColorModeValue -> object syntax
            fontWeight="bold"
          >
            {"Expert"}
          </Text>
        </VStack>
        <Text
          fontSize="sm"
          textAlign="center"
          color={{ _light: "gray.600", _dark: "gray.400" }} // useColorModeValue -> object syntax
        >
          Xin chào, tôi là một người yêu thích lập trình và giải quyết các bài
          toán khó.
        </Text>
        <SimpleGrid columns={3} w="full" gap={2} textAlign="center">
          <Box>
            <Text fontWeight="bold">{"30"}</Text>
            <Text fontSize="xs" color="gray.500">
              Bài viết
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold">{"100"}</Text>
            <Text fontSize="xs" color="gray.500">
              Giải pháp
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold">{"20"}</Text>
            <Text fontSize="xs" color="gray.500">
              Followers
            </Text>
          </Box>
        </SimpleGrid>
        <Button
          w="full"
          colorPalette="teal" // colorScheme -> colorPalette
          variant="outline"
          size="sm"
        >
          <Icon as={FiUserCheck} mr={1.5} />{" "}
          {/* leftIcon -> Icon làm con trực tiếp */}
          Theo dõi
        </Button>
      </VStack>
    </Card.Body>
  </Card.Root>
);
const RelatedPostsCard = () => (
  <Card.Root variant="outline">
    {" "}
    {/* Card -> Card.Root */}
    <Card.Header>
      {" "}
      {/* CardHeader -> Card.Header */}
      <Heading size="sm">Bài viết cùng chủ đề</Heading>
    </Card.Header>
    <Card.Body pt={0}>
      {" "}
      {/* CardBody -> Card.Body */}
      <VStack
        separator={<Separator />} // Divider -> Separator
        gap={3}
        align="stretch"
      >
        <Link fontSize="sm" _hover={{ color: "teal.500" }}>
          Làm thế nào để bắt đầu với thuật toán đồ thị?
        </Link>
        <Link fontSize="sm" _hover={{ color: "teal.500" }}>
          So sánh giữa DP và Greedy
        </Link>
        <Link fontSize="sm" _hover={{ color: "teal.500" }}>
          Case study: Tối ưu bộ nhớ trong bài toán chuỗi
        </Link>
      </VStack>
    </Card.Body>
  </Card.Root>
);

const TableOfContents = () => (
  <Card.Root variant="outline">
    {" "}
    {/* Card -> Card.Root */}
    <Card.Header>
      {" "}
      {/* CardHeader -> Card.Header */}
      <Heading size="sm">Mục lục</Heading>
    </Card.Header>
    <Card.Body pt={0}>
      {" "}
      {/* CardBody -> Card.Body */}
      <List.Root gap={1.5} fontSize="sm">
        {" "}
        {/* List -> List.Root */}
        <List.Item>
          {" "}
          {/* ListItem -> List.Item */}
          <Link>Hiểu về bản chất của DP</Link>
        </List.Item>
        <List.Item>
          {" "}
          {/* ListItem -> List.Item */}
          <Link pl={4}>Xác định trạng thái</Link>
        </List.Item>
        <List.Item>
          {" "}
          {/* ListItem -> List.Item */}
          <Link pl={4}>Tối ưu hóa không gian</Link>
        </List.Item>
      </List.Root>
    </Card.Body>
  </Card.Root>
);

// --- END: Sidebar Components ---

// --- START: Main Page Component ---
const PostDetailsPage = () => {
  const { post } = useLoaderData({ from: "/_home/community/post/$slug" });
  const comments = sampleComments;
  const rawHtml = React.useMemo(() => {
    return generateHTMLFromJSON(post.content);
  }, [post.content]);

  return (
    <Box bg={{ base: "gray.50", _dark: "gray.900" }}>
      {/* Header could be here */}
      <Container
        maxW="container.2xl"
        py={{ base: 4, md: 8 }}
        px={{ base: 2, md: 4, lg: 6 }}
      >
        <Grid
          templateColumns={{ base: "1fr", lg: "minmax(0, 2fr) minmax(0, 1fr)" }}
          gap={{ base: 6, lg: 8 }}
          alignItems="flex-start"
        >
          <GridItem as={VStack} gap={6} alignItems="stretch">
            <Breadcrumb.Root gap="8px" fontSize="sm">
              <Breadcrumb.List>
                <Breadcrumb.Item>
                  <Breadcrumb.Link asChild>
                    <RouterLink to="/home">Trang chủ</RouterLink>
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />

                <Breadcrumb.Item>
                  <Breadcrumb.Link asChild>
                    <RouterLink to="/community">Cộng đồng</RouterLink>
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.CurrentLink>{post.title}</Breadcrumb.CurrentLink>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>
            <Card.Root variant="outline">
              <Card.Body p={{ base: 4, md: 6 }}>
                {" "}
                {/* CardBody -> Card.Body */}
                <VStack gap={5} align="stretch">
                  <PostHeader
                    author={post.author}
                    createdAt={post.createdAt}
                  />
                  <PostContent
                    title={post.title}
                    tags={post.tags || []}
                    content={rawHtml}
                  />
                  <PostActions likes={20} commentsCount={30} bookmarks={45} />
                  <CommentSection comments={comments} commentsCount={30} />
                </VStack>
              </Card.Body>
            </Card.Root>
          </GridItem>

          <GridItem
            as={VStack}
            gap={6}
            alignItems="stretch"
            position={{ lg: "sticky" }}
            top="24px"
          >
            <AuthorCard author={post.author} />
            <TableOfContents />
            <RelatedPostsCard />
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

// --- END: Main Page Component ---

// A necessary evil for Chakra's Flex + TanStack Router's Link when using asChild or similar patterns
const Spacer = () => <Box flexGrow={1} />;

export const Route = createFileRoute("/_home/community/post/$slug")({
  component: PostDetailsPage,
  loader: async ({ params }) => {
    const post = await trpcClient.post.getPostBySlug.query({ slug: params.slug });
    if (!post) {
      throw redirect({ to: "/community" });
    }
    return { post: post[0] };
  },
});
