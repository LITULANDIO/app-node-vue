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
     friend: {},
     loading: false
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
      this.loading = true
      DataProvider({
           providerType: 'GROUPS',
           type: 'GET_GROUPS_USER',
           params: id
       }).then((res) => {
         this.groups = res.body
         window.localStorage.setItem('groups-user', JSON.stringify(res.body))
       }).finally( () => {
        this.loading = false
       })
      console.log('groups user request', fetchGroups.body)
  }
  },
  getter: {},
  persist: {
    enabled: true,
    serializer: {
      deserialize: parse,
      serialize: stringify
    }
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreAuth, import.meta.hot))
}