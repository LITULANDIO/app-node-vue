import { useAuth } from '@/composables/useAuth'
const { isAuthenticated } = useAuth()
export default defineNuxtRouteMiddleware (() => {
     if (!isAuthenticated()) {
         return navigateTo('/');
     }
    })