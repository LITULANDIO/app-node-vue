import axios from "axios";

export const WishesDataProvider = async ({ type, params, baseApiUrl }) => {
  if (!baseApiUrl) {
    throw new Error("Error: baseApiUrl is required");
  }

  const actions = {
    INSERT_WISHES: {
      method: "POST",
      url: `${baseApiUrl}/user/wishes`,
      data: params,
      headers: { Accept: "application/json" },
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
