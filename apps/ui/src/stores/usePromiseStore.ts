import { create } from "zustand";
interface PromiseStore {
	pending: Map<
		string,
		{
			resolve: (data: any) => void;
			reject: (err: any) => void;
		}
	>;
	addPending: (id: string, handlers: { resolve: any; reject: any }) => void;
	resolvePending: (id: string, result: any) => void;
	rejectPending: (id: string, error: any) => void;
	isPending: (id: string) => boolean;
	getFirstPending: () => string | null;
}

export const usePromiseStore = create<PromiseStore>((set, get) => ({
	pending: new Map(),

	addPending: (id, handlers) => {
		get().pending.set(id, handlers);
		set({ pending: new Map(get().pending) });
	},

	resolvePending: (id, result) => {
		const handlers = get().pending.get(id);
		if (handlers) {
			handlers.resolve(result);
			get().pending.delete(id);
			set({ pending: new Map(get().pending) });
		}
	},

	rejectPending: (id, error) => {
		const handlers = get().pending.get(id);
		if (handlers) {
			handlers.reject(error);
			get().pending.delete(id);
			set({ pending: new Map(get().pending) });
		}
	},
	isPending: (id) => get().pending.has(id),
	getFirstPending: () => {
		return get().pending.keys().next().value || null;
	},
}));
