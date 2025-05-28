// src/shared/nats/nats-client.ts
import { env } from "@/env";
import { connect, NatsConnection, StringCodec } from "nats";

type ListenerFn<T> = (data: T) => void;
export class NatsClient {
	private nc: NatsConnection;
	private sc = StringCodec();

	constructor() {
		this.nc = null as any;
	}
	private async connect() {
		if (this.nc) {
			return; // Already connected
		}
		this.nc = await connect({
			servers: env.NATS_SERVER_URL || "nats://localhost:4222",
		});
	}

	async publish(subject: string, data: object) {
		await this.connect();
		this.nc!.publish(subject, this.sc.encode(JSON.stringify(data)));
	}

	async subscribe<T extends Object>(subject: string, handler: ListenerFn<T>) {
		await this.connect();
		this.nc.subscribe(subject, {
			callback: (err, msg) => {
				if (err) {
					console.error("NATS subscription error:", err);
					return;
				}
				try {
					const data = JSON.parse(this.sc.decode(msg.data)) as T;
					handler(data);
				} catch (error) {
					console.error("Error processing NATS message:", error);
				}
			},
		});
	}
}

export const natsClient = new NatsClient();
