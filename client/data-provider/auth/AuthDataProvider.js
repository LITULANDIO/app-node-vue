import axios from "axios";
import { useAuth } from "@/composables/useAuth";
const { setToken } = useAuth();

export const AuthDataProvider = async ({ type, params, baseApiUrl }) => {
  if (!baseApiUrl) {
    throw new Error("Error: baseApiUrl is required");
  }

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

  const options = actions[type];
  if (!options) {
    console.error("Unsupported Data Provider request parameters");
    return;
  }

  try {
    const response = await axios(options);

    if (type === "LOGIN" && response.data.body?.token) {
      setToken(response.data.body.token);
    }

    return response;
  } catch (error) {
    console.error(
      `Error calling URL ${options.url} with method ${options.method}:`,
      error
    );
    throw error;
  }
};
