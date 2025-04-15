import { defineVuetifyConfiguration } from "vuetify-nuxt-module/custom-configuration";

export default defineVuetifyConfiguration({
  // your Vuetify options here
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#190404",
          secondary: "#fbf6f3",
          accent: "#82B1FF",
          error: "#ff5c5f",
          errorDark: "#d32f2f",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
          white: "#ffffff",
          black: "#333333",
          background: "#fbf6f3",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#190404",
          secondary: "#fbf6f3",
          accent: "#82B1FF",
          error: "#ff5c5f",
          errorDark: "#d32f2f",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
          white: "#ffffff",
          black: "#333333",
          background: "#fbf6f3",
        },
      },
    },
  },
});
