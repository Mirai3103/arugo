import { create } from "zustand";

interface PendingPromise {
  resolve: (data: any) => void;
  reject: (error: any) => void;
}

interface PromiseStore {
  pending?: PendingPromise;
  type?: "test" | "submit";
  id?: string;

  addPending: (
    id: string,
    handlers: PendingPromise,
    type: "test" | "submit",
  ) => void;
  resolvePending: (result: any) => void;
  rejectPending: (error: any) => void;
  isPending: () => boolean;
  getFirstPending: () => string | null;
  clearPending: () => void;
}

export const usePromiseStore = create<PromiseStore>((set, get) => ({
  addPending: (id, handlers, type) => {
    set({ id, pending: handlers, type });
  },

  resolvePending: (result) => {
    const { pending } = get();
    if (pending) {
      pending.resolve(result);
      get().clearPending();
    }
  },

  rejectPending: (error) => {
    const { pending } = get();
    if (pending) {
      pending.reject(error);
      get().clearPending();
    }
  },

  clearPending: () => {
    set({ pending: undefined, id: undefined, type: undefined });
  },

  isPending: () => !!get().pending,

  getFirstPending: () => get().id ?? null,
}));
