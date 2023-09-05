<template>
    <NuxtLayout/>
    <ButtonConfig />
    <section id="modal">
      <Guests 
        v-if="data"
        :isLoading="isLoading"
        :params="id"
        :isAdmin="isAdmin"
        @deleteGuest="onDeleteGuest"
        @selectedGuest="onSelected"
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
    <section class="button-container" :class="isFriendSelected() || hasSelectedUser && isAdmin ? 'justify-between' : 'justify-center'"> 
      <Button v-if="isAdmin" :label="$t('buttons.addGuest')" @onClicked="onCreateFriend" class="separator"/>
      <div v-if="isFriendSelected() || hasSelectedUser" class="join-group separator"  @click="onGoMyFriend" :data-text="$t('buttons.myFriend')">{{ $t('buttons.myFriend') }}</div>
      <div v-if="isLoading" class="separator">
        <Spinner/>
      </div>
    </section>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick, watchEffect } from 'vue'
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
const { groups } = storeToRefs(storeGroup)
const { data, isLoading, isSelected } = storeToRefs(storeGuest)
const { user } = storeToRefs(storeAuth)
const { getAllUsers, getUser } = useUsers()
const route = useRoute()
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
const group = ref(JSON.parse(localStorage.getItem('group')))
const groupsOfUser = ref('')
const hasSelectedUser = ref(false)
//#end
groupsOfUser.value = JSON.parse(localStorage.getItem('groups-user'))

//#cycle life
onMounted(async() => {
  if (route.params.id) {
    id.value = route.params.id
  }
 usersParsed.value = await getAllUsers()
 await storeGuest.getGuests(id.value)
 setDataGroupWhenEntryInviteFriend()
 addUserAdmin()
 isFriendSelected()
 hasSelectedUser.value = false
})
//#end

//#computed
const getUsers = computed(() => {
  return usersParsed.value.filter(user => user?.user.toLowerCase().includes(dataFriend.name.toLowerCase()))
})

const isAdmin = computed(() => user.value.id === data.value?.group?.admin || user.value.id ===  group.value.admin )
//#end

//#events
const onCreateFriend = () => {
  isOpenModal.value = true
  dataFriend.send = user.value.email
}
const onCloseModal = () => isOpenModal.value = false 
const onSelectUser = (event, idUser) => {
  nextTick(async () => {
    const userSelected = await getUser(idUser)
    idGuest.value = idUser
    dataFriend.name = event.target.textContent
    dataFriend.to = userSelected[0].email
    isShowDropdownUsers.value = false
    console.log({userSelected})
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
  dataFriend.to = ''
  dataFriend.name = ''
}
const onDeleteGuest = async (guest, id) => {
  await storeGuest.deleteGuest({
    guest,
    id
  })
  const groupOfUser = await DataProvider({
    providerType: 'GROUPS',
    type: 'GET_GROUPS_USER',
    params: user.value.id
  })
  window.localStorage.setItem('groups-user', JSON.stringify(groupOfUser.body))
}
const onGoMyFriend = () => {
  if (groupsOfUser.value) {
    groupsOfUser.value.forEach(grup => {
      if (grup.group.id === group.value.id ) {
          localStorage.setItem('friend-me', JSON.stringify(grup))
      }
    })
  }
  if(group.value.snug) {
    navigateTo(`/dashboard/user/group/my-friend/${group.value.snug}`)
  }
}
//# end

const isFriendSelected = () => {
  let isSelect = false
  groupsOfUser.value.map(grup => {
    if( grup.group.id === group.value.id) {
      console.log('fa match el grup', grup)
      if (grup.friend.name) {
        console.log('friend exist', grup.friend.name)
        isSelect = true
      }
    }
  })
  return isSelect
}
const onSelected = (data) => {
  console.log({data})
  hasSelectedUser.value = data.isSelected
}
// watchEffect(() => {
//   if (isSelected.value) {
//     console.log('isSELECTED', isSelected.value)
//     hasSelectedUser.value = true
//   }
//   // Realiza acciones basadas en isSelected aquí
// });
   
//# functions
const addUserAdmin = async () => {
  if (storeGuest.data.guests.length === 0 ) {
    await storeGuest.addGuestInGroup({
      guest: {idGroup: group.value.id, idGuest: user.value.id, friend: 0, active: 0},
      id: id.value
    })
    const groupOfUser = await DataProvider({
      providerType: 'GROUPS',
      type: 'GET_GROUPS_USER',
      params: user.value.id
    })
    window.localStorage.setItem('groups-user', JSON.stringify(groupOfUser.body))
  }
}

const setDataGroupWhenEntryInviteFriend = () => {
  groups.value.forEach(grup => {
    if(grup.snug === route.params.id) {
      const group = {
        id: grup.id,
        admin: grup.admin,
        name: grup.name,
        date: grup.date,
        location: grup.location,
        budget: grup.budget,
        snug: grup.snug
      }
      localStorage.setItem('group', (JSON.stringify(group)))
    }
  })
}
//#end

</script>

<style lang="scss" scoped>
.button-container {
  display: flex;
  align-items: center;
  bottom: 1rem;
  width: 100%;
  position: fixed;
}
.join-group{
    cursor: pointer;
    position: realtive;
    z-index: 999;
    bottom: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 2px solid rgba(4, 192, 168, 0.7651654412);
    color: white;
    background: #3F3E3E;
    box-shadow:0 0 0 0.2rem #3F3E3E;
    padding: 1rem;
    white-space: nowrap;
    &:hover{
      opacity: 0.9;
    }
    &:before{
      text-shadow: 0px 0px 20px  rgba(4, 192, 168, 0.7651654412);
      position: absolute;
      content: attr(data-text);
      animation: flicker 8s linear forwards;
      filter: blur(10px) brightness(0);
      animation-delay: 1s;
    }
  }
  @keyframes flicker{
    0%{
      filter: blur(5px) brightness(1);
    }
    3%{
      filter: blur(5px) brightness(0);
    }
    6%{
      filter: blur(5px) brightness(0);
    }
    7%{
      filter: blur(5px) brightness(1);
    }
    8%{
      filter: blur(5px) brightness(0);
    }
    9%{
      filter: blur(5px) brightness(1);
    }
    10%{
      filter: blur(5px) brightness(0);
    }
    20%{
      filter: blur(5px) brightness(1);
    }
  }
.separator {
  margin: 0 2rem;
  white-space: nowrap;
}
#modal{
  position: absolute;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

</style>