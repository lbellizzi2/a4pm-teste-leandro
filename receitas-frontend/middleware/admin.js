// middleware/admin.js
export default defineNuxtRouteMiddleware((to, from) => {
  // Exemplo simples: o estado 'admin' guarda os dados do admin logado
  const admin = useState("admin").value;

  // Se não estiver autenticado e não estiver na rota de login, redirecione para /admin/login
  if (!admin && to.path !== "/admin/login") {
    return navigateTo("/admin/login");
  }
});
