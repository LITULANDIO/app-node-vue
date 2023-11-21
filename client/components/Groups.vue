<template>
    <section id="groups">
        <div v-if="isLoading">
            <Spinner />
        </div>
        <div v-if="!isLoading && groupsProp">
            <h1 class="mb-10 capitalize text-center text-white text-2xl">{{ $t('pages.groups.header') }}</h1>
            <div class="box-group" v-for="group in groupsProp" :key="group.id">
                <div @click="onClicked(group)">{{ group.name }}</div>
            </div>
        </div> 
           
        <div v-if="(groupsUserList.length > 1) && !isLoading" mt-5>
            <h1 class="mt-5 mb-10 capitalize text-center text-white text-2xl">{{ $t('pages.groups.headerInvited') }}</h1>
            <div class="box-group" v-for="group in groupsUserList" :key="group.id">
                <div @click="onClicked(group)">{{ group.name }}</div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { DataProvider } from '@/data-provider/index'
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStoreAuth } from '~~/stores/auth';

//# props
const props = defineProps({
    groups: {
        type: Array,
        required: true
      },
    isLoading: {
        type: Boolean,
        default: false
    }
})
//#end
const groupsUserList = ref([])
const groupsUser = ref(JSON.parse(localStorage.getItem('groups-user')))
const groupsProp = computed(() =>props.groups)
const storeAuth = useStoreAuth()
const { user } = storeToRefs(storeAuth)

onMounted(async() => {
    await getGroups()
    groupsProp.value = [...groupsUserList.value]
})

//# emits
const emit = defineEmits(['onClicked'])

const onClicked = (group) => emit("onClicked", group)

const getGroups = async () => {
    const fetchGroup = await DataProvider({
        providerType: 'GROUPS',
        type: 'GET_GROUPS',
    })
    if (groupsUser.value) {
        fetchGroup.body.forEach(grup => {
            groupsUser.value.forEach(grupuser => {
                if (grup.id === grupuser.group.id && user.value.id !== grup.admin) {
                    groupsUserList.value.push(grup)
                }
            })
        })
    }
    console.log()
    return groupsUserList.value
}
//#

</script>

<style lang="scss" scoped>
#groups{
    max-height: calc(100vh - 330px);
    overflow: scroll;
    margin-top: 2rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    .box-group{
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
        box-shadow:0 0 0 0.2rem #3F3E3E;
        //filter:sepia()
        &:hover{
            opacity: 0.9;
        }
    }
}
</style>