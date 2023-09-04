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
    }
  },
  actions: {
    async login(data) {
      await DataProvider({
        providerType: 'AUTH',
        type: 'LOGIN',
        params: data
      })
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