<template>
  <div>
    <Navbar :user="authUser.name" @logout="onLogout" />
    <slot />
  </div>
</template>

<script setup>
import { useAuth } from "@/composables/useAuth";

definePageMeta({
  middleware: ["auth"],
});

const { user: authUser, logout } = useAuth();
const onLogout = () => logout();
</script>
