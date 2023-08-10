import { DataProvider } from '@/data-provider/index'

export default () => {

    const getAllUsers = async function() {
        const result = await DataProvider({
            providerType: 'AUTH',
            type: 'GET_USERS',
          })
          console.log('result =>', {result})
        return result.data.body   
    }

    const getUser = async function(id) {
        const result = await DataProvider({
            providerType: 'USERS',
            type: 'GET_USER',
            params: id
          })
          
        return result.body
    }

    return {
        getAllUsers,
        getUser
    }
}

