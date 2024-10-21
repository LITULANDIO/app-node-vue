import { ref } from 'vue'
import { DataProvider } from '@/data-provider/index'

export function useGuests() {
  const guests = ref(null)
  const isLoading = ref(false)
  const isSelected = ref(false)

  const getGuests = async (id) => {
    isLoading.value = true
    try {
      const response = await DataProvider({
        providerType: 'GUESTS',
        type: 'GET_GUESTS',
        params: id
      })
      guests.value = response.body
    } catch (error) {
      console.error('Error fetching guests:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addGuestInGroup = async ({ guest, id }) => {
    isLoading.value = true
    try {
      await DataProvider({
        providerType: 'GUESTS',
        type: 'INSERT_GUEST',
        params: guest
      })
      await getGuests(id)
    } catch (error) {
      console.error('Error adding guest:', error)
    } finally {
      isLoading.value = false
    }
  }

  const deleteGuest = async ({ guest, id }) => {
    try {
      await DataProvider({
        providerType: 'GUESTS',
        type: 'DELETE_GUEST',
        params: guest
      })
      await getGuests(id)
    } catch (error) {
      console.error('Error deleting guest:', error)
    }
  }

  const updateGuest = async (guest, id) => {
    try {
      await DataProvider({
        providerType: 'GUESTS',
        type: 'UPDATE_GUEST',
        params: guest
      })
      await getGuests(id)
    } catch (error) {
      console.error('Error updating guest:', error)
    }
  }

  return {
    guests,
    isLoading,
    isSelected,
    getGuests,
    addGuestInGroup,
    deleteGuest,
    updateGuest
  }
}