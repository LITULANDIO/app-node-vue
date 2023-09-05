<template>
    <div v-if="loading" class="fixed left-0 top-0 h-0.5 w-full z-50 bg-green-500" ></div>
    <NuxtPage />
    <NuxtLoadingIndicator />
    <ButtonConfig v-if="!loading || !isProfile"/>
</template>

<script setup>
import { computed } from 'vue'
  const nuxtApp = useNuxtApp();
  const loading = ref(false);
  const router = useRouter()
  nuxtApp.hook("page:start", () => {
    loading.value = true;
    const isProfile = computed(() => router.currentRoute._value.name === 'dashboard-user-my-profile')
  });
  nuxtApp.hook("page:finish", () => {
    loading.value = false;
  });
</script>
<style>
body{
position: relative;
padding: 0;
margin: 0;
margin-top: 5rem;
background: rgb(2,0,36);
background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(4,192,168,0.7651654411764706) 100%, rgba(0,212,255,1) 100%);
}
*, ::after, ::before {
    box-sizing: inherit;
}
</style>