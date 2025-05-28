import { useColorModeValue } from "@/components/ui/color-mode";
import type { BriefProblem } from "@/server/modules/problems/problemService";
import {
	DIFFICULTY_COLORS,
	DIFFICULTY_LABELS,
} from "@/utils/constants/difficulties";
import { Badge, Icon, Table, Text, Wrap } from "@chakra-ui/react";
import type React from "react";
import { FaRegCircle } from "react-icons/fa";

interface ProblemRowProps {
	problem: BriefProblem;
	onClick: (slug: string) => void;
}

export const ProblemRow: React.FC<ProblemRowProps> = ({ problem, onClick }) => (
	<Table.Row
		_hover={{
			bg: useColorModeValue("gray.50", "gray.700"),
			cursor: "pointer",
		}}
		onClick={() => onClick(problem.slug)}
	>
		<Table.Cell>
			<Icon size="md" color="yellow.500">
				<FaRegCircle />
			</Icon>
		</Table.Cell>
		<Table.Cell fontWeight="medium">{problem.title}</Table.Cell>
		<Table.Cell>
			<Text
				color={DIFFICULTY_COLORS[problem.difficultyLevel] || "gray.500"}
				fontWeight="medium"
			>
				{DIFFICULTY_LABELS[problem.difficultyLevel]}
			</Text>
		</Table.Cell>
		<Table.Cell>
			<Wrap gap={1}>
				{problem.tags.map((tag) => (
					<Badge fontSize="0.8em" key={tag.id}>
						{tag.name}
					</Badge>
				))}
			</Wrap>
		</Table.Cell>
		<Table.Cell fontVariantNumeric="tabular-nums">
			{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
			{(problem?.metadata as any)?.acRate?.toFixed(2)}%
		</Table.Cell>
	</Table.Row>
);
