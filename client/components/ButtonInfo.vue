<template>
     <div class="container-icon" @click="onViewInfo">
        <font-awesome-icon icon="fas fa-info" /> 
    </div>
    <Modal header="Info" :show="showInfo" @onClose="onClose">
        <p>
            <font-awesome-icon icon="fa-solid fa-location-dot" class="icon text-1xl" />
            <span class="pl-2">{{ group.location }}</span>
        </p>
        <p>
            <font-awesome-icon icon="fa-solid fa-calendar" class="icon text-1xl" />
            <span class="pl-2">{{ changeFormatDate(group.date) }}</span>
        </p>
        <p>
            <font-awesome-icon icon="fa-solid fa-sack-dollar" class="icon text-1xl" />
            <span class="pl-2">{{ group.budget }}€</span>
        </p>
    </Modal>
</template>

<script setup>
import { ref } from 'vue'
const group = ref(JSON.parse(localStorage.getItem('group')))
const showInfo = ref(false)

const onViewInfo = () => {
    showInfo.value = true
}
const onClose = () => {
    showInfo.value = false
}

//#methods
const changeFormatDate = (date) => {
    const fullDate = date.split('T')[0].split('-')
    return `${fullDate[2]}/${fullDate[1]}/${fullDate[0]}`
}
//

</script>

<style lang="scss" scoped>
.container-icon {
    background-color: #3F3E3E;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    padding: 0.5rem;
    right: 6rem;
    bottom: -2.5rem;
    border: 2px solid rgba(4, 192, 168, 0.7651654412);
    box-shadow: 0 0 0 0.2rem #3F3E3E;
    width: 25px;
    font-size: 20px;
    color: white;
    height: 25px;
}
</style>