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
                  @click="onSelectedFriend(guest)">
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
      </div>
  </Transition>
</template>

<script setup>
import { useStoreAuth } from '~~/stores/auth';
import { useStoreGuest } from '~~/stores/guests';
import { useStoreGroup } from '~~/stores/groups';
import { storeToRefs } from 'pinia'
import { io } from 'socket.io-client';
import { onMounted } from 'vue';
import { DataProvider } from '@/data-provider/index'

const socket = io('wss://socket-friends.quisqui.com');
console.log({socket})
  //# props
  const props = defineProps({
    isLoading: {
      type: Boolean,
      default: false,
    },
    guests: {
      type: [Array, Object],
      required: true,
    },
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
  const selectedGuestId = ref(null);
  const storeAuth = useStoreAuth()
  const storeGuest = useStoreGuest()
  const storeGroups = useStoreGroup()
  const { user, groups } = storeToRefs(storeAuth)
  const { group } = storeToRefs(storeGroups)
  const showModalWarning1 = ref(false)
  const showModalWarning2 = ref(false)
  const showModalSuccess = ref(false)
  const showModalInfoGuest = ref(false)
  const route = useRoute()
  const isSelect = ref(true)
  const isDeleteGuest = ref(false)
  const guestSelected = ref(null)
  const guestParams = ref(null)
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

  onMounted(() => {
    socket.on('guestUpdatedCompleted', async ({updatedGuestData, ids}) => {
      console.log('Guest updated:', updatedGuestData);
      console.log('socket room =>', socket.currentRoom)
      storeGuest.isLoading = true
      if (user.value.id !== ids.idUser && socket.currentRoom === ids.idGroup) { 
        showModalInfoGuest.value = true
      }
      DataProvider({
        providerType: 'GUESTS',
        type: 'GET_GUESTS',
        params: props.params
      }).then(res => {
        storeGuest.data = res.body
      }).finally(() => {
        storeGuest.isLoading = false
      })
    })
  })
  
  
  const onSelectedFriend = async (guest) => {
      const { id } = getIdGroup()
      const groupOfGuest = groups.value.find(grup => grup.group.id === id)
      if(guest.id === storeAuth.user.id) {
          showModalWarning1.value = true
          return
      } else if (groupOfGuest?.friend?.id >= 1) {
          showModalWarning2.value = true
      } else {
          const hash = storeGuest.data.guests.filter(guest => guest.id === user.value.id)
          const updatedGuest = {
              friend: guest.id,
              active: 1,
              idFriend: hash[0]['hashGuest'],
              idGuest: guest.hashGuest,
          }
          const ids = {
            idUser: user.value.id,
            idGroup: group.value.id
          }
          socket.emit('guestUpdated', { updatedGuest, ids });
          await storeAuth.getGroupsOfUser(user.value.id)
          showModalSuccess.value = true
          isSelect.value = false
      }
  }
  const onCloseModalDelete = () => isDeleteGuest.value = false
  const onOpenModalDelete = (guest, params) => {
    isDeleteGuest.value = true
    guestSelected.value = guest
    guestParams.value = params
  }
  //#end

  //#computed
  const selectedFriends = computed(() => storeGuest.data.guests.filter(guest => guest.active === 1))
  const unselectedFriends = computed(() => storeGuest.data.guests.filter(guest => guest.active === 0))
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
</style>