<template>
    <NuxtLayout/>
    <section id="options" class="flex justify-center items-center flex-col">
        <Button label="AMIC INVISIBLE" @click="onViewFriend"/>
        <Transition name="slide-fade">
            <section class="view-friend" v-if="isViewFriend">
                <Modal :show="isViewFriend" @onClose="onCloseViewFriend" padding>
                    <div>
                        <img :src="friend.friend.photo" :alt="friend.friend.name" />
                    </div>
                </Modal>
            </section>
        </Transition>
        <Button label="DESITJOS AMIC INVSIBLE" @click="onViewWishesFriend"/>
        <Transition name="slide-fade">
            <section class="view-friend" v-if="isViewWishesFriend">
                <Modal :header="`Desitjos de ${friend.friend.name}`" :show="isViewWishesFriend" @onClose="onCloseViewWishesFriend" padding>
                    <ul v-if="!isFriendWishesEmpty" class="mt-3">
                        <li v-for="wish in friendWishes">
                            <font-awesome-icon v-if="wish" icon="fas fa-gift" /> 
                            <span class="ml-2">{{ wish }}</span>
                        </li>
                    </ul>
                    <div class="flex justify-center" v-else>El teu amic invisible encara no ha posat els seus desitjos 🤷</div>
                </Modal>
            </section>
        </Transition>
        <Button label="ELS MEUS DESITJOS" @click="onViewFormWishes"/>
        <Transition name="slide-fade">
            <section class="view-friend" v-if="isViewWishesMe">
                <FormWishes 
                    :isOpen="isOpenModal"
                    @onClose="onCloseModal"
                    :data="data"
                    :wishes="friend.me.wishes"
                />
            </section>
        </Transition>
    </section>

</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStoreAuth } from '~~/stores/auth';

//#ref reactive const
const storeAuth = useStoreAuth()
const { user, friend } = storeToRefs(storeAuth)
const isViewFriend = ref(false)
const isViewWishesFriend = ref(false)
const isViewWishesMe = ref(false)
const isOpenModal = ref(false);
const data = reactive({
    idGroup: friend.value.group.id,
    idUser: user.value.id
})

//#end

//#computed
const labelFriend = computed(() => {})
const isFriendWishesEmpty = computed(() => {
    let isEmpty = true
    const wishes = friend.value.friend.wishes
    for(const wish in wishes) {
        if (wishes[wish] !== ''){
            isEmpty = false
        } 
    }
    return isEmpty
})
const friendWishes = computed(() => Object.values(friend.value.friend.wishes))
const meWishes = computed(() => Object.values(friend.me.wishes))
//#end

//#events
const onViewFriend = () => isViewFriend.value = !isViewFriend.value
const onViewWishesFriend = () => isViewWishesFriend.value = !isViewWishesFriend.value
const onCloseModal = () => isOpenModal.value = false 
const onViewFormWishes = () => { 
    isOpenModal.value = true
    isViewWishesMe.value = true
}
const onCloseViewFriend = () => isViewFriend.value = false
const onCloseViewWishesFriend = () => isViewWishesFriend.value = false
//#end

//#methods
//#
</script>

<style lang="scss">
#options{
    padding-top: 3rem;
    .button{
        min-width: 60%;
        margin-bottom: 2rem;
        text-align: center;
    }
    .view-friend{
       
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
</style> 




