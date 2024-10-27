<template>
  <Transition name="slide-fade">
      <div v-if="isLoading" class="spinner">
          <Spinner />
      </div>
      <div v-else class="w-full">
        <div class="flex justify-center items-center">
          <BackButton />
          <h1 class="text-2xl capitalize text-center text-white">{{ group.name  }}</h1>
        </div>
        <div id="guests" class="w-full flex justify-center items-center flex-wrap mt-5">
          <template v-for="guest in unselectedFriends" :key="guest.id">
              <div id="guest" class="cursor-pointer"
                  @mouseover="onVisibleDrop(guest.id)" 
                  @mouseleave="onHideDrop" 
                  @touchstart="onVisibleDrop(guest.id)"
                  >
                  <img src="/mysterious.png" />
                  <div class="icon-container" v-if="selectedGuestId === guest.id">
                      <template v-if="isAdmin">
                          <div @click="onOpenModalDelete(guest.hashGuest, params)">
                            <font-awesome-icon icon="fa-solid fa-trash" class="icon text-3xl cursor-pointer" />
                          </div>
                          <div @click="onSelectedFriend(guest)">
                            <font-awesome-icon icon="fa-solid fa-hand-pointer" class="icon text-3xl cursor-pointer ml-3" title="select user" />
                          </div>
                      </template>
                      <template v-else>
                        <div @click="onSelectedFriend(guest)">
                            <font-awesome-icon icon="fa-solid fa-hand-pointer" class="icon text-3xl cursor-pointer ml-3" title="select user" />
                        </div>                      
                      </template>
                  </div>
                  {{ guest.name }}
              </div>
          </template>
          <template  v-for="guest in selectedFriends" :key="guest.id">
            <div id="guest"
                  @mouseover="onVisibleDrop(guest.id)" 
                  @mouseleave="onHideDrop" 
                  @touchstart="onVisibleDrop(guest.id)">
              <img src="/select.jpg" />
              <div class="icon-container" v-if="selectedGuestId === guest.id">
                      <div v-if="isAdmin" @click="onOpenModalDelete(guest.hashGuest, params)">
                          <font-awesome-icon icon="fa-solid fa-trash" class="icon text-3xl cursor-pointer" />
                      </div>
                  </div>
              {{ guest.name }}
            </div>
          </template>
      </div>
      <Modal :show="showModalWarning1" @onClose="onCloseModalWarn1" padding>
          <div class="text-center">
              <font-awesome-icon icon="fa-solid fa-triangle-exclamation" class="icon text-orange-300 text-3xl mb-2" />
              <p class="mb-3">{{ $t('modals.warning1.text') }}</p>
          </div>
      </Modal>
      <Modal :show="showModalWarning2" @onClose="onCloseModalWarn2" padding>
        <div class="text-center">
            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" class="icon text-orange-300 text-3xl mb-2" />
            <p class="mb-3">{{ $t('modals.warning2.text') }}</p>
        </div>
      </Modal>
      <Modal :show="showModalSuccess" @onClose="onCloseModalSuccess" padding>
        <div class="text-center">
            <font-awesome-icon icon="fa-solid fa-circle-check" class="icon text-teal-600 text-3xl mb-2" />
            <p class="mb-3">{{ $t('modals.success.text') }}</p>
        </div>
      </Modal>
      <Modal :show="isDeleteGuest" @onClose="onCloseModalDelete" padding>
        <div class="text-center">
          <font-awesome-icon icon="fa-solid fa-triangle-exclamation" class="icon text-orange-300 text-3xl mb-2" />
          <p class="mb-3">{{ $t('modals.deleteGuest.text') }}</p>
          <div class="flex justify-around">
            <Button :label="$t('modals.deleteGuest.accept')" @onClicked="deleteGuest()"/>
            <Button :label="$t('modals.deleteGuest.cancel')" @onClicked="onCloseModalDelete"/>
          </div>
        </div>
      </Modal>
      <Modal :show="showModalInfoGuest" @onClose="onCloseModalInfoGuest" padding>
        <div class="text-center">
            <font-awesome-icon icon="fa-solid fa-circle-info" class="icon text-teal-600 text-3xl mb-2" />
            <p class="mb-3">{{ $t('modals.info.text') }}</p>
        </div>
      </Modal>
      <Modal :show="showModalWarnFriend" @onClose="onCloseModalWarnFriend" padding>
        <div class="text-center">
            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" class="icon text-orange-300 text-3xl mb-2" />
            <p class="mb-3">{{ $t('modals.warning3.text') }}</p>
        </div>
      </Modal>
      </div>
  </Transition>
  <Button class="custom-btn" @onClicked="onShowGuestList">
    <img src="/user-off.svg" />
  </Button>
  <Modal :show="showGuestList" @onClose="onCloseGuestList" padding>
    <div v-for="guests in guestsList" :key="guests.id">
        <input
          type="checkbox"
          :id="guests.id"
          :value="guests.id"
          v-model="selectedItems"
          @change="onChangeSelected"
        />
        <label class="ml-1 capitalize" :for="guests.id">{{ guests.user }}</label>
    </div>
  </Modal>
