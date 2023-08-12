<template>
    <section id="groups">
        <div v-if="isLoading">
            <Spinner />
        </div>
        <div v-else class="box-group" v-for="group in groups" :key="group.id">
            <div @click="onClicked(group)">{{ group.name }}</div>
        </div>
    </section>
</template>

<script setup>
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

//# emits
const emit = defineEmits(['onClicked'])

const onClicked = (group) => emit("onClicked", group)
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