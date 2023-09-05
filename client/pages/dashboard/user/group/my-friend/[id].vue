<template>
    <NuxtLayout/>
    <div  v-if="!friend.friend.name">
        <Spinner/>
    </div>
    <div v-else>
        <div class="pt-4">
            <BackButton />
            <ButtonInfo />
        </div>
        <section id="options" class="flex justify-center items-center flex-col">
            <Button :label="$t('pages.myFriend.field1')" @click="onViewFriend"/>
            <Transition name="slide-fade">
                <section class="view-friend" v-if="isViewFriend">
                    <Modal :show="isViewFriend" @onClose="onCloseViewFriend" padding>
                        <h1 class="capitalize text-center mb-5">{{ friend.friend.name }}</h1>
                        <div class="container-photo mb-3">
                            <img :src="friend.friend.photo" :alt="friend.friend.name" />
                        </div>
                    </Modal>
                </section>
            </Transition>
            <Button :label="$t('pages.myFriend.field2')" @click="onViewWishesFriend"/>
            <Transition name="slide-fade">
                <section class="view-friend" v-if="isViewWishesFriend">
                    <Modal :header="`${$t('pages.myFriend.headerModal')} ${friend.friend.name}`" :show="isViewWishesFriend" @onClose="onCloseViewWishesFriend" padding>
                        <ul v-if="!isFriendWishesEmpty" class="mt-3">
                            <li v-for="wish in friendWishes">
                                <font-awesome-icon v-if="wish" icon="fas fa-gift" /> 
                                <span class="ml-2">{{ wish }}</span>
                            </li>
                        </ul>
                        <div class="flex justify-center" v-else>{{ $t('pages.myFriend.message') }} 🤷</div>
                    </Modal>
                </section>
            </Transition>
            <Button :label="$t('pages.myFriend.field3')" @click="onViewFormWishes"/>
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
    </div>
</template>

<script setup>
import { ref, reactive, computed, onBeforeMount, onUpdated } from 'vue'
import { storeToRefs } from 'pinia'
import { useStoreAuth } from '~~/stores/auth';

//#ref reactive const
const storeAuth = useStoreAuth()
const { user } = storeToRefs(storeAuth)
const isViewFriend = ref(false)
const isViewWishesFriend = ref(false)
const isViewWishesMe = ref(false)
const isOpenModal = ref(false);
const group = ref(JSON.parse(localStorage.getItem('group')))
const friend = ref(JSON.parse(localStorage.getItem('friend')))
const data = reactive({
    idGroup: group.value?.id,
    idUser: user.value?.id
})
//#end

onUpdated(() => {
    data.idGroup = group.value.id
    data.idUser = user.value.id
})


//#computed
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
</script>

<style lang="scss">
#options{
    padding-top: 3rem;
    .button{
        min-width: 70%;
        margin-bottom: 2rem;
        text-align: center;
    }
    .view-friend{
       z-index: 999;
    }
    .container-photo {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid rgba(4, 192, 168, 0.7651654412);
            width: 10rem;
            height: 10rem;
            object-fit: cover;
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
</style> 




