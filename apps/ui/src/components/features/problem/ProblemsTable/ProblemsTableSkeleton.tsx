import {
	Box,
	HStack,
	Skeleton,
	SkeletonText,
	Stack,
	Table,
} from "@chakra-ui/react";
import React from "react";
export function generateSkeletonRows(count = 10) {
	const skeletonRows = Array.from({ length: count }, (_, index) => (
		// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
		<Table.Row key={index}>
			<Table.Cell>
				<Skeleton height="20px" width="20px" borderRadius="full" />
			</Table.Cell>

			<Table.Cell>
				<SkeletonText noOfLines={1} width={`${Math.random() * 40 + 60}%`} />
			</Table.Cell>

			<Table.Cell>
				<Skeleton height="20px" width="60px" />
			</Table.Cell>

			{/* Tags column */}
			<Table.Cell>
				<HStack gap={1}>
					{Array.from(
						{ length: Math.floor(Math.random() * 3) + 1 },
						(_, tagIndex) => (
							<Skeleton
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={tagIndex}
								height="20px"
								width={`${Math.random() * 20 + 40}px`}
								borderRadius="md"
							/>
						),
					)}
				</HStack>
			</Table.Cell>
			<Table.Cell>
				<Skeleton height="20px" width="50px" />
			</Table.Cell>
		</Table.Row>
	));
	return skeletonRows;
}
export const ProblemsTableSkeleton = () => {
	const skeletonRows = React.useMemo(() => generateSkeletonRows(10), []);
	return (
		<Box>
			{/* Search and Filters Skeleton */}
			<Stack direction={{ base: "column", md: "row" }} gap={4} mb={6}>
				{/* Search input skeleton */}
				<Skeleton height="40px" width={{ base: "full", md: "300px" }} />

				{/* Difficulty select skeleton */}
				<Skeleton height="40px" width={{ base: "full", md: "200px" }} />

				{/* Tags combobox skeleton */}
				<Skeleton height="40px" width={{ base: "full", md: "200px" }} />
			</Stack>

			{/* Table skeleton */}
			<Box overflowX="auto">
				<Table.Root
					variant="line"
					size={{
						base: "sm",
						md: "md",
					}}
				>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader>
								<Skeleton height="20px" width="60px" />
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<Skeleton height="20px" width="60px" />
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<Skeleton height="20px" width="50px" />
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<Skeleton height="20px" width="30px" />
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<Skeleton height="20px" width="70px" />
							</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>{skeletonRows}</Table.Body>
				</Table.Root>
			</Box>

			{/* Pagination skeleton */}
			<HStack gap={2} mt={6} justifyContent="center">
				<Skeleton height="32px" width="32px" />
				<Skeleton height="32px" width="32px" />
				<Skeleton height="20px" width="20px" />
				{Array.from({ length: 5 }, (_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<Skeleton key={index} height="32px" width="32px" />
				))}
				<Skeleton height="20px" width="20px" />
				<Skeleton height="32px" width="32px" />
				<Skeleton height="32px" width="32px" />
			</HStack>
		</Box>
	);
};

export default ProblemsTableSkeleton;
