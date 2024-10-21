import { useAuth } from '@/composables/useAuth'
const { isAuthenticated } = useAuth()
export default defineNuxtRouteMiddleware (() => {
     if (!isAuthenticated.value) {
         return navigateTo('/');
     }
    })