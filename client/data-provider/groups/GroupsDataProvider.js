import axios from "axios";

export const GroupsDataProvider = async ({ type, params, baseApiUrl }) => {
  if (!baseApiUrl) {
    throw new Error("Error: baseApiUrl is required");
  }

  const actions = {
    INSERT_GROUP: {
      method: "POST",
      url: `${baseApiUrl}/user/group`,
      data: params,
      headers: { Accept: "application/json" },
    },
    DELETE_GROUP: {
      method: "PUT",
      url: `${baseApiUrl}/user/group`,
    },
    GET_GROUP: {
      method: "GET",
      url: `${baseApiUrl}/user/group/${params}`,
    },
    GET_GROUPS: {
      method: "GET",
      url: `${baseApiUrl}/user/group`,
    },
    MATCH_CODE: {
      method: "POST",
      url: `${baseApiUrl}/user/group/matchCode`,
      data: params,
    },
    GET_GROUPS_USER: {
      method: "POST",
      url: `${baseApiUrl}/user/group/guests/getGroupsGuest`,
      data: { id: params },
    },
  };

  // Seleccionar la acción correspondiente a 'type'
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
      `Error calling URL ${options.url} with method ${options.method}:`,
      error
    );
    throw error;
  }
};
