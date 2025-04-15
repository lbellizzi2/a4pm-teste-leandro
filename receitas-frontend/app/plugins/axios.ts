// plugins/axios.ts
import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  // Estado global para controlar o loading (booleano)
  const loading = useState<boolean>("globalLoading", () => false);

  // Cria uma instância do axios com a baseURL do backend.
  // Substitua 'https://api.example.com/' pela URL do seu backend.
  const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:3016/api",
  });

  // Interceptor para requisições: ativa o loading
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      loading.value = true;
      return config;
    },
    (error) => {
      loading.value = false;
      return Promise.reject(error);
    }
  );

  // Interceptor para respostas: desativa o loading
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      loading.value = false;
      return response;
    },
    (error) => {
      loading.value = false;
      return Promise.reject(error);
    }
  );

  // Injeta a instância do axios no contexto do Nuxt
  return {
    provide: {
      axios: api,
    },
  };
});
