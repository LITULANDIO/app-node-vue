import { defineStore, acceptHMRUpdate } from 'pinia'
import { DataProvider } from "@/data-provider/index"

export const useStoreAuth = defineStore('auth', {
  state: () => {
    return {
     user: {
        id: null,
        name: '',
        photo: ''
     },
     groups: [],
     friend: {}
     

    }
  },
  actions: {
    async getGroupsOfUser (id) {
      const fetchGroups = await DataProvider({
           providerType: 'GROUPS',
           type: 'GET_GROUPS_USER',
           params: id
       })
       console.log({fetchGroups})
      this.groups = fetchGroups.body
  },
  },
  getter: {},
  persist: true
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreAuth, import.meta.hot))
}