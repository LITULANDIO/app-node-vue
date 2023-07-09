import axios from 'axios'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, DELETE';
axios.defaults.headers.common['Allow'] = 'GET, POST, OPTIONS, PUT, DELETE';

export const GuestsDataProvider = ({ type, params, baseApiUrl }) => {
    let options = null

    switch(type) {
        case "INSERT_GUEST": 
            if (baseApiUrl) {
                options = {
                    method: "POST",
                    url: `${baseApiUrl}/user/group/guests/addGuest`,
                    data: params,
                    headers: {
                        Accept: "application/json",
                    }
                }
                console.log('options =>', options)
                console.log('params =>', params)

            } else {
                throw new Error('Error baseApiUrl are necessary')
            }
            break;
        case "GET_GUESTS": 
            if (baseApiUrl) {
                options = {
                    method: "GET",
                    url: `${baseApiUrl}/user/group/guests/${params}`,
                    data: params,
                    headers: {
                        Accept: "application/json",
                    }
                }
                console.log('options =>', options)
                console.log('params =>', params)

            } else {
                throw new Error('Error baseApiUrl are necessary')
            }
            break;
        case "DELETE_GUEST":
            if (baseApiUrl) {
                console.log(params)
                options = {
                    method: "PUT",
                    url: `${baseApiUrl}/user/group/guests/deleteGuest`,
                    data: JSON.stringify(params)
                }
            } else {
                throw new Error('Error baseApiUrl are necessary')
            }
            break;
        case "UPDATE_GUEST":
            if (baseApiUrl) {
                console.log(params)
                options = {
                    method: "PUT",
                    url: `${baseApiUrl}/user/group/guests/updateGuest`,
                    data: params
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