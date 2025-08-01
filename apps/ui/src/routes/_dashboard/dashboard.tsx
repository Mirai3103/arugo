import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <VStack gap={6} align="stretch">
    <Heading as="h1" size="lg">
      Dashboard
    </Heading>
    <Text>
      Chào mừng bạn đến với trang quản trị. Đây là nơi nội dung chính của trang sẽ được hiển thị.
    </Text>
    <Box bg={{ "base": "white", "_dark": "gray.700" }} p={8} borderRadius="lg" minH="400px" boxShadow="base">
      <Text>Nội dung trang...</Text>
    </Box>
  </VStack>
}
