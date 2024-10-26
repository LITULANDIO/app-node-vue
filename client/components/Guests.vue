<template>
  <Transition name="slide-fade">
    <div v-if="isLoading" class="spinner">
      <Spinner />
    </div>
    <div v-else class="w-full">
      <div class="flex justify-center items-center">
        <BackButton />
        <h1 class="text-2xl capitalize text-center text-white">{{ group.name }}</h1>
      </div>
      <div id="guests" class="w-full flex justify-center items-center flex-wrap mt-5">
        <!-- Amigos no seleccionados -->
        <template v-for="guest in unselectedFriends" :key="guest.id">
          <div id="guest" class="cursor-pointer"
               @mouseover="onVisibleDrop(guest.id)"
               @mouseleave="onHideDrop"
               @touchstart="onVisibleDrop(guest.id)">
            <img src="/mysterious.png" />
            <div class="icon-container" v-if="selectedGuestId === guest.id">
              <template v-if="isAdmin">
                <div @click="onOpenModalDelete(guest.hashGuest, params)">
                  <font-awesome-icon icon="fa-solid fa-trash" class="icon text-3xl cursor-pointer" />
                </div>
              </template>
              <div @click="onSelectedFriend(guest)">
                <font-awesome-icon icon="fa-solid fa-hand-pointer" class="icon text-3xl cursor-pointer ml-3" title="select user" />
              </div>
            </div>
            {{ guest.name }}
          </div>
        </template>

        <!-- Amigos seleccionados -->
        <template v-for="guest in selectedFriends" :key="guest.id">
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

      <!-- Modales para advertencias y éxito -->
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
            <Button :label="$t('modals.deleteGuest.accept')" @onClicked="deleteGuest()" />
            <Button :label="$t('modals.deleteGuest.cancel')" @onClicked="onCloseModalDelete" />
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
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useGuests } from '@/composables/useGuests';
import { useGroups } from '@/composables/useGroups';
import { useFriend } from '@/composables/useFriend';

const socket = io('wss://socket-friends.quisqui.com');

// Props
const props = defineProps({
  params: {
    type: [String, Object],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Referencias y estados
const { user: authUser } = useAuth();
const { group, groupsUser } = useGroups();
const { guests, setGuests, isLoading } = useGuests(group.value.id);
const { setFriend } = useFriend(group.value.id);

const selectedGuestId = ref(null);
const showModalWarning1 = ref(false);
const showModalWarning2 = ref(false);
const showModalSuccess = ref(false);
const showModalInfoGuest = ref(false);
const isDeleteGuest = ref(false);
const guestSelected = ref(null);
const guestParams = ref(null);
const showGuestList = ref(false);
const selectedItems = ref([]);
const showModalWarnFriend = ref(false);

// Ciclos de vida
onMounted(() => {
  socket.emit('joinRoom', group.value.id);

  socket.on('guestUpdatedCompleted', (updatedGuestData) => {
    const guestIndex = guests.value.guests.findIndex(g => g.hashGuest === updatedGuestData.idGuest);
    if (guestIndex !== -1) {
      guests.value.guests[guestIndex].active = updatedGuestData.active;
      setFriend(updatedGuestData);
      showModalInfoGuest.value = true;
    }
  });
});

// Métodos de selección y advertencias
const onVisibleDrop = (id) => (selectedGuestId.value = id);
const onHideDrop = () => (selectedGuestId.value = null);

const deleteGuest = () => {
  emit('deleteGuest', guestSelected.value, guestParams.value);
  isDeleteGuest.value = false;
};

const onSelectedFriend = (guest) => {
  if (guest.id === authUser.value.id) {
    showModalWarning1.value = true;
    return;
  }

  const groupOfGuest = groupsUser.value.find(grup => grup.group.id === group.value.id);
  if (groupOfGuest?.friend?.id >= 1) {
    showModalWarning2.value = true;
    return;
  }

  // Actualizar selección
  const updatedGuest = {
    friend: guest.id,
    active: 1,
    idFriend: guests.value.guests.find(g => g.id === authUser.value.id).friend.id,
  };

  const ids = {
    idUser: authUser.value.id,
    idGroup: group.value.id,
  };
  
  setFriend(updatedGuest);
  socket.emit('guestUpdated', updatedGuest, ids);
  showModalSuccess.value = true;
};

const onChangeSelected = (guestId) => {
  const index = selectedItems.value.indexOf(guestId);
  if (index !== -1) {
    selectedItems.value.splice(index, 1);
  } else {
    selectedItems.value.push(guestId);
  }
};

const onShowGuestList = () => {
  selectedItems.value = [];
  showGuestList.value = true;
};

// Computed properties
const unselectedFriends = computed(() => guests.value.guests.filter(guest => guest.active !== 1));
const selectedFriends = computed(() => guests.value.guests.filter(guest => guest.active === 1));

// Métodos para cerrar modales
const onCloseModalWarn1 = () => (showModalWarning1.value = false);
const onCloseModalWarn2 = () => (showModalWarning2.value = false);
const onCloseModalSuccess = () => (showModalSuccess.value = false);
const onCloseModalDelete = () => (isDeleteGuest.value = false);
const onCloseModalInfoGuest = () => (showModalInfoGuest.value = false);
const onCloseModalWarnFriend = () => (showModalWarnFriend.value = false);
const onCloseGuestList = () => (showGuestList.value = false);
const onOpenModalDelete = (hashGuest, params) => {
  guestSelected.value = hashGuest;
  guestParams.value = params;
  isDeleteGuest.value = true;
};
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