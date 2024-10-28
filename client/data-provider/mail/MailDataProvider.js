import axios from "axios";

export const MailDataProvider = ({ type, params, baseApiUrl }) => {
  let options = null;

  switch (type) {
    case "SENDMAIL":
      if (baseApiUrl) {
        options = {
          method: "POST",
          url: `${baseApiUrl}/users/mail/sendmail`,
          data: JSON.parse(JSON.stringify(params)),
          headers: {
            Accept: "application/json",
          },
        };
      } else {
        throw new Error("Error baseApiUrl are necessary");
      }
      break;

    case "SENDMAILFORGOT":
      if (baseApiUrl) {
        options = {
          method: "POST",
          url: `${baseApiUrl}/users/mail/forgotPassword`,
          data: JSON.parse(JSON.stringify(params)),
          headers: {
            Accept: "application/json",
          },
        };
      } else {
        throw new Error("Error baseApiUrl are necessary");
      }
      break;
    case "SENDMAILSUCCESWISHES":
      if (baseApiUrl) {
        options = {
          method: "POST",
          url: `${baseApiUrl}/users/mail/succesWishes`,
          data: JSON.parse(JSON.stringify(params)),
          headers: {
            Accept: "application/json",
          },
        };
      } else {
        throw new Error("Error baseApiUrl are necessary");
      }
      break;
  }
  if (!!options) {
    let response = axios(options)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.error(
          `Error calling the url ${options.url} using the the method ${options.method}`,
          error
        );
      });

    return response;
  } else {
    console.error("Unsupported Data Provider request parameters");
  }
};
