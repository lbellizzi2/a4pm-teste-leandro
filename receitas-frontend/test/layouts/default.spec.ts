import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DefaultLayout from "~/layouts/default.vue";
import { createTestingPinia } from "@pinia/testing";
import { useUserStore } from "~/stores/userStore";

describe("Default Layout", () => {
  it("renders the layout correctly", () => {
    const wrapper = mount(DefaultLayout, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    expect(wrapper.findComponent({ name: "AppBar" }).exists()).toBe(true);
    expect(wrapper.find(".main-with-appbar").exists()).toBe(true);
    expect(wrapper.find(".page-container").exists()).toBe(true);
  });

  it("initializes user data from localStorage", () => {
    const mockUserData = { name: "Test User", email: "test@example.com" };
    localStorage.setItem("user", JSON.stringify(mockUserData));

    mount(DefaultLayout, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    const userStore = useUserStore();
    expect(userStore.setUserData).toHaveBeenCalledWith(mockUserData);
  });
});
