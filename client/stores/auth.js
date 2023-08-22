import { defineStore, acceptHMRUpdate } from 'pinia'
import { DataProvider } from "@/data-provider/index"
import { parse, stringify } from 'zipson'

export const useStoreAuth = defineStore('auth', {
  state: () => {
    return {
     user: {
        id: null,
        email: '',
        name: '',
        photo: ''
     },
     groups: [],
     friend: {}
     

    }
  },
  actions: {
    async login(data) {
      await DataProvider({
        providerType: 'AUTH',
        type: 'LOGIN',
        params: data
      })
    },
    async getGroupsOfUser (id) {
      const fetchGroups = await DataProvider({
           providerType: 'GROUPS',
           type: 'GET_GROUPS_USER',
           params: id
       })
      this.groups = fetchGroups.body
  },
  // async getUser ({ id, name }) {
  //   const fetchUser = await DataProvider({
  //     providerType: 'USERS',
  //     type: 'GET_USER',
  //     params: id
  //   })
  //   console.log({fetchUser})
  //   this.user.id = id
  //   this.user.name = name
  //   this.user.photo = fetchUser.body[0].photo
  // }
  },
  getter: {},
  persist: {
    serializer: {
      deserialize: parse,
      serialize: stringify
    }
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreAuth, import.meta.hot))
}