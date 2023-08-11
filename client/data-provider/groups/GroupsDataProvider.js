import axios from 'axios'

export const GroupsDataProvider = ({ type, params, baseApiUrl }) => {
    let options = null

    switch(type) {
        case "INSERT_GROUP": 
            if (baseApiUrl) {
                options = {
                    method: "POST",
                    url: `${baseApiUrl}/user/group`,
                    data: JSON.parse(JSON.stringify(params)),
                    headers: {
                        Accept: "application/json",
                    }
                }
            } else {
                throw new Error('Error baseApiUrl are necessary')
            }
            break;
        case "DELETE_GROUP":
            if (baseApiUrl) {
                options = {
                    method: "PUT",
                    url: `${baseApiUrl}/user/group`
                }
            } else {
                throw new Error('Error baseApiUrl are necessary')
            }
            break;
        case "GET_GROUP":
            if (baseApiUrl) {
                options = {
                    method: "GET",
                    url: `${baseApiUrl}/user/group/${params}`
                }
            } else {
                throw new Error('Error baseApiUrl are necessary')
            }
            break;
        case "GET_GROUPS":

            if (baseApiUrl) {
                options = {
                    method: "GET",
                    url: `${baseApiUrl}/user/group`
                }
            } else {
                throw new Error('Error baseApiUrl are necessary')
            }
            break;      
        case "MATCH_CODE":
                console.log({options})
    
            if (baseApiUrl) {
                options = {
                    method: "POST",
                    url: `${baseApiUrl}/user/group/matchCode`,
                    data: JSON.parse(JSON.stringify(params)) 
                }
            } else {
                throw new Error('Error baseApiUrl are necessary')
            }
            break;
        case "GET_GROUPS_USER":
    
            if (baseApiUrl) {
                options = {
                    method: "POST",
                    url: `${baseApiUrl}/user/group/guests/getGroupsGuest`,
                    data: {id: params }
                }
            } else {
                throw new Error('Error baseApiUrl are necessary')
            }
            break;      
    }

    if (!!options) {
        let response = axios(options)
            .then((res) => {
                return res.data
            })
            .catch(error => {
                console.error(`Error calling the url ${options.url} using the the method ${options.method}`, error);
            })

        return response;

    } else {
        console.error("Unsupported Data Provider request parameters");
    }


}