import { defineStore, acceptHMRUpdate } from 'pinia'
import { DataProvider } from '@/data-provider/index'

export const useStoreGuest = defineStore('guests', {
  state: () => {
    return {
     data: null,
     isLoading: false
    }
  },
  actions: {
    async getGuests (id) {
       this.isLoading = true
        const guests = await DataProvider({
            providerType: 'GUESTS',
            type: 'GET_GUESTS',
            params: id
        })
       this.data = guests?.body
       this.isLoading = false
    },
    async addGuestInGroup ({guest, id}) {
      this.isLoading = true
      await DataProvider({
          providerType: 'GUESTS',
          type: 'INSERT_GUEST',
          params: guest
      })
    this.getGuests(id)
    this.isLoading = false
    },
    async deleteGuest ({guest, id}) {
      await DataProvider({
        providerType: 'GUESTS',
        type: 'DELETE_GUEST',
        params: guest
    })
    this.getGuests(id)
    },
    async updateGuest (guest, id) {
      await DataProvider({
        providerType: 'GUESTS',
        type: 'UPDATE_GUEST',
        params: guest
      })
      this.getGuests(id)
    }
  },
  getter: {},
  persist: true
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreGuest, import.meta.hot))
}

