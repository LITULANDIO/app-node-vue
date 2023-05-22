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
import { useStoreGroup } from '../stores/groups';
const storeGroup = useStoreGroup()
const { group } = storeToRefs(storeGroup)
const { user } = storeToRefs(useStoreAuth())
const { clearAuthData } = useAuth()

const onLogout = () => {
  clearAuthData()
  group.value = {
      id: '',
      admin: '',
      name: '',
      date: '',
      budget: '',
      snug: '',
    }
}

definePageMeta({
  middleware: ["auth"]
})
</script>