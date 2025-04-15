import { vi } from "vitest";

export const useNuxtApp = () => ({
  $axios: {
    get: vi.fn(),
  },
});
