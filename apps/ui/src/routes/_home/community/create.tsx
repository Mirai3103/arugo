import { createFileRoute } from '@tanstack/react-router';
import {
  Box,
  Button,
  Container, Heading,
  HStack,
  Icon,
  Input, Textarea,
  VStack, Card,
  Field,
  Tooltip,
  Text
} from "@chakra-ui/react";
import {
  FiSend, FiZap
} from "react-icons/fi";

export const Route = createFileRoute('/_home/community/create')({
  component: CreatePostPage,
})
// Import from chakra-react-select
import {
  CreatableSelect
} from "chakra-react-select";



// --- END: Reusable Header ---


// --- START: Mock Data for Selects ---
const mockTopics = [
  { value: 'algorithms', label: 'Thuật toán' },
  { value: 'qna', label: 'Hỏi đáp' },
  { value: 'discussion', label: 'Thảo luận' },
  { value: 'news', label: 'Tin tức' },
  { value: 'career', label: 'Hướng nghiệp' },
];

const mockTags = [
  { value: 'dynamic-programming', label: 'dynamic-programming' },
  { value: 'graphs', label: 'graphs' },
  { value: 'data-structures', label: 'data-structures' },
  { value: 'arrays', label: 'arrays' },
  { value: 'sorting', label: 'sorting' },
  { value: 'python', label: 'python' },
  { value: 'c++', label: 'c++' },
  { value: 'interview', label: 'interview' },
];
// --- END: Mock Data ---

