<template>
    <NuxtLayout/>
    <div  class="justify-center items-center" v-if="!friend.friend.name">
        <Spinner/>
    </div>
    <div v-else>
        <div class="pt-4">
            <BackButton />
            <ButtonInfo />
        </div>
            <ButtonConfig />
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
                        @onSubmitSuccess="onSubmitSuccessHandler"
                        @onWhenCloseSuccess="onWhenCloseSuccess"
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
const groupsOfUser = ref(JSON.parse(window.localStorage.getItem('groups-user')))
const friend = ref(null)
const data = reactive({
    idGroup: group.value?.id,
    idUser: user.value?.id
})
//#end


onMounted(async() => {
    groupsOfUser.value.forEach(grup => {
        if (grup.group.id === group.value.id ) {
            friend.value = window.localStorage.setItem('friend-me', JSON.stringify(grup))
        }
    })
})
onUpdated(() => {
    data.idGroup = group.value.id
    data.idUser = user.value.id
})


//#computed
const isFriendWishesEmpty = computed(() => {
    let isEmpty = true
    if (friend.value) {
        const wishes = friend.value?.friend?.wishes
        for(const wish in wishes) {
            if (wishes && wishes[wish] !== ''){
                isEmpty = false
            } 
        }
    }
    return isEmpty
})
const friendWishes = computed(() => Object.values(friend.value?.friend?.wishes))
// const meWishes = computed(() => Object.values(friend.me.wishes))
//#end

//#events
const onViewFriend = () => isViewFriend.value = !isViewFriend.value
const onViewWishesFriend = () => isViewWishesFriend.value = !isViewWishesFriend.value
const onCloseModal = () => {
    isOpenModal.value = false 
    isViewWishesMe.value = false
}
const onViewFormWishes = () => { 
    isOpenModal.value = true
    isViewWishesMe.value = true
}
const onWhenCloseSuccess = () => {
    isViewWishesMe.value = false
}
const onSubmitSuccessHandler = () => {
    isOpenModal.value = false
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




