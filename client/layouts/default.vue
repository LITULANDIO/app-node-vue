<template>
  <div>
    <Navbar :user="user.name" @logout="onLogout"/>
    <slot />
  </div>
</template>

<script setup>
import { useStoreAuth } from '~~/stores/auth';
import useAuth from '@/composables/auth';
import { storeToRefs } from 'pinia'

definePageMeta({
  middleware: ["auth"]
})

const { user } = storeToRefs(useStoreAuth())
const { clearAuthData, deleteAllCookies } = useAuth()

const onLogout = () => {
  clearAuthData()
  //deleteAllCookies()
  localStorage.removeItem('group')
  localStorage.removeItem('friend-me')
  localStorage.removeItem('groups-user')
  localStorage.removeItem('friend')
  user.value = {
    id: '',
    name: '',
    lastname: '',
    photo: '',
  }
  navigateTo('/')
}
</script>