<template>
    <NuxtLayout/>
    <section id="modal">
      <Guests 
        v-if="data"
        :isLoading="isLoading"
        :params="id"
        :isAdmin="isAdmin"
        @deleteGuest="onDeleteGuest"
      />
      <ModalAddGuest 
        :isOpen="isOpenModal"
        :guest="dataFriend"
        :isShowDropdownUsers="isShowDropdownUsers"
        :isExistedGuest="isExistedGuest"
        :users="getUsers"
        @onClose="onCloseModal"
        @onKeyUp="onKeyUp"
        @onClicked="onSelectUser"
        @onSubmit="onSubmitFriend"
      />
    </section>
    <section class="flex justify-center items-center bottom-0">
      <Button v-if="isAdmin" label="AFAGEIX INVITAT" @onClicked="onCreateFriend" class="fixed"/>
      <Button label="EL MEU AMIC" @onClicked="onGoMyFriend" class="fixed"/>
    </section>
</template>

<script setup>
/**
 *TODO !!
 * =============================================================
 * - guardar desitjos i recuperarlos
 * - targeta x despres de seleccionar
 * - afegir opcio seleccionar  + eliminar usuari vista admin
 * - afegir admin al crear grup
 * - seccio grups creats i d'invitats segons entras per primera vegada amb codig
 * - afegir idioma
 * - boto opcions: editar perfil, caambiar idioma
 * - implementar afiliacio segons desitjos
 * =============================================================
 */

import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { useStoreGroup } from '~~/stores/groups';
import { useStoreGuest } from '~~/stores/guests';
import { useStoreAuth } from '~~/stores/auth';
import { storeToRefs } from 'pinia'
import useUsers from '@/composables/users'
import { DataProvider } from '@/data-provider/index'
definePageMeta({
  middleware: ["auth"]
})

//#ref reactive const 
const storeGroup = useStoreGroup()
const storeGuest = useStoreGuest()
const storeAuth = useStoreAuth()
const { group } = storeToRefs(storeGroup)
const { data, isLoading } = storeToRefs(storeGuest)
const { user } = storeToRefs(storeAuth)
const { getAllUsers } = useUsers()
const route = useRoute()
const router = useRouter()
const dataFriend = reactive({
  name: '',
  send: '',
  to: '',
  file: ''
})
const usersParsed = ref([])
const isOpenModal = ref(false);
const isShowDropdownUsers = ref(false)
const idGuest = ref('')
const isExistedGuest = ref(false)
const id = ref('')
//#end

//#cycle life
onMounted(async() => {
  if (route.params.id) {
    id.value = route.params.id
  }
 usersParsed.value = await getAllUsers()
 await storeGuest.getGuests(id.value)
 detectBackButton()
 setDataGroupWhenEntryInviteFriend()
})
//#end

//#computed
const getUsers = computed(() => {
  return usersParsed.value.filter(user => user?.user.toLowerCase().includes(dataFriend.name.toLowerCase()))
})

const isAdmin = computed(() => user.value.id === data.value?.group?.admin || user.value.id ===  group.value.admin )
//#end

//#events
const onCreateFriend = () => isOpenModal.value = true
const onCloseModal = () => isOpenModal.value = false 
const onSelectUser = (event, idUser) => {
  nextTick(() => {
    idGuest.value = idUser
    dataFriend.name = event.target.textContent
    isShowDropdownUsers.value = false
  })
}
const onKeyUp = () => {
  isShowDropdownUsers.value = dataFriend.name.length >= 3
  isExistedGuest.value = false
}
const onSubmitFriend = async () => {
  const isExistGuest = data.value.guests.some(guest => guest.id === idGuest.value)
  if (isExistGuest) {
    isExistedGuest.value = true
    return
  }
  await storeGuest.addGuestInGroup({
    guest: {idGroup: group.value.id, idGuest: idGuest.value, friend: 0, active: 0},
    id: id.value
  })
  isOpenModal.value = false
  DataProvider({
    providerType: 'MAIL',
    type: 'SENDMAIL',
    params: {
      sender: dataFriend.send,
      to: dataFriend.to,
      name: group.value.name,
      user: dataFriend.name,
      idAdmin: group.value.admin,
      
    }
  })
}
const onDeleteGuest = async (guest, id) => {
  await storeGuest.deleteGuest({
    guest,
    id
  })
}
const onGoMyFriend = () => {
  let snug = ''
  storeAuth.groups.forEach(grup => {
    if (grup.group.id === group.value.id ) {
        snug = group.value.snug
        storeAuth.friend = grup
    }
  })
  navigateTo(`/dashboard/user/group/my-friend/${snug}`)
}
const detectBackButton = () => {
  window.addEventListener('popstate', () => {
    group.value = {
      id: '',
      admin: '',
      name: '',
      date: '',
      budget: '',
      snug: '',
    }
});
}
const setDataGroupWhenEntryInviteFriend = () => {
  storeAuth.groups.forEach(grup => {
    if(grup.group.snug === route.params.id) {
      group.value = {
        id: grup.group.id,
        admin: '',
        name: grup.group.name,
        date: '',
        budget: '',
        snug: grup.group.snug
      }
    }
  })
}
//#end

</script>

<style lang="scss" scoped>
#modal{
  position: absolute;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>