</template>

<script setup>
import { io } from 'socket.io-client';
import { onMounted, onUnmounted, computed, ref } from 'vue';
import { DataProvider } from '@/data-provider/index'
import { useAuth } from '@/composables/useAuth'
import { useGuests } from '@/composables/useGuests'
import { useGroups } from '@/composables/useGroups'
import { useFriend } from '@/composables/useFriend'


// const socket = io('wss://socket-friends.quisqui.com', {
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// })
// const socket = io('http://localhost:3001');
// const socket = io('https://lopsided-unequaled-garnet.glitch.me');
const socket = io('https://socket-friend.onrender.com/')

console.log({socket})
  //# props
  const props = defineProps({
    params: {
      type: [String, Object]
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  });
  //#end

  //# const ref
  const { user: authUser, isAuthenticated } = useAuth()
  const { group, groupsUser, setGroupsUser } = useGroups()
  const { guests, setGuests, isLoading } = useGuests(group.value.id)
  const { setFriend } = useFriend(group.value.id)

  const selectedGuestId = ref(null)
  const showModalWarning1 = ref(false)
  const showModalWarning2 = ref(false)
  const showModalSuccess = ref(false)
  const showModalInfoGuest = ref(false)
  const route = useRoute()
  const isDeleteGuest = ref(false)
  const guestSelected = ref(null)
  const guestParams = ref(null)
  const showGuestList = ref(false)
  const selectedItems = ref([])
  const showModalWarnFriend = ref(false)
  //#end
  
  //# events
  const emit = defineEmits(['deleteGuest'])
  const onVisibleDrop = (id) => (selectedGuestId.value = id);
  const onHideDrop = () => (selectedGuestId.value = null);
  const deleteGuest = () => {
    emit('deleteGuest', guestSelected.value, guestParams.value)
    isDeleteGuest.value = false
  }
  const onCloseModalWarn1 = () => showModalWarning1.value = false
  const onCloseModalWarn2 = () => showModalWarning2.value = false
  const onCloseModalSuccess = () => showModalSuccess.value = false
  const onCloseModalInfoGuest = () => showModalInfoGuest.value = false
  const getIdGroup = () => {
    if (group.value.snug === route.params.id) {
      return { id: group.value.id }
    }
  }
  const onCloseModalDelete = () => isDeleteGuest.value = false
  const onOpenModalDelete = (guest, params) => {
    isDeleteGuest.value = true
    guestSelected.value = guest
    guestParams.value = params
  }
  const onShowGuestList = () => showGuestList.value = true
  const onCloseGuestList = () => showGuestList.value = false
  const onCloseModalWarnFriend = () => showModalWarnFriend.value = false
  const isMatchFriendList = (id) => selectedItems.value.some(item => item === id)
  //#end

  //#computed
  const isSelectedCheckBox = computed(() => selectedItems.value.length >= 1)
  const unselectedFriends = computed(() => guests.value?.guests.filter(guest => guest.active === 0));
  const selectedFriends = computed(() => guests.value?.guests.filter(guest => guest.active === 1));
  const guestsList = computed(() => guests.value.guests || [])
 //#end

//#cycle of life
onMounted(() => {
  socket.emit('joinRoom', group.value.id);

  socket.on('guestUpdatedCompleted', (updatedGuestData, ids) => {
    guests.value.guests.forEach(g => {
      if (g.hashGuest === updatedGuestData.idGuest) {
        g.active = 1
         selectedGuestId.value = guest.id;
         if (ids.idUser !== authUser.value.id) {
          showModalInfoGuest.value = true 
        }
      }
    })
  })

  socket.on('successGuest', (success) => {
     console.log({success})
      DataProvider({
        providerType: 'GROUPS',
        type: 'GET_GROUPS_USER',
        params: authUser.value.id
      }).then(response => {
        setGroupsUser(response.body)
      })
     emit('selectedGuest', { isSelected: true, user: ids.idUser})
  })

  socket.on('disconnect', (reason) => {
      console.log('Disconnected from server: ', reason);
      setTimeout(() => {
          socket.connect()
      }, 5000)
  })

  socket.on('selectionConflict', (data) => {
    showModalInfoGuest.value = true 
    alert(data.message)
  })

    socket.on('updateError', (data) => {
    showModalInfoGuest.value = true
    alert(data.message)
  })
})

onUnmounted(() => {
    socket.off('connect');
    socket.off('disconnect');
    socket.off('updateGuests');
    socket.off('guestUpdatedCompleted')
    socket.off('selectionConflict')
    socket.off('updateError');
    socket.disconnect();
});
//#end

//#methods
const onSelectedFriend = async (guest) => {
   const { id } = getIdGroup();
    const groupOfGuest = groupsUser.value.find(grup => grup.group.id === id);
  if (guest.id === authUser.value.id) {
    showModalWarning1.value = true;
    return
   } else if (groupOfGuest?.friend?.id >= 1) {
          showModalWarning2.value = true
   } else if(isSelectedCheckBox.value && isMatchFriendList(guest.id)){
          showModalWarnFriend.value = true
   } else {

    const updatedGuest = {
      friend: guest.id,
      active: 1,
      idFriend: guests.value.guests.find(g => g.id === authUser.value.id).hashGuest,
      idGuest: guest.hashGuest,
    };
    const ids = {
      idUser: authUser.value.id,
      idGroup: group.value.id
    }
    socket.emit('guestUpdated', updatedGuest, ids)
    showModalSuccess.value = true
   }
};
//#end
</script>

<style lang="scss">
 #guests{
  max-height: calc(100vh - 240px);
  overflow: scroll;
  margin-top: 2rem;
  padding-top: 5px;
  position: relative
}
  #guest {
    position: relative;
    width: 10rem;
    height: 10rem;
    object-fit: revert-layer;
    opacity: 0.9;
    border-radius: 15px;
    border: 2px solid rgba(4, 192, 168, 0.7651654412);
    box-shadow: 0 0 0 0.2rem #3f3e3e;
    margin-bottom: 1.3rem;
    margin-left: 0.6rem;
    margin-right: 0.6rem;
    img{
      width: 10rem;
      height: 10rem;
      border-radius: 15px;
      filter: sepia();
    }
    .icon-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 15px;
      .icon {
      z-index: 9;
      pointer-events: none;
      color: white;
      }
  }
}
.slide-fade-enter-active {
transition: all 1s ease-out;
}

.slide-fade-leave-active {
transition: opacity 0.5s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
opacity: 0;
}
.text-center {
text-shadow: 2px 2px 4px rgba(4, 192, 168, 0.7651654412);
}
.spinner {
position: absolute;
left: 45%;
}
.custom-btn {
  position: fixed;
  top: 18rem;
  height: 20px;
  width: 20px;
}
</style>