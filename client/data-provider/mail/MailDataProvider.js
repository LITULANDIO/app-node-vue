import axios from "axios";

export const MailDataProvider = async ({ type, params, baseApiUrl }) => {
  if (!baseApiUrl) {
    throw new Error("Error: baseApiUrl is required");
  }

  const actions = {
    SENDMAIL: {
      method: "POST",
      url: `${baseApiUrl}/users/mail/sendmail`,
      data: params,
      headers: { Accept: "application/json" },
    },
    SENDMAILFORGOT: {
      method: "POST",
      url: `${baseApiUrl}/users/mail/forgotPassword`,
      data: params,
      headers: { Accept: "application/json" },
    },
    SENDMAILSUCCESWISHES: {
      method: "POST",
      url: `${baseApiUrl}/users/mail/succesWishes`,
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
