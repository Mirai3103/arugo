import { Prose } from "@/components/ui/prose";
import { DEFAULT_EXTENSIONS } from "@/libs/tiptap/extension";
import {
  Badge, HStack,
  Heading, Tag, Text,
  VStack,
  Wrap
} from "@chakra-ui/react";
import { generateHTML } from "@tiptap/html";
import React from "react";

import { useLoaderData } from "@tanstack/react-router";
import { DIFFICULTY_COLORS_PALATE, DIFFICULTY_LABELS } from "@/utils/constants/difficulties";
export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  const {problem} = useLoaderData({
    from:"/problems/$slug/_layout"
  })
   const problemStatement = React.useMemo(() => {
    return generateHTML(problem.statement as JSON, DEFAULT_EXTENSIONS);
  }, [problem.statement]); 
 const subduedTextColor = { "base": "gray.500", "_dark": "gray.400" };
  
  return  <VStack align="stretch" gap={5}>
                <Prose size={"lg"} maxWidth={"99%"}>
                  <div
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                    dangerouslySetInnerHTML={{
                      __html: problemStatement,
                    }}
                  />
                </Prose>
                <VStack align="stretch" gap={3} pt={4}>
                  <Heading as="h3" size="sm" mb={1}>
                    Thông tin thêm
                  </Heading>
                  <HStack justifyContent="space-between">
                    <Text
                      fontSize="sm"
                      color={subduedTextColor}
                    >
                      Độ khó:
                    </Text>
                    <Badge
                      colorPalette={
                        DIFFICULTY_COLORS_PALATE[
                          problem.difficultyLevel!
                        ]
                      }
                      variant="solid"
                      fontSize="xs"
                    >
                      {
                        DIFFICULTY_LABELS[
                          problem.difficultyLevel!
                        ]
                      }
                    </Badge>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text
                      fontSize="sm"
                      color={subduedTextColor}
                    >
                      Thẻ:
                    </Text>
                    <Wrap gap={1}>
                      {problem.tags.map((tag) => (
                        <Tag.Root
                          size="sm"
                          colorPalette="purple"
                          variant="subtle"
                          key={tag.id}
                        >
                          <Tag.Label>
                            {tag.name}
                          </Tag.Label>
                        </Tag.Root>
                      ))}
                    </Wrap>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text
                      fontSize="sm"
                      color={subduedTextColor}
                    >
                      Lượt chấp nhận:
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      75.2%
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
}
