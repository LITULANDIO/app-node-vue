import { ref, watch } from 'vue'
import { DataProvider } from '@/data-provider/index'

export function useGroups() {
  const group = ref({
    id: '',
    admin: '',
    name: '',
    date: '',
    budget: '',
    location: '',
    snug: '',
  })

  const isLoading = ref(false)
  const groups = ref(JSON.parse(localStorage.getItem('groups')) || [])
  const groupsUser = ref(JSON.parse(localStorage.getItem('groups-user')) || [])

  watch(groups, (newValue) => {
    localStorage.setItem('groups', JSON.stringify(newValue))
  }, { deep: true })

  watch(groupsUser, (newValue) => {
    localStorage.setItem('groups-user', JSON.stringify(newValue))
  }, { deep: true })

  const setGroups = (newGroups) => {
    groups.value = newGroups
  }

  const setGroupsUser = (newGroupsUser) => {
    groupsUser.value = newGroupsUser
  }

  const getGroups = async (id) => {
    isLoading.value = true
    try {
      const fetchGroup = await DataProvider({
        providerType: 'GROUPS',
        type: 'GET_GROUPS',
      })
      groups.value = fetchGroup.body.filter(group => group.admin === id)
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addGroup = async ({ dataGroup, idUser }) => {
    isLoading.value = true
    try {
      await DataProvider({
        providerType: 'GROUPS',
        type: 'INSERT_GROUP',
        params: JSON.parse(JSON.stringify(dataGroup))
      })
      await getGroups(idUser)
    } catch (error) {
      console.error('Error adding group:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addGuestInGroup = async (data) => {
    console.log('ADD GUEST =>', data)
    try {
      await DataProvider({
        providerType: 'GUESTS',
        type: 'INSERT_GUEST',
        params: JSON.parse(JSON.stringify(data))
      })
    } catch (error) {
      console.error('Error adding guest to group:', error)
    }
  }

  const setCurrentGroup = (newGroup) => {
    Object.assign(group, newGroup)
    localStorage.setItem('group', JSON.stringify(newGroup))
  }

  const getCurrentGroup = () => {
    const storedGroup = localStorage.getItem('group')
    if (storedGroup) {
      Object.assign(group, JSON.parse(storedGroup))
    }
    return group
  }

  return {
    group,
    groups,
    groupsUser,
    getGroups,
    setGroups,
    setGroupsUser,
    addGroup,
    addGuestInGroup,
    setCurrentGroup,
    getCurrentGroup,
    isLoading
  }
}