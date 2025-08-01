import type { Tag } from "@/server/db/schema";
import { DIFFICULTY_LEVEL_COLLECTION } from "@/utils/constants/difficulties";
import {
  Combobox,
  Input,
  InputGroup,
  type ListCollection,
  Portal,
  Select,
  Stack,
} from "@chakra-ui/react";
import type React from "react";
import { FiSearch } from "react-icons/fi";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDifficultyChange: (value: string[]) => void;
  onTagsChange: (value: string[]) => void;
  defaultDifficulties: string[];
  tagCollection: ListCollection<Tag>;
  onTagFilter: (inputValue: string) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onDifficultyChange,
  onTagsChange,
  defaultDifficulties,
  tagCollection,
  onTagFilter,
}) => (
  <Stack direction={{ base: "column", md: "row" }} gap={4} mb={6}>
    <InputGroup
      flex={1}
      width="300px"
      startElement={<FiSearch color="gray.300" />}
    >
      <Input
        placeholder="Tìm kiếm bài tập"
        value={searchTerm}
        onChange={onSearchChange}
      />
    </InputGroup>

    <Select.Root
      collection={DIFFICULTY_LEVEL_COLLECTION}
      multiple
      onValueChange={({ value }) => onDifficultyChange(value)}
      defaultValue={defaultDifficulties}
      width={{ base: "full", md: "200px" }}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Chọn độ khó" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
          <Select.ClearTrigger />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {DIFFICULTY_LEVEL_COLLECTION.items.map((item) => (
            <Select.Item item={item} key={item.value}>
              {item.label}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>

    <Combobox.Root
      collection={tagCollection}
      onInputValueChange={({ inputValue }) => onTagFilter(inputValue)}
      multiple
      onValueChange={({ value }) => onTagsChange(value)}
      width={{ base: "full", md: "200px" }}
    >
      <Combobox.Control>
        <Combobox.Input placeholder="Chọn thẻ" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No tags found</Combobox.Empty>
            {tagCollection.items.map((item) => (
              <Combobox.Item item={item} key={item.id}>
                {item.name}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  </Stack>
);
