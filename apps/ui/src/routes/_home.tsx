import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { Box } from "@chakra-ui/react";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Box>
			<Header />
			<Outlet />
			<Footer />
		</Box>
	);
}
