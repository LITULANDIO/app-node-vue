<template>
    <section id="groups">
        <div v-if="isLoading">
            <Spinner />
        </div>
        <div v-if="!isLoading && groups">
            <h1 class="mb-10 capitalize text-center text-white text-2xl">{{ $t('pages.groups.header') }}</h1>
            <div class="box-group" v-for="group in groups" :key="group.id">
                <div @click="onClicked(group)">{{ group.name }}</div>
            </div>
        </div> 
           
        <div v-if="existGroupsInvited && !isLoading" class="mt-5">
            <h1 class="mt-5 mb-10 capitalize text-center text-white text-2xl">{{ $t('pages.groups.headerInvited') }}</h1>
            <div class="box-group" v-for="group in groupsUserList" :key="group.id">
                <div @click="onClicked(group)">{{ group.name }}</div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useGroups } from '@/composables/useGroups'

// Desestructurar propiedades del composable de autenticación y grupos
const { user: authUser } = useAuth()
const { groups, isLoading, groupsUser, getGroupsOfUser, getAllGroups, allGroups } = useGroups()

// Llamar a la función para obtener los grupos al montar el componente
onMounted(async() => {
    await getGroupsOfUser(authUser.value.id)
    await getAllGroups()
    console.log('groupsUser', groupsUser.value)
    console.log('groups', groups.value)
    console.log('allgroups', allGroups.value)
})

const groupsUserList = computed(() => {
    return allGroups.value.filter(allgroup => {
        return groupsUser.value.some(groupOfUser => allgroup.id === groupOfUser.group.id && authUser.value.id !== allgroup.admin)
    })
})

//# emits
const emit = defineEmits(['onClicked'])

const onClicked = (group) => emit("onClicked", group)

// Verificar si existen grupos invitados
const existGroupsInvited = computed(() => groupsUserList.value.length >= 1)
</script>

<style lang="scss" scoped>
#groups {
    max-height: calc(100vh - 330px);
    overflow: scroll;
    margin-top: 2rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    .box-group {
        min-width: 18rem;
        margin-bottom: 0.5rem;
        margin-top: 1.1rem;
        text-align: center;
        cursor: pointer;
        position: relative;
        z-index: 999;
        bottom: 1rem;
        padding: 1rem;
        border-radius: 0.5rem;
        color: white;
        background: #3F3E3E;
        border: 2px solid rgba(4, 192, 168, 0.7651654412);
        box-shadow: 0 0 0 0.2rem #3F3E3E;
        &:hover {
            opacity: 0.9;
        }
    }
}
</style>
