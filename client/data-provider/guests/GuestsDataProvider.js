import axios from "axios";

export const GuestsDataProvider = async ({ type, params, baseApiUrl }) => {
  if (!baseApiUrl) {
    throw new Error("Error: baseApiUrl is required");
  }

  const actions = {
    INSERT_GUEST: {
      method: "POST",
      url: `${baseApiUrl}/user/group/guests/addGuest`,
      data: params,
      headers: { Accept: "application/json" },
    },
    GET_GUESTS: {
      method: "GET",
      url: `${baseApiUrl}/user/group/guests/${params}`,
      headers: { Accept: "application/json" },
    },
    DELETE_GUEST: {
      method: "PUT",
      url: `${baseApiUrl}/user/group/guests/deleteGuest`,
      data: JSON.stringify(params),
    },
    UPDATE_GUEST: {
      method: "PUT",
      url: `${baseApiUrl}/user/group/guests/updateGuest`,
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
