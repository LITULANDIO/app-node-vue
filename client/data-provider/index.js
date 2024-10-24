import { getAPI } from './api/api'
import { AuthDataProvider } from './auth/AuthDataProvider'
import { UsersDataProvider } from './users/UsersDataProvider'
import { GroupsDataProvider } from './groups/GroupsDataProvider'
import { GuestsDataProvider } from './guests/GuestsDataProvider'
import { MailDataProvider } from './mail/MailDataProvider'
import { WishesDataProvider } from './wishes/WishesDataProvider'

export const DataProvider = ({providerType, type, params}) => {
    let data = null;

    switch(providerType) {
        case "AUTH":
            data = AuthDataProvider({
                type,
                params,
                baseApiUrl: getAPI()
            });
            break;
        case "USERS": 
            data = UsersDataProvider({
                type,
                params,
                baseApiUrl: getAPI()
            });
            break;
        case "GROUPS": 
            data = GroupsDataProvider({
                type,
                params,
                baseApiUrl: getAPI()
            });
            break;
        case "GUESTS": 
            data = GuestsDataProvider({
                type,
                params,
                baseApiUrl: getAPI()
            });
            break;
        case "MAIL": 
            data = MailDataProvider({
                type,
                params,
                baseApiUrl: getAPI()
            });
            break;
        case "WISHES": 
            data = WishesDataProvider({
                type,
                params,
                baseApiUrl: getAPI()
            });
            break;

        default: 
            break;
    }

    return data
}