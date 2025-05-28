import { createListCollection } from "@chakra-ui/react";
export const DIFFICULTY_LABELS = ["", "Dễ", "Trung bình", "Khó"];
const DIFFICULTY_LEVELS = [
	{
		label: "Dễ",
		value: "1",
	},
	{
		label: "Trung bình",
		value: "2",
	},
	{
		label: "Khó",
		value: "3",
	},
];
export const DIFFICULTY_COLORS = ["", "green.500", "orange.400", "red.500"];
export const DIFFICULTY_COLORS_PALATE = ["", "green", "orange", "red"];
export const DIFFICULTY_LEVEL_COLLECTION = createListCollection({
	items: DIFFICULTY_LEVELS,
});
