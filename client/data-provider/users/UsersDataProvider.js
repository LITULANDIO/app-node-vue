import axios from 'axios'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, DELETE';
axios.defaults.headers.common['Allow'] = 'GET, POST, OPTIONS, PUT, DELETE';

export const UsersDataProvider = ({ type, params, baseApiUrl }) => {
    let options = null

    switch(type) {
        case "INSERT_USER": 
            if (baseApiUrl) {
                options = {
                    method: "POST",
                    url: `${baseApiUrl}/users`,
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
        case "DELETE_USER":
            if (baseApiUrl) {
                options = {
                    method: "PUT",
                    url: `${baseApiUrl}/users`
                }
            } else {
                throw new Error('Error baseApiUrl are necessary')
            }
            break;
        case "GET_USER":
            if (baseApiUrl) {
                options = {
                    method: "GET",
                    url: `${baseApiUrl}/users/${params}`
                }
            } else {
                throw new Error('Error baseApiUrl are necessary')
            }
            break;
        case "GET_USERS":
            console.log({options})

            if (baseApiUrl) {
                options = {
                    method: "GET",
                    url: `${baseApiUrl}/users`
                }
                console.log({options})
            } else {
                throw new Error('Error baseApiUrl are necessary')
            }
            break; 
        case "UPDATE_PHOTO":
            console.log({options})

            if (baseApiUrl) {
                options = {
                    method: "POST",
                    url: `${baseApiUrl}/users/updatePhoto`,
                    data: params
                }
                console.log({options})
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