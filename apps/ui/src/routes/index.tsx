import { trpcClient } from "@/libs/query/trpc";
import {
  Box,
  Button,
  Container,
  Separator as Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { Link, useLoaderData, createFileRoute } from "@tanstack/react-router";

import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import {
  FiAward,
  FiBookOpen,
  FiCode,
  FiMessageSquare,
  FiPlayCircle,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

// Header Component
const Header = () => {
  const bg = { base: "white", _dark: "gray.800" };
  const color = { base: "gray.800", _dark: "white" };
  const { session } = useLoaderData({
    from: "/",
  });
  return (
    <Box
      as="header"
      py={4}
      px={{ base: 4, md: 8 }}
      bg={bg}
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Container maxW="container.xl">
        <Flex justifyContent="space-between" alignItems="center">
          <Link to="/">
            <HStack borderSpacing={2}>
              <Icon as={FiCode} w={8} h={8} color="teal.500" />
              <Heading as="h1" size="lg" color={color} letterSpacing="tight">
                Arugo
              </Heading>
            </HStack>
          </Link>
          <HStack borderSpacing={{ base: 2, md: 4 }}>
            {session?.user ? (
              <Button asChild variant="ghost" colorScheme="teal" size="sm">
                <Link to="/home">Trang chủ</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" colorScheme="teal" size="sm">
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button asChild colorScheme="teal" size="sm">
                  <Link to="/signup">Đăng ký</Link>
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

const HeroSection = () => {
  const { session } = useLoaderData({
    from: "/",
  });
  return (
    <Container maxW="container.xl" py={{ base: 12, md: 24 }}>
      <Flex
        direction={{ base: "column-reverse", md: "row" }}
        alignItems="center"
        justifyContent="space-between"
        gap={8}
      >
        <VStack
          alignItems={{ base: "center", md: "flex-start" }}
          borderSpacing={6}
          textAlign={{ base: "center", md: "left" }}
          flex="1"
        >
          <Heading
            as="h2"
            size={{ base: "xl", md: "2xl", lg: "3xl" }}
            fontWeight="bold"
            lineHeight="shorter"
          >
            Nâng Tầm Kỹ Năng Lập Trình Của Bạn với{" "}
            <chakra.span color="teal.500">Arugo</chakra.span>
          </Heading>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color={{ base: "gray.600", _dark: "gray.300" }}
          >
            Thực hành giải thuật, tham gia thử thách code, và chinh phục các
            cuộc thi lập trình. Xây dựng một cộng đồng vững mạnh và đạt được mục
            tiêu của bạn!
          </Text>
          <Stack
            direction={{ base: "column", sm: "row" }}
            borderSpacing={4}
            w={{ base: "full", md: "auto" }}
          >
            <Button asChild colorScheme="teal" size="lg" px={8}>
              <Link to={session?.user ? "/home" : "/login"}>
                Bắt Đầu Ngay
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              colorScheme="teal"
              size="lg"
              px={8}
            >
              <Link to="/home">
                Khám Phá Bài Tập <FiBookOpen />
              </Link>
            </Button>
          </Stack>
        </VStack>
        <Box flex="1" display={{ base: "none", md: "block" }}>
          
          <Image
            src="https://placewaifu.com/image/600/300"
            alt="Arugo Illustration"
            rounded="lg"
            boxShadow="xl"
          />
        </Box>
      </Flex>
    </Container>
  );
};

// Features Component
interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <VStack
      bg={{ base: "gray.50", _dark: "gray.700" }}
      p={6}
      rounded="lg"
      borderSpacing={4}
      alignItems="flex-start"
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ boxShadow: "xl", transform: "translateY(-5px)" }}
    >
      <Icon as={icon} w={10} h={10} color="teal.500" />
      <Heading as="h3" size="md" fontWeight="semibold">
        {title}
      </Heading>
      <Text color={{ base: "gray.600", _dark: "gray.300" }}>{description}</Text>
    </VStack>
  );
};

const FeaturesSection = () => {
  const features: FeatureCardProps[] = [
    {
      icon: FiTarget,
      title: "Bài Tập Đa Dạng",
      description:
        "Hàng ngàn bài tập thuật toán từ cơ bản đến nâng cao, giúp bạn rèn luyện tư duy logic và kỹ năng giải quyết vấn đề.",
    },
    {
      icon: FiAward,
      title: "Cuộc Thi Hấp Dẫn",
      description:
        "Tham gia các cuộc thi lập trình định kỳ, thử thách bản thân và cạnh tranh với các lập trình viên khác.",
    },
    {
      icon: FiTrendingUp,
      title: "Theo Dõi Tiến Độ",
      description:
        "Theo dõi tiến trình học tập của bạn, xem lại lịch sử bài làm và nhận phân tích chi tiết để cải thiện.",
    },
    {
      icon: FiUsers,
      title: "Cộng Đồng Năng Động",
      description:
        "Kết nối, học hỏi và chia sẻ kinh nghiệm với cộng đồng lập trình viên trên khắp thế giới.",
    },
    {
      icon: FiPlayCircle,
      title: "Hướng Dẫn Trực Quan",
      description:
        "Các bài giải chi tiết và video hướng dẫn giúp bạn hiểu sâu hơn về các thuật toán và cấu trúc dữ liệu.",
    },
    {
      icon: FiMessageSquare,
      title: "Thảo Luận & Hỗ Trợ",
      description:
        "Tham gia thảo luận về các bài toán, đặt câu hỏi và nhận được sự hỗ trợ từ cộng đồng và các chuyên gia.",
    },
  ];

  return (
    <Box bg={{ base: "gray.100", _dark: "gray.900" }} py={{ base: 12, md: 20 }}>
      <Container maxW="container.xl">
        <VStack borderSpacing={4} textAlign="center" mb={10}>
          <Heading as="h2" size="xl" fontWeight="bold">
            Tại Sao Chọn <chakra.span color="teal.500">Arugo</chakra.span>?
          </Heading>
          <Text
            fontSize="lg"
            color={{ base: "gray.600", _dark: "gray.300" }}
            maxW="2xl"
          >
            Arugo cung cấp một nền tảng toàn diện để bạn không chỉ học lập trình
            mà còn trở thành một chuyên gia giải quyết vấn đề.
          </Text>
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

// Problems Preview Component
interface ProblemItemProps {
  title: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  tags: string[];
}

const ProblemItem = ({ title, difficulty, tags }: ProblemItemProps) => {
  const difficultyColor = {
    Dễ: "green.500",
    "Trung bình": "orange.500",
    Khó: "red.500",
  };

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      p={4}
      bg={{ base: "white", _dark: "gray.700" }}
      rounded="md"
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}
    >
      <VStack alignItems="flex-start" borderSpacing={1}>
        <Heading as="h4" size="sm">
          {title}
        </Heading>
        <HStack borderSpacing={2}>
          {tags.map((tag) => (
            <Text
              key={tag}
              fontSize="xs"
              color="gray.500"
              _dark={{ color: "gray.400" }}
            >
              #{tag}
            </Text>
          ))}
        </HStack>
      </VStack>
      <Text
        fontSize="sm"
        fontWeight="medium"
        color={difficultyColor[difficulty]}
      >
        {difficulty}
      </Text>
    </Flex>
  );
};

const ProblemsPreviewSection = () => {
  const sampleProblems: ProblemItemProps[] = [
    {
      title: "Tìm tổng hai số",
      difficulty: "Dễ",
      tags: ["Mảng", "Toán học"],
    },
    { title: "Đảo ngược chuỗi", difficulty: "Dễ", tags: ["Chuỗi"] },
    {
      title: "Tìm đường đi ngắn nhất",
      difficulty: "Trung bình",
      tags: ["Đồ thị", "BFS"],
    },
    { title: "Sắp xếp Topo", difficulty: "Khó", tags: ["Đồ thị", "DFS"] },
  ];

  return (
    <Container maxW="container.lg" py={{ base: 12, md: 20 }}>
      <VStack borderSpacing={4} textAlign="center" mb={10}>
        <Heading as="h2" size="xl" fontWeight="bold">
          Thử Thách Bản Thân Với Các Bài Tập Nổi Bật
        </Heading>
        <Text fontSize="lg" color={{ base: "gray.600", _dark: "gray.300" }}>
          Khám phá một vài ví dụ về các dạng bài tập bạn có thể tìm thấy trên
          Arugo.
        </Text>
      </VStack>
      <Stack borderSpacing={4}>
        {sampleProblems.map((problem, index) => (
          <ProblemItem key={index} {...problem} />
        ))}
      </Stack>
      <Flex justifyContent="center" mt={8}>
        <Button asChild colorScheme="teal" variant="outline" size="lg">
          <Link to="/home">
            Xem Tất Cả Bài Tập
            <FiCode />
          </Link>
        </Button>
      </Flex>
    </Container>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <Box bg="teal.500" color="white" py={{ base: 12, md: 20 }}>
      <Container maxW="container.md" textAlign="center">
        <VStack borderSpacing={6}>
          <Heading as="h2" size={{ base: "lg", md: "xl" }} fontWeight="bold">
            Sẵn Sàng Chinh Phục Thử Thách?
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }}>
            Tham gia Arugo ngay hôm nay để bắt đầu hành trình trở thành một
            chuyên gia lập trình. Đăng ký miễn phí và trải nghiệm!
          </Text>
          <Button
            as={Link}
            // @ts-ignore
            to="/signup"
            bg={{ base: "white", _dark: "gray.800" }}
            color={{ base: "teal.500", _dark: "white" }}
            size="lg"
            px={10}
            _hover={{
              bg: { base: "gray.100", _dark: "gray.700" },
            }}
            leftIcon={<FiStar />}
          >
            Tham Gia Miễn Phí
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

// Footer Component
const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <Box
      bg={{ base: "gray.100", _dark: "gray.900" }}
      color={{ base: "gray.700", _dark: "gray.200" }}
    >
      <Container maxW="container.xl" py={10}>
        <Stack
          direction={{ base: "column", md: "row" }}
          borderSpacing={8}
          justifyContent="space-between"
          alignItems={{ base: "center", md: "flex-start" }}
        >
          <VStack
            borderSpacing={3}
            alignItems={{ base: "center", md: "flex-start" }}
          >
            <HStack borderSpacing={2}>
              <Icon as={FiCode} w={7} h={7} color="teal.500" />
              <Heading as="h3" size="md">
                Arugo
              </Heading>
            </HStack>
            <Text
              fontSize="sm"
              maxW="sm"
              textAlign={{ base: "center", md: "left" }}
            >
              Nền tảng hàng đầu cho việc học và rèn luyện kỹ năng lập trình,
              giải thuật.
            </Text>
          </VStack>

          <HStack
            borderSpacing={{ base: 6, md: 12 }}
            wrap="wrap"
            justifyContent={{ base: "center", md: "flex-start" }}
          >
            <VStack
              alignItems={{ base: "center", md: "flex-start" }}
              borderSpacing={3}
            >
              <Text fontWeight="semibold">Sản phẩm</Text>
              <Link to="/home">Bài tập</Link>
              <Link to="/contests">Cuộc thi</Link>
              <Link to="/community">Cộng đồng</Link>
            </VStack>
            <VStack
              alignItems={{ base: "center", md: "flex-start" }}
              borderSpacing={3}
            >
              <Text fontWeight="semibold">Công ty</Text>
              <Link to="/about">Về chúng tôi</Link>
              <Link to="/careers">Tuyển dụng</Link>
              <Link to="/contact">Liên hệ</Link>
            </VStack>
            <VStack
              alignItems={{ base: "center", md: "flex-start" }}
              borderSpacing={3}
            >
              <Text fontWeight="semibold">Hỗ trợ</Text>
              <Link to="/faq">FAQ</Link>
              <Link to="/terms">Điều khoản</Link>
              <Link to="/privacy">Chính sách</Link>
            </VStack>
          </HStack>
        </Stack>
        <Divider my={8} />
        <Flex
          direction={{ base: "column-reverse", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={4}
        >
          <Text fontSize="sm">&copy; {year} Arugo. Đã đăng ký bản quyền.</Text>
          <HStack borderSpacing={4}>
            <Link to="#">
              <Icon as={FaGithub} boxSize={5} />
            </Link>
            <Link to="#">
              <Icon as={FaTwitter} boxSize={5} />
            </Link>
            <Link to="#">
              <Icon as={FaLinkedin} boxSize={5} />
            </Link>
            <Link to="#">
              <Icon as={FaFacebook} boxSize={5} />
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

// Landing Page Component
function Landing() {
  return (
    <Box>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProblemsPreviewSection />
        
        <CTASection />
      </main>
      <Footer />
    </Box>
  );
}

export const Route = createFileRoute("/")({
  component: Landing,

  loader: async () => {
    const session = await trpcClient.auth.getServerSession.query()
    console.log(session);
    return {
      session,
    };
  },
});
