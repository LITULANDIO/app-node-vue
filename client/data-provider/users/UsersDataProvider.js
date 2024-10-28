import axios from "axios";

export const UsersDataProvider = async ({ type, params, baseApiUrl }) => {
  if (!baseApiUrl) {
    throw new Error("Error: baseApiUrl is required");
  }

  const actions = {
    INSERT_USER: {
      method: "POST",
      url: `${baseApiUrl}/users`,
      data: params,
      headers: { Accept: "application/json" },
    },
    DELETE_USER: {
      method: "PUT",
      url: `${baseApiUrl}/users`,
    },
    GET_USER: {
      method: "GET",
      url: `${baseApiUrl}/users/${params}`,
    },
    GET_USERS: {
      method: "GET",
      url: `${baseApiUrl}/users`,
    },
    UPDATE_PHOTO: {
      method: "POST",
      url: `${baseApiUrl}/users/updatePhoto`,
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
    return response.data;
  } catch (error) {
    console.error(
      `Error calling the URL ${options.url} with method ${options.method}:`,
      error
    );
    throw error;
  }
};
