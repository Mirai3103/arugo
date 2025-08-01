import type { FullProblem } from "@repo/backend/problems/problemService";
import {
  Box,
  Separator as Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { Link, useLocation, useParams } from "@tanstack/react-router";
import {
  FiBookOpen,
  FiMessageCircle,
  FiShare2,
  FiThumbsDown,
  FiThumbsUp,
} from "react-icons/fi";
import { Outlet } from "@tanstack/react-router";
import { LuX } from "react-icons/lu";
interface ProblemDescriptionPanelProps {
  problem: FullProblem;
}

export const ProblemDescriptionPanel = ({
  problem,
}: ProblemDescriptionPanelProps) => {
  const tab = useLocation({
    select: ({ pathname }) => {
      const TABS_PATTERNS = [
        {
          regex: /^\/problems\/[^/]+\/description$/,
          value: "desc",
        },
        {
          regex: /^\/problems\/[^/]+\/editorial$/,
          value: "editorial",
        },
        {
          regex: /^\/problems\/[^/]+\/solutions$/,
          value: "solutions",
        },
        {
          regex: /^\/problems\/[^/]+\/histories$/,
          value: "histories",
        },
        {
          regex: /^\/problems\/[^/]+\/submissions\/[^/]+$/,
          value: "submission",
        },
        {
          regex: /^\/problems\/[^/]+\/ai-chat-help$/,
          value: "ai-chat-help",
        },
      ];
      for (const { regex, value } of TABS_PATTERNS) {
        if (regex.test(pathname)) {
          return value;
        }
      }
      return "desc"; 
    },
  });
  const params = useParams({
    from: "/problems/$slug/_layout",
  });
  const bgColor = { base: "white", _dark: "gray.800" };

  const subduedTextColor = { base: "gray.500", _dark: "gray.400" };

  return (
    <Flex
      direction="column"
      h="100%"
      bg={bgColor}
      rounded={{ md: "lg" }}
      overflowY="auto" 
    >
      <Box p={{ base: 4, md: 6 }} flexGrow={1}>
        <Heading as="h1" size="lg" mb={4}>
          {problem.title}
        </Heading>
        <Tabs.Root
          variant="line"
          colorPalette="teal"
          size="sm"
          defaultValue={tab}
          value={tab}
        >
          <Tabs.List mb={4}>
            <Tabs.Trigger asChild value="desc">
              <span>
              <Link
                to="/problems/$slug/description"
                params={{
                  slug: params.slug || "",
                }}
              >
                Mô tả
              </Link>
              </span>
            </Tabs.Trigger>
            <Tabs.Trigger asChild value="editorial">
              <span>
              <Link
                to="/problems/$slug/editorial"
                params={{
                  slug: params.slug || "",
                }}
              >
                Hướng dẫn
              </Link></span>
            </Tabs.Trigger>
            <Tabs.Trigger asChild value="solutions">
              <span>
              <Link
                to="/problems/$slug/solutions"
                params={{
                  slug: params.slug || "",
                }}
              >
                Giải pháp
              </Link>
              </span>
            </Tabs.Trigger>
            <Tabs.Trigger asChild value="histories">
              <span>
              <Link
                to="/problems/$slug/histories"
                params={{
                  slug: params.slug || "",
                }}
              >
                Lịch sử
              </Link>
              </span>
            </Tabs.Trigger>
            <Tabs.Trigger asChild value="ai-chat-help">
              <span>
              <Link
                to="/problems/$slug/ai-chat-help"
                params={{
                  slug: params.slug || "",
                }}
              >
                Chat AI
              </Link>
              </span>
            </Tabs.Trigger>
            {tab === "submission" && (
              <Tabs.Trigger value="submission">
                Bài nộp
                <IconButton
                  variant={"ghost"}
                  size={"xs"}
                  rounded={"full"}
                  colorPalette={"red"}
                  asChild
                >
                  <Link
                    to={"/problems/$slug/description"}
                    params={(pre) => {
                      return {
                        slug: pre.slug || "",
                        id: "",
                      };
                    }}
                  >
                    <LuX />
                  </Link>
                </IconButton>
              </Tabs.Trigger>
            )}
          </Tabs.List>
          <Tabs.Content value={tab} p={0}>
            <Outlet />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
      <Divider />
      <HStack
        p={{ base: 3, md: 4 }}
        gap={3}
        justifyContent="space-between"
        bg={{ base: "gray.50", _dark: "gray.850" }}
        borderBottomRadius={{ md: "lg" }}
      >
        <HStack gap={1}>
          <IconButton aria-label="Thích" variant="ghost" size="sm">
            <FiThumbsUp />
          </IconButton>
          <Text fontSize="sm" color={subduedTextColor}>
            
          </Text>
          <IconButton aria-label="Không thích" variant="ghost" size="sm">
            <FiThumbsDown />
          </IconButton>
        </HStack>
        <HStack gap={1}>
          <IconButton aria-label="Thêm vào danh sách" variant="ghost" size="sm">
            <FiBookOpen />
          </IconButton>
        </HStack>
        <HStack gap={1}>
          <IconButton aria-label="Bình luận" variant="ghost" size="sm">
            <FiMessageCircle />
          </IconButton>
          <Text fontSize="sm" color={subduedTextColor}>
            
          </Text>
        </HStack>
        <IconButton aria-label="Chia sẻ" variant="ghost" size="sm">
          <FiShare2 />
        </IconButton>
      </HStack>
    </Flex>
  );
};
