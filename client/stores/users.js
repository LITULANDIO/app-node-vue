import { defineStore, acceptHMRUpdate } from 'pinia'
import { DataProvider } from "@/data-provider/index"
import { parse, stringify } from 'zipson'

import axios from 'axios'
const runtimeConfig = useRuntimeConfig();

export const useStoreUsers = defineStore('store', {
  state: async () => {
    return {
     users: null,
     user: null

    }
  },
  actions: {
    getAllUsers: async function() {
        const users = await DataProvider({
            providerType: 'USERS',
            type: 'GET_USERS',
          })
        this.users = users?.data?.body   
    },
    getUser: async function() {
      const user = await DataProvider({
        providerType: 'USERS',
        type: 'GET_USER',
      })
    this.user = user?.data?.body   
    },
    uploadImage: async (file) =>{
      if (!file) return

      try{
          const formData = new FormData()
          formData.append('upload_preset', 'curso-vue')
          formData.append('file', file)

          const url = runtimeConfig.public.keyClodinary
          const { data } = await axios.post(url, formData)
          return data.secure_url

        }catch(error){
          console.error('Error al cargar la imagen', error)
          return null
      }
    }
  },
  getter: {
    getUsers: state => state.users,
  },
  persist: {
    serializer: {
      deserialize: parse,
      serialize: stringify
    }
  },
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreUsers, import.meta.hot))
}

