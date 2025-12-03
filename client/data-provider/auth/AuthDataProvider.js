import axios from "axios";
import { useAuth } from "@/composables/useAuth";
const { setToken } = useAuth();

export const AuthDataProvider = async ({ type, params, baseApiUrl }) => {
  if (!baseApiUrl) {
    throw new Error("Error: baseApiUrl is required");
  }

  // Definir la configuración de cada acción en un objeto
  const actions = {
    LOGIN: {
      method: "POST",
      url: `${baseApiUrl}/auth/login`,
      data: params,
    },
    LOGOUT: {
      method: "GET",
      url: `${baseApiUrl}/logout`,
    },
    GET_USERS: {
      method: "GET",
      url: `${baseApiUrl}/auth/allUsers`,
    },
    UPDATE_PASSWORD: {
      method: "POST",
      url: `${baseApiUrl}/auth/updatePassword`,
      data: params,
    },
  };
  // Seleccionar las opciones según el tipo
  const options = actions[type];
  if (!options) {
    console.error("Unsupported Data Provider request parameters");
    return;
  }

  try {
    const response = await axios(options);

    // Manejo específico para LOGIN: guarda el token
    if (type === "LOGIN" && response.data.body?.token) {
      setToken(response.data.body.token);
    }

    return response;
  } catch (error) {
    console.error(
      `Error calling URL ${options.url} with method ${options.method}:`,
      error
    );
    throw error; // Lanza el error para manejarlo en el nivel superior si es necesario
  }
};