// --- START: Main Page Component ---
function CreatePostPage() {
  const formBg = {base:"white", _dark:"gray.800"};

  // Styles for chakra-react-select to match Chakra UI's theme
  const selectStyles = {
    control: (provided: any) => ({
      ...provided,
      bg: {base:"white", _dark:"gray.700"},
      borderColor: {base:"gray.200", _dark:"gray.600"},
      _hover: {
          borderColor: {base:"gray.300", _dark:"gray.500"},
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      bg: {base:"white", _dark:"gray.700"},
      boxShadow: "lg",
    }),
    option: (provided: any, state: { isSelected: boolean, isFocused: boolean }) => ({
      ...provided,
      bg: state.isFocused ? {base:"gray.100", _dark:"gray.600"} : "transparent",
      color: state.isSelected ? {base:"teal.500", _dark:"teal.200"} : {base:"gray.800", _dark:"whiteAlpha.900"},
      _active: {
          bg: {base:"gray.200", _dark:"gray.500"},
      }
    }),
    multiValue: (provided: any) => ({
      ...provided,
      bg: {base:"teal.50", _dark:"teal.800"},
      color: {base:"teal.800", _dark:"teal.100"},
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: {base:"teal.800", _dark:"teal.100"},
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: {base:"teal.500", _dark:"teal.200"},
      ':hover': {
        backgroundColor: {base:"teal.100", _dark:"teal.700"},
        color: 'teal.800',
      },
    }),
  };

  return (
   
      <Container maxW="container.lg" py={{ base: 6, md: 10 }}>
        <VStack gap={6} align="stretch">
          <Box>
            <Heading as="h1" size="xl">Tạo Bài Viết Mới</Heading>
            <Text color={{base:"gray.600", _dark:"gray.400"}} mt={1}>
              Chia sẻ kiến thức và kinh nghiệm của bạn với cộng đồng.
            </Text>
          </Box>

          <Card.Root variant="outline" bg={{ _light: "white", _dark: "gray.800" }}> {/* Card -> Card.Root, bg={formBg} -> object syntax */}
  <Card.Body p={{ base: 4, md: 6 }}> {/* CardBody -> Card.Body */}
    <VStack as="form" gap={5} onSubmit={(e) => e.preventDefault()}>
      
      {/* --- Tiêu đề --- */}
      <Field.Root id="post-title" required> {/* FormControl -> Field.Root, isRequired -> required */}
        <Field.Label>Tiêu đề</Field.Label> {/* FormLabel -> Field.Label */}
        <Input 
          placeholder="Ví dụ: Cách tối ưu thuật toán tìm đường đi ngắn nhất..." 
          css={{ "--focus-color": "var(--chakra-colors-teal-500)" }} // focusBorderColor -> css prop
        />
      </Field.Root>

      {/* --- Chủ đề --- */}
      <Field.Root id="post-topic" required>
        <Field.Label>Chủ đề</Field.Label>
        {/* <ChakraNativeSelect.Root collection={mockTopics}>
          <ChakraNativeSelect.Field 
            placeholder="Chọn chủ đề cho bài viết" 
            css={{ "--focus-color": "var(--chakra-colors-teal-500)" }} // focusBorderColor -> css prop
          >
            {mockTopics.map(topic => (
              <option key={topic.value} value={topic.value}>{topic.label}</option>
            ))}
          </ChakraNativeSelect.Field>
          <ChakraNativeSelect.Indicator />
        </ChakraNativeSelect.Root> */}
      </Field.Root>
      
      {/* --- Tags --- */}
      <Field.Root id="post-tags">
        <Field.Label>Tags</Field.Label>
        {/* Giả sử CreatableSelect và chakraStyles đã tương thích v3 */}
        <CreatableSelect
          isMulti
          name="tags"
          options={mockTags}
          placeholder="Chọn hoặc tạo tags... (ví dụ: c++, algorithms)"
          variant="outline"
          tagColorPalette="teal" // colorScheme -> colorPalette
          chakraStyles={selectStyles} // Giả sử selectStyles đã được migrate
        />
        <Field.HelperText> {/* FormHelperText -> Field.HelpText */}
          Thêm tối đa 5 tags để mô tả về nội dung của bạn.
        </Field.HelperText>
      </Field.Root>

      {/* --- Mô tả ngắn --- */}
      <Field.Root id="post-short-description">
        <Field.Label>Mô tả ngắn</Field.Label>
        <Box position="relative" w={"100%"}>
          <Textarea
            placeholder="Một mô tả ngắn gọn, hấp dẫn về nội dung bài viết..."
            minH="100px"
            w={"100%"}
            css={{ "--focus-color": "var(--chakra-colors-teal-500)" }} // focusBorderColor -> css prop
          />
          <Tooltip.Root positioning={{placement:'top'}}>
            <Tooltip.Trigger>
            <Button
              size="sm"
              variant="outline"
              colorPalette="purple" // colorScheme -> colorPalette
              position="absolute"
              bottom="8px"
              right="8px"
              type='button'
            >
              <Icon as={FiZap} mr={1.5}/> {/* leftIcon -> Icon làm con trực tiếp */}
              Auto-gen
            </Button></Tooltip.Trigger>
            <Tooltip.Content>Tạo mô tả bằng AI (dựa trên tiêu đề và nội dung)</Tooltip.Content>
          </Tooltip.Root>
        </Box>
      </Field.Root>

      {/* --- Nội dung --- */}
      <Field.Root id="post-content" required>
        <Field.Label>Nội dung</Field.Label>
        <Textarea
          placeholder="Viết nội dung của bạn ở đây. Hỗ trợ cú pháp Markdown."
          minH="300px"
          css={{ "--focus-color": "var(--chakra-colors-teal-500)" }} // focusBorderColor -> css prop
          fontSize="md"
          p={4}
        />
        <Field.HelperText> {/* FormHelperText -> Field.HelpText */}
          Bạn có thể sử dụng Markdown để định dạng bài viết.
        </Field.HelperText>
      </Field.Root>

      {/* --- Actions --- */}
      <HStack justifyContent="flex-end" w="full" gap={3} mt={4}>
        <Button variant="ghost" colorPalette="gray">Lưu nháp</Button> {/* colorScheme -> colorPalette */}
        <Button colorPalette="teal"> {/* colorScheme -> colorPalette */}
          Đăng bài<Icon as={FiSend} ml={2}/> {/* Thêm margin cho icon */}
        </Button>
      </HStack>
    </VStack>
  </Card.Body>
</Card.Root>
        </VStack>
      </Container>
  
  );
}

