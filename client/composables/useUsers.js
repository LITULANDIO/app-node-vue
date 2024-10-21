import { ref } from 'vue'
import { DataProvider } from "@/data-provider/index"
import axios from 'axios'

export function useUsers() {
  const users = ref(null)
  const currentUser = ref(null)
  const runtimeConfig = useRuntimeConfig()

  const getAllUsers = async () => {
    try {
      const response = await DataProvider({
        providerType: 'USERS',
        type: 'GET_USERS',
      })
      users.value = response?.data?.body
    } catch (error) {
      console.error('Error fetching all users:', error)
    }
  }

  const getUser = async () => {
    try {
      const response = await DataProvider({
        providerType: 'USERS',
        type: 'GET_USER',
      })
      currentUser.value = response?.data?.body
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const uploadImage = async (file) => {
    if (!file) return null

    try {
      const formData = new FormData()
      formData.append('upload_preset', 'curso-vue')
      formData.append('file', file)

      const url = runtimeConfig.public.keyClodinary
      const { data } = await axios.post(url, formData)
      return data.secure_url
    } catch (error) {
      console.error('Error al cargar la imagen', error)
      return null
    }
  }

  return {
    users,
    currentUser,
    getAllUsers,
    getUser,
    uploadImage
  }
}