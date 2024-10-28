import { ref, computed, watch } from "vue";
import { DataProvider } from "@/data-provider/index";
import rs from "jsrsasign";

export function useAuth() {
  const userDefault = ref({
    email: "",
    id: "",
    lastname: "",
    name: "",
    photo: "",
  });
  const user = ref(
    process.client
      ? JSON.parse(localStorage.getItem("user")) || userDefault
      : userDefault
  );
  const isAuthenticated = computed(() => checkToken());

  watch(
    user,
    (newValue) => {
      localStorage.setItem("user", JSON.stringify(newValue));
      isAuthenticated.value = !!newValue;
    },
    { deep: true }
  );

  function setToken(token) {
    if (process.client) {
      localStorage.setItem("TOKEN_USER", token);
    }
  }

  function getToken() {
    if (process.client) {
      return localStorage.getItem("TOKEN_USER");
    }
  }

  function deleteToken() {
    if (process.client) {
      localStorage.removeItem("TOKEN_USER");
      navigateTo("/");
    }
  }

  function checkToken() {
    const token = getToken();
    if (token) {
      let tokenData = rs.b64utos(token.split(".")[1]);
      tokenData = JSON.parse(tokenData);
      if (new Date(tokenData.iat * 1000.001) < new Date()) {
        deleteToken();
        return false;
      }
      return true;
    }
    return false;
  }

  async function login(credentials) {
    try {
      const response = await DataProvider({
        providerType: "AUTH",
        type: "LOGIN",
        params: credentials,
      });
      user.value = response.body;
      setToken(response.body.token);
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  function logout() {
    user.value = null;
    deleteToken();
    deleteAllCookies();
    navigateTo(`/`);
  }

  function clearAuthData() {
    deleteToken();
  }

  function deleteAllCookies() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie =
        name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    setToken,
    getToken,
    clearAuthData,
    deleteAllCookies,
  };
}
