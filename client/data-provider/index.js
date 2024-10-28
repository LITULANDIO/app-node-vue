import { getAPI } from "./api/api";
import { AuthDataProvider } from "./auth/AuthDataProvider";
import { UsersDataProvider } from "./users/UsersDataProvider";
import { GroupsDataProvider } from "./groups/GroupsDataProvider";
import { GuestsDataProvider } from "./guests/GuestsDataProvider";
import { MailDataProvider } from "./mail/MailDataProvider";
import { WishesDataProvider } from "./wishes/WishesDataProvider";

const providersMap = {
  AUTH: AuthDataProvider,
  USERS: UsersDataProvider,
  GROUPS: GroupsDataProvider,
  GUESTS: GuestsDataProvider,
  MAIL: MailDataProvider,
  WISHES: WishesDataProvider,
};

export const DataProvider = ({ providerType, type, params }) => {
  const providerFunction = providersMap[providerType];

  if (!providerFunction) {
    console.error(`Unsupported provider type: ${providerType}`);
    return null;
  }

  try {
    return providerFunction({
      type,
      params,
      baseApiUrl: getAPI(),
    });
  } catch (error) {
    console.error(
      `Error in DataProvider for ${providerType} with type ${type}:`,
      error
    );
    return null;
  }
};
