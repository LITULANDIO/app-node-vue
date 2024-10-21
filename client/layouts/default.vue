<template>
  <div>
    <Navbar :user="authUser.name" @logout="onLogout"/>
    <slot />
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

definePageMeta({
  middleware: ["auth"]
})

const { user: authUser, clearAuthData, deleteAllCookies } = useAuth()

const onLogout = () => {
  clearAuthData()
  //deleteAllCookies()
  // localStorage.removeItem('group')
  // localStorage.removeItem('friend-me')
  //localStorage.removeItem('groups-user')
  // localStorage.removeItem('friend')
  authUser.value = {
    id: '',
    name: '',
    lastname: '',
    photo: '',
  }
  navigateTo('/')
}
</script>