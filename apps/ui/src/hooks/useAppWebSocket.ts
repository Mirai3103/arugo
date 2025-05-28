import { useWebSocket } from "react-use-websocket/src/lib/use-websocket";
import { useIsClient } from "usehooks-ts";

export default function useAppWebSocket() {
	const isClient = useIsClient();

	const socketUrl = isClient ? "ws://localhost:3000/_ws" : null;

	const ws = useWebSocket(socketUrl, {
		share: true,
		shouldReconnect: () => true,
	});

	return ws;
}
